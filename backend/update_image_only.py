
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def update_studio_hero_image():
    # 1. Fetch current content
    response = supabase.table('content').select('*').eq('id', 1).execute()
    if not response.data:
        print("No content found in DB")
        return
    
    content = response.data[0]['config']
    
    # 2. Update ONLY the studio hero image key
    if 'studio' not in content:
        content['studio'] = {}
    if 'hero' not in content['studio']:
        content['studio']['hero'] = {}
    
    content['studio']['hero']['image'] = "/images/studio/hero-right.jpeg"
    
    # 3. Save back to DB
    update_response = supabase.table('content').update({'config': content}).eq('id', 1).execute()
    print("Successfully updated studio hero image in DB without resetting other content.")

if __name__ == "__main__":
    update_studio_hero_image()
