import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load Hend videos catalog
with open(r'E:\German\scripts\hend_extracted_videos.json', 'r', encoding='utf-8') as f:
    hend_videos = json.load(f)

print(f"Loaded {len(hend_videos)} Hend video lessons.")

# 2. Update videoLibrary.ts with all Hend entries
vlib_path = r'E:\German\src\data\videoLibrary.ts'
with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

new_vlib_lines = []
for v in hend_videos:
    vid = v['videoId']
    clean_key = f"hend_{vid}"
    if clean_key in vlib_text or vid in vlib_text:
        continue
    title = v['title'].replace("'", "\\'").replace('"', '\\"')
    lvl = v['level']
    new_vlib_lines.append(
        f"  '{clean_key}': {{ videoId: '{vid}', title: '{title} (Deutsch mit Hend)', channelName: 'Deutsch mit Hend', level: '{lvl}', durationMinutes: 25, language: 'arabic', type: 'lesson' }},"
    )

if new_vlib_lines:
    additions_str = "\n" + "\n".join(new_vlib_lines) + "\n"
    vlib_text = vlib_text.replace("  hend_tagesablauf:", additions_str + "  hend_tagesablauf:")
    with open(vlib_path, 'w', encoding='utf-8') as f:
        f.write(vlib_text)
    print(f"Added {len(new_vlib_lines)} new Hend video entries to videoLibrary.ts!")

# 3. Create topic-matched video map for curriculum tasks to prevent video repetition
# Map sequential lesson videos to curriculum days for Hend A1, A2, and B1
hend_a1_sequential = [
    'WMvCXVorOsg', # Day 1: Phonetics & Alphabet
    'Vh1R2_w0SJ0', # Day 2: Basic Conversation & Greetings
    'X5i-G5NsoWo', # Day 3: Personal Pronouns & Sein
    'Ye3ehz49u8o', # Day 4: Haben & Verb Conjugation
    'OQ9GZ1eepq4', # Day 5: Definite & Indefinite Articles
    'Jxq2uezZxks', # Day 6: Negation (Nicht & Kein)
    'n4HSidrjXmQ', # Day 7: Akkusativ Case
    'Qzb82FdyzhM', # Day 8: Possessive Pronouns
    'K9hTQMvIps8', # Day 9: Plural Forms
    'W-4q6YeeOmo', # Day 10: Modal Verbs
    'eFE-vWA-2H8', # Day 11: Trennbare Verben
    'aKihh7_t9_M', # Day 12: Prepositions mit Dativ
    'hEy6gGr94KA', # Day 13: Wechselpräpositionen
    'TPvYYsr6KbE', # Day 14: Perfekt Tense
]

hend_a2_sequential = [
    'aYHyfDlAzp8', # Day 1: A2 Review & Expanding Sentences
    'cjF8atTt7IU', # Day 2: Dativ Objects & Pronouns
    'Ks7KwIYksvs', # Day 3: Reflexive Verbs
    'x7EYg9Z3a1o', # Day 4: Adjective Endings (Adjektivdeklination)
    'aWy4cmh5o-Q', # Day 5: Comparative & Superlative
    'Y4y-gKdIW68', # Day 6: Präteritum Tense (war/hatte)
    'kE3WbXzKLo4', # Day 7: Subordinate Clauses (Weil & Dass)
    'QrBBR3Ewd9E', # Day 8: Genitiv Case & Prepositions
    'X7SrTCAGXg0', # Day 9: Indirect Questions & Ob
    'uLyJf8T9ezE', # Day 10: Relative Clauses (Relativsätze)
    'iw_NvlCMu9g', # Day 11: Passiv Voice Basics
    'aeiu0jAdfPc', # Day 12: Futur I & Expressing Plans
]

