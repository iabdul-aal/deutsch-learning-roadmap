import sys
import json
import urllib.request
import urllib.parse
import re

sys.stdout.reconfigure(encoding='utf-8')

def search_yt(query, max_results=10):
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    })
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        video_ids = list(dict.fromkeys(re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)))
        titles = re.findall(r'"title":\{"runs":\[\{"text":"(.*?)"\}', html)
        
        results = []
        for i, vid in enumerate(video_ids[:max_results]):
            t = titles[i] if i < len(titles) else "YouTube Video"
            results.append({
                'videoId': vid,
                'title': t,
                'url': f"https://www.youtube.com/watch?v={vid}"
            })
        return results
    except Exception as e:
        print(f"Error searching '{query}': {e}")
        return []

print("Searching YouTube for Piece of German videos & playlists...")
queries = [
    "Piece of German A1",
    "Piece of German A2",
    "Piece of German German lesson",
    "Piece of German grammar",
    "Piece of German vocabulary"
]

all_vids = {}
for q in queries:
    res = search_yt(q, max_results=10)
    for r in res:
        all_vids[r['videoId']] = r

print(f"\nFound {len(all_vids)} unique YouTube videos for Piece of German:")
for vid, data in all_vids.items():
    print(f"  - [{data['videoId']}] {data['title']}: {data['url']}")
