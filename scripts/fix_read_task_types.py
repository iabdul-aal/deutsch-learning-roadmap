"""
Convert all 'Read' tasks that have YouTube video links into 'Watch' or 'Listen' tasks
so task types accurately reflect video content in both JSON curriculum and UI headers.
"""
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tracks = [
    r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts',
    r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts',
]

total_converted = 0

for t_path in tracks:
    level = os.path.basename(os.path.dirname(t_path))
    with open(t_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.splitlines()
    new_lines = []
    
    in_task = False
    task_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for task start line containing "type": "Read"
        if re.search(r'["\']type["\']:\s*["\']Read["\']', line):
            # Inspect next few lines to check link and title
            block_chunk = "\n".join(lines[max(0, i-2):min(len(lines), i+8)])
            has_yt = ('youtube.com' in block_chunk or 'youtu.be' in block_chunk)
            
            if has_yt:
                # Check if title suggests listening or watching
                is_listening = any(k in block_chunk.lower() for k in ['listen', 'audio', 'sound', 'hören'])
                new_type = 'Listen' if is_listening else 'Watch'
                
                line = re.sub(r'(["\']type["\']:\s*["\'])Read(["\'])', f'\\1{new_type}\\2', line)
                print(f"[{level}] Line {i+1}: Converted type 'Read' -> '{new_type}' (has YouTube video link)")
                total_converted += 1
                
        new_lines.append(line)
        i += 1
        
    with open(t_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(new_lines))

print(f"\nTotal 'Read' tasks converted to 'Watch' / 'Listen': {total_converted}")
