import urllib.request
import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

levels = ['a1', 'a2', 'b1', 'b2']
weeks = range(1, 13)

urls_to_crawl = []
for lvl in levels:
    for wk in weeks:
        urls_to_crawl.append(f"https://www.pieceofgerman.com/{lvl}-{wk}")

print(f"Generated {len(urls_to_crawl)} URLs to crawl across A1, A2, B1, B2 (Weeks 1 to 12).")

all_youtube_embeds = {}
all_pdfs = set()
all_drives = set()

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return ""

for idx, url in enumerate(urls_to_crawl):
    print(f"[{idx+1}/{len(urls_to_crawl)}] Fetching: {url}")
    html = fetch_url(url)
    if not html:
        continue

    # Extract YouTube video IDs & embeds
    yt_embeds = re.findall(r'youtube\.com/embed/([a-zA-Z0-9_-]{11})', html)
    yt_watches = re.findall(r'youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})', html)
    yt_be = re.findall(r'youtu\.be/([a-zA-Z0-9_-]{11})', html)

    vids = set(yt_embeds + yt_watches + yt_be)
    
    parts = url.split('/')[-1].split('-')
    lvl_tag = parts[0].upper()
    wk_num = parts[1]

    for v in vids:
        if v not in all_youtube_embeds:
            all_youtube_embeds[v] = {
                'videoId': v,
                'level': lvl_tag,
                'week': wk_num,
                'sourceUrl': url
            }

    # Extract PDFs / Documents
    pdfs = re.findall(r'href=["\'](https?://[^\s"\'<>]+\.(?:pdf|docx?|zip|mp3))["\']', html, re.I)
    for p in pdfs:
        all_pdfs.add(p)

    # Extract Google Drive / Mediafire
    drives = re.findall(r'href=["\'](https?://(?:drive\.google\.com|docs\.google\.com|dropbox\.com|mediafire\.com)[^\s"\'<>]+)["\']', html, re.I)
    for d in drives:
        all_drives.add(d)

print(f"\n==========================================")
print(f"COMPLETED CRAWL OF ALL 48 PIECE OF GERMAN WEEKS")
print(f"==========================================")
print(f"Found {len(all_youtube_embeds)} unique YouTube embedded videos.")
print(f"Found {len(all_pdfs)} PDF/Document links.")
print(f"Found {len(all_drives)} Drive/Attachment links.")

out_json = r'E:\German\scripts\piece_of_german_48weeks_extracted.json'
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump({
        'videos': list(all_youtube_embeds.values()),
        'pdfs': list(all_pdfs),
        'drives': list(all_drives)
    }, f, ensure_ascii=False, indent=2)

print(f"Saved complete extraction database to {out_json}")
