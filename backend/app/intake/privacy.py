import re
from typing import Tuple

def mask_phone(phone: str) -> str:
    """Masks middle digits of phone number: +91 98765 43210 -> +91 98*** **210"""
    if not phone:
        return "+** ***** ****"
    clean = re.sub(r"[^\d+]", "", phone)
    if len(clean) >= 10:
        prefix = clean[:5]
        suffix = clean[-3:]
        return f"{prefix}*****{suffix}"
    return "***-***-****"

def mask_name(name: str) -> str:
    """Masks citizen full name: Ramesh Sharma -> R****** S***** [DPDP Protected]"""
    if not name or name.strip() == "Anonymous Citizen":
        return "Anonymous Citizen"
    parts = name.strip().split()
    masked_parts = []
    for part in parts:
        if len(part) <= 2:
            masked_parts.append(part[0] + "*")
        else:
            masked_parts.append(part[0] + "*" * (len(part) - 1))
    return " ".join(masked_parts)

def mask_pii(name: str, phone: str) -> Tuple[str, str]:
    return mask_name(name), mask_phone(phone)

def scrub_text_pii(text: str) -> str:
    """Scrubs embedded phone numbers, emails, and 12-digit national IDs from free-form text."""
    # Scrub phones
    phone_pattern = r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
    text = re.sub(phone_pattern, "[PHONE_REDACTED]", text)
    
    # Scrub 12-digit IDs (like Aadhaar or CPF)
    id_pattern = r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b"
    text = re.sub(id_pattern, "[ID_REDACTED]", text)
    
    # Scrub emails
    email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    text = re.sub(email_pattern, "[EMAIL_REDACTED]", text)
    
    return text
