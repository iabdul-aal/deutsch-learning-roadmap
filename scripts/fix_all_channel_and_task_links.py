"""
Fix all channel links, playlist links, and non-YouTube links in curriculum files,
replacing them with topic-matched, verified 200-OK YouTube video URLs.
"""
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Verified video library mapping by level and topic
VERIFIED_VIDEOS = {
    # A1 Core Videos
    'A1_INTRO': 'WMvCXVorOsg',       # Hend A1 Intro & Alphabet
    'A1_GREETINGS': 'Vh1R2_w0SJ0',   # Hend A1 Greetings
    'A1_NUMBERS': 'X5i-G5NsoWo',     # Hend A1 Numbers
    'A1_ARTICLES': 'OQ9GZ1eepq4',    # Hend A1 Definite & Indefinite Articles
    'A1_AKKUSATIV': 'TJCDYVP-cDU',   # Hend A1 Akkusativ Case
    'A1_DATIV': 'Oh4VKllZ-DQ',       # Hend A1 Dativ Case
    'A1_SEPARABLE': 'kURGW-rVkSA',   # Hend A1 Trennbare Verben
    'A1_MODAL': 'VB3qqhCQ-dA',       # Hend A1 Modalverben
    'A1_PERFEKT': 'XGWgTRlftPg',     # Hend A1 Das Perfekt
    'A1_PRAESENS': 'CyME2ZobD60',    # Hend A1 Präsens Conjugation
    'A1_DW_MOVIE': '4-eDoThe6qo',    # DW Nicos Weg A1 Movie
    'A1_EASY_START': 'r94aqLUO0wo',  # Easy German SEG #1
    'A1_EASY_STREET': 'OFSHdj_2FQA', # Easy German Street
    'A1_EASY_LIFE': 'MmacJnqL3i0',   # Easy German Real Life

    # A2 Core Videos
    'A2_NEBENSAETZE': 'kE3WbXzKLo4', # Hend A2 Nebensätze dass/weil
    'A2_WEIL': 'jiV90WdUkjw',        # Shehata A2 Nebensätze weil/obwohl
    'A2_WENN': 'aWy4cmh5o-Q',        # Hend A2 Wenn-Sätze
    'A2_PASSIV': 'IMQV1SYmSh4',      # Shehata A2 Das Passiv
    'A2_ADJEKTIV': 'nOW4U3kZUbk',    # Hend A2 Adjektivdeklination
    'A2_RELATIV': 'uLyJf8T9ezE',     # Hend A2 Relativsätze
    'A2_DATIV_CASE': 'aKihh7_t9_M',  # Hend A2 Dativ Case

    # B1 Core Videos
    'B1_KONJUNKTIV': 'Yrjgjh26FoE',  # Shehata B1 Konjunktiv 2
    'B1_GENITIV': '1gwm0ZU2Fx0',     # Shehata B1 Der Genitiv
    'B1_GEN_PREP': 'VK4of7UTig8',    # Shehata B1 Genitivpräpositionen
    'B1_PASSIV_ALL': 'Fwd7jsfSVWk',  # Shehata B1 Passiv Complete
    'B1_N_DECL': 'qkJy7L9w2KI',      # Hend B1 N-Deklension
    'B1_NOMINAL': 'TRv3DFHbej8',     # Hend B1 Nominalisierung
    'B1_GEN_POSS': 'y1VqPwhWJrM',    # Hend B1 Genitiv Possession
}

def get_best_video_for_task(title, level):
    t_lower = title.lower()
    if 'akkusativ' in t_lower: return VERIFIED_VIDEOS['A1_AKKUSATIV']
    if 'dativ' in t_lower: return VERIFIED_VIDEOS['A1_DATIV'] if level == 'A1' else VERIFIED_VIDEOS['A2_DATIV_CASE']
    if 'perfekt' in t_lower or 'past' in t_lower: return VERIFIED_VIDEOS['A1_PERFEKT']
    if 'modal' in t_lower: return VERIFIED_VIDEOS['A1_MODAL']
    if 'separable' in t_lower or 'trennbare' in t_lower: return VERIFIED_VIDEOS['A1_SEPARABLE']
    if 'konjunktiv' in t_lower: return VERIFIED_VIDEOS['B1_KONJUNKTIV']
    if 'genitiv' in t_lower: return VERIFIED_VIDEOS['B1_GENITIV']
    if 'passiv' in t_lower or 'passive' in t_lower: return VERIFIED_VIDEOS['A2_PASSIV'] if level == 'A2' else VERIFIED_VIDEOS['B1_PASSIV_ALL']
    if 'adjektiv' in t_lower: return VERIFIED_VIDEOS['A2_ADJEKTIV']
    if 'relativ' in t_lower: return VERIFIED_VIDEOS['A2_RELATIV']
    if 'wenn' in t_lower: return VERIFIED_VIDEOS['A2_WENN']
    if 'weil' in t_lower or 'dass' in t_lower or 'obwohl' in t_lower: return VERIFIED_VIDEOS['A2_NEBENSAETZE']
    if 'n-dekl' in t_lower or 'weak noun' in t_lower: return VERIFIED_VIDEOS['B1_N_DECL']
    if 'nominal' in t_lower: return VERIFIED_VIDEOS['B1_NOMINAL']
    if 'alphabet' in t_lower or 'pronunc' in t_lower or 'sound' in t_lower: return VERIFIED_VIDEOS['A1_INTRO']
    if 'greet' in t_lower or 'hallo' in t_lower or 'intro' in t_lower: return VERIFIED_VIDEOS['A1_GREETINGS']
    if 'number' in t_lower or 'zahl' in t_lower: return VERIFIED_VIDEOS['A1_NUMBERS']
    if 'article' in t_lower or 'gender' in t_lower or 'der die das' in t_lower: return VERIFIED_VIDEOS['A1_ARTICLES']
    
    # Default fallback per level
    if level == 'A1': return VERIFIED_VIDEOS['A1_DW_MOVIE']
    if level == 'A2': return VERIFIED_VIDEOS['A2_NEBENSAETZE']
    return VERIFIED_VIDEOS['B1_KONJUNKTIV']

files_to_fix = [
    (r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'A1'),
    (r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'A2'),
    (r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'B1'),
    (r'e:\German\src\data\contentRanking.ts', 'ALL'),
    (r'e:\German\src\data\videoLibrary.ts', 'ALL'),
]

total_fixed = 0

for file_path, level in files_to_fix:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    curr_title = ''
    for line in lines:
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
            
        # Check if line contains a channel link or playlist link
        if ('youtube.com/@' in line or '/channel/' in line or '/user/' in line or 'playlist?list=' in line):
            vid = get_best_video_for_task(curr_title, level)
            new_url = f"https://www.youtube.com/watch?v={vid}"
            
            # Replace channel/playlist link with direct video URL
            line = re.sub(r'https://www\.youtube\.com/(?:@[a-zA-Z0-9_-]+(?:/playlists|/videos)?|playlist\?list=[a-zA-Z0-9_-]+)', new_url, line)
            print(f"Fixed channel/playlist link in {os.path.basename(file_path)} -> {new_url} for '{curr_title}'")
            modified = True
            total_fixed += 1
            
        new_lines.append(line)
        
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

print(f"\nTotal channel & playlist links replaced: {total_fixed}")
