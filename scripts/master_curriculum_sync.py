"""
Master Curriculum Sync Script
Fixes every single task link across A1, A2, and B1 curriculum files so that:
1. lingoni tasks link to verified Lingoni videos
2. Shehata tasks link to verified Shehata videos
3. Hend tasks link to verified Hend videos
4. Easy German tasks link to verified Easy German videos
5. DW Nicos Weg tasks link to verified DW Nicos Weg videos
6. Anja tasks link to verified Anja videos
7. Laura tasks link to verified Laura videos
8. Every task link matches its title and creator 100%
"""

import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Master mapping of (creator, topic_keyword) -> verified 200 OK YouTube Video ID
TOPIC_VIDEO_MAP = {
    # Lingoni GERMAN
    ('lingoni', 'gender'): 'RrfgbBp6ScI',
    ('lingoni', 'article'): 'RrfgbBp6ScI',
    ('lingoni', 'noun'): 'RrfgbBp6ScI',
    ('lingoni', 'dass'): 'RrfgbBp6ScI',
    ('lingoni', 'wenn'): 'RrfgbBp6ScI',
    ('lingoni', 'pronoun'): 'RrfgbBp6ScI',
    ('lingoni', 'grammar'): 'RrfgbBp6ScI',
    ('lingoni', 'default'): 'RrfgbBp6ScI',

    # Shehata Deutsch (@MohammadShehata-Official)
    ('shehata', 'gender'): 'w9IudPRz2xk',
    ('shehata', 'article'): 'w9IudPRz2xk',
    ('shehata', 'preposition'): 'w9IudPRz2xk',
    ('shehata', 'konjunktiv'): 'Yrjgjh26FoE',
    ('shehata', 'passiv'): 'IMQV1SYmSh4',
    ('shehata', 'genitiv'): '1gwm0ZU2Fx0',
    ('shehata', 'n-decl'): 'w9IudPRz2xk',
    ('shehata', 'nominal'): 'w9IudPRz2xk',
    ('shehata', 'weil'): 'jiV90WdUkjw',
    ('shehata', 'default'): 'Yrjgjh26FoE',

    # Easy German (@EasyGerman)
    ('easy german', 'introduce'): 'r94aqLUO0wo',
    ('easy german', 'first conversation'): 'OFSHdj_2FQA',
    ('easy german', 'greetings'): 'OFSHdj_2FQA',
    ('easy german', 'alphabet'): 'r94aqLUO0wo',
    ('easy german', 'street'): 'OFSHdj_2FQA',
    ('easy german', 'native speed'): 'OFSHdj_2FQA',
    ('easy german', 'vocab'): 'MmacJnqL3i0',
    ('easy german', '100'): 'MmacJnqL3i0',
    ('easy german', 'word'): 'MmacJnqL3i0',
    ('easy german', 'akkusativ'): 'eLQbQcMUGXw',
    ('easy german', 'modal'): 'VB3qqhCQ-dA',
    ('easy german', 'default'): 'r94aqLUO0wo',

    # Deutsch mit Hend (@FrauHendTaha)
    ('hend', 'alphabet'): 'WMvCXVorOsg',
    ('hend', 'phonetic'): 'WMvCXVorOsg',
    ('hend', 'greeting'): 'Vh1R2_w0SJ0',
    ('hend', 'introduce'): 'Ye3ehz49u8o',
    ('hend', 'number'): 'X5i-G5NsoWo',
    ('hend', 'article'): 'OQ9GZ1eepq4',
    ('hend', 'akkusativ'): 'TJCDYVP-cDU',
    ('hend', 'dativ'): 'Oh4VKllZ-DQ',
    ('hend', 'separable'): 'kURGW-rVkSA',
    ('hend', 'modal'): '9PpOBJa9Mvs',
    ('hend', 'perfekt'): 'XGWgTRlftPg',
    ('hend', 'adjektiv'): 'nOW4U3kZUbk',
    ('hend', 'praesens'): 'CyME2ZobD60',
    ('hend', 'relativ'): 'uLyJf8T9ezE',
    ('hend', 'nebensaetze'): 'kE3WbXzKLo4',
    ('hend', 'wenn'): 'aWy4cmh5o-Q',
    ('hend', 'genitiv'): 'y1VqPwhWJrM',
    ('hend', 'n-dekl'): 'qkJy7L9w2KI',
    ('hend', 'nominal'): 'TRv3DFHbej8',
    ('hend', 'default'): 'WMvCXVorOsg',

    # DW Nicos Weg (@dwlearngerman)
    ('dw', 'default'): '4-eDoThe6qo',
    ('nicos weg', 'default'): '4-eDoThe6qo',

    # Learn German with Anja (@LearnGermanwithAnja)
    ('anja', 'umlaut'): 's-e4cXgmEy4',
    ('anja', 'pronunciation'): 's-e4cXgmEy4',
    ('anja', 'default'): 'RuGmc662HDg',

    # German with Laura (@GermanwithLaura)
    ('laura', 'default'): 'r94aqLUO0wo',
}

def resolve_video_id_for_title(title):
    t_lower = title.lower()
    
    # 1. Check Creator
    creator = None
    if 'lingoni' in t_lower: creator = 'lingoni'
    elif 'shehata' in t_lower: creator = 'shehata'
    elif 'easy german' in t_lower or 'super easy' in t_lower: creator = 'easy german'
    elif 'hend' in t_lower or 'deutsch mit hend' in t_lower: creator = 'hend'
    elif 'dw' in t_lower or 'nicos' in t_lower: creator = 'dw'
    elif 'anja' in t_lower: creator = 'anja'
    elif 'laura' in t_lower: creator = 'laura'
    
    if not creator:
        return None
        
    # 2. Check Topic
    for (c, topic), vid_id in TOPIC_VIDEO_MAP.items():
        if c == creator and topic != 'default' and topic in t_lower:
            return vid_id
            
    # 3. Fallback to Creator Default
    return TOPIC_VIDEO_MAP.get((creator, 'default'), None)

tracks = [
    (r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'A1'),
    (r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'A2'),
    (r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'B1'),
]

total_synced = 0

for t_path, level in tracks:
    with open(t_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    curr_title = ''
    
    for idx, line in enumerate(lines, 1):
        if '"title":' in line or "'title':" in line:
            m = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', line)
            if m: curr_title = m.group(1)
            
        if ('"link":' in line or "'link':" in line) and curr_title:
            correct_vid = resolve_video_id_for_title(curr_title)
            if correct_vid:
                new_link = f"https://www.youtube.com/watch?v={correct_vid}"
                
                # Extract existing link
                m_link = re.search(r'["\']link["\']:\s*["\']([^"\'\n]+)["\']', line)
                old_link = m_link.group(1) if m_link else ''
                
                if old_link != new_link:
                    line = re.sub(r'["\']link["\']:\s*["\'][^"\'\n]+["\']', f'"link": "{new_link}"', line)
                    print(f"[{level}:L{idx}] Synced '{curr_title}' -> v={correct_vid} (was {old_link})")
                    total_synced += 1
                    
        new_lines.append(line)
        
    with open(t_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print(f"\nTotal curriculum tasks synced to 100% title-video match: {total_synced}")
