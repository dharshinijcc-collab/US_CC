import sys
import os
import json

# Add backend to path so we can import DB helper
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from backend.db import DBHelper
from backend.website.models import WebsiteModel

def remove_contact_us():
    try:
        print("Fetching content from DB...")
        content_res = WebsiteModel.get_all_content()
        
        if content_res['status'] != 'success':
            print("Failed to fetch content:", content_res)
            return

        payload = content_res['payload']
        
        # Traverse the payload to find global.header.dropdowns
        if 'global' in payload and 'header' in payload['global'] and 'dropdowns' in payload['global']['header']:
            dropdowns = payload['global']['header']['dropdowns']
            
            company_dropdown_key = None
            if isinstance(dropdowns, dict):
                for key, val in dropdowns.items():
                    if val.get('label') == 'Company':
                        company_dropdown_key = key
                        break
                
                if company_dropdown_key:
                    links = dropdowns[company_dropdown_key].get('links', [])
                    # Filter out the contact us link
                    new_links = [l for l in links if l.get('name') != 'Contact Us']
                    dropdowns[company_dropdown_key]['links'] = new_links
                    print("Removed 'Contact Us' from Company dropdown (dict).")
            
            elif isinstance(dropdowns, list):
                for d in dropdowns:
                    if d.get('label') == 'Company':
                        links = d.get('links', [])
                        new_links = [l for l in links if l.get('name') != 'Contact Us']
                        d['links'] = new_links
                        print("Removed 'Contact Us' from Company dropdown (list).")

            # Update the DB
            print("Saving updated content to DB...")
            update_res = WebsiteModel.update_content(payload)
            print("Update result:", update_res)
            
        else:
            print("Could not find global.header.dropdowns in payload")
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    remove_contact_us()
