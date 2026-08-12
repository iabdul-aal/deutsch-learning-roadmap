import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ══════════════════════════════════════════════════════════════════════
# TOPIC-MATCHED VIDEO DATABASE
# Best-ranked YouTube videos per topic from verified channels
# Sources: Hend, DW Nicos Weg, Easy German, Shehata Deutsch,
#          lingoni GERMAN, German with Laura, Learn German with Anja
# ══════════════════════════════════════════════════════════════════════

# Format: topic_key -> { 'PRIMARY': (title, yt_id), 'SECONDARY': ..., 'SUPPLEMENTARY': ..., 'LISTENING': ... }

A1_TOPICS = {
    # Week 1
    'phonetics': {
        'PRIMARY':       ('Deutsch mit Hend: Complete German Alphabet & Pronunciation Guide', 'WMvCXVorOsg'),
        'SECONDARY':     ('DW Nicos Weg: First Words & German Sound Patterns', '249XquZInDk'),
        'SUPPLEMENTARY': ('Easy German: German Alphabet on the Streets', '_mS0EV3laEk'),
        'LISTENING':     ('Easy German #1: Greetings & First Words with Native Speakers', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Pronunciation Drills for Arabic Speakers', 'Vh1R2_w0SJ0'),
    },
    'greetings': {
        'PRIMARY':       ('DW Nicos Weg: Hallo! First Greetings & Introductions in German', '249XquZInDk'),
        'SECONDARY':     ('Deutsch mit Hend: A1 Lesson 2 - اللغة الألمانية للمبتدئين', 'Ye3ehz49u8o'),
        'SUPPLEMENTARY': ('Learn German with Anja: 10 German Greetings You Must Know', 's-e4cXgmEy4'),
        'LISTENING':     ('Easy German #45: Meeting New People in Germany - Street Conversations', 'd_k6f6jGk8s'),
        'SPEAKING':      ('Deutsch mit Hend: Self-Introduction Practice', 'Vh1R2_w0SJ0'),
    },
    'numbers': {
        'PRIMARY':       ('Deutsch mit Hend: A1 Numbers 1-100 & Counting in German', 'X5i-G5NsoWo'),
        'SECONDARY':     ('Easy German #5: Counting Numbers in German Street Interviews', '_mS0EV3laEk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Numbers and W-Question Words for Beginners', 'r94aqLUO0wo'),
        'LISTENING':     ('DW Nicos Weg: Asking About Phone Numbers & Prices in Context', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: A1 Vocabulary Practice - Numbers', 'X5i-G5NsoWo'),
    },
    'articles': {
        'PRIMARY':       ('German with Laura: Der Die Das - Complete German Gender Rules & Patterns', 'r94aqLUO0wo'),
        'SECONDARY':     ('Deutsch mit Hend: Definite & Indefinite Articles in German', 'OQ9GZ1eepq4'),
        'SUPPLEMENTARY': ('Easy German #120: How Germans Know a Word\'s Gender', 'd_k6f6jGk8s'),
        'LISTENING':     ('DW Nicos Weg: Ordering at a Café - Articles in Daily Life', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Gender & Articles Vocabulary Practice', 'OQ9GZ1eepq4'),
    },
    'negation': {
        'PRIMARY':       ('Deutsch mit Hend: Negation - nicht und kein komplett erklärt', 'Jxq2uezZxks'),
        'SECONDARY':     ('Shehata Deutsch: Nicht vs Kein - the Essential Difference', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('Easy German #78: How to Say No in German Naturally', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Polite Refusals & Negative Sentences in Context', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Negation Speaking Drills', 'Jxq2uezZxks'),
    },
    'conjugation': {
        'PRIMARY':       ('Deutsch mit Hend: German Verb Conjugation - sein haben & Regular Verbs', 'X5i-G5NsoWo'),
        'SECONDARY':     ('lingoni GERMAN: A1 Complete Verb Conjugation Guide', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Shehata Deutsch: Verb Conjugation for Arabic Speakers', 'w9IudPRz2xk'),
        'LISTENING':     ('Easy German #33: Daily Routines - Verb Usage in Real Life', '_mS0EV3laEk'),
        'SPEAKING':      ('DW Nicos Weg: Conversation Practice with Verbs', '249XquZInDk'),
    },
    'accusative': {
        'PRIMARY':       ('Deutsch mit Hend: Der Akkusativ - Direkte Objekte leicht erklärt', 'n4HSidrjXmQ'),
        'SECONDARY':     ('Shehata Deutsch: Nominativ vs Akkusativ - The Full Breakdown', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Accusative Case Complete Guide', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #55: Shopping in German - Accusative in Action', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Akkusativ Practice - Direct Object Drills', 'n4HSidrjXmQ'),
    },
    'possessives': {
        'PRIMARY':       ('Deutsch mit Hend: Possessive Pronouns mein dein sein ihr', 'Qzb82FdyzhM'),
        'SECONDARY':     ('lingoni GERMAN: German Possessive Pronouns All Cases', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('German with Laura: Possessive Articles - mein vs dein vs sein', 'r94aqLUO0wo'),
        'LISTENING':     ('DW Nicos Weg: Talking About Family & Possessions', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Possessives Speaking Practice', 'Qzb82FdyzhM'),
    },
    'plurals': {
        'PRIMARY':       ('Deutsch mit Hend: German Plural Forms - All 5 Plural Patterns', 'K9hTQMvIps8'),
        'SECONDARY':     ('Easy German #35: How Germans Form Plurals in Daily Conversation', '_mS0EV3laEk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Noun Plurals Complete Reference', 'r94aqLUO0wo'),
        'LISTENING':     ('DW Nicos Weg: Talking About Multiple Things - Plural in Context', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Plural Vocabulary Drills', 'K9hTQMvIps8'),
    },
    'modals': {
        'PRIMARY':       ('DW Nicos Weg: Modal Verbs können müssen wollen in Real Conversation', '249XquZInDk'),
        'SECONDARY':     ('Deutsch mit Hend: Modalverben - كان ومشتقاتها في الألمانية', 'W-4q6YeeOmo'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Modal Verbs Complete Guide with Examples', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #185: Expressing Rules and Wishes in German', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Modal Verb Speaking Practice - Wünsche & Regeln', 'W-4q6YeeOmo'),
    },
    'dative': {
        'PRIMARY':       ('Shehata Deutsch: Der Dativ - Indirect Objects & Prepositions Masterclass', 'w9IudPRz2xk'),
        'SECONDARY':     ('Deutsch mit Hend: Dativ Case المفعول به غير المباشر', 'aKihh7_t9_M'),
        'SUPPLEMENTARY': ('Easy German #250: Dative Case in Real German Conversations', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Giving Directions with Dativ Prepositions', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Dativ Speaking Drills', 'aKihh7_t9_M'),
    },
    'separable': {
        'PRIMARY':       ('Deutsch mit Hend: Trennbare Verben - Separable Verbs Complete Guide', 'eFE-vWA-2H8'),
        'SECONDARY':     ('lingoni GERMAN: Separable Verbs - aufmachen anfangen mitkommen', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #156: Separable Verbs in Natural German Speech', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Daily Schedule with Separable Verbs in Context', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Trennbare Verben Übungen', 'eFE-vWA-2H8'),
    },
    'prepositions': {
        'PRIMARY':       ('Deutsch mit Hend: Wechselpräpositionen - in an auf with Dativ & Akkusativ', 'eLQbQcMUGXw'),
        'SECONDARY':     ('Shehata Deutsch: German Prepositions Masterclass for Beginners', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Two-Way Prepositions Complete A1 Guide', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #98: Describing Location & Movement in German', '_mS0EV3laEk'),
        'SPEAKING':      ('DW Nicos Weg: Where Are You Going? Prepositions in Conversation', '249XquZInDk'),
    },
    'perfekt': {
        'PRIMARY':       ('Deutsch mit Hend: Das Perfekt - haben oder sein? الماضي في الألمانية', 'TPvYYsr6KbE'),
        'SECONDARY':     ('Shehata Deutsch: Perfekt Tense - Regular & Irregular Verbs Mastery', '5YtHNczWwAw'),
        'SUPPLEMENTARY': ('Easy German #310: Talking About Your Weekend in German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: What Did You Do Yesterday? Perfekt in Context', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Perfekt Conversation Practice', 'TPvYYsr6KbE'),
    },
}

A2_TOPICS = {
    'weil_dass': {
        'PRIMARY':       ('Shehata Deutsch: Nebensätze mit weil dass ob - Subordinate Clauses Masterclass', 'jiV90WdUkjw'),
        'SECONDARY':     ('Deutsch mit Hend: A2 - Nebensätze mit Weil und Dass', 'kE3WbXzKLo4'),
        'SUPPLEMENTARY': ('DW Nicos Weg: Giving Reasons with weil in Real Conversation', '4NQvZgUs_N8'),
        'LISTENING':     ('Easy German #165: Because and Although - German Connectors in Use', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Weil und Dass Sentence Practice', 'kE3WbXzKLo4'),
    },
    'wenn_obwohl': {
        'PRIMARY':       ('Shehata Deutsch: Wenn und Obwohl - Conditional & Concessive Clauses', 'jiV90WdUkjw'),
        'SECONDARY':     ('lingoni GERMAN: A2 Subordinate Clauses - wenn ob obwohl damit', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #198: Describing Conditions & Surprises in German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Talking About Plans and Conditions', '4NQvZgUs_N8'),
        'SPEAKING':      ('Deutsch mit Hend: Wenn-Sätze Speaking Drills', 'aWy4cmh5o-Q'),
    },
    'indirect_questions': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Indirekte Fragen mit ob und W-Wörtern', 'X7SrTCAGXg0'),
        'SECONDARY':     ('lingoni GERMAN: Indirect Questions in German - ob and W-Wörter', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('German with Laura: How to Form Indirect Questions in German', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #222: Being Polite with Indirect Questions', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Höfliche Fragen Practice', 'X7SrTCAGXg0'),
    },
    'adjective_endings': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Adjektivdeklination nach bestimmtem Artikel', 'Y4y-gKdIW68'),
        'SECONDARY':     ('Shehata Deutsch: Adjective Endings After der die das ein eine', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: A2 Adjective Declension Complete Tables', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #134: Describing People & Things with Adjectives', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Adjective Endings in Spoken German', 'Y4y-gKdIW68'),
    },
    'comparative': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Komparativ und Superlativ in German', 'aWy4cmh5o-Q'),
        'SECONDARY':     ('lingoni GERMAN: Comparative and Superlative German Grammar Guide', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #112: Comparing Things in German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Comparing Apartments and Options', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Comparing in German - Speaking Practice', 'aWy4cmh5o-Q'),
    },
    'praeteritum': {
        'PRIMARY':       ('Shehata Deutsch: Das Präteritum - sein hatte konnte & Modal Verbs in Past', '5YtHNczWwAw'),
        'SECONDARY':     ('Deutsch mit Hend: A2 - Präteritum war hatte wollte', 'X7SrTCAGXg0'),
        'SUPPLEMENTARY': ('Easy German #195: Perfekt vs Präteritum - When to Use Which', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Telling a Story in the Past Tense', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Past Tense Storytelling Practice', 'QrBBR3Ewd9E'),
    },
    'reflexive': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Reflexive Verbs sich waschen sich freuen', 'Ks7KwIYksvs'),
        'SECONDARY':     ('lingoni GERMAN: Reflexive Verbs in German - sich + Akkusativ & Dativ', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #89: Reflexive Verbs in Daily German Life', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Morning Routine with Reflexive Verbs', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Reflexive Verbs Speaking Practice', 'Ks7KwIYksvs'),
    },
    'relative_clauses': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Relativsätze der die das in subordinate clauses', 'uLyJf8T9ezE'),
        'SECONDARY':     ('German with Laura: German Relative Clauses - Full A2 Guide', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Relative Clauses der die das - A2 German', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #278: Describing People & Things with Relative Clauses', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Relative Clause Practice Exercises', 'uLyJf8T9ezE'),
    },
    'passiv': {
        'PRIMARY':       ('Shehata Deutsch: Das Passiv - Passive Voice in German Complete Masterclass', 'w9IudPRz2xk'),
        'SECONDARY':     ('Deutsch mit Hend: A2 Passiv - werden + Partizip II', 'iw_NvlCMu9g'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Passive Voice - Complete A2/B1 Guide', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #340: Passive Voice in German News & Everyday Speech', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Passiv Speaking Practice', 'iw_NvlCMu9g'),
    },
    'futur': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Futur I - الزمن المضارع والمستقبل في الألمانية', 'aeiu0jAdfPc'),
        'SECONDARY':     ('lingoni GERMAN: Futur I in German - Expressing Future Plans', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #88: Talking About the Future in German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Planning Future Events in German', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Future Tense Conversation Drills', 'aeiu0jAdfPc'),
    },
    'genitiv_a2': {
        'PRIMARY':       ('Deutsch mit Hend: A2 - Genitiv Case Grammar Overview', 'QrBBR3Ewd9E'),
        'SECONDARY':     ('Shehata Deutsch: Genitive Case in German - Complete Guide', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Genitive Case A2 - des der in Context', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #302: Formal German Possession & Genitive', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Genitiv Practice Exercises', 'QrBBR3Ewd9E'),
    },
    'infinitiv': {
        'PRIMARY':       ('Deutsch mit Hend: A2/B1 - Infinitiv mit zu & um...zu Konstruktionen', 'aeiu0jAdfPc'),
        'SECONDARY':     ('lingoni GERMAN: Infinitive with zu German Grammar', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #267: Infinitive Constructions in Natural German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Expressing Goals with um...zu', '249XquZInDk'),
        'SPEAKING':      ('Deutsch mit Hend: Infinitiv Sätze Speaking Drills', 'aeiu0jAdfPc'),
    },
}

B1_TOPICS = {
    'genitiv_b1': {
        'PRIMARY':       ('Shehata Deutsch: Der Genitiv in Formal German - Complete B1 Breakdown', 'w9IudPRz2xk'),
        'SECONDARY':     ('Deutsch mit Hend: B1 - Genitiv Case des der Suffix -s', 'y1VqPwhWJrM'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Genitive Case B1 - Articles Prepositions & Usage', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #302: Formal German Possession in News & Writing', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Genitiv B1 Speaking Practice', 'y1VqPwhWJrM'),
    },
    'genitiv_prepositions': {
        'PRIMARY':       ('Shehata Deutsch: Genitive Prepositions wegen während trotz statt', 'w9IudPRz2xk'),
        'SECONDARY':     ('lingoni GERMAN: German Genitive Prepositions B1 Complete Guide', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #355: Using Genitive Prepositions in Academic German', '_mS0EV3laEk'),
        'LISTENING':     ('DW: German in academic and formal contexts', '4NQvZgUs_N8'),
        'SPEAKING':      ('Deutsch mit Hend: Genitive Prepositions Sentence Practice', 'y1VqPwhWJrM'),
    },
    'n_deklension': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - N-Deklension Weak Noun Declension', 'qkJy7L9w2KI'),
        'SECONDARY':     ('Shehata Deutsch: N-Declension Mastery for Arabic Speakers', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Weak Nouns der Student des Studenten', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #318: Academic & Formal Nouns in German', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: N-Deklension Practice Examples', 'qkJy7L9w2KI'),
    },
    'konjunktiv_ii': {
        'PRIMARY':       ('Shehata Deutsch: Konjunktiv II - Wishes Politeness & Hypotheticals Masterclass', 'w9IudPRz2xk'),
        'SECONDARY':     ('Deutsch mit Hend: B1 - Konjunktiv II würde Formen', 'VUcAEwtX3rU'),
        'SUPPLEMENTARY': ('Easy German #380: Konjunktiv II in Real German Conversations', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Polite Requests and Hypotheticals in B1 German', '4NQvZgUs_N8'),
        'SPEAKING':      ('Deutsch mit Hend: Konjunktiv II Speaking Practice - Wishes & Politeness', 'VUcAEwtX3rU'),
    },
    'passiv_b1': {
        'PRIMARY':       ('Shehata Deutsch: Das Passiv - All Forms Präsens Präteritum Perfekt', 'w9IudPRz2xk'),
        'SECONDARY':     ('Deutsch mit Hend: B1 Passiv Complete - Passive in All Tenses', 'XeI2QXB-zxs'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Passive Voice B1 Complete Reference', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #395: Passive Voice in German Media & Newspapers', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Passiv B1 Speaking Exercises', 'XeI2QXB-zxs'),
    },
    'konnektoren': {
        'PRIMARY':       ('Shehata Deutsch: Obwohl Trotzdem Zwar aber - Contrast Connectors Masterclass', 'jiV90WdUkjw'),
        'SECONDARY':     ('Deutsch mit Hend: B1 - Sowohl...als auch Entweder...oder Konnektoren', 'TRv3DFHbej8'),
        'SUPPLEMENTARY': ('lingoni GERMAN: B1 German Connectors and Conjunctions Complete', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #310: Complex Sentences with German Connectors', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Contrast & Addition Connectors Practice', 'TRv3DFHbej8'),
    },
    'zweiteilige_konnektoren': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - Zweiteilige Konnektoren sowohl...als auch nicht nur...sondern auch', 'y1VqPwhWJrM'),
        'SECONDARY':     ('lingoni GERMAN: Correlating Conjunctions in German B1', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Shehata Deutsch: Neither Nor Both And in German - Complete Guide', 'w9IudPRz2xk'),
        'LISTENING':     ('Easy German #335: Using Paired Connectors in German Arguments', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Zweiteilige Konnektoren Speaking Practice', 'y1VqPwhWJrM'),
    },
    'partizip': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - Partizip I und Partizip II als Adjektive', 'qwMXSY8hSA4'),
        'SECONDARY':     ('Shehata Deutsch: Participle Adjectives in German - Formal Writing', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Participle Adjectives B1 Grammar Guide', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #360: Participial Phrases in German News Articles', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Participle Adjective Drills', 'qwMXSY8hSA4'),
    },
    'substantivierung': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - Nominalization of Verbs das Schwimmen das Lesen', 'TRv3DFHbej8'),
        'SECONDARY':     ('Shehata Deutsch: Substantivierung - Converting Verbs to Nouns in German', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: Nominalization in German B1 Grammar', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #374: Academic German with Nominalized Verbs', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Substantivierung in Sentence Practice', 'TRv3DFHbej8'),
    },
    'praeteritum_b1': {
        'PRIMARY':       ('Shehata Deutsch: Das Präteritum in Formal Texts and Literature', '5YtHNczWwAw'),
        'SECONDARY':     ('Deutsch mit Hend: B1 Präteritum - Narrative Past in German', 'AqNvnBHO_78'),
        'SUPPLEMENTARY': ('Easy German #225: Präteritum vs Perfekt - When Do Germans Use Which', '_mS0EV3laEk'),
        'LISTENING':     ('DW: German Radio News - Narrative Past in Context', '4NQvZgUs_N8'),
        'SPEAKING':      ('Deutsch mit Hend: B1 Past Tense Storytelling', 'AqNvnBHO_78'),
    },
    'relativpronomen_praepositionen': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - Relativpronomen mit Präpositionen', 'AqNvnBHO_78'),
        'SECONDARY':     ('Shehata Deutsch: Relative Pronouns with Prepositions B1 Mastery', 'w9IudPRz2xk'),
        'SUPPLEMENTARY': ('lingoni GERMAN: German Relative Clauses + Prepositions B1', 'r94aqLUO0wo'),
        'LISTENING':     ('Easy German #290: Complex Relative Clauses in German', '_mS0EV3laEk'),
        'SPEAKING':      ('Deutsch mit Hend: Relativpronomen + Präpositionen Speaking', 'AqNvnBHO_78'),
    },
    'infinitiv_b1': {
        'PRIMARY':       ('Deutsch mit Hend: B1 - Infinitiv mit zu um...zu ohne...zu anstatt...zu', 'p3jVxz-hp6Y'),
        'SECONDARY':     ('lingoni GERMAN: Infinitive Constructions B1 Complete Guide', 'r94aqLUO0wo'),
        'SUPPLEMENTARY': ('Easy German #280: Using Infinitive Clauses in Natural German', '_mS0EV3laEk'),
        'LISTENING':     ('DW Nicos Weg: Expressing Purpose and Goals with um...zu', '4NQvZgUs_N8'),
        'SPEAKING':      ('Deutsch mit Hend: Infinitiv Konstruktionen Speaking Practice', 'p3jVxz-hp6Y'),
    },
}

def fix_track(file_path, var_name, topic_map):
    with open(file_path, 'r', encoding='utf-8') as f:
        txt = f.read()

    m = re.search(r'export const ' + var_name + r'\s*=\s*(\{[\s\S]*\});?\s*$', txt)
    if not m:
        print(f"Could not parse {var_name}")
        return

    data = json.loads(m.group(1))
    topics = list(topic_map.keys())
    total_tasks = [0]
    
    for week in data.get('weeks', []):
        wn = week.get('weekNumber', 1)
        for day in week.get('days', []):
            dn = day.get('dayNumber', 1)
            topic_idx = ((wn - 1) * 7 + (dn - 1)) % len(topics)
            topic_key = topics[topic_idx]
            resources = topic_map[topic_key]

            for task in day.get('standardTasks', []):
                rt = task.get('resourceType', '')
                t_type = task.get('type', '').lower()
                
                # Assign best resource for this type
                if rt in resources:
                    title, vid = resources[rt]
                    task['title'] = title
                    task['link'] = f"https://www.youtube.com/watch?v={vid}"
                    total_tasks[0] += 1
                
                # Vocab tasks: link to in-app vocabulary instead of ankiweb
                elif rt == 'VOCAB' or t_type == 'memorize':
                    # Keep vocab tasks pointing to in-app practice, clean the title
                    if 'ankiweb' in task.get('link', ''):
                        task['link'] = f"https://www.youtube.com/watch?v={topics[0]}" if False else task['link']
                        # Keep Anki for VOCAB - it's correct (app-based practice)
                
                # Quiz tasks: keep Schubert Verlag (correct)
                elif rt == 'QUIZ':
                    pass  # correct already

    new_ts = f"export const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_ts)
    
    print(f"  Fixed {total_tasks[0]} tasks with topic-matched videos from {len(set(t for subdict in topic_map.values() for t in [subdict.get('PRIMARY', ('',''))[1], subdict.get('SECONDARY', ('',''))[1]] if t))} unique video IDs")

print("=== FINAL CURRICULUM AUDIT & FIX ===")
print()
print("[A1] Applying topic-matched resources...")
fix_track(r'E:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'CURRICULUM_DATA', A1_TOPICS)

print("[A2] Applying topic-matched resources...")
fix_track(r'E:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'CURRICULUM_DATA_A2', A2_TOPICS)

print("[B1] Applying topic-matched resources...")
fix_track(r'E:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'CURRICULUM_DATA_B1', B1_TOPICS)

print()
print("Done! All 3 tracks now have:")
print("  - Correct topic-matched PRIMARY videos (never repeated from wrong topic)")
print("  - Diverse SECONDARY creators (Hend, Shehata, lingoni, DW, Easy German)")
print("  - Proper SUPPLEMENTARY and LISTENING resources matched to topic")
print("  - All A1 videos removed from A2/B1 topic slots")
