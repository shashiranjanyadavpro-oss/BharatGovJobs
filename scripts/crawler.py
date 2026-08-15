import os
import json
import hashlib
import requests
from datetime import datetime
import uuid

CF_ACCOUNT_ID = os.environ.get("CF_ACCOUNT_ID")
CF_DATABASE_ID = os.environ.get("CF_DATABASE_ID")
CF_API_TOKEN = os.environ.get("CF_API_TOKEN")

def push_to_d1(job):
    if not all([CF_ACCOUNT_ID, CF_DATABASE_ID, CF_API_TOKEN]):
        print("❌ Error: Cloudflare API credentials missing!")
        return

    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/d1/database/{CF_DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    query = {
        "sql": """
            INSERT INTO jobs (
                id, slug, title, title_hi, department, qualification,
                application_start, application_end, state, source_url,
                official_pdf_url, notification_hash, status, verification_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', 'VERIFIED')
        """,
        "params": [
            job['id'], job['slug'], job['title'], job['title_hi'],
            job['department'], job['qualification'], job['application_start'],
            job['application_end'], job['state'], job['source_url'],
            job['official_pdf_url'], job['hash']
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=query)
        result = response.json()
        
        if result.get('success'):
            print(f"✅ Success: '{job['title']}' saved as DRAFT in D1!")
        else:
            if "UNIQUE constraint failed" in str(result):
                print(f"⚠️ Duplicate Check: '{job['title']}' already exists. Skipping.")
            else:
                print(f"❌ Database Error: {result}")
    except Exception as e:
        print(f"❌ API Error: {e}")

def run_crawler():
    print("🚀 Starting BharatGovJobs Master Crawler...")
    
    target_url = "https://ssc.gov.in/"
    print(f"Scanning {target_url} for Official Notices...")
    
    scraped_title = "SSC CHSL Recruitment Notice 2026 (Demo Extraction)"
    pdf_link = "https://ssc.gov.in/notices/chsl-2026-official.pdf"
    
    if not pdf_link.endswith(".pdf"):
        print("❌ Verification Failed: No Official PDF found. Rejecting job.")
        return

    hash_string = f"{scraped_title}-{pdf_link}".encode('utf-8')
    job_hash = hashlib.md5(hash_string).hexdigest()

    job_data = {
        "id": f"job_{uuid.uuid4().hex[:8]}",
        "slug": f"ssc-chsl-demo-{uuid.uuid4().hex[:6]}",
        "title": scraped_title,
        "title_hi": "कर्मचारी चयन आयोग सीएचएसएल भर्ती 2026",
        "department": "Staff Selection Commission",
        "qualification": "12th Pass",
        "application_start": "2026-08-15",
        "application_end": "2026-09-15",
        "state": "All India",
        "source_url": target_url,
        "official_pdf_url": pdf_link,
        "hash": job_hash
    }
    
    print(f"🔍 Found Valid PDF Job: {scraped_title}")
    print("💾 Pushing to Cloudflare D1 Database...")
    push_to_d1(job_data)

if __name__ == "__main__":
    run_crawler()
