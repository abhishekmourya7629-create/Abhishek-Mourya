import sqlite3
import json
import os
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from ..config import settings

def get_db_path() -> str:
    db_file = settings.DB_PATH
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    return db_file

def get_connection():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Citizen Requests
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS citizen_requests (
        id TEXT PRIMARY KEY,
        channel TEXT,
        original_text TEXT,
        translated_text TEXT,
        detected_language TEXT,
        masked_name TEXT,
        masked_phone TEXT,
        consent_granted INTEGER,
        sector TEXT,
        sub_type TEXT,
        severity TEXT,
        affected_group TEXT,
        location_mention TEXT,
        confidence REAL,
        district TEXT,
        state TEXT,
        country TEXT,
        lat REAL,
        lng REAL,
        cluster_id TEXT,
        review_status TEXT DEFAULT 'approved',
        created_at TEXT
    )
    """)
    
    # 2. Districts & Demographic Fusion Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS districts (
        district TEXT,
        state TEXT,
        country TEXT,
        lat REAL,
        lng REAL,
        population INTEGER,
        poverty_index REAL,
        infrastructure_index_json TEXT,
        planned_investment_json TEXT,
        description TEXT,
        PRIMARY KEY (country, state, district)
    )
    """)
    
    # 3. Project Recommendations & Priority Engine Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS project_recommendations (
        id TEXT PRIMARY KEY,
        country TEXT,
        state TEXT,
        district TEXT,
        sector TEXT,
        title TEXT,
        description TEXT,
        demand_count INTEGER,
        population_affected INTEGER,
        poverty_index REAL,
        baseline_infra_index REAL,
        planned_budget_m REAL,
        estimated_cost_m REAL,
        priority_score REAL,
        score_breakdown_json TEXT,
        gap_status TEXT,
        status TEXT DEFAULT 'recommended',
        explainability_json TEXT,
        lat REAL,
        lng REAL
    )
    """)
    
    # 4. Human Review Queue
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS human_review_queue (
        id TEXT PRIMARY KEY,
        request_id TEXT,
        original_text TEXT,
        translated_text TEXT,
        channel TEXT,
        detected_language TEXT,
        confidence REAL,
        extracted_json TEXT,
        reviewer_notes TEXT,
        status TEXT DEFAULT 'pending_review',
        created_at TEXT
    )
    """)
    
    # 5. Audit Log (Cryptographically signed / hashed trail)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        actor TEXT,
        action TEXT,
        details TEXT,
        country TEXT,
        regime TEXT,
        hash_signature TEXT
    )
    """)
    
    # 6. Impact Ledger ("You Said, We Did")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS impact_ledger (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT,
        district TEXT,
        sector TEXT,
        baseline_metric REAL,
        current_metric REAL,
        target_metric REAL,
        citizen_satisfaction_rate REAL,
        status TEXT,
        last_verified TEXT
    )
    """)

    conn.commit()
    conn.close()

def log_audit(actor: str, action: str, details: str, country: str = "India", regime: str = "DPDP Act, 2023"):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.utcnow().isoformat() + "Z"
    entry_id = f"aud_{int(datetime.utcnow().timestamp()*1000)}"
    payload = f"{entry_id}:{now_iso}:{actor}:{action}:{country}:{details}"
    sig = hashlib.sha256(payload.encode()).hexdigest()[:16]
    
    cursor.execute("""
    INSERT INTO audit_log (id, timestamp, actor, action, details, country, regime, hash_signature)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (entry_id, now_iso, actor, action, details, country, regime, sig))
    conn.commit()
    conn.close()
