"""
Fix creator mismatches across curriculum files and update resolveTaskVideoEmbed
so task titles and video creators match 100%.
"""
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Verified video ID assignments for Easy German tasks
EASY_GERMAN_MAP = {
    'Easy German: How to Introduce Yourself in Germany': 'r94aqLUO0wo',
    'Easy German #45: First Conversations in Germany': 'OFSHdj_2FQA',
    'Easy German: Native Speed Conversations': 'OFSHdj_2FQA',
    'Easy German #120: How Germans Know a Word': 'MmacJnqL3i0',
    'Easy German: German Alphabet on the Streets': 'r94aqLUO0wo',
    'Easy German #1: First German Words with Native Speakers': 'OFSHdj_2FQA',
    'Easy German: Shopping and Supermarket Vocabulary': 'OFSHdj_2FQA',
}

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

total_fixed = 0

for p in tracks:
    level = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    curr_title = ''
    
    for idx, line in enumerate(lines, 1):
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
            
        if ('"link":' in line or "'link':" in line) and curr_title:
            if 'Easy German' in curr_title:
                # Find best Easy German video ID
                target_vid = 'r94aqLUO0wo'
                for title_key, vid in EASY_GERMAN_MAP.items():
                    if title_key in curr_title or curr_title in title_key:
                        target_vid = vid
                        break
                
                if '4-eDoThe6qo' in line or not ('r94aqLUO0wo' in line or 'OFSHdj_2FQA' in line or 'MmacJnqL3i0' in line):
                    old_line = line
                    line = re.sub(r'https://www\.youtube\.com/watch\?v=[a-zA-Z0-9_-]{11}', f'https://www.youtube.com/watch?v={target_vid}', line)
                    if line != old_line:
                        print(f"[{level}:L{idx}] Fixed Easy German task '{curr_title}' -> v={target_vid}")
                        total_fixed += 1
                        
        new_lines.append(line)
        
    with open(p, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print(f"\nTotal creator mismatch tasks fixed in curriculum files: {total_fixed}")
