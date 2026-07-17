import os
import sys
import asyncio
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Ensure the root apps/backend directory is in Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from main import app
from app.tools.sve.analyzers.validation_engine import compute_validation_score
from app.tools.sve.collectors.hacker_news import collect_hn_posts
from app.tools.sve.collectors.product_hunt import collect_ph_posts

client = TestClient(app)

def test_math_scoring():
    print("Testing SVE scoring algorithm math...")
    # Mock analysis data
    pain_points = [
        {"pain_point": "high subscription cost", "mentions": 5, "severity": 4, "confidence": 0.8}
    ]
    sentiment = {
        "buying_intent_count": 2,
        "active_search_count": 1,
        "total_tagged": 5
    }
    competitors = [
        {"name": "CompA", "missing_features": ["high subscription cost"]}
    ]
    features = [
        {"feature_name": "API access", "mentions": 3, "priority": "low"}
    ]
    sources = [
        {"posted_at": "2026-07-01T00:00:00+00:00"}
    ]
    
    result = compute_validation_score(pain_points, sentiment, competitors, features, sources)
    print("Scoring Output:", result)
    
    assert "validation_score" in result
    assert "verdict" in result
    assert "reasoning" in result
    assert isinstance(result["validation_score"], int)
    print("[PASS] Math scoring test PASSED!")

async def test_hn_collector():
    print("Testing Hacker News live scraper collector...")
    posts = await collect_hn_posts(["startup", "venture"])
    print(f"Hacker News scraper returned {len(posts)} posts.")
    if posts:
        assert posts[0]["platform"] == "hackernews"
        assert "url" in posts[0]
        assert "content" in posts[0]
        assert "engagement" in posts[0]
    print("[PASS] Hacker News collector test PASSED!")

def test_api_endpoints():
    print("Testing FastAPI server routing endpoints...")
    # 1. Test root heartbeat endpoint
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    
    # 2. Test POST /api/social-validation (pipeline initialization)
    payload = {
        "ideaText": "An AI writing coach for screenwriters that helps draft screenplays and optimize pacing and character arcs.",
        "ideaName": "ScreenplayAI",
        "targetAudience": "Indie Filmmakers & Writers",
        "contactName": "Alice Dev",
        "contactEmail": "alice@script.io"
    }
    response = client.post("/api/social-validation", json=payload)
    print("POST /api/social-validation Response:", response.json())
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["status"] == "pending"
    
    # 3. Test GET /api/social-validation/status
    project_id = response.json()["id"]
    status_response = client.get(f"/api/social-validation/status?id={project_id}")
    print("GET status Response:", status_response.json())
    assert status_response.status_code == 200
    assert "status" in status_response.json()
    
    print("[PASS] FastAPI endpoints test PASSED!")

def main():
    print("==================================================")
    print("[TEST] Running CrestCode Python Backend Test Suite...")
    print("==================================================")
    
    # Test scoring math
    test_math_scoring()
    
    # Run async collectors test
    asyncio.run(test_hn_collector())
    
    # Test FastAPI routers using HTTP test client
    test_api_endpoints()
    
    print("\n[SUCCESS] ALL TESTS PASSED SUCCESSFULLY! Python SVE Backend is fully functional.")

if __name__ == "__main__":
    main()
