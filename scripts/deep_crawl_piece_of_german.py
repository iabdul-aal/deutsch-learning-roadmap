import urllib.request
import urllib.parse
import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

base_url = "https://www.pieceofgerman.com"
start_urls = [
    f"{base_url}/a1-1",
    f"{base_url}/a2-1",
    f"{base_url}/courses",
    f"{base_url}/certifications",
    f"{base_url}/blogs",
    f"{base_url}/sitemap.xml",
    f"{base_url}/robots.txt"
]

visited = set()
found_pdfs = set()
found_youtube = set()
found_drive = set()
found_other_links = set()

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            return content
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

print("Starting deep crawl of pieceofgerman.com...")

queue = list(start_urls)

while queue and len(visited) < 40:
    url = queue.pop(0)
    if url in visited:
        continue
    visited.add(url)
    print(f"[{len(visited)}] Crawling: {url}")

    html = fetch_url(url)
    if not html:
        continue

    # 1. Extract PDFs & Document Downloads
    pdfs = re.findall(r'href=["\'](https?://[^\s"\'<>]+\.(?:pdf|docx?|xlsx?|zip|rar|mp3))["\']', html, re.I)
    for p in pdfs:
        found_pdfs.add(p)

    relative_pdfs = re.findall(r'href=["\'](/[^\s"\'<>]+\.(?:pdf|docx?|xlsx?|zip|rar|mp3))["\']', html, re.I)
    for rp in relative_pdfs:
        found_pdfs.add(base_url + rp)

    # 2. Extract Google Drive / Dropbox / MediaFire
    drives = re.findall(r'href=["\'](https?://(?:drive\.google\.com|docs\.google\.com|dropbox\.com|mediafire\.com)[^\s"\'<>]+)["\']', html, re.I)
    for d in drives:
        found_drive.add(d)

    # 3. Extract YouTube URLs / Embeds
    yts = re.findall(r'(https?://(?:www\.)?youtube\.com/[^\s"\'<>]+|https?://youtu\.be/[^\s"\'<>]+)', html)
    for y in yts:
        found_youtube.add(y)

    # 4. Find internal subpages to queue
    internal_links = re.findall(r'href=["\'](/[a-zA-Z0-9_-]+)["\']', html)
    for il in internal_links:
        full_il = base_url + il
        if full_il not in visited and full_il not in queue:
            queue.append(full_il)

print("\n==========================================")
print("DEEP CRAWL RESULTS FOR PIECE OF GERMAN")
print("==========================================")

print(f"\n📄 FOUND {len(found_pdfs)} PDF/DOCUMENT DOWNLOADS:")
for p in sorted(found_pdfs):
    print("  -", p)

print(f"\n☁️ FOUND {len(found_drive)} DRIVE/ATTACHMENT LINKS:")
for d in sorted(found_drive):
    print("  -", d)

print(f"\n🎬 FOUND {len(found_youtube)} YOUTUBE EMBEDS/LINKS:")
for y in sorted(found_youtube):
    print("  -", y)

print(f"\n🔍 CRAWLED {len(visited)} TOTAL SUBPAGES.")
