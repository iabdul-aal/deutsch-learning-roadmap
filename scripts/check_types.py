import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

for p in tracks:
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    
    # Find all tasks
    matches = re.findall(r'\{\s*type:\s*[\'\"]([^\'\"]+)[\'\"],\s*title:\s*[\'\"]([^\'\"]+)[\'\"](?:,\s*resourceType:\s*[\'\"]([^\'\"]+)[\'\"])?(?:,\s*link:\s*[\'\"]([^\'\"]+)[\'\"])?', txt)
    print(f"\n=== {os.path.basename(os.path.dirname(p))} ===")
    print(f"Total tasks parsed: {len(matches)}")
    
    # Count by type
    by_type = {}
    for m in matches:
        t_type = m[0]
        by_type[t_type] = by_type.get(t_type, 0) + 1
    
    for t, cnt in by_type.items():
        print(f"  {t}: {cnt}")
    
    # Check reading tasks
    read_tasks = [m for m in matches if m[0] in ['Read', 'Color Coding', 'Reading', 'LESEN']]
    print(f"  -> Reading tasks sample:")
    for m in read_tasks[:5]:
        print(f"     Type: {m[0]} | Title: {m[1]} | Link: {m[3]}")
