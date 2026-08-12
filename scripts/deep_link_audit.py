import re
import json
import urllib.request
import urllib.error
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

channel_links = []
playlist_links = []
non_yt_links = []
broken_vids = []
valid_vids = {}

for p in tracks:
    level = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all task objects
    # Parse standardTasks and intensiveTasks
    task_matches = re.findall(r'\{\s*["\']type["\']:\s*["\']([^"\'\n]+)["\'],\s*["\']title["\']:\s*["\']([^"\'\n]+)["\'](?:,\s*["\']duration["\']:\s*["\']([^"\'\n]+)["\'])?(?:,\s*["\']resourceType["\']:\s*["\']([^"\'\n]+)["\'])?(?:,\s*["\']link["\']:\s*["\']([^"\'\n]+)["\'])?', content)
    
    for m in task_matches:
        t_type, t_title, duration, res_type, link = m[0], m[1], m[2], m[3], m[4]
        
        # Check channel links
        if '@' in link or '/channel/' in link or '/user/' in link or '/c/' in link:
            channel_links.append((level, t_title, link))
        
        # Check playlist links
        if 'playlist?list=' in link or 'list=' in link:
            playlist_links.append((level, t_title, link))
            
        # Check non-youtube links
        if link and not ('youtube.com' in link or 'youtu.be' in link):
            non_yt_links.append((level, t_type, t_title, link))
            
        # Check video ID
        yt_match = re.search(r'(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})', link)
        if yt_match:
            vid = yt_match.group(1)
            if vid not in valid_vids and vid not in [b[0] for b in broken_vids]:
                url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
                req = urllib.request.Request(url, headers=hdr)
                try:
                    res = urllib.request.urlopen(req, timeout=3)
                    if res.status == 200:
                        valid_vids[vid] = True
                except Exception as e:
                    broken_vids.append((vid, str(e), level, t_title))

print("=== DEEP CURRICULUM LINK AUDIT ===")
print(f"Channel Links (FORBIDDEN): {len(channel_links)}")
print(f"Playlist Links (FORBIDDEN): {len(playlist_links)}")
print(f"Non-YouTube Links: {len(non_yt_links)}")
print(f"Broken YouTube Video IDs: {len(broken_vids)}")

if channel_links:
    print("\n--- Channel Links Found ---")
    for cl in channel_links[:10]:
        print(f"[{cl[0]}] {cl[1]} -> {cl[2]}")

if playlist_links:
    print("\n--- Playlist Links Found ---")
    for pl in playlist_links[:10]:
        print(f"[{pl[0]}] {pl[1]} -> {pl[2]}")

if non_yt_links:
    print("\n--- Non-YouTube Links Found ---")
    for nl in non_yt_links[:15]:
        print(f"[{nl[0]}] Type: {nl[1]} | {nl[2]} -> {nl[3]}")

if broken_vids:
    print("\n--- Broken Video IDs Found ---")
    for bv in broken_vids[:10]:
        print(f"[{bv[2]}] ID: {bv[0]} ({bv[1]}) | {bv[3]}")
