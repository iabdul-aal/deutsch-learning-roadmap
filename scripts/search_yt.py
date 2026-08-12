#!/usr/bin/env python3
"""
YouTube Search API Utility for Deutsch Survival Platform.
Searches YouTube programmatically for video IDs matching any query string.
"""

import sys
import re
import urllib.request
import urllib.parse
import json

# Ensure UTF-8 output encoding for Windows PowerShell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def search_youtube(query, max_results=5):
    """Search YouTube and return matching video IDs and titles."""
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
            
            # Extract videoId and title pairings from YouTube initialData
            video_matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})".*?"title":{"runs":\[{"text":"(.*?)"}\]', html)
            
            results = []
            seen = set()
            for vid, title in video_matches:
                if vid not in seen:
                    seen.add(vid)
                    results.append({"videoId": vid, "title": title, "url": f"https://www.youtube.com/watch?v={vid}"})
                if len(results) >= max_results:
                    break
            
            return results
    except Exception as e:
        print(f"Error searching YouTube for '{query}': {e}")
        return []

if __name__ == "__main__":
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Deutsch mit Hend Akkusativ"
    print(f"Searching YouTube for: '{query}'...")
    res = search_youtube(query)
    print(json.dumps(res, indent=2, ensure_ascii=False))
