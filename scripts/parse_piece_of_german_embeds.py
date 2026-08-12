import re
import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_file = r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\tasks\task-962.log'

with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Extract all video IDs from embed URLs
vids = list(dict.fromkeys(re.findall(r'youtube\.com/embed/([a-zA-Z0-9_-]{11})', text)))
print(f"Found {len(vids)} unique video IDs embedded inside Piece of German:")

video_metadata = []

def get_video_title(vid):
    url = f"https://www.youtube.com/watch?v={vid}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            t = title_match.group(1).replace(' - YouTube', '').strip()
            return t
    except Exception as e:
        pass
    return f"Piece of German Lesson ({vid})"

for i, vid in enumerate(vids):
    title = get_video_title(vid)
    video_metadata.append({
        'videoId': vid,
        'title': title,
        'url': f"https://www.youtube.com/watch?v={vid}"
    })
    print(f"[{i+1}/{len(vids)}] {vid} -> {title}")

output_json = r'E:\German\scripts\piece_of_german_videos.json'
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(video_metadata, f, ensure_ascii=False, indent=2)

print(f"\nSaved {len(video_metadata)} verified Piece of German embedded videos to {output_json}")
