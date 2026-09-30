import json
from typing import Dict, Any, List
from ..models.database import get_connection

def get_fused_district_data(country: str = "India") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Fetch district metadata
    cursor.execute("""
    SELECT district, state, country, lat, lng, population, poverty_index,
           infrastructure_index_json, planned_investment_json, description
    FROM districts
    WHERE country = ?
    """, (country,))
    district_rows = cursor.fetchall()
    
    # 2. Fetch approved demand counts grouped by district and sector
    cursor.execute("""
    SELECT district, sector, COUNT(*) as demand_count,
           SUM(CASE WHEN severity = 'critical' THEN 2.0 WHEN severity = 'high' THEN 1.5 ELSE 1.0 END) as weighted_demand
    FROM citizen_requests
    WHERE country = ? AND review_status = 'approved'
    GROUP BY district, sector
    """, (country,))
    demand_rows = cursor.fetchall()
    
    conn.close()
    
    # Organize demand by district
    demand_by_dist = {}
    for r in demand_rows:
        d = r["district"]
        if d not in demand_by_dist:
            demand_by_dist[d] = {"raw_counts": {}, "weighted_counts": {}}
        demand_by_dist[d]["raw_counts"][r["sector"]] = r["demand_count"]
        demand_by_dist[d]["weighted_counts"][r["sector"]] = round(r["weighted_demand"], 1)

    fused_list = []
    for d in district_rows:
        d_name = d["district"]
        pop = d["population"]
        infra_idx = json.loads(d["infrastructure_index_json"])
        planned_inv = json.loads(d["planned_investment_json"])
        
        dist_demands = demand_by_dist.get(d_name, {"raw_counts": {}, "weighted_counts": {}})
        raw_counts = dist_demands["raw_counts"]
        weighted_counts = dist_demands["weighted_counts"]
        
        # Calculate normalized demand per 100k population
        normalized_per_100k = {}
        for sec in ["water", "roads", "health", "electricity", "broadband", "schools"]:
            c = raw_counts.get(sec, 0)
            norm = round((c / pop) * 100000.0, 2)
            normalized_per_100k[sec] = norm

        fused_list.append({
            "district": d_name,
            "state": d["state"],
            "country": country,
            "lat": d["lat"],
            "lng": d["lng"],
            "population": pop,
            "poverty_index": d["poverty_index"],
            "infrastructure_index": infra_idx,
            "planned_investment_usd_m": planned_inv,
            "description": d["description"],
            "demand_counts": raw_counts,
            "weighted_demand": weighted_counts,
            "normalized_demand_per_100k": normalized_per_100k
        })
        
    return fused_list
