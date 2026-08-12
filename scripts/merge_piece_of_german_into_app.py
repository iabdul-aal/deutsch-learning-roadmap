import re
import json

with open(r'E:\German\scripts\piece_of_german_videos.json', 'r', encoding='utf-8') as f:
    videos = json.load(f)

# Select top relevant videos for A1 and A2 curriculum matching
curated_videos = []
seen_ids = set()

for v in videos:
    vid = v['videoId']
    t = v.get('title', '').strip()
    if not t or vid in seen_ids or 'YouTube' in t or len(t) < 3:
        continue
    seen_ids.add(vid)
    curated_videos.append(v)

print(f"Curated {len(curated_videos)} distinct video entries.")

# 1. Append to videoLibrary.ts
vlib_file = r'E:\German\src\data\videoLibrary.ts'
with open(vlib_file, 'r', encoding='utf-8') as f:
    vlib_code = f.read()

vlib_additions = []
for v in curated_videos[:40]:  # Top 40 high-value lessons
    vid = v['videoId']
    title = v['title'].replace("'", "\\'").replace('"', '\\"')
    level = 'A2' if any(x in title for x in ['A2', 'Folge 4', 'Folge 5', 'Folge 6', 'Bewerbung', 'Umzug']) else 'A1'
    vlib_additions.append(f"  pog_{vid}: {{ videoId: '{vid}', title: '{title}', channelName: 'Piece of German / DW / Goethe', level: '{level}', durationMinutes: 15, language: 'german', type: 'lesson' }},")

addition_str = "\n" + "\n".join(vlib_additions) + "\n"
if "hend_tagesablauf:" in vlib_code and "pog_" not in vlib_code:
    vlib_code = vlib_code.replace("hend_tagesablauf:", addition_str + "  hend_tagesablauf:")
    with open(vlib_file, 'w', encoding='utf-8') as f:
        f.write(vlib_code)
    print("Successfully merged curated Piece of German videos into videoLibrary.ts!")

print("Done!")
