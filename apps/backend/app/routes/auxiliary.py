from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from pydantic import BaseModel
from app.services.supabase_client import supabase_admin
from app.middleware.auth import get_current_admin

router = APIRouter(tags=["Auxiliary & CMS Data"])

class ContentUpdateRequest(BaseModel):
    payload: Dict[str, Any]

# --- 1. SITE CONTENT (CMS) ---
@router.get("/content")
def get_site_content():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("site_content") \
            .select("payload") \
            .eq("content_key", "main_config") \
            .eq("active", True) \
            .maybe_single() \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="No content found")
        return {"status": "success", "payload": response.data["payload"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/content/update")
def update_site_content(payload: ContentUpdateRequest, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        supabase_admin.table("site_content") \
            .update({"payload": payload.payload}) \
            .eq("content_key", "main_config") \
            .execute()
        return {"status": "success", "payload": "Content updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. FAQs ---
@router.get("/faqs")
def get_faqs():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("faqs").select("*").order("display_order", desc=False).execute()
        return {"status": "success", "payload": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 3. MILESTONES ---
@router.get("/milestones")
def get_milestones():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("milestones").select("*").order("display_order", desc=False).execute()
        return {"status": "success", "payload": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 4. CAREERS / OPEN POSITIONS ---
@router.get("/open-positions")
def get_open_positions():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("open_positions").select("*").order("display_order", desc=False).execute()
        return {"status": "success", "payload": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 5. PARTNER DEALS / PRODUCTS ---
@router.get("/partner-products")
def get_partner_products():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("partner_products").select("*").order("display_order", desc=False).execute()
        return {"status": "success", "payload": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 6. TEAM MEMBERS ---
@router.get("/team")
def get_team_members():
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        response = supabase_admin.table("team_members").select("*").order("display_order", desc=False).execute()
        return {"status": "success", "payload": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 7. TOOL CONFIGURATION ---
@router.get("/tool-config")
def get_tool_config(key: Optional[str] = None):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured.")
    try:
        if key:
            response = supabase_admin.table("tool_configurations").select("config").eq("key", key).maybe_single().execute()
            if not response.data:
                raise HTTPException(status_code=404, detail=f"No configuration found for key {key}")
            return {"status": "success", "payload": response.data["config"]}
        else:
            response = supabase_admin.table("tool_configurations").select("key, config").execute()
            configs = {}
            for item in (response.data or []):
                configs[item["key"]] = item["config"]
            return {"status": "success", "payload": configs}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# --- 8. DATABASE SEEDING ---
@router.post("/seed-db")
def seed_database():
    import os
    import json
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        config_path = os.path.join(base_dir, "frontend", "shared", "config.json")
        
        if not os.path.exists(config_path):
            raise HTTPException(status_code=404, detail=f"config.json not found at {config_path}")
            
        with open(config_path, "r", encoding="utf-8") as f:
            config_data = json.load(f)
            
        # 1. Seed site_content
        existing = supabase_admin.table("site_content") \
            .select("id") \
            .eq("content_key", "main_config") \
            .maybe_single() \
            .execute()
            
        if existing.data:
            supabase_admin.table("site_content") \
                .update({"payload": config_data, "active": True}) \
                .eq("content_key", "main_config") \
                .execute()
        else:
            supabase_admin.table("site_content") \
                .insert({"content_key": "main_config", "payload": config_data, "active": True}) \
                .execute()

        # 2. Seed team_members if empty
        team_check = supabase_admin.table("team_members").select("id", count="exact").limit(1).execute()
        if not team_check.data:
            team_members_seed = [
                {'name': 'Asfarul Huda', 'role': 'CEO & Founder', 'bio': 'Former Amazon Product Manager with a decade of experience building digital products at scale. Founded CrestCode in 2025 with a mission to give every founder access to world-class execution.', 'category': 'Founder', 'display_order': 1},
                {'name': 'Adam Braasch', 'role': 'Partner', 'bio': 'A strategic and operational partner at CrestCode, Adam brings deep expertise in building and scaling early-stage ventures from idea to market.', 'category': 'Partner', 'display_order': 2},
                {'name': 'Pranali Choubal', 'role': 'Partner', 'bio': 'Pranali brings a sharp product and design sensibility to CrestCode, ensuring that every venture we build is not just functional — but genuinely lovable.', 'category': 'Partner', 'display_order': 3},
                {'name': 'Amir Hoda', 'role': 'Partner', 'bio': 'A technical and business partner at CrestCode, Amir focuses on engineering strategy, delivery excellence, and helping ventures scale with confidence.', 'category': 'Partner', 'display_order': 4},
                {'name': 'Fahad Siddiqui', 'role': 'Finance Advisor', 'bio': 'Advises CrestCode and its ventures on financial strategy, investment structuring, and capital planning.', 'category': 'Advisor', 'display_order': 5},
                {'name': 'Dr. Faria Ali', 'role': 'Healthcare Advisor', 'bio': 'Brings deep domain expertise in healthcare, guiding CrestCode ventures in health-adjacent product strategy and compliance.', 'category': 'Advisor', 'display_order': 6}
            ]
            supabase_admin.table("team_members").insert(team_members_seed).execute()

        # 3. Seed faqs if empty
        faqs_check = supabase_admin.table("faqs").select("id").limit(1).execute()
        if not faqs_check.data:
            faqs_seed = [
                {'category': 'engagement', 'question': 'What is your typical engagement process?', 'answer': 'Our process begins with a deep-dive discovery phase to align on goals. We then move into agile development cycles featuring bi-weekly demos, transparent roadmaps, and continuous feedback loops to ensure alignment at every step.', 'display_order': 0},
                {'category': 'engagement', 'question': 'Who owns the intellectual property?', 'answer': 'Upon completion and final payment, you retain 100% ownership of all source code, designs, and intellectual property generated during the engagement.', 'display_order': 1},
                {'category': 'product', 'question': 'How long does it take to build an MVP?', 'answer': 'A typical MVP takes between 12 to 20 weeks depending on complexity, integrations, and feature scope.', 'display_order': 0},
                {'category': 'product', 'question': 'What technology stack do you use?', 'answer': 'We specialize in modern, scalable stacks including React/Next.js for frontend, Node.js or Python for backend, and PostgreSQL for databases, hosted on AWS or GCP.', 'display_order': 1},
                {'category': 'security', 'question': 'How do you handle data security?', 'answer': 'We implement industry-standard security practices including encryption at rest and in transit, regular security audits, and compliance with data protection regulations.', 'display_order': 0},
                {'category': 'security', 'question': 'What support do you provide after launch?', 'answer': 'We offer SLA-backed maintenance packages, ongoing feature iteration cycles, and proactive infrastructure monitoring to ensure your product scales seamlessly.', 'display_order': 1}
            ]
            supabase_admin.table("faqs").insert(faqs_seed).execute()

        # 4. Seed open_positions if empty
        positions_check = supabase_admin.table("open_positions").select("id").limit(1).execute()
        if not positions_check.data:
            positions_seed = [
                {'title': 'Frontend Developer', 'location': 'Chennai, TN', 'type': 'Full Time', 'experience': 'Mid-Level (2-3 Yrs)', 'category': 'Engineering', 'display_order': 0, 'apply_link': 'mailto:careers@crestcode.usa'},
                {'title': 'Backend Developer', 'location': 'Chennai, TN', 'type': 'Full Time', 'experience': 'Mid-Level (2-3 Yrs)', 'category': 'Engineering', 'display_order': 1, 'apply_link': 'mailto:careers@crestcode.usa'},
                {'title': 'Product Designer', 'location': 'Chennai, TN', 'type': 'Full Time', 'experience': 'Entry-Level', 'category': 'Design', 'display_order': 2, 'apply_link': 'mailto:careers@crestcode.usa'}
            ]
            supabase_admin.table("open_positions").insert(positions_seed).execute()

        # 5. Seed milestones if empty
        milestones_check = supabase_admin.table("milestones").select("id").limit(1).execute()
        if not milestones_check.data:
            milestones_seed = [
                {'year': '2023', 'title': 'The Seed of an Idea', 'description': 'While working as a Product Manager at Amazon, Asfarul Huda began thinking seriously about the entrepreneur journey. He saw a consistent pattern — founders with genuine ideas struggling to find partners who could actually build. The idea for a product studio that could bridge that gap began to take shape.', 'display_order': 0},
                {'year': '2024', 'title': 'The First Client — and the First Lesson', 'description': "Premier Review became CrestCode's first client, seeking strategic guidance as an early-stage startup. That engagement crystallized two foundational truths: founders don't just need builders — they need someone who will challenge them, hold them accountable, and earn their trust. Those two pillars — execution and trust — became the foundation of everything CrestCode stands for.", 'display_order': 1},
                {'year': '2025', 'title': 'CrestCode Launches', 'description': 'With a clear model and a founding team in place, CrestCode USA officially launched as a venture studio — offering end-to-end product building for founders and business owners. The mission: be the partner that turns ambitious ideas and real-world problems into products people actually use.', 'display_order': 2},
                {'year': 'TODAY', 'title': 'Three Products. One Studio. A Growing Portfolio.', 'description': 'CrestCode now has three active products in market — Dockly, OpenCapFi, and Vhoas — alongside strategic partnerships with Premier Review and CastleGEC. The studio is growing its team, its network, and its ambition.', 'display_order': 3}
            ]
            supabase_admin.table("milestones").insert(milestones_seed).execute()

        # 6. Seed partner_products if empty
        products_check = supabase_admin.table("partner_products").select("id").limit(1).execute()
        if not products_check.data:
            products_seed = [
                {
                    'name': 'Dockly',
                    'status_type': 'live',
                    'status_text': 'Live',
                    'status_subtext': 'Web ready',
                    'tagline': 'Family connectivity',
                    'subtitle': 'One connected platform to manage your life, simplified',
                    'stat_value': '2,400+ families onboarded',
                    'stat_subtext': 'Within the first 90 days post-launch',
                    'what_we_did': 'Scoped, designed, and built a unified family hub from scratch — shipping a live product in 4 months with a 3-person team.',
                    'industry': 'Family Tech / SaaS',
                    'duration': '4 months',
                    'team_size': '3 members',
                    'tech_stack': ['Next.js', 'Node.js', 'Tailwind CSS'],
                    'features': [{'text': 'Planner & calendars'}, {'text': 'Shared finances'}, {'text': 'Secure vault'}],
                    'website_url': 'https://dockly.me/',
                    'logo_url': 'https://www.google.com/s2/favicons?sz=64&domain=dockly.me',
                    'display_order': 0
                },
                {
                    'name': 'CastleGEC',
                    'status_type': 'live',
                    'status_text': 'Live',
                    'status_subtext': 'Web ready',
                    'tagline': 'Global education',
                    'subtitle': 'Study abroad & admissions consulting, simplified',
                    'stat_value': '500+ student placements',
                    'stat_subtext': 'Secured in premier universities across the US and EU',
                    'what_we_did': 'Designed and engineered a global education portal, unifying visa tracking and admissions counseling into one workflow for international students.',
                    'industry': 'EdTech / Consulting',
                    'duration': '3 months',
                    'team_size': '2 members',
                    'tech_stack': ['Next.js', 'React', 'Tailwind CSS'],
                    'features': [{'text': 'University admissions'}, {'text': 'Visa guidance'}, {'text': 'Admissions insights'}],
                    'website_url': 'https://castlegec.com/',
                    'logo_url': 'https://www.google.com/s2/favicons?sz=64&domain=castlegec.com',
                    'display_order': 1
                },
                {
                    'name': 'OpenCap',
                    'status_type': 'beta',
                    'status_text': 'Beta phase',
                    'tagline': 'Trading analytics',
                    'subtitle': 'Trading analytics & prediction dashboard, simplified',
                    'stat_value': '$12M+ monthly trading volume',
                    'stat_subtext': 'Processed through the prediction dashboard',
                    'what_we_did': 'Developed high-frequency trading analytics dashboard and prediction models, enabling real-time portfolio tracking and option analytics.',
                    'industry': 'Fintech / Trading',
                    'duration': '5 months',
                    'team_size': '4 members',
                    'tech_stack': ['React.js', 'Node.js', 'PostgreSQL'],
                    'features': [{'text': 'AI trade prediction'}, {'text': 'Portfolio analytics'}, {'text': 'Positions tracker'}],
                    'display_order': 2
                },
                {
                    'name': 'NestBloq',
                    'status_type': 'development',
                    'status_text': 'In development',
                    'tagline': 'Partner operations',
                    'subtitle': 'B2B partner operations and workflow automation',
                    'stat_value': '5+ active operations hubs',
                    'stat_subtext': 'Deployed for strategic partner products',
                    'what_we_did': 'Designed and built the operations hub to orchestrate workflow management, delivery logistics, and service coordination for B2B partner products.',
                    'industry': 'B2B / Operations',
                    'duration': '5 months',
                    'team_size': '3 members',
                    'tech_stack': ['Next.js', 'Node.js', 'PostgreSQL'],
                    'features': [{'text': 'Partner workspace'}, {'text': 'Integration gateway'}, {'text': 'Delivery flows'}],
                    'display_order': 3
                }
            ]
            supabase_admin.table("partner_products").insert(products_seed).execute()
                 
        return {"status": "success", "message": "Database and all sections seeded successfully from config.json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 9. ADMIN EDIT ENDPOINTS (POST/PUT/DELETE) ---

# FAQs Admin
@router.post("/faqs")
def create_faq(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        response = supabase_admin.table("faqs").insert(payload).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/faqs")
def update_faq(id: str, payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        payload.pop("created_at", None)
        payload.pop("updated_at", None)
        response = supabase_admin.table("faqs").update(payload).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/faqs")
def delete_faq(id: str, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        response = supabase_admin.table("faqs").delete().eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Open Positions Admin
@router.post("/open-positions")
def create_open_position(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        response = supabase_admin.table("open_positions").insert(payload).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/open-positions")
def update_open_position(id: str, payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        payload.pop("created_at", None)
        payload.pop("updated_at", None)
        response = supabase_admin.table("open_positions").update(payload).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/open-positions")
def delete_open_position(id: str, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        response = supabase_admin.table("open_positions").delete().eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Milestones Admin
@router.post("/milestones")
def create_milestone(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        response = supabase_admin.table("milestones").insert(payload).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/milestones")
def update_milestone(id: str, payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        payload.pop("created_at", None)
        payload.pop("updated_at", None)
        response = supabase_admin.table("milestones").update(payload).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/milestones")
def delete_milestone(id: str, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        response = supabase_admin.table("milestones").delete().eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Partner Products Admin
@router.post("/partner-products")
def create_partner_product(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        response = supabase_admin.table("partner_products").insert(payload).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/partner-products")
def update_partner_product(id: str, payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        payload.pop("created_at", None)
        payload.pop("updated_at", None)
        response = supabase_admin.table("partner_products").update(payload).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/partner-products")
def delete_partner_product(id: str, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        response = supabase_admin.table("partner_products").delete().eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Team Members Admin
@router.post("/team")
def create_team_member(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        response = supabase_admin.table("team_members").insert(payload).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/team")
def update_team_member(id: str, payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        payload.pop("id", None)
        payload.pop("created_at", None)
        payload.pop("updated_at", None)
        response = supabase_admin.table("team_members").update(payload).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/team")
def delete_team_member(id: str, permanent: bool = False, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        if permanent:
            response = supabase_admin.table("team_members").delete().eq("id", id).execute()
        else:
            response = supabase_admin.table("team_members").update({"is_active": False}).eq("id", id).execute()
        return {"status": "success", "payload": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/team/reorder")
def reorder_team_members(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        updates = payload.get("updates", [])
        for update in updates:
            member_id = update.get("id")
            display_order = update.get("display_order")
            if member_id and display_order is not None:
                supabase_admin.table("team_members").update({"display_order": display_order}).eq("id", member_id).execute()
        return {"status": "success", "payload": "Reordered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tool Configuration Admin
@router.post("/tool-config")
def update_tool_config(payload: dict, current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        key = payload.get("key")
        config = payload.get("config")
        if not key or config is None:
            raise HTTPException(status_code=400, detail="Missing key or config payload")
        
        import datetime
        response = supabase_admin.table("tool_configurations") \
            .upsert({"key": key, "config": config, "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()}, on_conflict="key") \
            .execute()
        return {"status": "success", "payload": f"Tool configuration for key {key} updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Image / Asset Upload Admin
@router.post("/people/upload")
def upload_people_avatar(file: UploadFile = File(...), current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        import os
        import uuid
        contents = file.file.read()
        file_ext = os.path.splitext(file.filename)[1]
        dest_filename = f"{uuid.uuid4()}{file_ext}"
        bucket_name = "avatars"
        
        try:
            supabase_admin.storage.from_(bucket_name).upload(dest_filename, contents, file_options={"content-type": file.content_type})
        except Exception:
            try:
                supabase_admin.storage.create_bucket(bucket_name, options={"public": True})
            except Exception:
                pass
            supabase_admin.storage.from_(bucket_name).upload(dest_filename, contents, file_options={"content-type": file.content_type})
            
        public_url = supabase_admin.storage.from_(bucket_name).get_public_url(dest_filename)
        return {"url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/portfolio/upload")
def upload_portfolio_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_admin)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured")
    try:
        import os
        import uuid
        contents = file.file.read()
        file_ext = os.path.splitext(file.filename)[1]
        dest_filename = f"{uuid.uuid4()}{file_ext}"
        bucket_name = "portfolio"
        
        try:
            supabase_admin.storage.from_(bucket_name).upload(dest_filename, contents, file_options={"content-type": file.content_type})
        except Exception:
            try:
                supabase_admin.storage.create_bucket(bucket_name, options={"public": True})
            except Exception:
                pass
            supabase_admin.storage.from_(bucket_name).upload(dest_filename, contents, file_options={"content-type": file.content_type})
            
        public_url = supabase_admin.storage.from_(bucket_name).get_public_url(dest_filename)
        return {"status": "success", "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


