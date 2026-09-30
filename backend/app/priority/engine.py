import math
from typing import List, Dict, Any, Optional
from ..models.schemas import PriorityWeights, ProjectRecommendation
from ..analytics.fusion_engine import get_fused_district_data
from ..analytics.gap_detector import compute_gap_matrix
from .explainability import generate_grounded_explanation

DEFAULT_WEIGHTS = PriorityWeights(
    w_demand=0.25,
    w_deprivation=0.20,
    w_population=0.15,
    w_equity=0.15,
    w_cost_effectiveness=0.15,
    w_feasibility=0.10
)

# Representative infrastructure intervention project catalog per sector
PROJECT_TEMPLATES = {
    "water": [
        ("Deep Solar Tube-Well & Groundwater Recharge Grid", "Construction of automated solar powered borewells with fluoride filtration units and community cisterns.", 3.8),
        ("Monsoon Stormwater Drainage & Sewer Desilting", "Underground gravity trunk line desilting and covered drain reconstruction to halt monsoon flooding.", 6.5),
        ("Rural Piped Water Reticulation & Household Taps", "Multi-village piped supply connection with smart metering and solar pumping stations.", 4.2)
    ],
    "roads": [
        ("All-Weather Rural Bridge & Farm-to-Market Paving", "Reinforced concrete culvert bridge replacement and all-weather macadam road surfacing.", 5.2),
        ("Critical Mountain Road Guardrails & Slope Stabilization", "Steel crash barriers, rockfall retaining meshes, and tarmac resurfacing on accident-prone bends.", 4.0),
        ("Urban Pothole Resurfacing & Traffic Calming", "Asphalt overlay, pedestrian walkways, and LED streetlighting.", 3.0)
    ],
    "health": [
        ("24/7 Primary Maternity Health Center & Solar Backup", "Maternity ward refurbishment, 10kW rooftop solar power unit, and essential medicine storage depot.", 2.5),
        ("Emergency Telemedicine Clinic & Mobile Ambulance Boat", "High-bandwidth video diagnostic link and 4WD all-terrain patient transport vehicle.", 2.0)
    ],
    "electricity": [
        ("Substation Transformer Upgrade & Aerial Bundled Cabling", "High-capacity transformer replacement, surge arrestors, and storm-resistant insulated cables.", 4.5),
        ("Arctic / Extreme Cold Thermal Heating Main Overhaul", "Polyurethane pre-insulated pipes and automated pressure valves to prevent sub-zero ruptures.", 7.0)
    ],
    "schools": [
        ("Primary School Building Reconstruction & Clean Sanitation", "Reinforced roof waterproofing, modern girl-friendly toilets, and solar micro-power.", 1.8),
        ("Winter Classroom Heating & Thermal Insulation", "Safe electric thermal radiator installation, double-glazed windows, and electrical rewiring.", 1.5)
    ],
    "broadband": [
        ("Rural Village Optical Fiber Loop & Common Service Center", "Underground fiber optic link connecting panchayats/clinics with public Wi-Fi hotspots.", 1.2),
        ("Metropolitan 5G Micro-Cell & Smart Pole Network", "Ultra-dense commercial fiber expansion and intelligent street sensing poles.", 8.0)
    ]
}

