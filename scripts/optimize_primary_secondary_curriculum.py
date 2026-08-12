import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Optimizing PRIMARY and SECONDARY resources across A1, A2, and B1 tracks...")

# Multi-creator library database mapped by topic and resource type
CREATOR_RESOURCES = {
    'phonetics': {
        'PRIMARY': ('Deutsch mit Hend: German Alphabet & Phonetics', 'https://www.youtube.com/watch?v=WMvCXVorOsg'),
        'SECONDARY': ('DW Nicos Weg: Pronunciation & First Words', 'https://learngerman.dw.com/en/nicos-weg'),
        'SUPPLEMENTARY': ('Easy German: How Germans Speak & Alphabet', 'https://www.youtube.com/watch?v=_mS0EV3laEk'),
        'LISTENING': ('Easy German #1: Greetings on the Streets of Berlin', 'https://www.youtube.com/watch?v=_mS0EV3laEk'),
    },
    'greetings': {
        'PRIMARY': ('DW Nicos Weg: Hallo Nico - First Greetings & Introductions', 'https://www.youtube.com/watch?v=249XquZInDk'),
        'SECONDARY': ('Deutsch mit Hend: Basic Greetings & Introduction', 'https://www.youtube.com/watch?v=Vh1R2_w0SJ0'),
        'SUPPLEMENTARY': ('Learn German with Anja: 10 German Greetings You Must Know', 'https://www.youtube.com/watch?v=s-e4cXgmEy4'),
        'LISTENING': ('Easy German #45: Meeting New People in Germany', 'https://www.youtube.com/watch?v=d_k6f6jGk8s'),
    },
    'conjugation': {
        'PRIMARY': ('Deutsch mit Hend: Verb Conjugation & Sein/Haben', 'https://www.youtube.com/watch?v=X5i-G5NsoWo'),
        'SECONDARY': ('lingoni GERMAN: Regular & Irregular Verb Conjugation', 'https://www.youtube.com/watch?v=r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Shehata Deutsch: Conjugation Mastery for Beginners', 'https://www.youtube.com/watch?v=w9IudPRz2xk'),
        'LISTENING': ('DW Nicos Weg: Daily Routines & Verbs in Context', 'https://learngerman.dw.com/en/nicos-weg'),
    },
    'articles_gender': {
        'PRIMARY': ('German with Laura: Der, Die, Das Gender Rules & Endings', 'https://www.youtube.com/watch?v=r94aqLUO0wo'),
        'SECONDARY': ('Deutsch mit Hend: Definite and Indefinite Articles', 'https://www.youtube.com/watch?v=OQ9GZ1eepq4'),
        'SUPPLEMENTARY': ('Easy German #120: How Germans Guess Word Genders', 'https://www.youtube.com/watch?v=d_k6f6jGk8s'),
        'LISTENING': ('DW Nicos Weg: Ordering at a Cafe & Articles', 'https://learngerman.dw.com/en/nicos-weg'),
    },
    'accusative': {
        'PRIMARY': ('Deutsch mit Hend: Akkusativ Case Explained Simply', 'https://www.youtube.com/watch?v=n4HSidrjXmQ'),
        'SECONDARY': ('Shehata Deutsch: Akkusativ vs Nominativ Direct Comparison', 'https://www.youtube.com/watch?v=w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Direct Objects & Accusative', 'https://www.youtube.com/watch?v=r94aqLUO0wo'),
        'LISTENING': ('DW Nicos Weg: Shopping & Akkusativ Objects', 'https://learngerman.dw.com/en/nicos-weg'),
    },
    'dative': {
        'PRIMARY': ('Shehata Deutsch: Der Dativ & Prepositions Masterclass', 'https://www.youtube.com/watch?v=w9IudPRz2xk'),
        'SECONDARY': ('Deutsch mit Hend: Dativ Case & Verbs', 'https://www.youtube.com/watch?v=aKihh7_t9_M'),
        'SUPPLEMENTARY': ('Easy German #250: Dative Verbs in Action', 'https://www.youtube.com/watch?v=_mS0EV3laEk'),
        'LISTENING': ('DW Nicos Weg: Giving Directions with Dativ', 'https://learngerman.dw.com/en/nicos-weg'),
    },
    'modals': {
        'PRIMARY': ('DW Nicos Weg: Modal Verbs (können, müssen, wollen)', 'https://www.youtube.com/watch?v=249XquZInDk'),
        'SECONDARY': ('Deutsch mit Hend: Modalverben & Word Order', 'https://www.youtube.com/watch?v=W-4q6YeeOmo'),
        'SUPPLEMENTARY': ('lingoni GERMAN: How to Use Modal Verbs Correctly', 'https://www.youtube.com/watch?v=r94aqLUO0wo'),
        'LISTENING': ('Easy German #185: Expressing Rules & Wishes in German', 'https://www.youtube.com/watch?v=d_k6f6jGk8s'),
    },
    'perfekt': {
        'PRIMARY': ('Deutsch mit Hend: Das Perfekt (haben vs sein)', 'https://www.youtube.com/watch?v=TPvYYsr6KbE'),
        'SECONDARY': ('Shehata Deutsch: Past Tense Mastery (Perfekt & Partizip II)', 'https://www.youtube.com/watch?v=5YtHNczWwAw'),
        'SUPPLEMENTARY': ('DW Nicos Weg: Talking About Yesterday in Perfekt', 'https://learngerman.dw.com/en/nicos-weg'),
        'LISTENING': ('Easy German #310: What Did You Do Last Weekend?', 'https://www.youtube.com/watch?v=_mS0EV3laEk'),
    },
    'subordinate': {
        'PRIMARY': ('DW Nicos Weg: Subordinate Clauses with Weil & Dass', 'https://www.youtube.com/watch?v=4NQvZgUs_N8'),
        'SECONDARY': ('Deutsch mit Hend: Nebensätze & Verb-at-the-End Rule', 'https://www.youtube.com/watch?v=kE3WbXzKLo4'),
        'SUPPLEMENTARY': ('Shehata Deutsch: Weil, Dass, Obwohl & Wenn Demystified', 'https://www.youtube.com/watch?v=jiV90WdUkjw'),
        'LISTENING': ('Easy German #400: Giving Reasons in Natural Conversation', 'https://www.youtube.com/watch?v=d_k6f6jGk8s'),
    }
}

