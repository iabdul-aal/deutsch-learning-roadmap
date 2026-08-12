import json
import re

# Load parsed real video titles and channel mapping
with open(r'E:\German\scripts\piece_of_german_videos.json', 'r', encoding='utf-8') as f:
    video_list = json.load(f)

real_titles = {}
for v in video_list:
    vid = v['videoId']
    title = v.get('title', '').strip()
    if title and not title.startswith('Piece of German'):
        # Determine actual channel name from title
        channel = 'German Learning Series'
        if 'Nicos Weg' in title or 'Folge' in title or 'Deutsch lernen' in title:
            channel = 'DW Deutsch Lernen'
        elif 'with Jenny' in title or 'Jenny' in title:
            channel = 'Deutsch mit Jenny'
        elif 'Easy German' in title or 'Super Easy German' in title:
            channel = 'Easy German'
        elif 'Deutsch Für Euch' in title:
            channel = 'Deutsch Für Euch'
        elif 'Deutsch mit Marija' in title:
            channel = 'Deutsch mit Marija'
        elif 'الدرس رقم' in title or 'اللغة الألمانية' in title:
            channel = 'Shehata Deutsch / Arabic Ecosystem'
        
        real_titles[vid] = {
            'title': title,
            'channel': channel
        }

print(f"Loaded real titles & channels for {len(real_titles)} YouTube videos.")

# 1. Update videoLibrary.ts
vlib_path = r'E:\German\src\data\videoLibrary.ts'
with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

def replace_vlib_entry(match):
    key = match.group(1)
    vid = match.group(2)
    old_title = match.group(3)
    old_channel = match.group(4)
    level = match.group(5)
    
    if vid in real_titles:
        info = real_titles[vid]
        new_title = info['title'].replace("'", "\\'").replace('"', '\\"')
        new_channel = info['channel']
        return f"  '{key}': {{ videoId: '{vid}', title: '{new_title}', channelName: '{new_channel}', level: '{level}', durationMinutes: 15, language: 'german', type: 'lesson' }},"
    else:
        # Generic clean title without 'Piece of German' tag
        clean_t = f"German {level} Video Lesson ({vid})"
        return f"  '{key}': {{ videoId: '{vid}', title: '{clean_t}', channelName: 'DW / Goethe / Native Series', level: '{level}', durationMinutes: 15, language: 'german', type: 'lesson' }},"

pattern = r"^\s*'([^']+)':\s*\{\s*videoId:\s*'([^']+)',\s*title:\s*'([^']*)',\s*channelName:\s*'([^']*)',\s*level:\s*'([^']*)',.*?\},"
vlib_text = re.sub(pattern, replace_vlib_entry, vlib_text, flags=re.M)

# Replace any remaining 'Piece of German' string in comments or titles
vlib_text = vlib_text.replace("Piece of German / DW / Goethe", "DW / Goethe / Native Ecosystem")
vlib_text = vlib_text.replace("Piece of German", "Curated German Video Series")

with open(vlib_path, 'w', encoding='utf-8') as f:
    f.write(vlib_text)

print("Updated videoLibrary.ts with real video titles and channel attributions!")

# 2. Clean contentRanking.ts
cranking_path = r'E:\German\src\data\contentRanking.ts'
with open(cranking_path, 'r', encoding='utf-8') as f:
    cranking_text = f.read()

cranking_text = cranking_text.replace("Piece of German", "German Learning Masterclass")
cranking_text = cranking_text.replace("Piece of German", "German Learning Series")

with open(cranking_path, 'w', encoding='utf-8') as f:
    f.write(cranking_text)

print("Updated contentRanking.ts!")

# 3. Clean resources.ts files
res_a1_path = r'E:\German\src\data\tracks\german-a1-ar\resources.ts'
res_a2_path = r'E:\German\src\data\tracks\german-a2-ar\resources.ts'

for p in [res_a1_path, res_a2_path]:
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    txt = txt.replace("Piece of German - ", "")
    txt = txt.replace("Piece of German", "Curated German Video Curriculum")
    with open(p, 'w', encoding='utf-8') as f:
        f.write(txt)

print("Updated resource files!")
