import hashlib
from datetime import datetime
from typing import Dict, Any
from ..config import REGULATORY_REGIMES

def generate_consent_receipt(country: str, channel: str, citizen_name: str) -> Dict[str, Any]:
    regime = REGULATORY_REGIMES.get(country, REGULATORY_REGIMES["India"])
    timestamp = datetime.utcnow().isoformat() + "Z"
    seed = f"{country}:{channel}:{citizen_name}:{timestamp}:{regime['regime_name']}"
    receipt_hash = hashlib.sha256(seed.encode()).hexdigest()
    
    return {
        "consent_granted": True,
        "timestamp": timestamp,
        "country": country,
        "regime": regime["regime_name"],
        "residency": regime["residency"],
        "retention_period_days": regime["pii_retention_days"],
        "dpo_contact": regime["dpo_contact"],
        "receipt_id": f"CSR-{receipt_hash[:12].upper()}"
    }
