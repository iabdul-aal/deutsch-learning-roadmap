"""
Extract real YouTube video IDs from downloaded search result pages
and verify them against known Piece of German topics.
"""
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

BASE = r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps'

# Each step number -> what we searched for
SEARCH_STEPS = {
    '1624': 'Hend Akkusativ',
    '1627': 'Shehata Konjunktiv',
    '1628': 'Hend Dativ',
    '1633': 'Hend Perfekt',
    '1634': 'Shehata Passiv',
    '1636': 'Hend Adjektivdeklination',
    '1637': 'Hend Perfekt haben sein',
    '1638': 'Shehata Genitiv',
}

ALL_RESULTS = {}

for step, label in SEARCH_STEPS.items():
    path = fr'{BASE}\{step}\content.md'
    if not os.path.exists(path):
        print(f'[MISSING] {label} - step {step}')
        continue
    
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
    
    # Extract all unique video IDs
    vids = list(dict.fromkeys(re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', txt)))
    
    # Extract any title context around video IDs
    vid_contexts = {}
    for vid in vids[:15]:
        # Find snippet of text around the video ID
        idx = txt.find(vid)
        if idx >= 0:
            snippet = txt[max(0, idx-200):idx+200]
            # Look for text-like content near it
            words = re.findall(r'[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9\s\-,#\.]{10,60}', snippet)
            vid_contexts[vid] = ' | '.join(words[:3]) if words else ''
    
    ALL_RESULTS[label] = {'vids': vids[:10], 'contexts': vid_contexts}
    
    print(f'\n=== {label} ===')
    for vid in vids[:10]:
        ctx = vid_contexts.get(vid, '')
        print(f'  https://www.youtube.com/watch?v={vid}  | {ctx[:60]}')

# Also check Piece of German courses page
pog_path = fr'{BASE}\1622\content.md'
if os.path.exists(pog_path):
    with open(pog_path, 'r', encoding='utf-8', errors='ignore') as f:
        pog_txt = f.read()
    
    print('\n=== PIECE OF GERMAN COURSES PAGE ===')
    # Look for course links and text content
    links = re.findall(r'href="(/[^"]{2,80})"', pog_txt)
    course_links = [l for l in links if any(k in l.lower() for k in ['a1', 'a2', 'b1', 'b2', 'level', 'lesson', 'grammar', 'vocab', 'course'])]
    print(f'Course-like URLs found: {course_links[:20]}')
    
    # Extract any readable text
    readable = re.findall(r'>([A-Za-zÄÖÜäöüß][^<]{15,120})<', pog_txt)
    content_items = [r.strip() for r in readable if not r.strip().startswith(('var ', 'function', 'window', '//'))]
    print(f'Content text items: {content_items[:20]}')
    
    # YouTube IDs on that page
    yt_vids = list(dict.fromkeys(re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', pog_txt)))
    embed_vids = list(dict.fromkeys(re.findall(r'embed/([a-zA-Z0-9_-]{11})', pog_txt)))
    all_pog_vids = list(dict.fromkeys(yt_vids + embed_vids))
    print(f'YouTube videos embedded: {all_pog_vids[:15]}')
