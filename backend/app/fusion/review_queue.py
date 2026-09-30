import json
from typing import List, Dict, Any, Optional
from ..models.database import get_connection, log_audit
from ..models.schemas import ReviewQueueAction

def get_pending_review_items(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, request_id, original_text, translated_text, channel,
           detected_language, confidence, extracted_json, reviewer_notes, status, created_at
    FROM human_review_queue
    WHERE status = 'pending_review'
    ORDER BY created_at DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        extracted = {}
        try:
            extracted = json.loads(r["extracted_json"])
        except Exception:
            pass
        results.append({
            "id": r["id"],
            "request_id": r["request_id"],
            "original_text": r["original_text"],
            "translated_text": r["translated_text"],
            "channel": r["channel"],
            "detected_language": r["detected_language"],
            "confidence": r["confidence"],
            "extracted": extracted,
            "reviewer_notes": r["reviewer_notes"],
            "status": r["status"],
            "created_at": r["created_at"]
        })
    conn.close()
    return results

def process_review_item(item_id: str, action_data: ReviewQueueAction) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM human_review_queue WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return {"success": False, "error": "Review item not found"}
        
    req_id = row["request_id"]
    new_status = "approved" if action_data.action == "approve" else "rejected"
    
    cursor.execute("""
    UPDATE human_review_queue
    SET status = ?, reviewer_notes = ?
    WHERE id = ?
    """, (new_status, action_data.reviewer_notes or f"Human action: {action_data.action}", item_id))
    
    # Also update the citizen_requests table
    if action_data.action == "approve":
        updates = ["review_status = 'approved'", "confidence = 1.0"]
        params = []
        if action_data.corrected_sector:
            updates.append("sector = ?")
            params.append(action_data.corrected_sector)
        if action_data.corrected_district:
            updates.append("district = ?")
            params.append(action_data.corrected_district)
        if action_data.corrected_severity:
            updates.append("severity = ?")
            params.append(action_data.corrected_severity)
            
        params.append(req_id)
        sql = f"UPDATE citizen_requests SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(sql, params)
    else:
        cursor.execute("UPDATE citizen_requests SET review_status = 'rejected' WHERE id = ?", (req_id,))
        
    conn.commit()
    conn.close()
    
    log_audit("Human Reviewer", f"REVIEW_{action_data.action.upper()}", f"Reviewer processed queue item {item_id} (request {req_id}) -> {new_status}")
    
    return {"success": True, "item_id": item_id, "new_status": new_status}
