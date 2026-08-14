import os
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# Sample Portals List for Bot 1-3
TARGET_PORTALS = [
    {
        "district": "Supaul",
        "state": "Bihar",
        "category": "Anganwadi",
        "url": "https://supaul.nic.in/notice_category/recruitment/"
    },
    {
        "district": "Gaya",
        "state": "Bihar",
        "category": "Anganwadi",
        "url": "https://gaya.bih.nic.in/notice_category/recruitment/"
    },
    {
        "district": "Patna",
        "state": "Bihar",
        "category": "ASHA",
        "url": "https://patna.nic.in/notice_category/recruitment/"
    }
]

def run_crawler():
    print(f"[{datetime.utcnow().isoformat()}] Starting BharatGovJobs Crawler Engine...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    extracted_jobs = []

    for portal in TARGET_PORTALS:
        try:
            print(f"Checking portal: {portal['district']} ({portal['category']})...")
            response = requests.get(portal["url"], headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "lxml")
                # Basic parsing placeholder (Bot 1-3 Mock Trigger)
                print(f"Successfully connected to {portal['district']} NIC Portal.")
            else:
                print(f"Portal {portal['district']} returned status: {response.status_code}")
        except Exception as e:
            print(f"Error crawling {portal['district']}: {str(e)}")

    print("Crawler job completed successfully.")

if __name__ == "__main__":
    run_crawler()
  
