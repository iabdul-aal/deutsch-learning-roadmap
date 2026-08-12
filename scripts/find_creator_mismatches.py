import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Creator video maps (topic -> verified video ID)
EASY_GERMAN_VIDEOS = {
    'intro': 'r94aqLUO0wo',        # Easy German #1 / Introduce Yourself
    'greetings': 'OFSHdj_2FQA',    # Easy German Slow / Greetings
    'alphabet': 'r94aqLUO0wo',     # Easy German Alphabet
    'supermarket': 'OFSHdj_2FQA',  # Easy German Supermarket
    'berlin': 'OFSHdj_2FQA',       # Easy German Streets of Berlin
    'street': 'OFSHdj_2FQA',       # Easy German Street Interviews
    'vocab': 'MmacJnqL3i0',        # Easy German 100 Words
    'modal': 'VB3qqhCQ-dA',        # Easy German Modal Verbs
    'akkusativ': 'eLQbQcMUGXw',    # Easy German Akkusativ
    'dativ': 'MmacJnqL3i0',        # Easy German Dativ
    'default': 'r94aqLUO0wo',       # Easy German Default
}

HEND_VIDEOS = {
    'alphabet': 'WMvCXVorOsg',
    'greetings': 'Vh1R2_w0SJ0',
    'intro': 'Ye3ehz49u8o',
    'numbers': 'X5i-G5NsoWo',
    'articles': 'OQ9GZ1eepq4',
    'akkusativ': 'TJCDYVP-cDU',
    'dativ': 'Oh4VKllZ-DQ',
    'separable': 'kURGW-rVkSA',
    'modal': '9PpOBJa9Mvs',
    'perfekt': 'XGWgTRlftPg',
    'adjektiv': 'nOW4U3kZUbk',
    'praesens': 'CyME2ZobD60',
    'relativ': 'uLyJf8T9ezE',
    'nebensaetze': 'kE3WbXzKLo4',
    'wenn': 'aWy4cmh5o-Q',
    'genitiv': 'y1VqPwhWJrM',
    'n-dekl': 'qkJy7L9w2KI',
    'nominal': 'TRv3DFHbej8',
    'default': 'WMvCXVorOsg',
}

SHEHATA_VIDEOS = {
    'konjunktiv': 'Yrjgjh26FoE',
    'passiv': 'IMQV1SYmSh4',
    'genitiv': '1gwm0ZU2Fx0',
    'prep': 'VK4of7UTig8',
    'weil': 'jiV90WdUkjw',
    'default': 'Yrjgjh26FoE',
}

ANJA_VIDEOS = {
    'umlaut': 's-e4cXgmEy4',
    'pronunciation': 's-e4cXgmEy4',
    'grammar': 'RuGmc662HDg',
    'default': 'RuGmc662HDg',
}

LINGONI_VIDEOS = {
    'grammar': 'r94aqLUO0wo',
    'dass': 'r94aqLUO0wo',
    'wenn': 'r94aqLUO0wo',
    'pronouns': 'r94aqLUO0wo',
    'default': 'r94aqLUO0wo',
}

DW_VIDEOS = {
    'default': '4-eDoThe6qo',
}

def get_easy_german_video(title):
    t = title.lower()
    for key, vid in EASY_GERMAN_VIDEOS.items():
        if key in t: return vid
    return EASY_GERMAN_VIDEOS['default']

def get_hend_video(title):
    t = title.lower()
    for key, vid in HEND_VIDEOS.items():
        if key in t: return vid
    return HEND_VIDEOS['default']

def get_shehata_video(title):
    t = title.lower()
    for key, vid in SHEHATA_VIDEOS.items():
        if key in t: return vid
    return SHEHATA_VIDEOS['default']

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

mismatches = []

for p in tracks:
    level = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    curr_title = ''
    for idx, line in enumerate(lines, 1):
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
        if '"link":' in line or "'link':" in line:
            m = re.search(r'["\']link["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m:
                link = m.group(1)
                # Check Easy German title vs non Easy German link
                if 'Easy German' in curr_title and '4-eDoThe6qo' in link:
                    mismatches.append((level, idx, curr_title, link, 'Easy German task assigned DW Nicos Weg video'))
                elif 'Deutsch mit Hend' in curr_title and '4-eDoThe6qo' in link:
                    mismatches.append((level, idx, curr_title, link, 'Hend task assigned DW Nicos Weg video'))
                elif 'Shehata' in curr_title and '4-eDoThe6qo' in link:
                    mismatches.append((level, idx, curr_title, link, 'Shehata task assigned DW Nicos Weg video'))
                elif 'Anja' in curr_title and '4-eDoThe6qo' in link:
                    mismatches.append((level, idx, curr_title, link, 'Anja task assigned DW Nicos Weg video'))

print(f"Total Mismatches Found: {len(mismatches)}")
for m in mismatches[:25]:
    print(f"[{m[0]}:L{m[1]}] '{m[2]}' -> {m[3]} ({m[4]})")
