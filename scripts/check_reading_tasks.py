import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

read_tasks = []

for t_path in tracks:
    level = os.path.basename(os.path.dirname(t_path))
    with open(t_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find task blocks with type: 'Read' or 'Color Coding'
    task_blocks = re.findall(r'\{[^{}]*type:\s*[\'\"](?:Read|Color Coding)[\'\"].*?\}', content, re.DOTALL)
    for b in task_blocks:
        title_m = re.search(r'title:\s*[\'\"]([^\'\"]+)[\'\"]', b)
        link_m  = re.search(r'link:\s*[\'\"]([^\'\"]+)[\'\"]', b)
        title = title_m.group(1) if title_m else 'No title'
        link  = link_m.group(1) if link_m else 'No link'
        read_tasks.append((level, title, link))

print(f"Total Reading tasks found: {len(read_tasks)}")

yt_readings = [t for t in read_tasks if 'youtube.com' in t[2] or 'youtu.be' in t[2]]
non_yt_readings = [t for t in read_tasks if not ('youtube.com' in t[2] or 'youtu.be' in t[2])]

print(f"Reading tasks with YouTube links: {len(yt_readings)}")
print(f"Reading tasks without YouTube links: {len(non_yt_readings)}")

print("\n--- Reading Tasks WITH YouTube Links (Sample) ---")
for t in yt_readings[:15]:
    print(f"[{t[0]}] Title: {t[1]} | Link: {t[2]}")

print("\n--- Reading Tasks WITHOUT YouTube Links (Sample) ---")
for t in non_yt_readings[:15]:
    print(f"[{t[0]}] Title: {t[1]} | Link: {t[2]}")
