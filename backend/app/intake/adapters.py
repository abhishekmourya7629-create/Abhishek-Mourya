from typing import Dict, Any, Optional
from ..models.schemas import CitizenInputCreate
from .privacy import scrub_text_pii

class BaseChannelAdapter:
    def parse(self, payload: Dict[str, Any]) -> CitizenInputCreate:
        raise NotImplementedError

class WhatsAppAdapter(BaseChannelAdapter):
    def parse(self, payload: Dict[str, Any]) -> CitizenInputCreate:
        raw_msg = payload.get("message", payload.get("text", ""))
        sender = payload.get("sender_name", payload.get("profile_name", "WhatsApp Citizen"))
        phone = payload.get("from_number", payload.get("wa_id", "+91 98765 00000"))
        country = payload.get("country", "India")
        return CitizenInputCreate(
            channel="whatsapp",
            raw_text=scrub_text_pii(raw_msg),
            citizen_name=sender,
            phone_number=phone,
            country=country,
            consent_granted=payload.get("consent_granted", True),
            language_hint=payload.get("language", "auto")
        )

class SMSAdapter(BaseChannelAdapter):
    def parse(self, payload: Dict[str, Any]) -> CitizenInputCreate:
        raw_msg = payload.get("body", payload.get("text", ""))
        sender = payload.get("sender", "SMS Citizen")
        phone = payload.get("from_number", "+91 98000 00000")
        country = payload.get("country", "India")
        return CitizenInputCreate(
            channel="sms",
            raw_text=scrub_text_pii(raw_msg),
            citizen_name=sender,
            phone_number=phone,
            country=country,
            consent_granted=payload.get("consent_granted", True),
            language_hint=payload.get("language", "auto")
        )

class VoiceAdapter(BaseChannelAdapter):
    def parse(self, payload: Dict[str, Any]) -> CitizenInputCreate:
        transcript = payload.get("transcript", payload.get("text", ""))
        sender = payload.get("caller_name", "Voice Caller")
        phone = payload.get("caller_id", "+91 97000 00000")
        country = payload.get("country", "India")
        return CitizenInputCreate(
            channel="voice",
            raw_text=scrub_text_pii(transcript),
            citizen_name=sender,
            phone_number=phone,
            country=country,
            consent_granted=payload.get("consent_granted", True),
            audio_simulated=True,
            language_hint=payload.get("language", "auto")
        )

class WebFormAdapter(BaseChannelAdapter):
    def parse(self, payload: Dict[str, Any]) -> CitizenInputCreate:
        raw_msg = payload.get("description", payload.get("text", ""))
        sender = payload.get("name", "Web Citizen")
        phone = payload.get("contact", "+91 96000 00000")
        country = payload.get("country", "India")
        return CitizenInputCreate(
            channel="web",
            raw_text=scrub_text_pii(raw_msg),
            citizen_name=sender,
            phone_number=phone,
            country=country,
            consent_granted=payload.get("consent_granted", True),
            language_hint=payload.get("language", "auto")
        )

ADAPTER_MAP = {
    "whatsapp": WhatsAppAdapter(),
    "sms": SMSAdapter(),
    "voice": VoiceAdapter(),
    "web": WebFormAdapter()
}

def adapt_payload(channel: str, payload: Dict[str, Any]) -> CitizenInputCreate:
    adapter = ADAPTER_MAP.get(channel.lower(), WebFormAdapter())
    return adapter.parse(payload)