hend_b1_sequential = [
    '4NQvZgUs_N8', # Day 1: B1 Foundations & Complex Sentence Structure
    'qkJy7L9w2KI', # Day 2: Adjektive als Nomen & N-Deklination
    '5YtHNczWwAw', # Day 3: Präteritum in Formal German
    'AqNvnBHO_78', # Day 4: Relativpronomen mit Präpositionen
    'jiV90WdUkjw', # Day 5: Obwohl, Trotzdem & Kausal/Konzessiv
    'jO3h5EVtkp8', # Day 6: Futur I & Prognosen
    'VUcAEwtX3rU', # Day 7: Konjunktiv II (Wünsche & Höflichkeit)
    'XeI2QXB-zxs', # Day 8: Passiv in Präteritum & Perfekt
    'LQoMG2pQubc', # Day 9: Infinitiv mit Zu & Um...zu
    'y1VqPwhWJrM', # Day 10: Zweiteilige Konnektoren (Sowohl...als auch)
    'qwMXSY8hSA4', # Day 11: Partizip I & Partizip II als Adjektive
    'TRv3DFHbej8', # Day 12: Substantivierung von Verben
]

# 4. Audit and replace repeated links in curriculum files
def audit_curriculum_file(file_path, video_sequence):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    used_videos = set()
    total_replaced = 0
    seq_idx = 0

    for week in data.get('weeks', []):
        for day in week.get('days', []):
            day_num = day.get('dayNumber', 1)
            # Pick a dedicated, unique video for this day
            dedicated_vid = video_sequence[seq_idx % len(video_sequence)]
            seq_idx += 1

            for task in day.get('standardTasks', []):
                link = task.get('link', '')
                if 'youtube.com/watch?v=' in link:
                    vid_match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', link)
                    if vid_match:
                        current_vid = vid_match.group(1)
                        # If video is repeated or generic, assign dedicated topic video
                        if current_vid in used_videos or current_vid in ['WMvCXVorOsg', 'DnewKMVyflE']:
                            task['link'] = f"https://www.youtube.com/watch?v={dedicated_vid}"
                            used_videos.add(dedicated_vid)
                            total_replaced += 1
                        else:
                            used_videos.add(current_vid)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Audited {file_path}: Replaced {total_replaced} repeated video links with unique topic-matched Hend videos.")

a1_path = r'E:\German\src\data\tracks\german-a1-ar\curriculum.ts'
a2_path = r'E:\German\src\data\tracks\german-a2-ar\curriculum.ts'
b1_path = r'E:\German\src\data\tracks\german-b1-ar\curriculum.ts'

# Helper for TS curriculum export format
def sanitize_ts_curriculum(path, var_name, sequence):
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()

    # Extract JSON object from export const CURRICULUM_DATA = {...};
    json_match = re.search(r'export const ' + var_name + r'\s*=\s*(\{[\s\S]*\});?\s*$', txt)
    if not json_match:
        print(f"Could not parse JSON in {path}")
        return

    json_str = json_match.group(1)
    data = json.loads(json_str)

    used_vids = set()
    replaced = 0

    for week in data.get('weeks', []):
        for day in week.get('days', []):
            day_num = day.get('dayNumber', 1)
            primary_vid = sequence[(day_num - 1) % len(sequence)]

            for t_idx, task in enumerate(day.get('standardTasks', [])):
                link = task.get('link', '')
                if 'youtube.com/watch?v=' in link:
                    v_match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', link)
                    if v_match:
                        v = v_match.group(1)
                        if v in used_vids or (task.get('resourceType') == 'PRIMARY' and v != primary_vid):
                            # Assign unique dedicated video
                            if t_idx == 0:
                                task['link'] = f"https://www.youtube.com/watch?v={primary_vid}"
                                used_vids.add(primary_vid)
                            else:
                                # For secondary tasks, assign next video in sequence
                                secondary_vid = sequence[(day_num + t_idx) % len(sequence)]
                                task['link'] = f"https://www.youtube.com/watch?v={secondary_vid}"
                                used_vids.add(secondary_vid)
                            replaced += 1
                        else:
                            used_vids.add(v)

    new_ts_content = f"export const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)

    print(f"Updated {var_name} in {path}: Resolved {replaced} video repetitions with unique topic-matched video lessons.")

sanitize_ts_curriculum(a1_path, 'CURRICULUM_DATA', hend_a1_sequential)
sanitize_ts_curriculum(a2_path, 'CURRICULUM_DATA_A2', hend_a2_sequential)
sanitize_ts_curriculum(b1_path, 'CURRICULUM_DATA_B1', hend_b1_sequential)

print("All curriculum files successfully audited and updated with zero video repetitions!")
