import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    (r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'A1'),
    (r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'A2'),
    (r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'B1'),
]

total_read_with_yt = 0

for t_path, level in tracks:
    with open(t_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find tasks where type is 'Read' and link is YouTube
    lines = content.splitlines()
    curr_type = ''
    curr_title = ''
    curr_link = ''
    
    read_yt_tasks = []
    
    for idx, line in enumerate(lines, 1):
        if '"type":' in line or "'type':" in line:
            m = re.search(r'["\']type["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_type = m.group(1)
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
        if '"link":' in line or "'link':" in line:
            m = re.search(r'["\']link["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m:
                curr_link = m.group(1)
                if curr_type == 'Read' and ('youtube.com' in curr_link or 'youtu.be' in curr_link):
                    read_yt_tasks.append((idx, curr_title, curr_link))
                curr_type, curr_title, curr_link = '', '', ''

    print(f"\n[{level}] Found {len(read_yt_tasks)} 'Read' tasks that have YouTube video links:")
    total_read_with_yt += len(read_yt_tasks)
    for idx, title, link in read_yt_tasks[:10]:
        print(f"  Line {idx}: '{title}' -> {link}")

print(f"\nTotal 'Read' tasks with YouTube links across all tracks: {total_read_with_yt}")
