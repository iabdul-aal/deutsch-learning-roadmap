import json
import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'E:\German\scripts\piece_of_german_48weeks_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

videos = data['videos']
print(f"Total extracted videos across all 48 weeks: {len(videos)}")

# Map by level
by_level = {'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0}
for v in videos:
    lvl = v['level']
    if lvl in by_level:
        by_level[lvl] += 1

print("Distribution by level:")
for lvl, count in by_level.items():
    print(f"  - Level {lvl}: {count} videos")

# Read existing videoLibrary.ts
vlib_path = r'E:\German\src\data\videoLibrary.ts'
with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

new_entries = []
added_count = 0

for v in videos:
    vid = v['videoId']
    clean_key = f"pog_{vid}"
    if clean_key in vlib_text or vid in vlib_text:
        continue
    
    lvl = v['level']
    wk = v['week']
    title = f"Piece of German {lvl} Week {wk} Lesson ({vid})"
    
    new_entries.append(
        f"  pog_{vid}: {{ videoId: '{vid}', title: '{title}', channelName: 'Piece of German / DW / Goethe', level: '{lvl}', durationMinutes: 15, language: 'german', type: 'lesson' }},"
    )
    added_count += 1

print(f"Injecting {added_count} brand new unique video entries into videoLibrary.ts...")

if new_entries:
    additions_str = "\n" + "\n".join(new_entries) + "\n"
    vlib_text = vlib_text.replace("  hend_tagesablauf:", additions_str + "  hend_tagesablauf:")
    with open(vlib_path, 'w', encoding='utf-8') as f:
        f.write(vlib_text)
    print("Successfully injected all 48-week extracted videos into videoLibrary.ts!")
