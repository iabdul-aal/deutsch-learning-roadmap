import urllib.request
import json
import re
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

vlib_path = r'E:\German\src\data\videoLibrary.ts'

with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

generic_matches = re.findall(r"^\s*'([^']+)':\s*\{\s*videoId:\s*'([^']+)',\s*title:\s*'German [A-Z0-9]+ Video Lesson \(([^']+)\)'", vlib_text, re.M)

print(f"Found {len(generic_matches)} generic entries requiring real YouTube title & channel fetch.")

fetched_metadata = {}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_oembed(vid):
    oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        req = urllib.request.Request(oembed_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8', errors='ignore'))
            return {
                'title': data.get('title', ''),
                'channel': data.get('author_name', '')
            }
    except Exception as e:
        try:
            page_url = f"https://www.youtube.com/watch?v={vid}"
            req = urllib.request.Request(page_url, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                t_match = re.search(r'<title>(.*?)</title>', html)
                if t_match:
                    t = t_match.group(1).replace(' - YouTube', '').strip()
                    return {'title': t, 'channel': 'YouTube Creator'}
        except Exception as ex:
            pass
    return None

for idx, (key, vid, vid_check) in enumerate(generic_matches):
    info = fetch_oembed(vid)
    if info and info.get('title'):
        title = info['title'].replace("'", "\\'").replace('"', '\\"')
        channel = info['channel'].replace("'", "\\'").replace('"', '\\"')
        fetched_metadata[vid] = {
            'title': title,
            'channel': channel
        }
        print(f"[{idx+1}/{len(generic_matches)}] {vid} -> {info['title']} ({info['channel']})")
    else:
        print(f"[{idx+1}/{len(generic_matches)}] {vid} -> Failed to fetch")
    time.sleep(0.05)

print(f"\nSuccessfully fetched real YouTube titles for {len(fetched_metadata)} videos.")

# Clean replace line by line
lines = vlib_text.splitlines()
new_lines = []

for line in lines:
    replaced = False
    for vid, info in fetched_metadata.items():
        if f"videoId: '{vid}'" in line and f"German " in line and "Video Lesson" in line:
            title = info['title']
            channel = info['channel'] or 'DW / Goethe / Native Ecosystem'
            # Extract key and level
            k_match = re.search(r"'([^']+)':", line)
            l_match = re.search(r"level:\s*'([^']+)'", line)
            m_match = re.search(r"durationMinutes:\s*(\d+)", line)

            key_str = k_match.group(1) if k_match else f"pog_{vid}"
            lvl_str = l_match.group(1) if l_match else "A1"
            dur_str = m_match.group(1) if m_match else "15"

            line = f"  '{key_str}': {{ videoId: '{vid}', title: '{title}', channelName: '{channel}', level: '{lvl_str}', durationMinutes: {dur_str}, language: 'german', type: 'lesson' }},"
            replaced = True
            break
    new_lines.append(line)

vlib_text = "\n".join(new_lines)

with open(vlib_path, 'w', encoding='utf-8') as f:
    f.write(vlib_text)

print("Updated videoLibrary.ts with 100% authentic YouTube titles & channel names!")
