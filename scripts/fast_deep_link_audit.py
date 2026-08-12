import re
import json
import urllib.request
import urllib.error
import os
import sys
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

all_tasks = []

for p in tracks:
    level = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple JSON-like regex task extraction
    lines = content.splitlines()
    curr_type, curr_title, curr_link = '', '', ''
    for idx, line in enumerate(lines, 1):
        if '"type":' in line or "'type':" in line:
            m = re.search(r'["\']type["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_type = m.group(1)
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
        if '"link":' in line or "'link':" in line:
            m = re.search(r'["\']link["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m:
                curr_link = m.group(1)
                all_tasks.append((level, idx, curr_type, curr_title, curr_link))
                curr_type, curr_title, curr_link = '', '', ''

print(f"Total tasks parsed across curriculum: {len(all_tasks)}")

channel_links = [t for t in all_tasks if '@' in t[4] or '/channel/' in t[4] or '/user/' in t[4] or '/c/' in t[4]]
playlist_links = [t for t in all_tasks if 'playlist?list=' in t[4] or 'list=' in t[4]]
non_yt_links = [t for t in all_tasks if t[4] and not ('youtube.com' in t[4] or 'youtu.be' in t[4])]

# Extract video IDs for verification
yt_tasks = [t for t in all_tasks if re.search(r'(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})', t[4])]
unique_vids = set()
vid_to_tasks = {}

for t in yt_tasks:
    m = re.search(r'(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})', t[4])
    if m:
        vid = m.group(1)
        unique_vids.add(vid)
        if vid not in vid_to_tasks: vid_to_tasks[vid] = []
        vid_to_tasks[vid].append(t)

def check_vid(vid):
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    req = urllib.request.Request(url, headers=hdr)
    try:
        res = urllib.request.urlopen(req, timeout=4)
        return (vid, True, 200)
    except urllib.error.HTTPError as e:
        return (vid, False, e.code)
    except Exception as e:
        return (vid, False, str(e))

with ThreadPoolExecutor(max_workers=20) as ex:
    check_results = list(ex.map(check_vid, unique_vids))

broken_vid_map = {v: err for v, ok, err in check_results if not ok}

print(f"\n=== AUDIT RESULTS ===")
print(f"1. Channel Links (FORBIDDEN):  {len(channel_links)}")
print(f"2. Playlist Links (FORBIDDEN): {len(playlist_links)}")
print(f"3. Non-YouTube Links:         {len(non_yt_links)}")
print(f"4. Broken Video IDs (404/Err): {len(broken_vid_map)}")

if channel_links:
    print("\n--- FORBIDDEN CHANNEL LINKS FOUND ---")
    for t in channel_links[:15]:
        print(f"  [{t[0]}:L{t[1]}] Task: {t[3][:45]} -> {t[4]}")

if playlist_links:
    print("\n--- FORBIDDEN PLAYLIST LINKS FOUND ---")
    for t in playlist_links[:15]:
        print(f"  [{t[0]}:L{t[1]}] Task: {t[3][:45]} -> {t[4]}")

if non_yt_links:
    print("\n--- NON-YOUTUBE LINKS FOUND ---")
    for t in non_yt_links[:25]:
        print(f"  [{t[0]}:L{t[1]}] Type: {t[2]} | Task: {t[3][:40]} -> {t[4]}")

if broken_vid_map:
    print("\n--- BROKEN VIDEO IDS FOUND ---")
    for vid, err in broken_vid_map.items():
        print(f"  ID: {vid} (Err: {err}) in tasks:")
        for t in vid_to_tasks[vid][:2]:
            print(f"     [{t[0]}:L{t[1]}] {t[3][:45]}")
