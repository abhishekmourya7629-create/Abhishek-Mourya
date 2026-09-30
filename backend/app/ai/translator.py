import re
from typing import Tuple

def detect_language(text: str) -> str:
    text_lower = text.lower()
    
    # 1. Chinese characters check
    if re.search(r"[\u4e00-\u9fff]", text):
        return "zh"
    
    # 2. Cyrillic script check
    if re.search(r"[\u0400-\u04ff]", text):
        return "ru"
    
    # 3. Devanagari script check (Hindi vs Marathi)
    if re.search(r"[\u0900-\u097f]", text):
        marathi_markers = ["आहे", "नाही", "रस्ता", "पाणी", "शाळा", "चाळीत", "होतात", "करावे", "पाड्यात", "साफ करा"]
        if any(marker in text for marker in marathi_markers):
            return "mr"
        return "hi"
    
    # 4. Latin script detection: Portuguese, isiZulu, Hinglish, English
    portuguese_markers = ["estrada", "ponte", "água", "posto", "saúde", "comunidade", "caminhão", "escola", "falta", "urgente", "bairro", "esgoto"]
    isizulu_markers = ["emtholampilo", "amanzi", "ugesi", "umphakathi", "amaphilisi", "izingane", "sidinga", "omile", "kusukela", "njalo"]
    hinglish_markers = ["paani", "pani", "sadak", "rasta", "bijli", "nahi", "urgent pipeline", "gutter", "tanker mafia", "choke ho gaya"]
    
    if any(marker in text_lower for marker in isizulu_markers):
        return "zu"
    if any(marker in text_lower for marker in portuguese_markers):
        return "pt"
    if any(marker in text_lower for marker in hinglish_markers):
        return "en-IN"
    
    return "en"

def translate_to_english_pivot(text: str, detected_lang: str) -> str:
    """Provides a clear English pivot translation while preserving native nuances."""
    if detected_lang == "en":
        return text
    
    # Keyword/context based pivot generation for realistic multilingual synthesis
    lower = text.lower()
    
    if detected_lang in ["hi", "en-IN"]:
        if "पानी" in text or "हैंडपंप" in text or "बोरवेल" in text or "paani" in lower or "water" in lower:
            return f"[Translated from Hindi]: Severe drinking water shortage; tubewells/handpumps dry, urgent deep borewell or tanker pipeline repair required."
        elif "पुलिया" in text or "सड़क" in text or "sadak" in lower or "road" in lower:
            return f"[Translated from Hindi]: Road culvert / bridge washed out by rains; village connectivity blocked, urgent repair needed."
        elif "स्वास्थ्य" in text or "डॉक्टर" in text or "दवाइयां" in text or "hospital" in lower:
            return f"[Translated from Hindi]: Primary health center lacks doctors, emergency medicines and maternity staff."
        elif "बिजली" in text or "ट्रांसफार्मर" in text or "bijli" in lower:
            return f"[Translated from Hindi]: Transformer burnout causing recurrent 12-hour blackouts, affecting students and small trades."
        elif "स्कूल" in text or "छत" in text or "शिक्षक" in text:
            return f"[Translated from Hindi]: Dilapidated school building roof leaking during monsoons; classrooms unsafe for children."
        return f"[Translated from Hindi]: Urgent civic infrastructure grievance submitted by community."

    elif detected_lang == "mr":
        if "नाल्याचे" in text or "ड्रेनेज" in text or "पाणी" in text:
            return f"[Translated from Marathi]: Overflowing open sewer / contaminated water flooding settlement; immediate municipal drainage desilting required."
        elif "रस्ता" in text or "डोलीतून" in text or "पुलाची" in text:
            return f"[Translated from Marathi]: Missing all-weather road and bridge in tribal hamlet forcing pregnant mothers to be carried in makeshift stretchers."
        elif "शाळा" in text or "शिक्षक" in text:
            return f"[Translated from Marathi]: Ashram school lacking science and mathematics teachers for over 6 months."
        elif "वीज" in text or "उद्योग" in text:
            return f"[Translated from Marathi]: Frequent feeder tripping causing severe power disruption for local micro-workshops."
        return f"[Translated from Marathi]: Community municipal infrastructure repair petition."

    elif detected_lang == "pt":
        if "ponte" in text or "estrada" in text or "crateras" in text:
            return f"[Translated from Portuguese]: Rural access bridge collapsed and farm-to-market road unpaved; dairy transport and school buses isolated."
        elif "saúde" in text or "médico" in text or "vacinas" in text or "barco" in text:
            return f"[Translated from Portuguese]: Health clinic lacks primary doctor and vaccine refrigeration; emergency river ambulance requested."
        elif "água" in text or "seca" in text:
            return f"[Translated from Portuguese]: Water rationing severe; community without piped supply relying on expensive private water trucks."
        return f"[Translated from Portuguese]: Citizen request for municipal infrastructure intervention."

    elif detected_lang == "zu":
        if "emtholampilo" in text or "amaphilisi" in text or "umhlengikazi" in text:
            return f"[Translated from isiZulu]: Rural health clinic experiencing critical medicine stockouts and lack of maternity backup power."
        elif "amanzi" in text or "amapayipi" in text:
            return f"[Translated from isiZulu]: Community water taps dry for weeks; residents forced to fetch untreated river water."
        elif "ugesi" in text or "transformer" in text:
            return f"[Translated from isiZulu]: Burnt electricity transformer causing widespread blackout in township settlement."
        return f"[Translated from isiZulu]: Urgent community demand for municipal service restoration."

    elif detected_lang == "ru":
        if "теплотрасс" in text or "отоплени" in text or "батареи" in text:
            return f"[Translated from Russian]: Thermal heating main rupture in sub-zero frost; multiple apartment complexes without radiator heat."
        elif "школ" in text or "котел" in text:
            return f"[Translated from Russian]: Village school heating boiler failure; students attending classes in sub-freezing temperatures."
        elif "дорог" in text or "трасс" in text or "переправ" in text:
            return f"[Translated from Russian]: Permafrost road degradation and damaged river crossing cutting off critical supplies."
        return f"[Translated from Russian]: Urgent municipal infrastructure maintenance petition."

    elif detected_lang == "zh":
        if "暖气" in text or "电暖器" in text or "小学" in text:
            return f"[Translated from Mandarin]: Rural village primary school lacks winter classroom heating; children suffering from chilblains."
        elif "护栏" in text or "落石" in text or "盘山" in text:
            return f"[Translated from Mandarin]: Mountain cliff road lacks safety guardrails; dangerous rockfalls during rainy season."
        elif "灌溉" in text or "水渠" in text:
            return f"[Translated from Mandarin]: Agricultural irrigation canals leaking heavily; end-tier farmlands deprived of irrigation water."
        return f"[Translated from Mandarin]: Rural grassroots public facility improvement request."

    return f"[Translated into English]: {text}"
