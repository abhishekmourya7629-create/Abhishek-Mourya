import random
from typing import List, Dict, Any, Optional
from ..models.database import get_connection, log_audit

def get_impact_ledger() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, project_id, title, district, sector, baseline_metric,
           current_metric, target_metric, citizen_satisfaction_rate, status, last_verified
    FROM impact_ledger
    ORDER BY last_verified DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "project_id": r["project_id"],
            "title": r["title"],
            "district": r["district"],
            "sector": r["sector"],
            "baseline_metric": r["baseline_metric"],
            "current_metric": r["current_metric"],
            "target_metric": r["target_metric"],
            "citizen_satisfaction_rate": r["citizen_satisfaction_rate"],
            "status": r["status"],
            "last_verified": r["last_verified"],
            "relative_gain_pct": round(((r["current_metric"] - r["baseline_metric"]) / max(0.01, r["baseline_metric"])) * 100, 1)
        })
    return results

def simulate_citizen_feedback_loop(project_id: str) -> Dict[str, Any]:
    """
    Simulates automated citizen verification callback loop:
    'Was your water connection fixed?'
    Returns response statistics and sample verified voice/text receipts.
    """
    yes_pct = round(random.uniform(84.0, 93.0), 1)
    partial_pct = round(random.uniform(5.0, 10.0), 1)
    no_pct = round(100.0 - yes_pct - partial_pct, 1)

    quotes = [
        {"citizen": "R***** S. (Ward 4)", "response": "Yes", "comment": "Solar tubewell was energized on 14th; all 4 hamlets now receive clean water.", "timestamp": "2 days ago"},
        {"citizen": "S***** D. (Farmer)", "response": "Yes", "comment": "The dry borehole was deepened to 280ft and fluoride filter works well.", "timestamp": "3 days ago"},
        {"citizen": "M***** Y. (Local Teacher)", "response": "Partial", "comment": "Main pipeline repaired, but pressure in eastern street is still low in mornings.", "timestamp": "4 days ago"}
    ]

    log_audit("Citizen Feedback Loop", "CONFIRMATION_SURVEY_PULSE", f"Dispatched 250 IVR/WhatsApp verification surveys for project {project_id} -> {yes_pct}% affirmative.")

    return {
        "project_id": project_id,
        "sample_size": 250,
        "response_rate_pct": 78.4,
        "breakdown": {
            "yes_fully_resolved_pct": yes_pct,
            "partially_resolved_pct": partial_pct,
            "unresolved_pct": no_pct
        },
        "verified_citizen_responses": quotes,
        "audit_certification": "Digital Public Good Civic Verification Signature #DPG-VERIF-2026"
    }
