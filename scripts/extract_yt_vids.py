import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE = r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps'

searches = {
    'Hend Akkusativ': '1624',
    'Shehata Konjunktiv': '1627',
    'Hend Dativ': '1628',
}

for label, step in searches.items():
    path = fr'{BASE}\{step}\content.md'
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            txt = f.read()
        
        vids = re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', txt)
        vids = list(dict.fromkeys(vids))
        
        # Try to extract initial data JSON for titles
        vid_title_pairs = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"[^}]{0,200}?"text":"([^"]{5,100})"', txt)
        
        print(f'\n=== {label} ===')
        print(f'  Video IDs found: {vids[:12]}')
        if vid_title_pairs:
            for vid, t in vid_title_pairs[:8]:
                print(f'  {vid}: {t[:70]}')
        else:
            print('  (no title-id pairs parsed)')
    except FileNotFoundError:
        print(f'\n=== {label} === (file not found: {path})')
