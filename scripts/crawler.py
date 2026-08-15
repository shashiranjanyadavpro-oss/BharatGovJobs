import os
import hashlib
import requests
from bs4 import BeautifulSoup
import uuid

CF_ACCOUNT_ID = os.environ.get("CF_ACCOUNT_ID")
CF_DATABASE_ID = os.environ.get("CF_DATABASE_ID")
CF_API_TOKEN = os.environ.get("CF_API_TOKEN")

def push_to_d1(job):
    if not all([CF_ACCOUNT_ID, CF_DATABASE_ID, CF_API_TOKEN]):
        print("❌ Cloudflare API credentials missing!")
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
            print(f"✅ Saved to D1: {job['title']}")
        elif "UNIQUE constraint failed" in str(result):
            print(f"⚠️ Duplicate: {job['title']} already present.")
        else:
            print(f"❌ DB Error: {result}")
    except Exception as e:
        print(f"❌ Request Error: {e}")

def crawl_ssc():
    print("🔍 Fetching live notices from SSC portal...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    target_url = "https://ssc.gov.in"
    try:
        res = requests.get(target_url, headers=headers, timeout=15)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        links = soup.find_all('a', href=True)
        pdf_count = 0

        for a in links:
            href = a['href'].strip()
            text = a.get_text(strip=True)
            
            # The PDF Must Rule: PDF link aur title dono hone chahiye
            if href.lower().endswith('.pdf') and len(text) > 10:
                full_pdf_url = href if href.startswith('http') else f"{target_url}/{href.lstrip('/')}"
                job_hash = hashlib.md5(f"{text}-{full_pdf_url}".encode('utf-8')).hexdigest()
                
                job_data = {
                    "id": f"job_{uuid.uuid4().hex[:8]}",
                    "slug": f"ssc-{uuid.uuid4().hex[:6]}",
                    "title": text,
                    "title_hi": text,
                    "department": "Staff Selection Commission",
                    "qualification": "Check Notification",
                    "application_start": "2026-08-15",
                    "application_end": "2026-09-15",
                    "state": "All India",
                    "source_url": target_url,
                    "official_pdf_url": full_pdf_url,
                    "hash": job_hash
                }
                
                push_to_d1(job_data)
                pdf_count += 1
                if pdf_count >= 3:  # Test run ke liye top 3 notices
                    break
                    
        if pdf_count == 0:
            print("ℹ️ No direct PDF notices found on landing page right now.")
    except Exception as e:
        print(f"❌ Crawl Failed: {e}")

if __name__ == "__main__":
    crawl_ssc()