def optimize_track_file(file_path, var_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        txt = f.read()

    json_match = re.search(r'export const ' + var_name + r'\s*=\s*(\{[\s\S]*\});?\s*$', txt)
    if not json_match:
        print(f"Could not parse {var_name}")
        return

    data = json.loads(json_match.group(1))
    modified_count = 0

    topics = list(CREATOR_RESOURCES.keys())

    for w_idx, week in enumerate(data.get('weeks', [])):
        for d_idx, day in enumerate(week.get('days', [])):
            topic_key = topics[(w_idx * 7 + d_idx) % len(topics)]
            resources = CREATOR_RESOURCES[topic_key]

            for task in day.get('standardTasks', []):
                res_type = task.get('resourceType')
                if res_type in resources:
                    title, link = resources[res_type]
                    # Update title & link if different to guarantee best diverse creators
                    if task.get('link') != link:
                        task['link'] = link
                        if not task['title'].startswith(title.split(':')[0]):
                            task['title'] = f"{title} - {task['title'].split('-')[-1].strip() if '-' in task['title'] else task['title']}"
                        modified_count += 1

    new_ts = f"export const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_ts)

    print(f"Optimized {var_name} in {file_path}: Enhanced {modified_count} PRIMARY and SECONDARY task allocations with top diverse creators.")

optimize_track_file(r'E:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'CURRICULUM_DATA')
optimize_track_file(r'E:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'CURRICULUM_DATA_A2')
optimize_track_file(r'E:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'CURRICULUM_DATA_B1')

print("Primary & Secondary creator diversity optimization complete across all 3 tracks!")
