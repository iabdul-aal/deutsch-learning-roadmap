import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

def spot_check(path, var_name, track):
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = re.search(r'export const ' + var_name + r'\s*=\s*(\{[\s\S]*\});?\s*$', txt)
    data = json.loads(m.group(1))
    print(f'\n=== {track} SPOT CHECK ===')
    
    seen_primary_vids = {}
    dupes = []
    
    for week in data['weeks']:
        wn = week['weekNumber']
        for day in week['days']:
            dn = day['dayNumber']
            day_label = f"W{wn}D{dn}"
            if dn <= 4 and wn <= 2:
                print(f"  {day_label}: {day['title'][:55]}")
            
            for t in day['standardTasks']:
                rt = t.get('resourceType', '')
                link = t.get('link', '')
                vid_m = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', link)
                vid = vid_m.group(1) if vid_m else None
                
                if rt == 'PRIMARY' and vid:
                    if vid in seen_primary_vids:
                        dupes.append((day_label, vid, t['title'][:50], seen_primary_vids[vid]))
                    else:
                        seen_primary_vids[vid] = day_label
                
                if rt in ['PRIMARY','SECONDARY'] and dn <= 4 and wn <= 2:
                    print(f"    [{rt:12s}] {t['title'][:62]} | {vid or 'NO_VID'}")
    
    print(f"\n  Duplicate PRIMARY video IDs across entire {track} track: {len(dupes)}")
    for d in dupes[:5]:
        print(f"    {d[0]} vid={d[1]}: {d[2]} [also in {d[3]}]")

spot_check(r'src\data\tracks\german-a1-ar\curriculum.ts', 'CURRICULUM_DATA', 'A1')
spot_check(r'src\data\tracks\german-a2-ar\curriculum.ts', 'CURRICULUM_DATA_A2', 'A2')
spot_check(r'src\data\tracks\german-b1-ar\curriculum.ts', 'CURRICULUM_DATA_B1', 'B1')
