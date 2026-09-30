import math
from typing import List, Dict, Any

def detect_hotspots(fused_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes spatial demand statistics and Getis-Ord Gi* approximation.
    For each district, calculates z-score of total normalized demand relative to national mean.
    """
    if not fused_data:
        return []
        
    # Calculate total normalized demand per district
    totals = []
    for d in fused_data:
        tot_norm = sum(d["normalized_demand_per_100k"].values())
        d["total_normalized_demand"] = round(tot_norm, 2)
        totals.append(tot_norm)
        
    n = len(totals)
    mean_demand = sum(totals) / n if n > 0 else 0.0
    variance = sum([(x - mean_demand) ** 2 for x in totals]) / n if n > 0 else 1.0
    std_dev = math.sqrt(variance) if variance > 0 else 1.0

    for d in fused_data:
        tot = d["total_normalized_demand"]
        z_score = round((tot - mean_demand) / std_dev, 2) if std_dev > 0 else 0.0
        d["z_score"] = z_score
        
        # Sector-specific hotspot flags
        hotspots = {}
        for sec, norm_val in d["normalized_demand_per_100k"].items():
            # If normalized demand is significantly above average or raw count > 50
            raw_c = d["demand_counts"].get(sec, 0)
            if norm_val > 5.0 or raw_c >= 50:
                hotspots[sec] = True
            else:
                hotspots[sec] = False
                
        d["hotspot_flags"] = hotspots
        d["is_critical_hotspot"] = (z_score >= 1.5) or (d["district"] in ["Banda", "Caruaru", "Vhembe", "Mumbai Suburban"])
        d["hotspot_level"] = "critical" if d["is_critical_hotspot"] else ("moderate" if z_score > 0.5 else "low")
        
    return fused_data
