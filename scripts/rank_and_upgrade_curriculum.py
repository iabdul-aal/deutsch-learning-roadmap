import json
import re

# Load ranked content DB
content_db_path = r'E:\German\src\data\contentRanking.ts'
vlib_path = r'E:\German\src\data\videoLibrary.ts'

with open(content_db_path, 'r', encoding='utf-8') as f:
    content_db_text = f.read()

with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

# Extract all verified YouTube video IDs and titles
video_map = {}

# Extract from videoLibrary.ts
vlib_matches = re.findall(r"['\"]?(pog_[a-zA-Z0-9_-]+|hend_[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]{11})['\"]?:\s*\{\s*videoId:\s*['\"]([a-zA-Z0-9_-]{11})['\"],\s*title:\s*['\"]([^'\"]+)['\"]", vlib_text)
for key, vid, title in vlib_matches:
    video_map[vid] = title

# Extract from contentRanking.ts
db_matches = re.findall(r"resourceId:\s*['\"]([a-zA-Z0-9_-]{11})['\"],\s*title:\s*['\"]([^'\"]+)['\"]", content_db_text)
for vid, title in db_matches:
    video_map[vid] = title

print(f"Total unique verified video resources in database: {len(video_map)}")

# Key TOP-RANKED Tier 1 Resources for A1 / A2 / B1:
# Hend Lesson 1: WMvCXVorOsg
# Hend Lesson 2: UuDS2hFTwtc
# Shehata A1 Pronunciation: 35Afp-fqoQ8
# DW Nicos Weg A1: dC6ZGLzdaTs
# Piece of German A1 Crash Course: S8ukFF6SdGk
# Piece of German A2 Crash Course: DnewKMVyflE
# Piece of German Wo/Wohin: dTdc9sPFQig
# Piece of German Accusative/Dative: Lg5P2w_Ro1c
# Piece of German Word Order: jR4XeQxwGHQ
# Piece of German Modal Verbs: W9coIzRQGh4
# Piece of German Future Tense: uBAnVYX9VeI

a1_curriculum_path = r'E:\German\src\data\tracks\german-a1-ar\curriculum.ts'
a2_curriculum_path = r'E:\German\src\data\tracks\german-a2-ar\curriculum.ts'

with open(a1_curriculum_path, 'r', encoding='utf-8') as f:
    a1_text = f.read()

with open(a2_curriculum_path, 'r', encoding='utf-8') as f:
    a2_text = f.read()

# Replace any generic or channel link fallbacks in A1 with top-ranked video URLs
replacements_a1 = [
    ("https://www.youtube.com/user/FrauHendTaha", "https://www.youtube.com/watch?v=WMvCXVorOsg"),
    ("https://www.youtube.com/@FrauHendTaha", "https://www.youtube.com/watch?v=WMvCXVorOsg"),
    ("https://www.youtube.com/@MohammadShehata-Official", "https://www.youtube.com/watch?v=DnewKMVyflE"),
    ("https://www.youtube.com/user/EasyGerman", "https://www.youtube.com/watch?v=S8ukFF6SdGk"),
]

for old_url, new_url in replacements_a1:
    a1_text = a1_text.replace(old_url, new_url)
    a2_text = a2_text.replace(old_url, new_url)

with open(a1_curriculum_path, 'w', encoding='utf-8') as f:
    f.write(a1_text)

with open(a2_curriculum_path, 'w', encoding='utf-8') as f:
    f.write(a2_text)

print("Curriculum upgrade complete! Top-ranked video links injected into A1 & A2 tracks.")
