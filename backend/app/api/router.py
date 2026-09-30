import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Query, Body

from ..config import settings, REGULATORY_REGIMES
from ..models.schemas import (
    CitizenInputCreate, ExtractedMetadata, PriorityWeights,
    ReviewQueueAction, ProjectAction, ScenarioSimulationRequest, NLQueryRequest,
    ChatbotMessageRequest
)
from ..ai.chatbot import process_chatbot_message
from ..models.database import get_connection, log_audit
from ..intake.privacy import mask_pii, scrub_text_pii
from ..intake.consent import generate_consent_receipt
from ..intake.adapters import adapt_payload
from ..ai.asr_simulator import simulate_asr
from ..ai.translator import detect_language, translate_to_english_pivot
from ..ai.provider import get_llm_provider
from ..fusion.gazetteer import geocode_location, get_gazetteer
from ..fusion.deduplication import cluster_requests
from ..fusion.review_queue import get_pending_review_items, process_review_item
from ..analytics.fusion_engine import get_fused_district_data
from ..analytics.hotspot_detector import detect_hotspots
from ..analytics.gap_detector import compute_gap_matrix
from ..priority.engine import generate_project_recommendations, DEFAULT_WEIGHTS
from ..priority.scenario import simulate_budget_scenario
from ..impact.ledger import get_impact_ledger, simulate_citizen_feedback_loop
from ..trust.bias_monitor import compute_bias_metrics

router = APIRouter()

# 1. Sovereign Countries & Regulatory Profile
@router.get("/countries")
def list_countries():
    gazetteer = get_gazetteer()
    result = []
    for country, data in gazetteer.items():
        regime = REGULATORY_REGIMES.get(country, {})
        result.append({
            "name": country,
            "currency": data.get("currency"),
            "currency_symbol": data.get("currency_symbol"),
            "districts_count": len(data.get("districts", [])),
            "regime_name": regime.get("regime_name", "National Sovereign Data Standard"),
            "residency": regime.get("residency", "Sovereign In-Country Cloud")
        })
    return result

@router.get("/regime/{country}")
def get_country_regime(country: str):
    regime = REGULATORY_REGIMES.get(country, REGULATORY_REGIMES.get("India"))
    return regime

