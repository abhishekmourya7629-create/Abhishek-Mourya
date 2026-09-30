import random
from typing import Dict, Any, List

def simulate_asr(audio_duration_sec: float = 12.5, language_hint: str = "hi") -> Dict[str, Any]:
    """Simulates ASR waveform metadata and speech recognition metrics."""
    num_bars = 32
    waveform = [round(random.uniform(0.15, 0.95), 2) for _ in range(num_bars)]
    
    # Simulate speech recognition metrics
    confidence = round(random.uniform(0.88, 0.98), 2)
    wer_simulated = round(random.uniform(0.04, 0.12), 3)  # Word Error Rate
    
    return {
        "audio_duration_sec": audio_duration_sec,
        "sample_rate_hz": 16000,
        "channels": 1,
        "codec": "opus/ogg",
        "asr_confidence": confidence,
        "word_error_rate_est": wer_simulated,
        "waveform_bars": waveform
    }
