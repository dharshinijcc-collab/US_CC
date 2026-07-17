import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.services.supabase_client import supabase_admin
from app.tools.sve.collectors import collect_posts
from app.tools.sve.analyzers import (
    generate_keywords,
    extract_pain_points,
    tag_sentiment,
    find_competitors,
    analyze_features,
    compute_validation_score
)

# Global in-memory stage tracker to bypass DB constraints
sve_status_store: Dict[str, Dict[str, Any]] = {}

async def set_status(project_id: str, status: str, failed_stage: str = None) -> None:
    if not supabase_admin:
        return
    try:
        payload = {"status": status}
        if failed_stage:
            payload["failed_stage"] = failed_stage
            
        supabase_admin.table("projects").update(payload).eq("id", project_id).execute()
    except Exception as e:
        print(f"orchestrator: failed to update status to {status}: {e}")

async def set_stage(project_id: str, stage: str) -> None:
    sve_status_store[project_id] = {"current_stage": stage}
    print(f"pipeline: stage updated to '{stage}' for project {project_id}")

async def insert_sources(project_id: str, raw_posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not raw_posts or not supabase_admin:
        return []
        
    rows = []
    for p in raw_posts:
        rows.append({
            "project_id": project_id,
            "platform": p.get("platform"),
            "url": p.get("url"),
            "content": p.get("content"),
            "engagement": p.get("engagement") or 1,
            "posted_at": p.get("posted_at")
        })
        
    try:
        res = supabase_admin.table("sources").insert(rows).execute()
        return res.data or []
    except Exception as e:
        print(f"orchestrator: failed to insert sources: {e}")
        return []

async def insert_pain_points(project_id: str, pain_points: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not pain_points or not supabase_admin:
        return []
        
    rows = []
    for pp in pain_points:
        rows.append({
            "project_id": project_id,
            "pain_point": pp.get("pain_point"),
            "mentions": pp.get("mentions") or 1,
            "severity": pp.get("severity") or 3,
            "confidence": pp.get("confidence") or 0.5
        })
        
    try:
        res = supabase_admin.table("pain_points").insert(rows).execute()
        inserted = res.data or []
        
        # Populate join table - map inserted UUID back to source_ids
        join_rows = []
        for i, inserted_pp in enumerate(inserted):
            original_pp = pain_points[i]
            source_ids = original_pp.get("source_ids") or []
            for source_id in source_ids:
                join_rows.append({
                    "pain_point_id": inserted_pp.get("id"),
                    "source_id": source_id
                })
                
        if join_rows:
            supabase_admin.table("pain_point_sources").insert(join_rows).execute()
            
        return inserted
    except Exception as e:
        print(f"orchestrator: failed to insert pain points: {e}")
        return []

async def insert_competitors(project_id: str, competitors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not competitors or not supabase_admin:
        return []
        
    rows = []
    for c in competitors:
        rows.append({
            "project_id": project_id,
            "name": c.get("name"),
            "website": c.get("website"),
            "source_url": c.get("source_url"),
            "missing_features": c.get("missing_features") or [],
            "confidence": c.get("confidence") or 0.5
        })
        
    try:
        res = supabase_admin.table("competitors").insert(rows).execute()
        return res.data or []
    except Exception as e:
        print(f"orchestrator: failed to insert competitors: {e}")
        return []

async def insert_features(project_id: str, features: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not features or not supabase_admin:
        return []
        
    rows = []
    for f in features:
        rows.append({
            "project_id": project_id,
            "feature_name": f.get("feature_name"),
            "mentions": f.get("mentions") or 1,
            "priority": f.get("priority") or "low"
        })
        
    try:
        res = supabase_admin.table("features").insert(rows).execute()
        return res.data or []
    except Exception as e:
        print(f"orchestrator: failed to insert features: {e}")
        return []

async def insert_report(project_id: str, score_result: Dict[str, Any]) -> None:
    if not supabase_admin:
        return
    try:
        supabase_admin.table("reports").insert([{
            "project_id": project_id,
            "validation_score": score_result.get("validation_score"),
            "verdict": score_result.get("verdict"),
            "reasoning": score_result.get("reasoning")
        }]).execute()
    except Exception as e:
        print(f"orchestrator: failed to insert SVE report: {e}")
        raise e

async def run_pipeline(project_id: str, idea_text: str) -> None:
    pipeline_start = datetime.now(timezone.utc).timestamp()
    def elapsed():
        return f"+{(datetime.now(timezone.utc).timestamp() - pipeline_start):.1f}s"

    print("\n" + "="*60)
    print(f"[SVE] Pipeline START  project_id={project_id}")
    print("="*60)

    try:
        # Stage 1: Keyword Generation
        await set_stage(project_id, "keyword_generation")
        print(f"\n[{elapsed()}] [STAGE 1] Keyword Generation — calling Gemini...")
        try:
            keywords = await generate_keywords(idea_text)
            print(f"[{elapsed()}] [STAGE 1 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 1 FAILED]: {exc}")
            await set_status(project_id, "failed", "keyword_generator")
            return

        # Stage 2: Post Collection
        await set_status(project_id, "collecting")
        await set_stage(project_id, "collecting")
        print(f"\n[{elapsed()}] [STAGE 2] Post Collection — scraping HN & PH...")
        try:
            raw_posts = await collect_posts(keywords)
            source_rows = await insert_sources(project_id, raw_posts)
            print(f"[{elapsed()}] [STAGE 2 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 2 FAILED]: {exc}")
            await set_status(project_id, "failed", "reddit_collector")
            return

        if not source_rows:
            print(f"[{elapsed()}] [STAGE 2 WARNING] Zero sources collected. Halting.")
            await set_status(project_id, "failed", "reddit_collector")
            return

        # Stage 3: Pain Point Extraction
        await set_status(project_id, "analyzing")
        await set_stage(project_id, "extracting_pain_points")
        print(f"\n[{elapsed()}] [STAGE 3] Pain Point Extraction — sending posts to Gemini...")
        try:
            pain_points_raw = await extract_pain_points(idea_text, source_rows)
            await insert_pain_points(project_id, pain_points_raw)
            print(f"[{elapsed()}] [STAGE 3 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 3 FAILED]: {exc}")
            await set_status(project_id, "failed", "pain_point_extractor")
            return

        # Stage 4: Sentiment Tagging
        await set_stage(project_id, "sentiment_tagging")
        print(f"\n[{elapsed()}] [STAGE 4] Sentiment Tagging...")
        try:
            sentiment = await tag_sentiment(source_rows)
            print(f"[{elapsed()}] [STAGE 4 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 4 WARNING] (non-fatal): {exc}")
            sentiment = {"buying_intent_count": 0, "active_search_count": 0, "total_tagged": 0, "per_source": {}}

        # Stage 5: Competitor Discovery
        await set_stage(project_id, "competitor_discovery")
        print(f"\n[{elapsed()}] [STAGE 5] Competitor Discovery...")
        try:
            competitors_raw = await find_competitors(idea_text, pain_points_raw)
            await insert_competitors(project_id, competitors_raw)
            print(f"[{elapsed()}] [STAGE 5 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 5 WARNING] (non-fatal): {exc}")
            competitors_raw = []

        # Stage 6: Feature Request Analysis
        await set_stage(project_id, "feature_mapping")
        print(f"\n[{elapsed()}] [STAGE 6] Feature Request Analysis...")
        try:
            features_raw = await analyze_features(idea_text, competitors_raw)
            await insert_features(project_id, features_raw)
            print(f"[{elapsed()}] [STAGE 6 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 6 WARNING] (non-fatal): {exc}")
            features_raw = []

        # Stage 7: Validation Scoring
        await set_stage(project_id, "scoring")
        print(f"\n[{elapsed()}] [STAGE 7] Computing Validation Score...")
        try:
            score_result = compute_validation_score(
                pain_points_raw, sentiment, competitors_raw, features_raw, source_rows
            )
            await insert_report(project_id, score_result)
            
            # Save compiled dd_report jsonb payload
            final_payload = {
                "id": project_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "social_validation": {
                    "validation_score": score_result["validation_score"],
                    "verdict": score_result["verdict"],
                    "reasoning": score_result["reasoning"],
                    "pain_points": [{
                        "pain_point": pp.get("pain_point"),
                        "mentions": pp.get("mentions"),
                        "severity": pp.get("severity"),
                        "confidence": pp.get("confidence"),
                        "sources": []
                    } for pp in pain_points_raw],
                    "competitors": [{
                        "name": c.get("name"),
                        "website": c.get("website"),
                        "source_url": c.get("source_url"),
                        "missing_features": c.get("missing_features"),
                        "confidence": c.get("confidence")
                    } for c in competitors_raw],
                    "feature_requests": [{
                        "feature_name": f.get("feature_name"),
                        "mentions": f.get("mentions"),
                        "priority": f.get("priority")
                    } for f in features_raw]
                }
            }
            
            supabase_admin.table("dd_reports").update({
                "overall_score": score_result["validation_score"],
                "verdict": score_result["verdict"],
                "report_data": final_payload
            }).eq("id", project_id).execute()

            print(f"[{elapsed()}] [STAGE 7 DONE]")
        except Exception as exc:
            print(f"[{elapsed()}] [STAGE 7 FAILED]: {exc}")
            await set_status(project_id, "failed", "validation_engine")
            return

        await set_status(project_id, "done")
        print(f"\n[SVE] Pipeline COMPLETE project_id={project_id}")
    except Exception as e:
        print(f"[SVE] Critical pipeline failure: {e}")
        await set_status(project_id, "failed", "validation_engine")