# 2. Citizen Intake Simulator (Pipeline-in-Action)
@router.post("/intake/simulate")
def simulate_intake_pipeline(input_data: CitizenInputCreate):
    """
    Executes the full pipeline step by step and returns intermediate state
    for interactive visualization in the frontend.
    """
    country = input_data.country or "India"
    channel = input_data.channel.lower()
    raw_text = input_data.raw_text.strip()
    
    pipeline_steps = []
    
    # Step 1: Consent Verification
    consent_info = generate_consent_receipt(country, channel, input_data.citizen_name or "Citizen")
    pipeline_steps.append({
        "step": 1,
        "name": "Sovereign Consent Gate",
        "status": "passed",
        "output": consent_info
    })
    
    # Step 2: PII Scrubbing & Masking
    clean_text = scrub_text_pii(raw_text)
    masked_name, masked_phone = mask_pii(input_data.citizen_name, input_data.phone_number)
    pipeline_steps.append({
        "step": 2,
        "name": "PII Masking & Anonymization",
        "status": "passed",
        "output": {
            "masked_name": masked_name,
            "masked_phone": masked_phone,
            "scrubbed_text": clean_text
        }
    })
    
    # Step 3: Voice ASR (if channel is voice or simulated)
    asr_meta = None
    if channel == "voice" or input_data.audio_simulated:
        asr_meta = simulate_asr(audio_duration_sec=14.2)
        pipeline_steps.append({
            "step": 3,
            "name": "Voice ASR Simulation",
            "status": "passed",
            "output": asr_meta
        })

    # Step 4: Language Detection & English Pivot Translation
    detected_lang = input_data.language_hint if input_data.language_hint and input_data.language_hint != "auto" else detect_language(clean_text)
    translated_pivot = translate_to_english_pivot(clean_text, detected_lang)
    pipeline_steps.append({
        "step": 4,
        "name": "Language Detection & Pivot Translation",
        "status": "passed",
        "output": {
            "detected_language": detected_lang,
            "original_text_preserved": clean_text,
            "english_pivot": translated_pivot
        }
    })

    # Step 5: LLM Entity Extraction
    llm = get_llm_provider()
    extraction = llm.extract_structured_demand(clean_text, country)
    pipeline_steps.append({
        "step": 5,
        "name": "LLM Structured Extraction",
        "status": "passed",
        "output": extraction
    })

    # Step 6: Gazetteer Geocoding
    geocoded = geocode_location(extraction.get("location_mention", ""), country, clean_text)
    if not geocoded:
        # Fallback to first district in country
        geocoded = {"district": "Banda", "state": "Uttar Pradesh", "lat": 25.48, "lng": 80.33, "geocoding_confidence": 0.6}
    pipeline_steps.append({
        "step": 6,
        "name": "Gazetteer Geocoding",
        "status": "passed",
        "output": geocoded
    })

    # Step 7: Deduplication & Clustering
    cluster_id = f"cluster_{geocoded['district']}_{extraction['sector']}"
    pipeline_steps.append({
        "step": 7,
        "name": "Semantic Deduplication & Clustering",
        "status": "passed",
        "output": {
            "cluster_id": cluster_id,
            "target_district": geocoded["district"],
            "sector": extraction["sector"],
            "clustering_note": f"Clustered into active {geocoded['district']} {extraction['sector']} demand signal pool"
        }
    })

    # Step 8: Database Persistence & Review Queue Routing
    confidence = extraction.get("confidence", 0.85)
    review_status = "approved"
    is_queued = False
    
    if confidence < settings.DEFAULT_CONFIDENCE_THRESHOLD:
        review_status = "pending_review"
        is_queued = True

    req_id = f"req_{country[:2].lower()}_{int(datetime.utcnow().timestamp()*1000)%100000:05d}"
    now_iso = datetime.utcnow().isoformat() + "Z"
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO citizen_requests (
        id, channel, original_text, translated_text, detected_language,
        masked_name, masked_phone, consent_granted, sector, sub_type, severity,
        affected_group, location_mention, confidence, district, state,
        country, lat, lng, cluster_id, review_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req_id, channel, clean_text, translated_pivot, detected_lang,
        masked_name, masked_phone, 1, extraction["sector"], extraction["sub_type"],
        extraction["severity"], extraction["affected_group"], extraction.get("location_mention", geocoded["district"]),
        confidence, geocoded["district"], geocoded["state"], country,
        geocoded["lat"], geocoded["lng"], cluster_id, review_status, now_iso
    ))

    if is_queued:
        cursor.execute("""
        INSERT INTO human_review_queue (
            id, request_id, original_text, translated_text, channel,
            detected_language, confidence, extracted_json, reviewer_notes, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"rev_{req_id}", req_id, clean_text, translated_pivot, channel,
            detected_lang, confidence, json.dumps(extraction),
            "Confidence score below 0.75 threshold; requires human supervisor confirmation.",
            "pending_review", now_iso
        ))

    conn.commit()
    conn.close()

    log_audit("AI Intake Engine", "CITIZEN_REQUEST_INGESTED", f"Ingested request {req_id} ({country}/{geocoded['district']}/{extraction['sector']}) via {channel}. Review status: {review_status}", country=country)

    pipeline_steps.append({
        "step": 8,
        "name": "Demand Index Update & Queue Routing",
        "status": "passed",
        "output": {
            "request_id": req_id,
            "review_status": review_status,
            "human_review_required": is_queued,
            "timestamp": now_iso
        }
    })

    return {
        "success": True,
        "request_id": req_id,
        "pipeline_steps": pipeline_steps,
        "summary": {
            "country": country,
            "district": geocoded["district"],
            "sector": extraction["sector"],
            "severity": extraction["severity"],
            "confidence": confidence,
            "channel": channel,
            "needs_human_review": is_queued
        }
    }

# 3. Overview Statistics
@router.get("/stats/overview")
def get_overview_stats(country: str = "India"):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM citizen_requests WHERE country = ?", (country,))
    total_reqs = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT district) FROM districts WHERE country = ?", (country,))
    dist_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM human_review_queue WHERE status = 'pending_review'")
    pending_reviews = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM audit_log WHERE country = ?", (country,))
    audit_count = cursor.fetchone()[0]

    conn.close()

    fused = get_fused_district_data(country)
    fused_with_hotspots = detect_hotspots(fused)
    hotspots_count = sum([1 for d in fused_with_hotspots if d.get("is_critical_hotspot", False)])
    
    gaps = compute_gap_matrix(fused)
    unplanned_gaps_count = len(gaps.get("unplanned_gaps", []))
    ghost_count = len(gaps.get("ghost_allocations", []))

    return {
        "country": country,
        "total_requests": total_reqs,
        "districts_covered": dist_count,
        "active_hotspots": hotspots_count,
        "critical_unplanned_gaps": unplanned_gaps_count,
        "ghost_allocations": ghost_count,
        "pending_human_reviews": pending_reviews,
        "audit_trail_entries": audit_count,
        "system_status": "Operational (Sovereign DPG Node Active)"
    }

# 4. Fused District Map & Data
@router.get("/districts/fused")
def list_fused_districts(country: str = "India"):
    fused = get_fused_district_data(country)
    fused_hotspots = detect_hotspots(fused)
    return fused_hotspots

# 5. Gap Matrix Data
@router.get("/analytics/gaps")
def get_gap_matrix_data(country: str = "India"):
    fused = get_fused_district_data(country)
    return compute_gap_matrix(fused)

# 6. Priority Recommendations (Live Weights & Sliders)
@router.post("/priority/recommendations")
def get_priority_recommendations(
    country: str = "India",
    sector: Optional[str] = "all",
    weights: Optional[PriorityWeights] = Body(default=None)
):
    recs = generate_project_recommendations(country, weights, sector)
    return recs

# 7. Policymaker Project Actions (Approve / Reject / Defer)
@router.post("/priority/action/{project_id}")
def record_project_action(project_id: str, action_data: ProjectAction, country: str = "India"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE project_recommendations SET status = ? WHERE id = ?", (action_data.action, project_id))
    conn.commit()
    conn.close()

    log_audit("Policymaker", f"PROJECT_{action_data.action.upper()}", f"Project {project_id} updated to {action_data.action}. Notes: {action_data.policymaker_notes or 'None'}", country=country)
    return {"success": True, "project_id": project_id, "new_status": action_data.action}

# 8. Scenario Budget Simulator
@router.post("/scenario/simulate")
def run_scenario_simulation(req: ScenarioSimulationRequest):
    return simulate_budget_scenario(
        country=req.country,
        budget_limit_m=req.budget_limit_m,
        weights=req.weights,
        sector=req.selected_sector
    )

# 9. Natural Language Query Parser
@router.post("/query/natural-language")
def parse_natural_language_query(req: NLQueryRequest):
    llm = get_llm_provider()
    parsed = llm.parse_natural_language_query(req.query, req.country or "India")
    
    # Execute query over recommendations
    filters = parsed.get("parsed_filters", {})
    sec_filter = filters.get("sector", "all")
    all_recs = generate_project_recommendations(req.country or "India", None, sec_filter)
    
    filtered_results = []
    for r in all_recs:
        match = True
        if "gap_status" in filters and r["gap_status"] != filters["gap_status"]:
            match = False
        if "district" in filters and filters["district"].lower() not in r["district"].lower():
            match = False
        if "min_priority_score" in filters and r["priority_score"] < filters["min_priority_score"]:
            match = False
        if match:
            filtered_results.append(r)

    return {
        "query": req.query,
        "country": req.country,
        "parsed_filters": filters,
        "summary": parsed.get("query_summary", ""),
        "matched_count": len(filtered_results),
        "results": filtered_results
    }

# 10. Human Review Queue
@router.get("/review-queue")
def list_review_queue():
    return get_pending_review_items()

@router.post("/review-queue/{item_id}/action")
def act_on_review_item(item_id: str, action_data: ReviewQueueAction):
    return process_review_item(item_id, action_data)

# 11. Impact Ledger & Citizen Verification Loop
@router.get("/impact/ledger")
def list_impact_ledger():
    return get_impact_ledger()

@router.post("/impact/confirm-loop/{project_id}")
def run_citizen_confirmation(project_id: str):
    return simulate_citizen_feedback_loop(project_id)

# 12. Trust & Bias Monitoring
@router.get("/trust/bias-metrics")
def get_bias_panel(country: str = "India"):
    return compute_bias_metrics(country)

# 13. Audit Log
@router.get("/trust/audit-log")
def get_audit_trail(limit: int = 50, country: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if country:
        cursor.execute("SELECT * FROM audit_log WHERE country = ? ORDER BY timestamp DESC LIMIT ?", (country, limit))
    else:
        cursor.execute("SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# 14. Intelligent Sovereign Chatbot Copilot
@router.post("/chatbot/chat")
def handle_chatbot_chat(req: ChatbotMessageRequest):
    return process_chatbot_message(
        message=req.message,
        country=req.country or "India",
        history=req.conversation_history
    )
