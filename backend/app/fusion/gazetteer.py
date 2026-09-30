import json
import os
from typing import Dict, Any, Optional, Tuple

def load_gazetteer_data():
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "brics_countries.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

_GAZETTEER_CACHE = None

def get_gazetteer():
    global _GAZETTEER_CACHE
    if _GAZETTEER_CACHE is None:
        _GAZETTEER_CACHE = load_gazetteer_data()
    return _GAZETTEER_CACHE

def geocode_location(location_mention: str, country_hint: str = "India", text_fallback: str = "") -> Optional[Dict[str, Any]]:
    gazetteer = get_gazetteer()
    country_data = gazetteer.get(country_hint)
    if not country_data:
        # Fallback to India if unknown
        country_data = gazetteer.get("India", {})
        country_hint = "India"
        
    districts = country_data.get("districts", [])
    
    target_str = (location_mention + " " + text_fallback).lower()
    
    # Aliases and sub-localities
    aliases = {
        "dharavi": ("Mumbai Suburban", "Maharashtra"),
        "kurla": ("Mumbai Suburban", "Maharashtra"),
        "govandi": ("Mumbai Suburban", "Maharashtra"),
        "baberu": ("Banda", "Uttar Pradesh"),
        "tindwari": ("Banda", "Uttar Pradesh"),
        "atarra": ("Banda", "Uttar Pradesh"),
        "charkhari": ("Mahoba", "Uttar Pradesh"),
        "kabrai": ("Mahoba", "Uttar Pradesh"),
        "mau": ("Chitrakoot", "Uttar Pradesh"),
        "rajapur": ("Chitrakoot", "Uttar Pradesh"),
        "bhamragad": ("Gadchiroli", "Maharashtra"),
        "aheri": ("Gadchiroli", "Maharashtra"),
        "sironcha": ("Gadchiroli", "Maharashtra"),
        "riacho do peixe": ("Caruaru", "Pernambuco"),
        "malhada de pedras": ("Caruaru", "Pernambuco"),
        "são pedro": ("Garanhuns", "Pernambuco")
    }
    
    # 1. Check aliases
    for alias, (d_name, s_name) in aliases.items():
        if alias in target_str:
            for d in districts:
                if d["district"] == d_name:
                    return {
                        "district": d["district"],
                        "state": d["state"],
                        "country": country_hint,
                        "lat": d["lat"],
                        "lng": d["lng"],
                        "geocoding_confidence": 0.98,
                        "match_type": "alias_exact"
                    }
                    
    # 2. Check direct district name match
    for d in districts:
        if d["district"].lower() in target_str:
            return {
                "district": d["district"],
                "state": d["state"],
                "country": country_hint,
                "lat": d["lat"],
                "lng": d["lng"],
                "geocoding_confidence": 0.95,
                "match_type": "district_exact"
            }
            
    # 3. Default fallback to top district of country if not found
    if districts:
        d = districts[0]
        return {
            "district": d["district"],
            "state": d["state"],
            "country": country_hint,
            "lat": d["lat"],
            "lng": d["lng"],
            "geocoding_confidence": 0.60,
            "match_type": "fallback_centroid"
        }
        
    return None
