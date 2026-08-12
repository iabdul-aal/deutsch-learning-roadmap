import re
import json
import urllib.request
import urllib.error
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

paths = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
    r'e:\German\src\data\videoLibrary.ts',
    r'e:\German\src\data\contentRanking.ts'
]

vid_locations = {}

for p in paths:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            vids = re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', line)
            vids += re.findall(r'youtu\.be/([a-zA-Z0-9_-]{11})', line)
            vids += re.findall(r"resourceId:\s*['\"]([a-zA-Z0-9_-]{11})['\"]", line)
            vids += re.findall(r"videoId:\s*['\"]([a-zA-Z0-9_-]{11})['\"]", line)
            for v in vids:
                if v not in vid_locations:
                    vid_locations[v] = []
                vid_locations[v].append((os.path.basename(p), idx, line.strip()[:90]))

print(f'Total unique video IDs found: {len(vid_locations)}')

broken_vids = {}
valid_vids = {}

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for i, (vid, locs) in enumerate(vid_locations.items(), 1):
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    req = urllib.request.Request(url, headers=hdr)
    try:
        res = urllib.request.urlopen(req, timeout=5)
        if res.status == 200:
            data = json.loads(res.read().decode('utf-8'))
            valid_vids[vid] = data.get('title', 'OK')
    except urllib.error.HTTPError as e:
        broken_vids[vid] = (e.code, locs)
    except Exception as e:
        broken_vids[vid] = (str(e), locs)
    
    if i % 10 == 0 or i == len(vid_locations):
        print(f'Checked {i}/{len(vid_locations)}...')

print(f'\n=== SUMMARY ===')
print(f'Valid videos: {len(valid_vids)}')
print(f'Broken / 404 videos: {len(broken_vids)}')

if broken_vids:
    print('\n=== BROKEN / 404 VIDEO LIST ===')
    for v, (err, locs) in broken_vids.items():
        print(f'\nVideo ID: {v} (HTTP Error {err})')
        for loc in locs:
            print(f'  -> [{loc[0]}:{loc[1]}] {loc[2]}')

# Save result to json
with open(r'e:\German\artifacts\yt_check_results.json', 'w', encoding='utf-8') as f:
    json.dump({
        'valid': valid_vids,
        'broken': {v: {'error': str(err), 'locations': locs} for v, (err, locs) in broken_vids.items()}
    }, f, indent=2, ensure_ascii=False)
