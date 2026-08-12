import re
import json
import urllib.request
import urllib.error
import os
import sys
from concurrent.futures import ThreadPoolExecutor

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

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def check_video(item):
    vid, locs = item
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    req = urllib.request.Request(url, headers=hdr)
    try:
        res = urllib.request.urlopen(req, timeout=5)
        if res.status == 200:
            data = json.loads(res.read().decode('utf-8'))
            return (vid, True, data.get('title', 'OK'), locs)
    except urllib.error.HTTPError as e:
        return (vid, False, e.code, locs)
    except Exception as e:
        return (vid, False, str(e), locs)

with ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(check_video, vid_locations.items()))

valid = {}
broken = {}

for vid, is_ok, info, locs in results:
    if is_ok:
        valid[vid] = info
    else:
        broken[vid] = (info, locs)

print(f'\n=== FAST CHECK COMPLETE ===')
print(f'Valid videos: {len(valid)}')
print(f'Broken / 404 videos: {len(broken)}')

if broken:
    print('\n=== BROKEN / 404 VIDEO LIST ===')
    for v, (err, locs) in broken.items():
        print(f'\nVideo ID: {v} (Error: {err})')
        for loc in locs:
            print(f'  -> [{loc[0]}:{loc[1]}] {loc[2]}')

out_data = {
    'valid_count': len(valid),
    'broken_count': len(broken),
    'valid': valid,
    'broken': {v: {'error': str(err), 'locations': locs} for v, (err, locs) in broken.items()}
}

with open(r'e:\German\artifacts\yt_check_fast_results.json', 'w', encoding='utf-8') as f:
    json.dump(out_data, f, indent=2, ensure_ascii=False)
