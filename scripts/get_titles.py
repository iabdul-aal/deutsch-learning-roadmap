import re, sys, os

sys.stdout.reconfigure(encoding='utf-8')

BASE = r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps'

def get_title_from_yt_page(step):
    path = fr'{BASE}\{step}\content.md'
    if not os.path.exists(path):
        return '(file missing)'
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
    # Look for og:title or title tags
    og = re.search(r'"og:title"[^>]+content="([^"]{5,120})"', txt)
    if og: return og.group(1)
    title = re.search(r'<title>([^<]{5,120})</title>', txt)
    if title: return title.group(1)
    # Look for "title" in ytInitialData
    t = re.search(r'"title":\{"simpleText":"([^"]{5,120})"', txt)
    if t: return t.group(1)
    # og:title in meta
    m = re.search(r'content="([^"]{5,120})" property="og:title"', txt)
    if m: return m.group(1)
    return '(title not found)'

print('Video 9PpOBJa9Mvs:', get_title_from_yt_page('1655'))
print('Video f57z9fmqKV4:', get_title_from_yt_page('1656'))
