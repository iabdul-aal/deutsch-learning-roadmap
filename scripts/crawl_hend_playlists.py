import urllib.request
import json
import re
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
}

target_playlists = [
    'https://www.youtube.com/playlist?list=PLkMQi7_Jt8pt4A2C-ZhoRHKt0AGVkVg9w',
    'https://www.youtube.com/playlist?list=PLkMQi7_Jt8psrUCL-WW39UxoOEpQAXYIN',
    'https://www.youtube.com/playlist?list=PLkMQi7_Jt8pt7uaNw7SWUQZKgqHP_boAf',
    'https://www.youtube.com/playlist?list=PL-N_ooNpDdsNG8iXas-YY2kMQ67Pm97JB',
    'https://www.youtube.com/@FrauHendTaha/videos',
    'https://www.youtube.com/@FrauHendTaha/playlists',
]

all_vids = set()

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

print("Crawling Hend playlists and channel page...")

for url in target_playlists:
    print(f"Fetching: {url}")
    html = fetch_url(url)
    if not html:
        continue

    vids = re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', html)
    vids_embed = re.findall(r'youtube\.com/embed/([a-zA-Z0-9_-]{11})', html)
    found = set(vids + vids_embed)
    all_vids.update(found)
    print(f"Found {len(found)} videos on page.")

print(f"\nDiscovered {len(all_vids)} unique video IDs across Hend playlists & channel.")

# Now fetch metadata for all discovered videos using YouTube OEmbed API
hend_videos = []

for idx, vid in enumerate(sorted(all_vids)):
    oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        req = urllib.request.Request(oembed_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8', errors='ignore'))
            t = data.get('title', '')
            c = data.get('author_name', '')
            
            # Determine level
            level = 'A1'
            if 'A2' in t or 'أخيرة A1' in t:
                level = 'A2'
            elif 'B1' in t:
                level = 'B1'
            elif 'B2' in t:
                level = 'B2'

            hend_videos.append({
                'videoId': vid,
                'title': t,
                'channel': c or 'Deutsch mit Hend',
                'level': level
            })
            print(f"[{idx+1}/{len(all_vids)}] {vid} -> {t} (Level: {level})")
    except Exception as e:
        print(f"[{idx+1}/{len(all_vids)}] {vid} -> Failed to fetch details")
    time.sleep(0.05)

out_json = r'E:\German\scripts\hend_extracted_videos.json'
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(hend_videos, f, ensure_ascii=False, indent=2)

print(f"\nSaved {len(hend_videos)} verified Hend video lessons to {out_json}")
