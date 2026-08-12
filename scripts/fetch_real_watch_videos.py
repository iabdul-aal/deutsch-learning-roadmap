#!/usr/bin/env python3
"""
Automatically search YouTube and replace all channel (@) links in Watch tasks 
with real, playable YouTube video links (https://www.youtube.com/watch?v=...).
"""

import sys
import re
import urllib.request
import urllib.parse
import json
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

def search_youtube_first_video(query):
    """Search YouTube for query and return the first matching video ID."""
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.youtube.com/results?search_query={encoded_query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode("utf-8")
            matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
            if matches:
                return matches[0]
    except Exception as e:
        print(f"Error searching for '{query}': {e}", flush=True)
    return None

def process_track(track_name):
    filePath = REPO_ROOT / "src" / "data" / "tracks" / track_name / "curriculum.ts"
    if not filePath.exists():
        return

    content = filePath.read_text(encoding="utf-8")
    lines = content.split("\n")
    updated_count = 0
    cache = {}

    for i in range(len(lines)):
        line = lines[i]
        if '"link":' in line and 'youtube.com/@' in line:
            title = ""
            task_type = ""
            for j in range(i - 1, max(-1, i - 7), -1):
                if not title and '"title":' in lines[j]:
                    title = lines[j]
                if not task_type and '"type":' in lines[j]:
                    task_type = lines[j]

            title_clean = re.sub(r'.*"title":\s*"([^"]+)".*', r'\1', title)
            
            if title_clean:
                if title_clean in cache:
                    vid_id = cache[title_clean]
                else:
                    print(f"Searching YT for: '{title_clean}'...", flush=True)
                    vid_id = search_youtube_first_video(title_clean)
                    if vid_id:
                        cache[title_clean] = vid_id

                if vid_id:
                    new_link = f"https://www.youtube.com/watch?v={vid_id}"
                    lines[i] = re.sub(r'"link":\s*"[^"]+"', f'"link": "{new_link}"', lines[i])
                    updated_count += 1
                    print(f"  -> [{title_clean[:30]}] Replaced with: {new_link}", flush=True)

    filePath.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n✅ {track_name}: Updated {updated_count} Watch tasks with real YouTube video links.\n", flush=True)

if __name__ == "__main__":
    for track in ["german-a1-ar", "german-a2-ar", "german-b1-ar"]:
        process_track(track)
