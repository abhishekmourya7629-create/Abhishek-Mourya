from typing import List, Dict, Any

def compute_gap_matrix(fused_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Classifies every (district, sector) pair into:
    - 'requested_unplanned' (High demand, zero/negligible planned investment)
    - 'planned_unrequested' (High planned investment, minimal citizen demand -> Ghost Allocation)
    - 'planned_and_requested' (Aligned demand and capital plan)
    - 'low_priority' (Low demand, modest budget)
    """
    sectors = ["water", "roads", "health", "electricity", "broadband", "schools"]
    
    unplanned_gaps = []
    ghost_allocations = []
    aligned_projects = []
    matrix_cells = []

    for d in fused_data:
        d_name = d["district"]
        country = d["country"]
        
        for sec in sectors:
            demand_count = d["demand_counts"].get(sec, 0)
            norm_demand = d["normalized_demand_per_100k"].get(sec, 0.0)
            budget_m = d["planned_investment_usd_m"].get(sec, 0.0)
            infra_idx = d["infrastructure_index"].get(sec, 0.5)

            # Determine classification
            # High demand threshold: norm_demand >= 4.0 or demand_count >= 40
            # Low budget threshold: budget_m <= 0.2
            # High budget threshold: budget_m >= 6.0
            
            is_high_demand = (norm_demand >= 4.0) or (demand_count >= 40)
            is_low_demand = (demand_count <= 10)
            is_high_budget = (budget_m >= 5.0)
            is_low_budget = (budget_m <= 0.2)

            gap_type = "routine"
            if is_high_demand and is_low_budget:
                gap_type = "requested_unplanned"
                unplanned_gaps.append({
                    "district": d_name,
                    "country": country,
                    "sector": sec,
                    "demand_count": demand_count,
                    "normalized_demand": norm_demand,
                    "budget_m": budget_m,
                    "infra_index": infra_idx,
                    "poverty_index": d["poverty_index"],
                    "urgency": "critical",
                    "label": "Critical Unplanned Gap"
                })
            elif is_high_budget and is_low_demand:
                gap_type = "planned_unrequested"
                ghost_allocations.append({
                    "district": d_name,
                    "country": country,
                    "sector": sec,
                    "demand_count": demand_count,
                    "normalized_demand": norm_demand,
                    "budget_m": budget_m,
                    "infra_index": infra_idx,
                    "poverty_index": d["poverty_index"],
                    "scrutiny": "high_reallocation_potential",
                    "label": "Ghost Allocation / Overbudgeted"
                })
            elif is_high_demand and is_high_budget:
                gap_type = "planned_and_requested"
                aligned_projects.append({
                    "district": d_name,
                    "country": country,
                    "sector": sec,
                    "demand_count": demand_count,
                    "normalized_demand": norm_demand,
                    "budget_m": budget_m,
                    "infra_index": infra_idx,
                    "label": "Aligned High Priority"
                })

            matrix_cells.append({
                "district": d_name,
                "country": country,
                "sector": sec,
                "demand_count": demand_count,
                "normalized_demand": norm_demand,
                "budget_m": budget_m,
                "infra_index": infra_idx,
                "gap_type": gap_type
            })

    return {
        "unplanned_gaps": unplanned_gaps,
        "ghost_allocations": ghost_allocations,
        "aligned_projects": aligned_projects,
        "matrix_cells": matrix_cells,
        "summary": {
            "unplanned_count": len(unplanned_gaps),
            "ghost_count": len(ghost_allocations),
            "aligned_count": len(aligned_projects)
        }
    }
