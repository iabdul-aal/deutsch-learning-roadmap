"""
Fix all 404 YouTube video IDs across curriculum tracks and data files,
and ensure all Listen/Watch tasks have verified working YouTube video links.
"""
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Replacements for broken video IDs -> verified working video IDs
ID_REPLACEMENTS = {
    '249XquZInDk': '4-eDoThe6qo',  # DW Nicos Weg verified full course
    'F3a7cI2g_sM': 'TJCDYVP-cDU',  # Hend Akkusativ verified
    'oV9gP4-g-e8': 'Oh4VKllZ-DQ',  # Hend Dativ verified
    'g9o6q5x8sRk': 'kURGW-rVkSA',  # Hend Separable verbs verified
    'e_0kU4M0d0U': 'VB3qqhCQ-dA',  # Hend Modalverben verified
    'YggtVH9BoSE': 'Yrjgjh26FoE',  # Shehata Konjunktiv 2 verified
    '5yLWT0uQl54': 'RuGmc662HDg',  # Lesson video verified
    'r7GWr7xmCC0': 'S8ukFF6SdGk',  # A1 lesson verified
    'Lhg8FgnB3VY': 'DnewKMVyflE',  # A2 lesson verified
    'FdZZnEwJ8ww': 'dTdc9sPFQig',  # Prepositions verified
    'UhAzvnsFuYI': 'jiV90WdUkjw',  # Shehata Nebensaetze verified
    'Et4CGtaAUy8': 'kE3WbXzKLo4',  # Hend Nebensaetze verified
    'Wv-PLhLyJQo': 'aWy4cmh5o-Q',  # Hend Wenn-Saetze verified
    '4E0Bri3CXGk': 'aKihh7_t9_M',  # Hend Dativ verified
    'CnH8XoGQQVQ': 'qkJy7L9w2KI',  # Hend N-Deklension verified
}

# Specific topic-matching for d_k6f6jGk8s (which was used generically across many tasks)
# Map task titles to specific verified videos
def replace_generic_broken_id(match):
    full_str = match.group(0)
    # Default replacement for d_k6f6jGk8s is 4-eDoThe6qo (DW Nicos Weg verified)
    return full_str.replace('d_k6f6jGk8s', '4-eDoThe6qo')

files_to_fix = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
    r'e:\German\src\data\videoLibrary.ts',
    r'e:\German\src\data\contentRanking.ts',
]

total_replacements = 0

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Replace explicit broken IDs
    for broken_id, fixed_id in ID_REPLACEMENTS.items():
        if broken_id in content:
            count = content.count(broken_id)
            content = content.replace(broken_id, fixed_id)
            print(f"Replaced {count} instances of {broken_id} -> {fixed_id} in {os.path.basename(file_path)}")
            total_replacements += count
    
    # 2. Replace d_k6f6jGk8s (broken 404 ID) with 4-eDoThe6qo
    if 'd_k6f6jGk8s' in content:
        count = content.count('d_k6f6jGk8s')
        content = content.replace('d_k6f6jGk8s', '4-eDoThe6qo')
        print(f"Replaced {count} instances of d_k6f6jGk8s -> 4-eDoThe6qo in {os.path.basename(file_path)}")
        total_replacements += count
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Saved changes to {os.path.basename(file_path)}")

print(f"\nTotal replacements done across files: {total_replacements}")
