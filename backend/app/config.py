import os
from pydantic import BaseModel
from typing import Dict, Any

class Settings(BaseModel):
    APP_NAME: str = "NAGRIK - Citizen Demand Intelligence Platform"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    DB_PATH: str = os.getenv("DB_PATH", "backend/app/data/janasetu.db")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")  # 'mock' or 'gemini'
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_CONFIDENCE_THRESHOLD: float = 0.75
    DEFAULT_COUNTRY: str = "India"

settings = Settings()

# Sovereign Regulatory Profiles for BRICS Nations
REGULATORY_REGIMES: Dict[str, Dict[str, Any]] = {
    "India": {
        "regime_name": "Digital Personal Data Protection (DPDP) Act, 2023",
        "residency": "Sovereign In-Country (MeitY Empanelled Cloud, Mumbai/Delhi)",
        "consent_mechanism": "Notice & Explicit Purpose-Bound Consent (Sec 6)",
        "pii_retention_days": 90,
        "masking_standard": "IS 17428 / ISO 27701 compliant anonymization",
        "dpo_contact": "dpo-nagrik@nic.in",
        "citizen_rights": ["Right to Access", "Right to Correction", "Right to Erasure", "Grievance Redressal"]
    },
    "Brazil": {
        "regime_name": "Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709",
        "residency": "Sovereign In-Country (São Paulo Data Zone)",
        "consent_mechanism": "Explicit Citizen Consent (Art. 7, I & Art. 11)",
        "pii_retention_days": 180,
        "masking_standard": "ANPD Pseudonymization Guidelines",
        "dpo_contact": "encarregado-dados@governo.br",
        "citizen_rights": ["Confirmação", "Acesso", "Correção", "Anonimização", "Eliminação"]
    },
    "South Africa": {
        "regime_name": "Protection of Personal Information Act (POPIA), 2013",
        "residency": "Sovereign SADC Zone (Johannesburg / Cape Town)",
        "consent_mechanism": "Voluntary, Specific & Informed Consent (Sec 11)",
        "pii_retention_days": 180,
        "masking_standard": "Information Regulator Minimum Standards",
        "dpo_contact": "information-officer@gov.za",
        "citizen_rights": ["Right to Object", "Correction of Personal Information", "Destruction/Deletion"]
    },
    "Russia": {
        "regime_name": "Federal Law on Personal Data No. 152-FZ",
        "residency": "Primary Database Localization inside Russian Federation (Art. 18)",
        "consent_mechanism": "Written/Electronic Citizen Consent (Art. 9)",
        "pii_retention_days": 365,
        "masking_standard": "Roskomnadzor Certified Anonymization Protocols",
        "dpo_contact": "dpo-inquiries@gosuslugi.ru",
        "citizen_rights": ["Right to clarify", "Block or destroy illegal data"]
    },
    "China": {
        "regime_name": "Personal Information Protection Law (PIPL), 2021",
        "residency": "Domestic Storage for Critical Information Infrastructure (Art. 40)",
        "consent_mechanism": "Informed Consent & Separate Consent for Sensitive Data (Art. 13/29)",
        "pii_retention_days": 90,
        "masking_standard": "GB/T 35273 Anonymization and De-identification",
        "dpo_contact": "privacy@cac.gov.cn",
        "citizen_rights": ["Right to know", "Right to decide", "Right to copy and transfer"]
    }
}
