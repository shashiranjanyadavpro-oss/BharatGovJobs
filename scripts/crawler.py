import os
import json
import hashlib
import requests
from datetime import datetime
import uuid

# 1. Cloudflare Credentials (Ye hum GitHub Secrets se lenge)
CF_ACCOUNT_ID = os.environ.get("CF_ACCOUNT_ID")
CF_DATABASE_ID = os.environ.get("CF_DATABASE_ID")
CF_API_TOKEN = os.environ.get("CF_API_TOKEN")

def push_to_d1(job):
    """Ye function verified job ko database me DRAFT mode me daalega"""
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
            INSERT INTO jobs (id, slug, title, department, state, source_url, official_pdf_url, notification_hash, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT')
        """,
        "params": [
            job['id'], job['slug'], job['title'], job['department'], 
            job['state'], job['source_url'], job['official_pdf_url'], 
            job['hash']
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=query)
        result = response.json()
        
        if result.get('success'):
            print(f"✅ Success: '{job['title']}' saved as DRAFT in D1!")
        else:
            # Agar hash match ho gaya (job pehle se hai)
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
    
    # ---------------------------------------------------------
    # NOTE: Abhi hum Python-Cloudflare connection test karne ke liye 
    # ek real-looking data extract simulate kar rahe hain. 
    # Connection successful hone ke baad yahan BeautifulSoup (HTML Parser) lagayenge.
    # ---------------------------------------------------------
    
    scraped_title = "SSC CHSL Recruitment Notice 2026 (Demo Extraction)"
    pdf_link = "https://ssc.gov.in/notices/chsl-2026-official.pdf"
    
    # 🛡️ THE PDF MUST RULE: PDF nahi toh Job nahi!
    if not pdf_link.endswith(".pdf"):
        print("❌ Verification Failed: No Official PDF found. Rejecting job.")
        return

    # 🧠 DUPLICATE DETECTION: Title aur PDF link ko milakar ek unique Hash (ID) banana
    hash_string = f"{scraped_title}-{pdf_link}".encode('utf-8')
    job_hash = hashlib.md5(hash_string).hexdigest()

    # Data structuring according to our new Phase 1 Schema
    job_data = {
        "id": f"job_{uuid.uuid4().hex[:8]}",
        "slug": f"ssc-chsl-demo-{uuid.uuid4().hex[:6]}",
        "title": scraped_title,
        "department": "Staff Selection Commission",
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
    
