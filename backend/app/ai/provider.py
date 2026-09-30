import json
import os
import re
from typing import Dict, Any, Optional
import requests
from ..config import settings
from .translator import detect_language, translate_to_english_pivot

class BaseLLMProvider:
    def extract_structured_demand(self, text: str, country: str = "India") -> Dict[str, Any]:
        raise NotImplementedError

    def parse_natural_language_query(self, query: str, country: str = "India") -> Dict[str, Any]:
        raise NotImplementedError

class DeterministicMockProvider(BaseLLMProvider):
    """Zero-dependency, offline, instant deterministic intelligence provider."""

    def extract_structured_demand(self, text: str, country: str = "India") -> Dict[str, Any]:
        lower = text.lower()
        lang = detect_language(text)
        
        # Sector determination
        sector = "water"  # default
        sub_type = "general_demand"
        severity = "medium"
        affected_group = "general_public"
        confidence = 0.92

        # Sector rules
        if any(w in lower for w in ["पानी", "paani", "borewell", "handpump", "well", "pipeline", "fluoride", "जल", "tanker", "água", "amanzi", "poço", "compesa", "sewage", "gutter", "drainage", "नाल्याचे", "ड्रेनेज", "पाणी"]):
            sector = "water"
            if any(w in lower for w in ["borewell", "हैंडपंप", "बोरवेल", "tubewell", "सूख"]):
                sub_type = "dried_borewell_crisis"
                severity = "critical"
                affected_group = "farmers_and_families"
            elif any(w in lower for w in ["gutter", "नाल्याचे", "sewage", "ड्रेनेज", "drainage"]):
                sub_type = "open_sewage_overflow"
                severity = "critical"
                affected_group = "slum_dwellers"
            else:
                sub_type = "drinking_water_shortage"
                severity = "high"
                affected_group = "local_residents"

        elif any(w in lower for w in ["सड़क", "sadak", "road", "bridge", "पुलिया", "pothole", "highway", "रस्ता", "ponte", "estrada", "vicinal", "трасс", "дорог", "护栏", "盘山"]):
            sector = "roads"
            if any(w in lower for w in ["bridge", "पुलिया", "ponte", "collapsed", "टूट"]):
                sub_type = "bridge_washout_connectivity_loss"
                severity = "critical"
                affected_group = "rural_commuters"
            elif any(w in lower for w in ["crater", "pothole", "mud", "intransitável"]):
                sub_type = "unpaved_rural_road_decay"
                severity = "high"
                affected_group = "farmers_and_freight"
            else:
                sub_type = "road_maintenance"
                severity = "medium"
                affected_group = "commuters"

        elif any(w in lower for w in ["स्वास्थ्य", "doctor", "डॉक्टर", "clinic", "hospital", "दवाइयां", "medicine", "मरीज", "रुग्णालय", "saúde", "médico", "vacinas", "emtholampilo", "amaphilisi", "telemedicine", "卫生室"]):
            sector = "health"
            sub_type = "clinic_equipment_and_staff_deficit"
            severity = "critical"
            affected_group = "pregnant_mothers_and_elders"

        elif any(w in lower for w in ["बिजली", "bijli", "electricity", "transformer", "ट्रांसफार्मर", "power", "grid", "feeder", "ugesi", "теплотрасс", "отоплени", "котел", "substation"]):
            sector = "electricity"
            sub_type = "transformer_failure_and_grid_blackout"
            severity = "high"
            affected_group = "households_and_students"

        elif any(w in lower for w in ["स्कूल", "school", "छत", "teacher", "शिक्षक", "शाळा", "escola", "暖气", "classroom", "boiler"]):
            sector = "schools"
            sub_type = "school_building_safety_and_heating"
            severity = "high"
            affected_group = "children_and_teachers"

        elif any(w in lower for w in ["broadband", "fiber", "internet", "5g", "wi-fi", "इंटरनेट", "optic", "postes inteligentes"]):
            sector = "broadband"
            sub_type = "high_speed_broadband_access"
            severity = "low"
            affected_group = "students_and_professionals"

        # Check for location mentions
        location_mention = ""
        possible_locs = [
            "Banda", "Mahoba", "Chitrakoot", "Mumbai", "Dharavi", "Kurla", "Govandi", "Gadchiroli",
            "Kalahandi", "Barmer", "Wayanad", "Delhi", "Gurgaon", "Caruaru", "Garanhuns", "Manaus",
            "Pinheiros", "Vhembe", "Mopani", "Alexandra", "Sandton", "Yakutsk", "Birobidzhan", "Zhoukou", "Liangshan"
        ]
        for loc in possible_locs:
            if loc.lower() in lower or loc in text:
                location_mention = loc
                break

        # Check if text is ambiguous or short
        if len(text.strip()) < 15:
            confidence = 0.58
        elif not location_mention:
            confidence = 0.71

        return {
            "sector": sector,
            "sub_type": sub_type,
            "severity": severity,
            "affected_group": affected_group,
            "location_mention": location_mention,
            "confidence": confidence
        }

    def parse_natural_language_query(self, query: str, country: str = "India") -> Dict[str, Any]:
        q = query.lower()
        applied_filters = {"country": country}
        explanation_parts = [f"Focusing on sovereign nation: {country}"]

        # Check sector
        for sec in ["water", "roads", "health", "electricity", "broadband", "schools"]:
            if sec in q:
                applied_filters["sector"] = sec
                explanation_parts.append(f"Filtered to sector: {sec.upper()}")

        # Check gap / funding status
        if "no planned" in q or "unplanned" in q or "zero" in q or "no budget" in q or "gap" in q:
            applied_filters["gap_status"] = "unplanned_gap"
            explanation_parts.append("Filtered to High Demand with Zero/Negligible Planned Public Investment")
        elif "aligned" in q or "funded" in q:
            applied_filters["gap_status"] = "aligned"
            explanation_parts.append("Filtered to Aligned Priority Projects")
        elif "ghost" in q or "overfunded" in q or "reallocate" in q:
            applied_filters["gap_status"] = "ghost_allocation"
            explanation_parts.append("Filtered to Overfunded / Low-Demand Ghost Allocations")

        # Check severity / priority
        if "critical" in q or "high priority" in q or "urgent" in q:
            applied_filters["min_priority_score"] = 70.0
            explanation_parts.append("Priority Score >= 70.0 (High Emergency)")

        # Check district mention
        districts = ["banda", "mahoba", "chitrakoot", "mumbai suburban", "dharavi", "gadchiroli", "kalahandi", "barmer", "wayanad", "caruaru", "vhembe", "yakutsk", "zhoukou"]
        for d in districts:
            if d in q:
                applied_filters["district"] = d.title()
                explanation_parts.append(f"Restricted to district: {d.title()}")

        return {
            "parsed_filters": applied_filters,
            "query_summary": " AND ".join(explanation_parts) if explanation_parts else "All records",
            "confidence": 0.95
        }

