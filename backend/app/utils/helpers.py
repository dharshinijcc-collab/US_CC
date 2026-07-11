import os
import uuid
import threading
import requests as http_requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = (
    os.environ.get("SUPABASE_SERVICE_KEY")
    or os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
)
RESUME_BUCKET = "resumes"


def run_async(func, *args, **kwargs) -> None:
    """Run a function asynchronously in a background thread.

    Args:
        func: The function target to run.
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.
    """
    try:
        thread = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)
        thread.start()
    except Exception as e:
        print(f"[ASYNC ERROR] Failed to spawn thread for {func.__name__}: {e}")


def upload_resume_to_supabase(file_obj, original_filename: str) -> str:
    """Uploads a file object to Supabase Storage and returns its public URL.

    Args:
        file_obj: The file-like object to be uploaded.
        original_filename: The base name of the uploaded document.

    Returns:
        The public access URL string, or an empty string if upload fails.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        return ""
    
    ext = (
        original_filename.rsplit(".", 1)[-1].lower()
        if "." in original_filename
        else "pdf"
    )
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{RESUME_BUCKET}/{unique_name}"
    
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": file_obj.content_type or "application/octet-stream",
        "x-upsert": "true",
    }
    
    try:
        resp = http_requests.post(
            upload_url,
            headers=headers,
            data=file_obj.read(),
            timeout=30
        )
        if resp.status_code in (200, 201):
            return f"{SUPABASE_URL}/storage/v1/object/public/{RESUME_BUCKET}/{unique_name}"
        print(f"Supabase upload failed {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"Supabase upload error: {e}")
        
    return ""
