import os, hashlib, requests, uuid, re
from bs4 import BeautifulSoup
from datetime import datetime

CF_ACCOUNT_ID = os.environ.get("CF_ACCOUNT_ID")
CF_DATABASE_ID = os.environ.get("CF_DATABASE_ID")
CF_API_TOKEN = os.environ.get("CF_API_TOKEN")

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}

def push_to_d1(job):
    if not all([CF_ACCOUNT_ID, CF_DATABASE_ID, CF_API_TOKEN]):
        print("❌ Secrets missing")
        return False
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/d1/database/{CF_DATABASE_ID}/query"
    h = {"Authorization": f"Bearer {CF_API_TOKEN}", "Content-Type": "application/json"}
    sql = """INSERT INTO jobs (id, slug, title, title_hi, department, qualification, application_start, application_end, state, source_url, official_pdf_url, notification_hash, status, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', 'VERIFIED')
    ON CONFLICT(notification_hash) DO NOTHING"""
    payload = {"sql": sql, "params": [job['id'], job['slug'], job['title'], job['title_hi'], job['department'], job['qualification'], job['application_start'], job['application_end'], job['state'], job['source_url'], job['official_pdf_url'], job['hash']]}
    try:
        r = requests.post(url, headers=h, json=payload, timeout=20)
        res = r.json()
        if res.get('success'):
            print(f"✅ Saved: {job['title'][:60]}")
            return True
        else:
            print(f"⚠️ D1: {res}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def make_job(title, pdf_url, source, dept="SSC", qual="Check Notification"):
    # Clean title
    title = re.sub(r'\s+', ' ', title).strip()
    if len(title) < 15 or len(title) > 200: return None
    if not pdf_url.lower().endswith('.pdf'): return None
    h = hashlib.md5(f"{title}-{pdf_url}".encode()).hexdigest()
    # Hindi mapping
    hi_map = {"SSC":"SSC भर्ती", "UPSC":"UPSC भर्ती", "Railway":"रेलवे भर्ती", "Banking":"बैंक भर्ती", "Defence":"सेना भर्ती"}
    return {
        "id": f"job-{uuid.uuid4().hex[:8]}",
        "slug": f"{dept.lower()}-{uuid.uuid4().hex[:6]}",
        "title": title,
        "title_hi": f"{title} - {hi_map.get(dept, 'सरकारी नौकरी')}",
        "department": dept,
        "qualification": qual,
        "application_start": datetime.now().strftime("%Y-%m-%d"),
        "application_end": "2026-09-30",
        "state": "All India",
        "source_url": source,
        "official_pdf_url": pdf_url,
        "hash": h
    }

def crawl_portal(target_url, dept, base_url=""):
    print(f"🔍 Crawling {dept}: {target_url}")
    try:
        r = requests.get(target_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, 'html.parser')
        count=0
        for a in soup.find_all('a', href=True):
            text = a.get_text(strip=True)
            href = a['href'].strip()
            if not href.lower().endswith('.pdf'): continue
            if len(text) < 20: continue
            # keyword filter - only govt job pdfs
            if not any(k in text.lower() for k in ["recruitment","notice","advertisement","vacancy","notification","भर्ती"]): continue
            full_pdf = href if href.startswith('http') else base_url.rstrip('/') + '/' + href.lstrip('/')
            job = make_job(text, full_pdf, target_url, dept)
            if job and push_to_d1(job):
                count+=1
                if count>=5: break # max 5 per portal per run
        print(f"   -> {count} new jobs from {dept}")
    except Exception as e:
        print(f"   -> Failed {dept}: {e}")

if __name__ == "__main__":
    print(f"🇮🇳 BharatGovJobs Crawler Started - {datetime.now()}")
    # 1. SSC
    crawl_portal("https://ssc.gov.in", "SSC", "https://ssc.gov.in")
    # 2. UPSC
    crawl_portal("https://upsc.gov.in/whats-new", "UPSC", "https://upsc.gov.in")
    # 3. RRB (Railway)
    crawl_portal("https://www.rrbcdg.gov.in/", "Railway", "https://www.rrbcdg.gov.in")
    # 4. IBPS (Banking)
    crawl_portal("https://www.ibps.in/", "Banking", "https://www.ibps.in")
    print("✅ Crawler Finished - Jai Hind!")
