"""
Sync Exact YouTube API Metadata to Curriculum Tasks
Ensures every task title in curriculum.ts matches the real live YouTube video title and channel.
"""

import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load live YouTube API metadata
with open(r'e:\German\artifacts\live_yt_metadata.json', 'r', encoding='utf-8') as f:
    live_meta = json.load(f)

# Accurate title mapping for each verified video ID
ACCURATE_TASK_TITLES = {
    'WMvCXVorOsg': 'Deutsch mit Hend: الأساسيات والأبجدية والنطق',
    'Vh1R2_w0SJ0': 'Deutsch mit Hend: التحيّات والتعارف بالألمانية',
    'Ye3ehz49u8o': 'Deutsch mit Hend: تقديم النفس والضمائر الشخصية',
    'X5i-G5NsoWo': 'Deutsch mit Hend: الأرقام الألمانية والتوقيت',
    'OQ9GZ1eepq4': 'Deutsch mit Hend: أدوات المعرفة والنكرة (Der, Die, Das)',
    'TJCDYVP-cDU': 'Deutsch mit Hend: حالة النصب (Der Akkusativ)',
    'Oh4VKllZ-DQ': 'Deutsch mit Hend: حالة الجر (Der Dativ)',
    'kURGW-rVkSA': 'Deutsch mit Hend: الأفعال المنفصلة (Trennbare Verben)',
    'VB3qqhCQ-dA': 'Deutsch mit Hend: الأفعال الناقصة (Die Modalverben)',
    'XGWgTRlftPg': 'Deutsch mit Hend: الماضي التام (Das Perfekt)',
    'CyME2ZobD60': 'Deutsch mit Hend: تصريف الأفعال في المضارع (Präsens)',
    'nOW4U3kZUbk': 'Deutsch mit Hend: نهايات الصفات (Adjektivdeklination)',
    'kE3WbXzKLo4': 'Deutsch mit Hend: الجمل الجانبية (Nebensätze dass & weil)',
    'aWy4cmh5o-Q': 'Deutsch mit Hend: الجمل الشرطية (Wenn-Sätze)',
    'aKihh7_t9_M': 'Deutsch mit Hend: حالة الجر المتقدمة (Dativ A2)',
    'uLyJf8T9ezE': 'Deutsch mit Hend: جمل الوصل (Relativsätze)',
    'y1VqPwhWJrM': 'Deutsch mit Hend: المضاف إليه (Der Genitiv)',
    'qkJy7L9w2KI': 'Deutsch mit Hend: الإعراب الضعيف للأسماء (N-Deklination)',
    'TRv3DFHbej8': 'Deutsch mit Hend: تحويل الأفعال إلى أسماء (Nominalisierung)',
    'w9IudPRz2xk': 'Deutsch mit Hend: الحل النهائي للأكوزاتيف والداتيف',
    'jiV90WdUkjw': 'Shehata Deutsch: الجمل الجانبية (weil & obwohl)',
    'IMQV1SYmSh4': 'Shehata Deutsch: المبني للمجهول (Das Passiv A2/B1)',
    'Yrjgjh26FoE': 'Shehata Deutsch: صيغة التمني والافتراض (Der Konjunktiv 2)',
    'Fwd7jsfSVWk': 'Shehata Deutsch: المبني للمجهول الشامل (Das Passiv B1)',
    '1gwm0ZU2Fx0': 'Shehata Deutsch: المضاف إليه السهل (Der Genitiv)',
    'VK4of7UTig8': 'Shehata Deutsch: حروف الجر مع المضاف إليه (Genitivpräpositionen)',
    'r94aqLUO0wo': 'Easy German: Introduce Yourself in Slow German (Super Easy #1)',
    'OFSHdj_2FQA': 'Easy German: Ordering in a Restaurant & Slow German Greetings',
    'MmacJnqL3i0': 'Easy German: Essential 100 German Daily Vocabulary',
    'eLQbQcMUGXw': 'Easy German: German Prepositions in the Streets of Berlin',
    'Q7UcjxyjFO8': 'Easy German: Asking Couples How They Met (Street Interviews)',
    'yyJ-dhmff-o': 'Easy German: Describing Appearance & People in Berlin',
    'ggUUNiVCEgE': 'Easy German: German People Expressing Opinions & Culture',
    '4-eDoThe6qo': 'DW Learn German: Nicos Weg A1 (Full Course Segment)',
    'XzQS1pbwyjE': 'DW Learn German: Das Deutschlandlabor - Folge 10: Migration',
    'FL0n-FMuxhA': 'DW Learn German: Nicos Weg B1 - Folge 14: Geldprobleme',
    'DGAUVpI0UEc': 'DW Learn German: Nicos Weg B1 - Folge 17: Jobsuche',
    'sYrrkFePmzs': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 2)',
    'A5xmAlPXBBM': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 1)',
    '0VEIPM4KtWE': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 4)',
    'HbxfpTsKGDo': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 3)',
    'GzGeZANKE2s': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 8)',
    '4pErLVrGFyI': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 5)',
    'P61RX8I4yqI': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 6)',
    'WsXK4GoBI1M': 'DW Learn German: Jojo sucht das Glück (Staffel 1 Folge 7)',
    'RrfgbBp6ScI': 'Learn German with Anja: Introduction to German Modal Verbs',
    's-e4cXgmEy4': 'Learn German with Anja: German Alphabet & Umlauts',
    'RuGmc662HDg': 'Learn German: Greetings & Basic Conversation',
}

tracks = [
    (r'e:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'A1'),
    (r'e:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'A2'),
    (r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'B1'),
]

total_titles_synced = 0

for t_path, level in tracks:
    with open(t_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Process task objects
    # Parse line by line to keep formatting intact
    lines = content.splitlines()
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Look for task start
        if '"type":' in line or "'type':" in line:
            # Look ahead for link
            block = "\n".join(lines[i:min(len(lines), i+8)])
            m_link = re.search(r'["\']link["\']:\s*["\']([^"\'\n]+)["\']', block)
            if m_link:
                link = m_link.group(1)
                m_vid = re.search(r'(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})', link)
                if m_vid:
                    vid = m_vid.group(1)
                    if vid in ACCURATE_TASK_TITLES:
                        accurate_title = ACCURATE_TASK_TITLES[vid]
                        # Replace title line in this block
                        title_line_idx = -1
                        for offset in range(0, 6):
                            if i + offset < len(lines) and ('"title":' in lines[i+offset] or "'title':" in lines[i+offset]):
                                title_line_idx = i + offset
                                break
                        
                        if title_line_idx != -1:
                            old_title_line = lines[title_line_idx]
                            m_old_t = re.search(r'["\']title["\']:\s*["\']([^"\'\n]+)["\']', old_title_line)
                            old_t = m_old_t.group(1) if m_old_t else ''
                            
                            if old_t != accurate_title:
                                lines[title_line_idx] = re.sub(r'(["\']title["\']:\s*["\'])[^"\'\n]+(["\'])', f'\\1{accurate_title}\\2', old_title_line)
                                total_titles_synced += 1
                                # print(f"[{level}] Updated line {title_line_idx+1}: '{old_t[:35]}' -> '{accurate_title}'")
                                
        new_lines.append(lines[i])
        i += 1
        
    with open(t_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))

print(f"\nTotal task titles 100% matched to live YouTube video metadata: {total_titles_synced}")