class GeminiProvider(BaseLLMProvider):
    """Cloud Gemini provider with fallback to DeterministicMockProvider."""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = DeterministicMockProvider()

    def extract_structured_demand(self, text: str, country: str = "India") -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.extract_structured_demand(text, country)
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            prompt = f"""
            You are an infrastructure demand extractor for BRICS governments.
            Extract the following JSON from the citizen input:
            {{
               "sector": "water" | "roads" | "health" | "electricity" | "broadband" | "schools",
               "sub_type": "string",
               "severity": "critical" | "high" | "medium" | "low",
               "affected_group": "string",
               "location_mention": "string (district or village)",
               "confidence": float (0.0 to 1.0)
            }}
            Country: {country}
            Input text: {text}
            Output JSON only:
            """
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            res = requests.post(url, json=payload, timeout=5)
            if res.status_code == 200:
                raw_out = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                cleaned = re.sub(r"```json|```", "", raw_out).strip()
                return json.loads(cleaned)
        except Exception as e:
            pass
        return self.fallback.extract_structured_demand(text, country)

    def parse_natural_language_query(self, query: str, country: str = "India") -> Dict[str, Any]:
        return self.fallback.parse_natural_language_query(query, country)

def get_llm_provider() -> BaseLLMProvider:
    provider_name = os.getenv("LLM_PROVIDER", settings.LLM_PROVIDER).lower()
    api_key = os.getenv("GEMINI_API_KEY", settings.GEMINI_API_KEY)
    if provider_name == "gemini" and api_key:
        return GeminiProvider(api_key=api_key)
    return DeterministicMockProvider()
