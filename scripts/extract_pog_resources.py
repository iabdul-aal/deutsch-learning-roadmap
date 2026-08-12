import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

BASE = r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps'

# Extract video IDs from Hend channel page and modal search
def extract_from_file(step):
    path = fr'{BASE}\{step}\content.md'
    if not os.path.exists(path):
        return [], ''
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
    vids = list(dict.fromkeys(re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', txt)))
    return vids, txt

# Get Hend channel videos
hend_vids, hend_txt = extract_from_file('1645')
print('=== Hend Channel Video IDs (first 30) ===')
for v in hend_vids[:30]:
    print(f'  {v}')

# Get Piece of German blog
pog_blog_vids, pog_blog_txt = extract_from_file('1646')
print('\n=== Piece of German Blog - Video IDs embedded ===')
for v in pog_blog_vids[:15]:
    print(f'  {v}')

# Extract any readable text content from PoG blog
readable = re.findall(r'>([A-Za-zÄÖÜäöüß][^<]{20,200})<', pog_blog_txt)
content_items = [r.strip() for r in readable if not r.strip().startswith(('var ', 'function', 'window', 'document', '//'))]
print('\n=== Piece of German Blog Content Text ===')
for item in content_items[:40]:
    print(f'  {item[:120]}')

# Extract external resource links
ext_links = re.findall(r'href="(https?://[^"]{10,120})"', pog_blog_txt)
german_links = [l for l in ext_links if any(k in l.lower() for k in [
    'youtube', 'germanpod', 'lingoda', 'babbel', 'duolingo', 'anki', 
    'german.net', 'dw.com', 'goethe', 'schubert', 'pons', 'leo.org',
    'seedlang', 'clozemaster', 'assimil', 'hueber', 'klett', 'cornelsen',
    'izi.travel', 'coffebreak', 'germanwithlaura', 'easyge'
])]
print('\n=== External Resource Links on PoG Blog ===')
for l in list(dict.fromkeys(german_links))[:25]:
    print(f'  {l}')

# Hend modal search
modal_vids, modal_txt = extract_from_file('1647')
print('\n=== Hend Modalverben Search Results ===')
for v in modal_vids[:10]:
    print(f'  https://www.youtube.com/watch?v={v}')
