from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class CitizenInputCreate(BaseModel):
    channel: str = Field(default="whatsapp", description="whatsapp, sms, voice, or web")
    raw_text: str = Field(..., description="Original raw citizen message or voice note transcript")
    citizen_name: Optional[str] = Field(default="Anonymous Citizen")
    phone_number: Optional[str] = Field(default="+91 98765 43210")
    language_hint: Optional[str] = Field(default="auto")
    country: Optional[str] = Field(default="India")
    consent_granted: bool = Field(default=True, description="Citizen gave explicit consent for infrastructure analytics")
    audio_simulated: Optional[bool] = Field(default=False)

class ExtractedMetadata(BaseModel):
    sector: str = Field(..., description="water, roads, health, electricity, broadband, schools")
    sub_type: str = Field(default="general", description="Sub-category of demand")
    severity: str = Field(default="medium", description="critical, high, medium, low")
    affected_group: str = Field(default="general_public", description="e.g. farmers, students, mothers, patients")
    location_mention: str = Field(default="", description="Location string detected in text")
    confidence: float = Field(default=0.85, description="Model extraction confidence score (0.0 - 1.0)")

class CitizenRequestRecord(BaseModel):
    id: str
    channel: str
    original_text: str
    translated_text: str
    detected_language: str
    masked_name: str
    masked_phone: str
    consent_granted: bool
    sector: str
    sub_type: str
    severity: str
    affected_group: str
    location_mention: str
    confidence: float
    district: str
    state: str
    country: str
    lat: float
    lng: float
    cluster_id: Optional[str] = None
    review_status: str = "approved"  # approved, pending_review, rejected
    created_at: str

class DistrictMetrics(BaseModel):
    district: str
    state: str
    country: str
    lat: float
    lng: float
    population: int
    poverty_index: float  # 0.0 - 1.0
    infrastructure_index: Dict[str, float]  # sector -> 0.0 - 1.0
    planned_investment_usd_m: Dict[str, float]  # sector -> millions
    demand_counts: Dict[str, int] = {}
    normalized_demand_per_100k: Dict[str, float] = {}
    hotspot_flags: Dict[str, bool] = {}

class PriorityWeights(BaseModel):
    w_demand: float = Field(default=0.25, ge=0.0, le=1.0)
    w_deprivation: float = Field(default=0.20, ge=0.0, le=1.0)
    w_population: float = Field(default=0.15, ge=0.0, le=1.0)
    w_equity: float = Field(default=0.15, ge=0.0, le=1.0)
    w_cost_effectiveness: float = Field(default=0.15, ge=0.0, le=1.0)
    w_feasibility: float = Field(default=0.10, ge=0.0, le=1.0)

class ProjectRecommendation(BaseModel):
    id: str
    country: str
    state: str
    district: str
    sector: str
    title: str
    description: str
    demand_count: int
    population_affected: int
    poverty_index: float
    baseline_infra_index: float
    planned_budget_m: float
    estimated_cost_m: float
    priority_score: float  # 0 to 100
    score_breakdown: Dict[str, float]
    gap_status: str  # "unplanned_gap", "aligned", "ghost_allocation", "moderate_need"
    status: str = "recommended"  # "recommended", "approved", "rejected", "deferred"
    explainability: Dict[str, Any]
    lat: float
    lng: float

class ReviewQueueAction(BaseModel):
    action: str = Field(..., description="approve, reject, update")
    corrected_sector: Optional[str] = None
    corrected_district: Optional[str] = None
    corrected_severity: Optional[str] = None
    reviewer_notes: Optional[str] = None

class ProjectAction(BaseModel):
    action: str = Field(..., description="approve, reject, defer")
    policymaker_notes: Optional[str] = None

class ScenarioSimulationRequest(BaseModel):
    country: str = "India"
    budget_limit_m: float = 50.0
    weights: Optional[PriorityWeights] = None
    selected_sector: Optional[str] = "all"

class NLQueryRequest(BaseModel):
    query: str
    country: Optional[str] = "India"

class AuditLogItem(BaseModel):
    id: str
    timestamp: str
    actor: str  # AI Pipeline, Human Reviewer, Policymaker, System
    action: str
    details: str
    country: str
    regime: str

class ChatbotMessageRequest(BaseModel):
    message: str
    country: Optional[str] = "India"
    conversation_history: Optional[List[Dict[str, str]]] = []
