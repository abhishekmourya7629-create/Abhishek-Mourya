from typing import Dict, Any, List, Optional
from ..models.schemas import PriorityWeights
from .engine import generate_project_recommendations

def simulate_budget_scenario(
    country: str = "India",
    budget_limit_m: float = 30.0,
    weights: Optional[PriorityWeights] = None,
    sector: Optional[str] = "all"
) -> Dict[str, Any]:
    recommendations = generate_project_recommendations(country, weights, sector)
    
    funded_projects = []
    unfunded_projects = []
    spent_budget = 0.0
    total_beneficiaries = 0
    total_demand_resolved = 0
    infra_improvements = []

    for proj in recommendations:
        cost = proj["estimated_cost_m"]
        if spent_budget + cost <= budget_limit_m:
            spent_budget += cost
            total_beneficiaries += proj["population_affected"]
            total_demand_resolved += proj["demand_count"]
            
            # Projected infrastructure index improvement:
            # High-need districts jump more (+0.25 to +0.40)
            baseline = proj["baseline_infra_index"]
            improvement = round((1.0 - baseline) * 0.45, 2)
            infra_improvements.append(improvement)
            
            funded_projects.append({
                **proj,
                "projected_index_improvement": improvement,
                "new_projected_index": round(min(1.0, baseline + improvement), 2)
            })
        else:
            unfunded_projects.append(proj)

    avg_improvement = round(sum(infra_improvements) / max(1, len(infra_improvements)), 2)

    return {
        "budget_limit_m": budget_limit_m,
        "spent_budget_m": round(spent_budget, 2),
        "remaining_budget_m": round(max(0.0, budget_limit_m - spent_budget), 2),
        "funded_count": len(funded_projects),
        "unfunded_count": len(unfunded_projects),
        "total_beneficiaries_gaining_access": total_beneficiaries,
        "total_citizen_demands_resolved": total_demand_resolved,
        "avg_infra_index_gain": avg_improvement,
        "funded_projects": funded_projects,
        "unfunded_projects": unfunded_projects[:10]
    }
