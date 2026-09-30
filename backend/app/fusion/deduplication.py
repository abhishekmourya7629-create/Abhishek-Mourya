import re
import math
from typing import List, Dict, Any, Tuple
from collections import Counter

def tokenize_and_vectorize(text: str) -> Counter:
    words = re.findall(r"\w+", text.lower())
    # Generate unigrams and bigrams for richer semantic overlap
    tokens = words + [f"{words[i]}_{words[i+1]}" for i in range(len(words)-1)]
    return Counter(tokens)

def cosine_similarity(vec1: Counter, vec2: Counter) -> float:
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])
    sum1 = sum([val**2 for val in vec1.values()])
    sum2 = sum([val**2 for val in vec2.values()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    if not denominator:
        return 0.0
    return float(numerator) / denominator

def cluster_requests(requests_list: List[Dict[str, Any]], similarity_threshold: float = 0.40) -> List[Dict[str, Any]]:
    """
    Clusters citizen requests within the same district & sector based on semantic similarity.
    Returns grouped demand signals.
    """
    clusters: List[Dict[str, Any]] = []
    
    # Pre-vectorize
    vectors = [tokenize_and_vectorize(r.get("translated_text", "") + " " + r.get("original_text", "")) for r in requests_list]
    assigned = [False] * len(requests_list)
    
    for i, req in enumerate(requests_list):
        if assigned[i]:
            continue
            
        cluster_members = [req]
        assigned[i] = True
        
        for j in range(i + 1, len(requests_list)):
            if assigned[j]:
                continue
            
            other = requests_list[j]
            # District and sector must match
            if req.get("district") == other.get("district") and req.get("sector") == other.get("sector"):
                sim = cosine_similarity(vectors[i], vectors[j])
                if sim >= similarity_threshold:
                    cluster_members.append(other)
                    assigned[j] = True
                    
        # Create cluster summary signal
        cluster_id = f"sig_{req.get('district', 'unknown')}_{req.get('sector', 'infra')}_{len(clusters)+1}"
        clusters.append({
            "cluster_id": cluster_id,
            "district": req.get("district"),
            "sector": req.get("sector"),
            "sub_type": req.get("sub_type"),
            "severity": req.get("severity"),
            "country": req.get("country"),
            "signal_strength": len(cluster_members),
            "primary_sample": req.get("original_text"),
            "english_summary": req.get("translated_text"),
            "lat": req.get("lat"),
            "lng": req.get("lng"),
            "items_count": len(cluster_members),
            "member_ids": [m.get("id") for m in cluster_members]
        })
        
    return clusters
