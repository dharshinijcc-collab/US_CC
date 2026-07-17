import time
import httpx
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, path, json_data=None, params=None, headers=None):
    url = f"{BASE_URL}{path}"
    start = time.perf_counter()
    try:
        if method == "GET":
            resp = httpx.get(url, params=params, headers=headers, timeout=30.0)
        elif method == "POST":
            resp = httpx.post(url, json=json_data, params=params, headers=headers, timeout=30.0)
        duration = (time.perf_counter() - start) * 1000.0
        return resp.status_code, round(duration, 2), resp.json()
    except Exception as e:
        duration = (time.perf_counter() - start) * 1000.0
        return 500, round(duration, 2), {"error": str(e)}

def run_live_audit():
    print("==================================================")
    print("LIVE RUNTIME EXECUTION AUDIT")
    print("==================================================")

    results = []

    # 1. Root Endpoint
    sc, ms, data = test_endpoint("GET", "/")
    results.append({
        "Endpoint": "GET /",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"status={data.get('status')} message={data.get('message')}"
    })

    # 2. Content CMS Endpoint
    sc, ms, data = test_endpoint("GET", "/api/content")
    results.append({
        "Endpoint": "GET /api/content",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"status={data.get('status')} payload_keys={list(data.get('payload', {}).keys()) if data.get('payload') else 'None'}"
    })

    # 3. FAQs Endpoint
    sc, ms, data = test_endpoint("GET", "/api/faqs")
    results.append({
        "Endpoint": "GET /api/faqs",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"status={data.get('status')} length={len(data.get('payload', [])) if data.get('payload') else 0}"
    })

    # 4. Admin Login with bad credentials
    sc, ms, data = test_endpoint("POST", "/api/auth/login", {
        "email": "wrong@admin.com",
        "password": "wrongpassword"
    })
    results.append({
        "Endpoint": "POST /api/auth/login (Bad Auth)",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"detail={data.get('detail', 'Unknown error')}"
    })

    # 5. VC Idea Validator Submission (Real mathematical check)
    idea_payload = {
        "ideaText": "A subscription clothing marketplace for dynamic styles",
        "toolType": "idea-validator",
        "answers": {
            "customer": "Fashion conscious Gen Z consumers",
            "problem": "High cost of owning temporary fashion items",
            "pain_score": 8,
            "validation_level": "waitlist",
            "market_size_choice": "large",
            "revenue_model_choice": "subscription",
            "why_now": "Sustainability and circular economy interest is booming",
            "competitors": "Rent the runway, Stitch fix",
            "moat": "Proprietary sizing datasets and automated return loops",
            "solo_founder": False,
            "has_technical_cofounder": True,
            "technical_background": "can_code",
            "current_stage": "prototype",
            "launch_timeline": "3 months",
            "funding_status": "bootstrapped",
            "contact_name": "Dharshini",
            "contact_email": "dharshini@crestcode.com",
            "need_help": False
        }
    }
    sc, ms, data = test_endpoint("POST", "/api/idea-validator", idea_payload)
    results.append({
        "Endpoint": "POST /api/idea-validator",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"overall_score={data.get('overall_score')} triage_band={data.get('triage_band')} is_mock={data.get('is_mock')}"
    })

    # 6. SVE Project Creation
    sve_payload = {
        "idea_text": "A subscription clothing marketplace for dynamic styles",
        "name": "Dharshini",
        "email": "dharshini@crestcode.com"
    }
    sc, ms, data = test_endpoint("POST", "/api/social-validation", sve_payload)
    results.append({
        "Endpoint": "POST /api/social-validation",
        "Status Code": sc,
        "Response Time": f"{ms} ms",
        "Result": f"status={data.get('status')} project_id={data.get('project_id')}"
    })

    # Format output as a markdown table
    print("\n| Endpoint | Status Code | Response Time | Result |")
    print("|---|---|---|---|")
    for r in results:
        print(f"| {r['Endpoint']} | {r['Status Code']} | {r['Response Time']} | {r['Result']} |")

if __name__ == "__main__":
    run_live_audit()