def generate_project_recommendations(
    country: str = "India",
    weights: Optional[PriorityWeights] = None,
    sector_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    if weights is None:
        weights = DEFAULT_WEIGHTS
        
    fused_data = get_fused_district_data(country)
    gap_info = compute_gap_matrix(fused_data)
    
    # Map unplanned gaps and ghost allocations for fast lookup
    unplanned_set = {(g["district"], g["sector"]) for g in gap_info["unplanned_gaps"]}
    ghost_set = {(g["district"], g["sector"]) for g in gap_info["ghost_allocations"]}
    aligned_set = {(g["district"], g["sector"]) for g in gap_info["aligned_projects"]}

    recommendations = []

    for d in fused_data:
        d_name = d["district"]
        pop = d["population"]
        poverty = d["poverty_index"]
        
        sectors_to_evaluate = [sector_filter] if sector_filter and sector_filter != "all" else ["water", "roads", "health", "electricity", "broadband", "schools"]
        
        for sec in sectors_to_evaluate:
            demand_count = d["demand_counts"].get(sec, 0)
            norm_demand = d["normalized_demand_per_100k"].get(sec, 0.0)
            infra_idx = d["infrastructure_index"].get(sec, 0.5)
            budget_m = d["planned_investment_usd_m"].get(sec, 0.0)

            # Skip trivial zero-activity cells if not planned
            if demand_count == 0 and budget_m == 0:
                continue

            # Project details
            templates = PROJECT_TEMPLATES.get(sec, PROJECT_TEMPLATES["water"])
            tpl_idx = 0 if norm_demand > 5.0 else (1 if len(templates) > 1 else 0)
            proj_title, proj_desc, default_cost = templates[tpl_idx]
            
            # Gap status
            key = (d_name, sec)
            if key in unplanned_set:
                gap_status = "unplanned_gap"
            elif key in ghost_set:
                gap_status = "ghost_allocation"
            elif key in aligned_set:
                gap_status = "aligned"
            else:
                gap_status = "moderate_need"

            # Cost estimation
            est_cost_m = round(default_cost * (0.8 + (pop / 2000000) * 0.4), 2)

            # Calculate the 6 components (each normalized 0 to 100)
            # 1. Demand factor (0-100)
            # 15 normalized per 100k maps to 100
            s_demand = min(100.0, (norm_demand / 15.0) * 100.0)

            # 2. Deprivation factor (0-100)
            # Low infrastructure (high deficit) + high poverty
            infra_deficit = max(0.0, 1.0 - infra_idx)
            s_deprivation = min(100.0, (infra_deficit * 60.0 + poverty * 40.0))

            # 3. Population affected factor (0-100)
            s_population = min(100.0, (math.log10(max(1000, pop)) / 7.0) * 100.0)

            # 4. Equity adjustment factor (0-100)
            equity_val = 20.0
            if poverty >= 0.70:
                equity_val += 35.0
            if gap_status == "unplanned_gap":
                equity_val += 35.0
            if d_name in ["Banda", "Gadchiroli", "Vhembe", "Caruaru", "Kalahandi"]:
                equity_val += 10.0
            s_equity = min(100.0, equity_val)

            # 5. Cost effectiveness (0-100)
            beneficiaries = int(pop * (0.15 + (demand_count / max(1, demand_count + 50)) * 0.35))
            benefit_ratio = beneficiaries / (est_cost_m * 1000000.0)
            s_cost_eff = min(100.0, max(15.0, benefit_ratio * 400.0))

            # 6. Feasibility (0-100)
            # Higher if infrastructure baseline data exists and budget is already partially considered
            s_feasibility = 85.0 if gap_status == "aligned" else (75.0 if gap_status == "unplanned_gap" else 60.0)

            # Composite weighted score (0 to 100)
            raw_score = (
                weights.w_demand * s_demand +
                weights.w_deprivation * s_deprivation +
                weights.w_population * s_population +
                weights.w_equity * s_equity +
                weights.w_cost_effectiveness * s_cost_eff +
                weights.w_feasibility * s_feasibility
            )
            # Normalize by sum of weights
            total_weight = (weights.w_demand + weights.w_deprivation + weights.w_population + 
                            weights.w_equity + weights.w_cost_effectiveness + weights.w_feasibility) or 1.0
            priority_score = round(raw_score / total_weight, 1)

            # If ghost allocation, heavily depress priority score to highlight for reallocation
            if gap_status == "ghost_allocation":
                priority_score = min(priority_score, 24.5)

            score_breakdown = {
                "demand": round(s_demand, 1),
                "deprivation": round(s_deprivation, 1),
                "population": round(s_population, 1),
                "equity": round(s_equity, 1),
                "cost_effectiveness": round(s_cost_eff, 1),
                "feasibility": round(s_feasibility, 1),
                "weights_used": {
                    "w_demand": weights.w_demand,
                    "w_deprivation": weights.w_deprivation,
                    "w_population": weights.w_population,
                    "w_equity": weights.w_equity,
                    "w_cost_effectiveness": weights.w_cost_effectiveness,
                    "w_feasibility": weights.w_feasibility
                }
            }

            rec_id = f"proj_{country[:3].lower()}_{d_name[:3].lower()}_{sec}"
            
            explainability = generate_grounded_explanation(
                district=d_name,
                state=d["state"],
                country=country,
                sector=sec,
                demand_count=demand_count,
                norm_demand=norm_demand,
                poverty=poverty,
                infra_idx=infra_idx,
                budget_m=budget_m,
                est_cost_m=est_cost_m,
                priority_score=priority_score,
                gap_status=gap_status,
                score_breakdown=score_breakdown
            )

            recommendations.append({
                "id": rec_id,
                "country": country,
                "state": d["state"],
                "district": d_name,
                "sector": sec,
                "title": f"{d_name}: {proj_title}",
                "description": proj_desc,
                "demand_count": demand_count,
                "population_affected": beneficiaries,
                "poverty_index": poverty,
                "baseline_infra_index": infra_idx,
                "planned_budget_m": budget_m,
                "estimated_cost_m": est_cost_m,
                "priority_score": priority_score,
                "score_breakdown": score_breakdown,
                "gap_status": gap_status,
                "status": "recommended",
                "explainability": explainability,
                "lat": d["lat"],
                "lng": d["lng"]
            })

    # Sort descending by priority score
    recommendations.sort(key=lambda x: x["priority_score"], reverse=True)
    return recommendations
