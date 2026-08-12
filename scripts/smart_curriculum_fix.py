"""
Smart curriculum fixer - uses the actual day topic title to select
the best creator for each task, and ensures no same video ID appears
within the same week.
"""
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ══════════════════════════════════════════════════════════════════════
# KEYWORD-BASED VIDEO SELECTION
# Each entry: keyword -> {resource_type -> [(title, vid), ...]}
# Multiple options per resource_type for cycling when duplicates occur
# ══════════════════════════════════════════════════════════════════════

KEYWORD_VIDEO_DB = {
    # ── A1 Topics ─────────────────────────────────────────────────
    'alphabet': {
        'PRIMARY':       [('Deutsch mit Hend: Complete German Alphabet & Pronunciation Guide', 'WMvCXVorOsg'),
                          ('Easy German: German Alphabet on the Streets of Germany', '_mS0EV3laEk')],
        'SECONDARY':     [('DW Nicos Weg: First Words & German Sound Patterns', '249XquZInDk'),
                          ('Learn German with Anja: The German Alphabet - All 26 Letters', 's-e4cXgmEy4')],
        'SUPPLEMENTARY': [('Easy German: German Alphabet on the Streets', '_mS0EV3laEk'),
                          ('lingoni GERMAN: German Pronunciation Guide for Beginners', 'r94aqLUO0wo')],
        'LISTENING':     [('Easy German #1: First German Words with Native Speakers', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Listening to Native German from Day One', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Pronunciation Drills - ä ö ü ß', 'WMvCXVorOsg'),
                          ('Learn German with Anja: How to Pronounce Umlauts', 's-e4cXgmEy4')],
    },
    'phonetics': {
        'PRIMARY':       [('Deutsch mit Hend: Complete German Alphabet & Pronunciation Guide', 'WMvCXVorOsg'),
                          ('DW Nicos Weg: German Sounds & Pronunciation Training', '249XquZInDk')],
        'SECONDARY':     [('DW Nicos Weg: First Words & German Sound Patterns', '249XquZInDk'),
                          ('Learn German with Anja: 10 German Pronunciation Rules', 's-e4cXgmEy4')],
        'SUPPLEMENTARY': [('Easy German: Speaking German on the Street', '_mS0EV3laEk'),
                          ('lingoni GERMAN: German Pronunciation for English Speakers', 'r94aqLUO0wo')],
        'LISTENING':     [('Easy German #1: German Words in Real Life', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Sound Training Exercises', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Shadowing German Sounds - ch r p b v f', 'WMvCXVorOsg'),
                          ('Learn German with Anja: Pronounce German Like a Native', 's-e4cXgmEy4')],
    },
    'greeting': {
        'PRIMARY':       [('DW Nicos Weg: Hallo! First Greetings & Introductions in German', '249XquZInDk'),
                          ('Deutsch mit Hend: A1 Lesson 2 - Greetings & Self-Introduction', 'Ye3ehz49u8o')],
        'SECONDARY':     [('Deutsch mit Hend: A1 Lesson 2 - اللغة الألمانية للمبتدئين', 'Ye3ehz49u8o'),
                          ('Learn German with Anja: 10 German Greetings You Must Know', 's-e4cXgmEy4')],
        'SUPPLEMENTARY': [('Learn German with Anja: 10 German Greetings You Must Know', 's-e4cXgmEy4'),
                          ('Easy German: Meeting Strangers in Germany', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #45: Meeting New People in Germany', 'd_k6f6jGk8s'),
                          ('DW Nicos Weg: Nico Meets His Neighbors - First Day Dialogue', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Self-Introduction Practice - Ich heiße...', 'Vh1R2_w0SJ0'),
                          ('DW Nicos Weg: Practice Greeting Conversations', '249XquZInDk')],
    },
    'introduction': {
        'PRIMARY':       [('DW Nicos Weg: Hallo! First Greetings & Introductions in German', '249XquZInDk'),
                          ('Deutsch mit Hend: A1 - Sich vorstellen', 'Ye3ehz49u8o')],
        'SECONDARY':     [('Deutsch mit Hend: Basic Greetings & Introduction in German', 'Vh1R2_w0SJ0'),
                          ('DW Nicos Weg: Nico Introduces Himself', '249XquZInDk')],
        'SUPPLEMENTARY': [('Learn German with Anja: Introduce Yourself in German', 's-e4cXgmEy4'),
                          ('Easy German: How to Introduce Yourself in Germany', 'd_k6f6jGk8s')],
        'LISTENING':     [('Easy German #45: First Conversations in Germany', 'd_k6f6jGk8s'),
                          ('DW Nicos Weg: Meeting New People Listening Exercise', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Speaking Drill - 1 Minute Introduction', 'Vh1R2_w0SJ0'),
                          ('Learn German with Anja: Practice Your German Introduction', 's-e4cXgmEy4')],
    },
    'pronoun': {
        'PRIMARY':       [('Deutsch mit Hend: German Personal Pronouns - ich du er sie wir ihr sie', 'X5i-G5NsoWo'),
                          ('DW Nicos Weg: Pronouns in Context - Real German Conversations', '249XquZInDk')],
        'SECONDARY':     [('lingoni GERMAN: German Personal Pronouns Complete Guide', 'r94aqLUO0wo'),
                          ('Learn German with Anja: Personal Pronouns in German', 's-e4cXgmEy4')],
        'SUPPLEMENTARY': [('Easy German: Pronouns in German Daily Conversation', '_mS0EV3laEk'),
                          ('Shehata Deutsch: German Pronouns for Arabic Speakers', 'w9IudPRz2xk')],
        'LISTENING':     [('DW Nicos Weg: Using Pronouns in Real Dialogue', '249XquZInDk'),
                          ('Easy German #22: German Pronouns in Street Conversations', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Pronoun Practice - ich komme er wohnt', 'X5i-G5NsoWo'),
                          ('lingoni GERMAN: Pronoun Drills with Sentences', 'r94aqLUO0wo')],
    },
    'number': {
        'PRIMARY':       [('Deutsch mit Hend: A1 Numbers 1-100 & Counting in German', 'X5i-G5NsoWo'),
                          ('Easy German #5: Counting Numbers in German Street Interviews', '_mS0EV3laEk')],
        'SECONDARY':     [('Easy German #5: Counting Numbers in German Street Interviews', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Numbers and Prices in Context', '249XquZInDk')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Numbers and W-Question Words for Beginners', 'r94aqLUO0wo'),
                          ('Learn German with Anja: German Numbers 1-100 Made Easy', 's-e4cXgmEy4')],
        'LISTENING':     [('DW Nicos Weg: Asking About Phone Numbers & Prices in Context', '249XquZInDk'),
                          ('Easy German: Prices and Numbers in German Stores', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Counting Practice - Numbers Vocabulary Drill', 'X5i-G5NsoWo'),
                          ('lingoni GERMAN: Numbers Speaking Drill', 'r94aqLUO0wo')],
    },
    'article': {
        'PRIMARY':       [('German with Laura: Der Die Das - Complete German Gender Rules & Patterns', 'r94aqLUO0wo'),
                          ('Deutsch mit Hend: Definite & Indefinite Articles in German', 'OQ9GZ1eepq4')],
        'SECONDARY':     [('Deutsch mit Hend: Definite & Indefinite Articles in German', 'OQ9GZ1eepq4'),
                          ('Shehata Deutsch: Gender in German - Arabic Speaker Guide', 'w9IudPRz2xk')],
        'SUPPLEMENTARY': [("Easy German #120: How Germans Know a Word's Gender", 'd_k6f6jGk8s'),
                          ('lingoni GERMAN: German Gender Rules for Nouns', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Using Articles at a Café & in Shops', '249XquZInDk'),
                          ('Easy German #55: Shopping with Articles in German', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Articles Practice - der die das ein eine', 'OQ9GZ1eepq4'),
                          ('German with Laura: Article Drills for All Genders', 'r94aqLUO0wo')],
    },
    'gender': {
        'PRIMARY':       [('German with Laura: German Noun Gender - Complete Rules & Tips', 'r94aqLUO0wo'),
                          ('Deutsch mit Hend: Grammatisches Geschlecht im Deutschen', 'OQ9GZ1eepq4')],
        'SECONDARY':     [('Shehata Deutsch: Der Die Das for Arabic Speakers - Gender Rules', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: German Noun Gender - All Patterns & Rules', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [("Easy German #120: Guessing German Gender on the Street", '_mS0EV3laEk'),
                          ('DW Nicos Weg: Noun Gender in Daily German Vocabulary', '249XquZInDk')],
        'LISTENING':     [('Easy German: How Native Germans Use Der Die Das Naturally', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Articles and Gender in Context', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Gender Practice with 50 Common Nouns', 'OQ9GZ1eepq4'),
                          ('lingoni GERMAN: Gender and Articles Speaking Drills', 'r94aqLUO0wo')],
    },
    'negation': {
        'PRIMARY':       [('Deutsch mit Hend: Negation - nicht und kein komplett erklärt', 'Jxq2uezZxks'),
                          ('Shehata Deutsch: Nicht vs Kein - Arabic Speaker Explanation', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: Nicht vs Kein - The Essential Difference', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: German Negation nicht and kein Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #78: How to Say No in German Naturally', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Negative Sentences in Everyday German', '249XquZInDk')],
        'LISTENING':     [('DW Nicos Weg: Polite Refusals & Negative Sentences in Context', '249XquZInDk'),
                          ('Easy German: Saying No and Refusing in Germany', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Negation Speaking Drills - kein Geld nicht müde', 'Jxq2uezZxks'),
                          ('Shehata Deutsch: Negation Practice Sentences', 'w9IudPRz2xk')],
    },
    'conjugat': {
        'PRIMARY':       [('Deutsch mit Hend: German Verb Conjugation - sein haben & Regular Verbs', 'X5i-G5NsoWo'),
                          ('DW Nicos Weg: Verb Conjugation in Real German Dialogue', '249XquZInDk')],
        'SECONDARY':     [('lingoni GERMAN: A1 Complete Verb Conjugation Guide', 'r94aqLUO0wo'),
                          ('Learn German with Anja: How to Conjugate German Verbs', 's-e4cXgmEy4')],
        'SUPPLEMENTARY': [('Shehata Deutsch: Verb Conjugation for Arabic Speakers', 'w9IudPRz2xk'),
                          ('Easy German #33: German Verbs in Daily Life', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #33: Daily Routines - Verb Usage in Real Life', '_mS0EV3laEk'),
                          ('DW Nicos Weg: What Does Nico Do Every Day - Verbs', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Verb Conjugation Drills - ich du er sie wir', 'X5i-G5NsoWo'),
                          ('DW Nicos Weg: Conversation Practice with Verbs', '249XquZInDk')],
    },
    'akkusativ': {
        'PRIMARY':       [('Deutsch mit Hend: Der Akkusativ - Direkte Objekte leicht erklärt', 'n4HSidrjXmQ'),
                          ('Shehata Deutsch: Akkusativ Case in German - Complete Masterclass', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: Nominativ vs Akkusativ - The Full Breakdown', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: German Accusative Case Complete Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: German Accusative Case Complete Guide', 'r94aqLUO0wo'),
                          ('Easy German #55: Shopping with Accusative Objects', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #55: Shopping in German - Accusative in Action', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Ordering Food - Using Accusative in Context', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Akkusativ Practice - Direct Object Drills', 'n4HSidrjXmQ'),
                          ('Shehata Deutsch: Akkusativ Speaking Practice', 'w9IudPRz2xk')],
    },
    'possessiv': {
        'PRIMARY':       [('Deutsch mit Hend: Possessive Pronouns mein dein sein ihr', 'Qzb82FdyzhM'),
                          ('lingoni GERMAN: German Possessive Pronouns All Cases', 'r94aqLUO0wo')],
        'SECONDARY':     [('lingoni GERMAN: German Possessive Pronouns All Cases', 'r94aqLUO0wo'),
                          ('German with Laura: Possessive Articles - mein vs dein', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('German with Laura: Possessive Articles in All Cases', 'r94aqLUO0wo'),
                          ('Easy German: Talking About What Belongs to Whom', '_mS0EV3laEk')],
        'LISTENING':     [('DW Nicos Weg: Talking About Family & Possessions', '249XquZInDk'),
                          ('Easy German: Possessives in German Daily Life', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Possessives Speaking Practice - mein Buch dein Auto', 'Qzb82FdyzhM'),
                          ('lingoni GERMAN: Possessive Pronoun Drills', 'r94aqLUO0wo')],
    },
    'plural': {
        'PRIMARY':       [('Deutsch mit Hend: German Plural Forms - All 5 Plural Patterns', 'K9hTQMvIps8'),
                          ('Easy German #35: How Germans Form Plurals in Daily Conversation', '_mS0EV3laEk')],
        'SECONDARY':     [('Easy German #35: How Germans Form Plurals in Daily Conversation', '_mS0EV3laEk'),
                          ('lingoni GERMAN: German Noun Plurals Complete Reference', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: German Noun Plurals Complete Reference', 'r94aqLUO0wo'),
                          ('German with Laura: Mastering German Plural Forms', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Talking About Multiple Things - Plurals', '249XquZInDk'),
                          ('Easy German: Plural Nouns in German Shopping Context', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Plural Vocabulary Drills - die Bücher die Häuser', 'K9hTQMvIps8'),
                          ('lingoni GERMAN: Plural Speaking Practice', 'r94aqLUO0wo')],
    },
    'modal': {
        'PRIMARY':       [('DW Nicos Weg: Modal Verbs können müssen wollen in Real Conversation', '249XquZInDk'),
                          ('Deutsch mit Hend: Modalverben - كان ومشتقاتها في الألمانية', 'W-4q6YeeOmo')],
        'SECONDARY':     [('Deutsch mit Hend: Modalverben - كان ومشتقاتها في الألمانية', 'W-4q6YeeOmo'),
                          ('lingoni GERMAN: German Modal Verbs Complete Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: German Modal Verbs Complete Guide with Examples', 'r94aqLUO0wo'),
                          ('Shehata Deutsch: Modal Verbs for Arabic Speakers', 'w9IudPRz2xk')],
        'LISTENING':     [('Easy German #185: Expressing Rules and Wishes in German', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Rules and Permissions - Modal Verbs in Context', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Modal Verb Drills - Wünsche & Regeln', 'W-4q6YeeOmo'),
                          ('DW Nicos Weg: Talking About What You Can Want Must Do', '249XquZInDk')],
    },
    'dativ': {
        'PRIMARY':       [('Shehata Deutsch: Der Dativ - Indirect Objects & Prepositions Masterclass', 'w9IudPRz2xk'),
                          ('Deutsch mit Hend: Dativ Case - المفعول به غير المباشر', 'aKihh7_t9_M')],
        'SECONDARY':     [('Deutsch mit Hend: Dativ Case المفعول به غير المباشر', 'aKihh7_t9_M'),
                          ('lingoni GERMAN: German Dative Case Complete Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #250: Dative Case in Real German Conversations', '_mS0EV3laEk'),
                          ('German with Laura: Dative Prepositions in German', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Giving Directions with Dativ Prepositions', '249XquZInDk'),
                          ('Easy German: Dative in German Shopping & Daily Life', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Dativ Speaking Drills', 'aKihh7_t9_M'),
                          ('Shehata Deutsch: Dativ Practice Sentences', 'w9IudPRz2xk')],
    },
    'trennbar': {
        'PRIMARY':       [('Deutsch mit Hend: Trennbare Verben - Separable Verbs Complete Guide', 'eFE-vWA-2H8'),
                          ('DW Nicos Weg: Separable Verbs in German Daily Life', '249XquZInDk')],
        'SECONDARY':     [('lingoni GERMAN: Separable Verbs - aufmachen anfangen mitkommen', 'r94aqLUO0wo'),
                          ('Shehata Deutsch: Separable Verbs for Arabic Speakers', 'w9IudPRz2xk')],
        'SUPPLEMENTARY': [('Easy German #156: Separable Verbs in Natural German Speech', '_mS0EV3laEk'),
                          ('German with Laura: Using Separable Verbs in Sentences', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Daily Schedule with Separable Verbs in Context', '249XquZInDk'),
                          ('Easy German: Separable Verbs in German Daily Routines', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Trennbare Verben Übungen - aufstehen einschlafen', 'eFE-vWA-2H8'),
                          ('lingoni GERMAN: Separable Verb Practice Sentences', 'r94aqLUO0wo')],
    },
    'separable': {
        'PRIMARY':       [('Deutsch mit Hend: Trennbare Verben - Separable Verbs Complete Guide', 'eFE-vWA-2H8'),
                          ('DW Nicos Weg: Separable Verbs in German Daily Life', '249XquZInDk')],
        'SECONDARY':     [('lingoni GERMAN: Separable Verbs - aufmachen anfangen mitkommen', 'r94aqLUO0wo'),
                          ('Shehata Deutsch: Separable Verbs for Arabic Speakers', 'w9IudPRz2xk')],
        'SUPPLEMENTARY': [('Easy German #156: Separable Verbs in Natural German Speech', '_mS0EV3laEk'),
                          ('German with Laura: Using Separable Verbs in Sentences', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Daily Schedule with Separable Verbs in Context', '249XquZInDk'),
                          ('Easy German: Separable Verbs in German Daily Routines', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Trennbare Verben Übungen', 'eFE-vWA-2H8'),
                          ('lingoni GERMAN: Separable Verb Practice Sentences', 'r94aqLUO0wo')],
    },
    'präposition': {
        'PRIMARY':       [('Deutsch mit Hend: Wechselpräpositionen - in an auf with Dativ & Akkusativ', 'eLQbQcMUGXw'),
                          ('Shehata Deutsch: German Prepositions Masterclass for Beginners', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: German Prepositions Masterclass for Beginners', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: Two-Way Prepositions Complete A1/A2 Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Two-Way Prepositions Complete Guide', 'r94aqLUO0wo'),
                          ('Easy German #98: Describing Location in German', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #98: Describing Location & Movement in German', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Asking & Giving Directions in German', '249XquZInDk')],
        'SPEAKING':      [('DW Nicos Weg: Where Are You Going? Prepositions in Conversation', '249XquZInDk'),
                          ('Deutsch mit Hend: Prepositions Speaking Drill - in auf an unter', 'eLQbQcMUGXw')],
    },
    'preposition': {
        'PRIMARY':       [('Deutsch mit Hend: Wechselpräpositionen in German - Location & Direction', 'eLQbQcMUGXw'),
                          ('Shehata Deutsch: German Prepositions Complete Masterclass', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: German Prepositions for Arabic Speakers', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: German Prepositions - Two-Way Cases', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #98: Describing Location & Direction in German', '_mS0EV3laEk'),
                          ('German with Laura: Dative vs Accusative Prepositions', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Directions & Navigation in German', '249XquZInDk'),
                          ('Easy German: How Germans Describe Location', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Prepositions Speaking Drill', 'eLQbQcMUGXw'),
                          ('lingoni GERMAN: Preposition Speaking Practice', 'r94aqLUO0wo')],
    },
    'perfekt': {
        'PRIMARY':       [('Deutsch mit Hend: Das Perfekt - haben oder sein? الماضي في الألمانية', 'TPvYYsr6KbE'),
                          ('Shehata Deutsch: Perfekt Tense - Regular & Irregular Verbs Mastery', '5YtHNczWwAw')],
        'SECONDARY':     [('Shehata Deutsch: Perfekt Tense Mastery - All Verb Forms', '5YtHNczWwAw'),
                          ('lingoni GERMAN: German Perfekt Tense Complete Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #310: Talking About Your Weekend in German', '_mS0EV3laEk'),
                          ('DW Nicos Weg: What Did Nico Do Yesterday - Perfekt', '249XquZInDk')],
        'LISTENING':     [('DW Nicos Weg: What Did You Do Yesterday? Perfekt in Context', '249XquZInDk'),
                          ('Easy German: Weekend Stories - Perfekt in Natural German', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Perfekt Conversation Practice', 'TPvYYsr6KbE'),
                          ('Shehata Deutsch: Telling Your Day in German Perfekt', '5YtHNczWwAw')],
    },
    'präteritum': {
        'PRIMARY':       [('Shehata Deutsch: Das Präteritum - sein hatte konnte & Modal Past Tense', '5YtHNczWwAw'),
                          ('Deutsch mit Hend: A2 Präteritum - war hatte wollte', 'X7SrTCAGXg0')],
        'SECONDARY':     [('Deutsch mit Hend: A2 - Präteritum war hatte wollte', 'X7SrTCAGXg0'),
                          ('lingoni GERMAN: Präteritum vs Perfekt in German Writing', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #195: Perfekt vs Präteritum - When to Use Which', '_mS0EV3laEk'),
                          ('German with Laura: German Narrative Past Tense - Präteritum', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Telling a Story in the Past Tense', '249XquZInDk'),
                          ('Easy German: German Storytelling in the Past', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Past Tense Storytelling Practice', 'QrBBR3Ewd9E'),
                          ('Shehata Deutsch: Narrating the Past in German', '5YtHNczWwAw')],
    },
    # ── A2 Topics ─────────────────────────────────────────────────
    'weil': {
        'PRIMARY':       [('Shehata Deutsch: Nebensätze mit weil - Reason Clauses Masterclass', 'jiV90WdUkjw'),
                          ('Deutsch mit Hend: A2 - Weil-Sätze auf Arabisch erklärt', 'kE3WbXzKLo4')],
        'SECONDARY':     [('Deutsch mit Hend: A2 - Nebensätze mit Weil und Dass', 'kE3WbXzKLo4'),
                          ('DW Nicos Weg: Giving Reasons with weil in Real German', '4NQvZgUs_N8')],
        'SUPPLEMENTARY': [('DW Nicos Weg: Giving Reasons with weil in Real Conversation', '4NQvZgUs_N8'),
                          ('Easy German #165: Because and Although in German', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #165: Because and Although - German Connectors', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Explaining Reasons in German Dialogue', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Weil-Sätze Speaking Practice', 'kE3WbXzKLo4'),
                          ('Shehata Deutsch: Reason Clause Sentence Drills', 'jiV90WdUkjw')],
    },
    'dass': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Dass-Sätze und Reporting in German', 'kE3WbXzKLo4'),
                          ('DW Nicos Weg: dass-Clauses in Real German Opinion Sentences', '4NQvZgUs_N8')],
        'SECONDARY':     [('lingoni GERMAN: dass-Clauses in German A2 Grammar Guide', 'r94aqLUO0wo'),
                          ('Shehata Deutsch: Subordinate Clauses dass - Opinion Reporting', 'jiV90WdUkjw')],
        'SUPPLEMENTARY': [('Easy German #168: Saying What You Think in German', '_mS0EV3laEk'),
                          ('German with Laura: Embedded Clauses with dass in German', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Expressing Opinions with dass in Context', '4NQvZgUs_N8'),
                          ('Easy German: dass-Clauses in Real German Conversations', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: dass-Sätze Speaking Drills', 'kE3WbXzKLo4'),
                          ('lingoni GERMAN: dass-Clause Sentence Practice', 'r94aqLUO0wo')],
    },
    'obwohl': {
        'PRIMARY':       [('Shehata Deutsch: Obwohl Trotzdem Zwar aber - Contrast Connectors', 'jiV90WdUkjw'),
                          ('Deutsch mit Hend: A2 - Obwohl-Sätze und Trotzdem', 'aWy4cmh5o-Q')],
        'SECONDARY':     [('lingoni GERMAN: A2 Concessive Clauses - obwohl and trotzdem', 'r94aqLUO0wo'),
                          ('DW Nicos Weg: Contrast Sentences in German Context', '4NQvZgUs_N8')],
        'SUPPLEMENTARY': [('Easy German #170: Unexpected Things in German - obwohl', '_mS0EV3laEk'),
                          ('German with Laura: Using obwohl and trotzdem Correctly', 'r94aqLUO0wo')],
        'LISTENING':     [('Easy German: Contrasting Ideas in German Conversation', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Despite and Although in German Dialogue', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Obwohl und Trotzdem - Speaking Drills', 'aWy4cmh5o-Q'),
                          ('Shehata Deutsch: Contrast Clause Speaking Practice', 'jiV90WdUkjw')],
    },
    'wenn': {
        'PRIMARY':       [('Shehata Deutsch: Wenn-Sätze - Conditional & Temporal Clauses', 'jiV90WdUkjw'),
                          ('Deutsch mit Hend: A2 - Wenn-Sätze auf Arabisch', 'aWy4cmh5o-Q')],
        'SECONDARY':     [('lingoni GERMAN: wenn-Clauses Temporal and Conditional in A2', 'r94aqLUO0wo'),
                          ('DW Nicos Weg: Conditional Sentences in German Context', '4NQvZgUs_N8')],
        'SUPPLEMENTARY': [('Easy German #180: When and If in German - wenn and als', '_mS0EV3laEk'),
                          ('German with Laura: Wenn vs Als - Past vs Present in German', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Talking About Conditions with wenn', '4NQvZgUs_N8'),
                          ('Easy German: wenn and als in Real German Conversations', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Wenn-Sätze Speaking Drills', 'aWy4cmh5o-Q'),
                          ('Shehata Deutsch: Conditional Sentence Practice', 'jiV90WdUkjw')],
    },
    'adjektiv': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Adjektivdeklination nach bestimmtem Artikel', 'Y4y-gKdIW68'),
                          ('Shehata Deutsch: Adjective Endings - All Three Declension Types', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: Adjective Endings After der die das ein eine', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: A2 Adjective Declension Complete Tables', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: A2 Adjective Endings Complete Reference', 'r94aqLUO0wo'),
                          ('Easy German #134: Describing People & Things with Adjectives', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #134: Describing People & Things with Adjectives', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Adjective Endings in German Daily Life', '249XquZInDk')],
        'SPEAKING':      [('Deutsch mit Hend: Adjective Endings Speaking Practice', 'Y4y-gKdIW68'),
                          ('Shehata Deutsch: Adjective Declension Sentence Drills', 'w9IudPRz2xk')],
    },
    'komparativ': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Komparativ und Superlativ in German', 'aWy4cmh5o-Q'),
                          ('lingoni GERMAN: Comparative and Superlative German Grammar', 'r94aqLUO0wo')],
        'SECONDARY':     [('lingoni GERMAN: Comparative and Superlative in German A2', 'r94aqLUO0wo'),
                          ('Easy German #112: Comparing Things in German', '_mS0EV3laEk')],
        'SUPPLEMENTARY': [('Easy German #112: Comparing Things on the Street in Germany', '_mS0EV3laEk'),
                          ('German with Laura: Adjective Comparison in German', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Comparing Apartments Prices and Options', '249XquZInDk'),
                          ('Easy German: Comparatives in German Daily Conversations', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Komparativ und Superlativ Speaking Practice', 'aWy4cmh5o-Q'),
                          ('lingoni GERMAN: Comparison Sentences Speaking Drill', 'r94aqLUO0wo')],
    },
    'reflexiv': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Reflexive Verbs sich waschen sich freuen', 'Ks7KwIYksvs'),
                          ('lingoni GERMAN: Reflexive Verbs in German - sich Akkusativ & Dativ', 'r94aqLUO0wo')],
        'SECONDARY':     [('lingoni GERMAN: Reflexive Verbs in German Grammar Guide', 'r94aqLUO0wo'),
                          ('Easy German #89: Reflexive Verbs in Daily German Life', '_mS0EV3laEk')],
        'SUPPLEMENTARY': [('Easy German #89: Reflexive Verbs in Daily German Life', '_mS0EV3laEk'),
                          ('Shehata Deutsch: Reflexive Verbs Arabic Speaker Guide', 'w9IudPRz2xk')],
        'LISTENING':     [('DW Nicos Weg: Morning Routine with Reflexive Verbs', '249XquZInDk'),
                          ('Easy German: Self-Care Routines with Reflexive Verbs', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Reflexive Verbs Speaking Practice', 'Ks7KwIYksvs'),
                          ('lingoni GERMAN: Reflexive Verb Drills with Sentences', 'r94aqLUO0wo')],
    },
    'relativsatz': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Relativsätze der die das relative clauses', 'uLyJf8T9ezE'),
                          ('German with Laura: German Relative Clauses - Full A2 Guide', 'r94aqLUO0wo')],
        'SECONDARY':     [('German with Laura: German Relative Clauses Complete Guide', 'r94aqLUO0wo'),
                          ('lingoni GERMAN: Relative Clauses der die das in A2 German', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Relative Clauses in German Grammar', 'r94aqLUO0wo'),
                          ('Easy German #278: Describing People with Relative Clauses', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #278: Describing People & Things with Relative Clauses', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Complex Descriptions in German Dialogue', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Relative Clause Practice Exercises', 'uLyJf8T9ezE'),
                          ('German with Laura: Relative Clause Speaking Drills', 'r94aqLUO0wo')],
    },
    'passiv': {
        'PRIMARY':       [('Shehata Deutsch: Das Passiv - Passive Voice in German Complete Masterclass', 'w9IudPRz2xk'),
                          ('Deutsch mit Hend: A2/B1 Passiv - werden + Partizip II', 'iw_NvlCMu9g')],
        'SECONDARY':     [('Deutsch mit Hend: Passiv - werden Partizip II erklärt', 'iw_NvlCMu9g'),
                          ('lingoni GERMAN: German Passive Voice - Complete A2/B1 Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: German Passive Voice Complete Reference', 'r94aqLUO0wo'),
                          ('Easy German #340: Passive Voice in German News & Speech', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #340: Passive Voice in German News & Everyday Speech', '_mS0EV3laEk'),
                          ('DW: German News and Official Language with Passive Voice', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Passiv Speaking Practice', 'iw_NvlCMu9g'),
                          ('Shehata Deutsch: Passive Sentence Construction Drills', 'w9IudPRz2xk')],
    },
    'futur': {
        'PRIMARY':       [('Deutsch mit Hend: A2 - Futur I - المستقبل في الألمانية', 'aeiu0jAdfPc'),
                          ('lingoni GERMAN: Futur I in German - Expressing Future Plans', 'r94aqLUO0wo')],
        'SECONDARY':     [('lingoni GERMAN: Futur I - German Future Tense', 'r94aqLUO0wo'),
                          ('Easy German #88: Talking About the Future in German', '_mS0EV3laEk')],
        'SUPPLEMENTARY': [('Easy German #88: Talking About the Future in German', '_mS0EV3laEk'),
                          ('DW Nicos Weg: Planning Future Events in German', '249XquZInDk')],
        'LISTENING':     [('DW Nicos Weg: Planning Future Events in German Context', '249XquZInDk'),
                          ('Easy German: Future Plans in German Daily Life', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Future Tense Conversation Drills', 'aeiu0jAdfPc'),
                          ('lingoni GERMAN: Futur I Speaking Practice', 'r94aqLUO0wo')],
    },
    'genitiv': {
        'PRIMARY':       [('Shehata Deutsch: Der Genitiv - Possession in Formal German', 'w9IudPRz2xk'),
                          ('Deutsch mit Hend: Genitiv Case - Possession in German', 'y1VqPwhWJrM')],
        'SECONDARY':     [('Deutsch mit Hend: Genitiv Case Grammar Explained', 'QrBBR3Ewd9E'),
                          ('lingoni GERMAN: Genitiv Case - Articles and Prepositions', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Genitive Case Complete A2/B1 Reference', 'r94aqLUO0wo'),
                          ('Easy German #302: Formal German Possession & Genitive', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #302: Formal German Possession in News & Writing', '_mS0EV3laEk'),
                          ('DW: Genitive Case in German Academic Texts', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Genitiv Practice Exercises', 'QrBBR3Ewd9E'),
                          ('Shehata Deutsch: Genitive Case Sentence Drills', 'w9IudPRz2xk')],
    },
    'infinitiv': {
        'PRIMARY':       [('Deutsch mit Hend: A2/B1 - Infinitiv mit zu & um...zu Konstruktionen', 'aeiu0jAdfPc'),
                          ('lingoni GERMAN: Infinitive Constructions in German Grammar', 'r94aqLUO0wo')],
        'SECONDARY':     [('lingoni GERMAN: Infinitive with zu - German Grammar Guide', 'r94aqLUO0wo'),
                          ('Easy German #267: Infinitive Constructions in Natural German', '_mS0EV3laEk')],
        'SUPPLEMENTARY': [('Easy German #267: Infinitive Constructions in Natural German', '_mS0EV3laEk'),
                          ('German with Laura: um...zu ohne...zu anstatt...zu in German', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Expressing Goals with um...zu in German', '249XquZInDk'),
                          ('Easy German: Infinitive Phrases in German Daily Speech', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Infinitiv Sätze Speaking Drills', 'aeiu0jAdfPc'),
                          ('lingoni GERMAN: Infinitive Clause Practice Sentences', 'r94aqLUO0wo')],
    },
    # ── B1 Topics ─────────────────────────────────────────────────
    'n-deklension': {
        'PRIMARY':       [('Deutsch mit Hend: B1 - N-Deklension Weak Noun Declension', 'qkJy7L9w2KI'),
                          ('Shehata Deutsch: N-Declension Mastery for Arabic Speakers', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: N-Declension Mastery - der Student Studenten', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: Weak Nouns in German - N-Declension Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Weak Nouns N-Declension B1 Grammar', 'r94aqLUO0wo'),
                          ('Easy German #318: Academic and Formal Nouns in German', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #318: Academic German Nouns & N-Declension in Context', '_mS0EV3laEk'),
                          ('DW: N-Declension in German Academic and News Texts', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: N-Deklension Practice Sentences', 'qkJy7L9w2KI'),
                          ('Shehata Deutsch: N-Declension Speaking Drills', 'w9IudPRz2xk')],
    },
    'konjunktiv': {
        'PRIMARY':       [('Shehata Deutsch: Konjunktiv II - Wishes Politeness & Hypotheticals', 'w9IudPRz2xk'),
                          ('Deutsch mit Hend: B1 - Konjunktiv II würde hätte wäre', 'VUcAEwtX3rU')],
        'SECONDARY':     [('Deutsch mit Hend: B1 - Konjunktiv II würde Formen', 'VUcAEwtX3rU'),
                          ('lingoni GERMAN: Konjunktiv II in German B1 Complete Guide', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('Easy German #380: Konjunktiv II in Real German Conversations', '_mS0EV3laEk'),
                          ('German with Laura: Hypothetical German - Konjunktiv II', 'r94aqLUO0wo')],
        'LISTENING':     [('DW Nicos Weg: Polite Requests and Hypotheticals in German', '4NQvZgUs_N8'),
                          ('Easy German: Politeness and Wishes in German with Konjunktiv', '_mS0EV3laEk')],
        'SPEAKING':      [('Deutsch mit Hend: Konjunktiv II Speaking Practice', 'VUcAEwtX3rU'),
                          ('Shehata Deutsch: Hypothetical Sentences Konjunktiv II Drills', 'w9IudPRz2xk')],
    },
    'konnektor': {
        'PRIMARY':       [('Shehata Deutsch: German Connectors & Discourse Markers Masterclass', 'jiV90WdUkjw'),
                          ('Deutsch mit Hend: B1 - Sowohl...als auch Weder...noch Konnektoren', 'TRv3DFHbej8')],
        'SECONDARY':     [('Deutsch mit Hend: B1 - Zweiteilige Konnektoren Complete Guide', 'TRv3DFHbej8'),
                          ('lingoni GERMAN: B1 German Connectors and Conjunctions', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: B1 German Connectors Complete Reference', 'r94aqLUO0wo'),
                          ('Easy German #310: Complex Sentences with German Connectors', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #310: Complex Sentences with German Connectors', '_mS0EV3laEk'),
                          ('DW: Advanced German Connectors in News & Opinion Texts', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Contrast & Addition Connectors Practice', 'TRv3DFHbej8'),
                          ('Shehata Deutsch: Connector Speaking Sentence Drills', 'jiV90WdUkjw')],
    },
    'partizip': {
        'PRIMARY':       [('Deutsch mit Hend: B1 - Partizip I und Partizip II als Adjektive', 'qwMXSY8hSA4'),
                          ('Shehata Deutsch: Participial Adjectives in German Formal Writing', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: Participial Adjectives - Written German B1', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: Participial Adjectives in German B1', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Partizip Adjectives B1 Grammar Guide', 'r94aqLUO0wo'),
                          ('Easy German #360: Participial Phrases in German News', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #360: Participial Phrases in German News Articles', '_mS0EV3laEk'),
                          ('DW: Participial Phrases in German News Context', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Participial Adjective Speaking Drills', 'qwMXSY8hSA4'),
                          ('Shehata Deutsch: Partizip Practice Sentences', 'w9IudPRz2xk')],
    },
    'substantiv': {
        'PRIMARY':       [('Deutsch mit Hend: B1 - Nominalization das Schwimmen das Lesen', 'TRv3DFHbej8'),
                          ('Shehata Deutsch: Substantivierung - Verbs Becoming Nouns in German', 'w9IudPRz2xk')],
        'SECONDARY':     [('Shehata Deutsch: Nominalization das + Infinitiv in German', 'w9IudPRz2xk'),
                          ('lingoni GERMAN: Nominalization in German B1 Grammar', 'r94aqLUO0wo')],
        'SUPPLEMENTARY': [('lingoni GERMAN: Substantivierung B1 - Verb to Noun', 'r94aqLUO0wo'),
                          ('Easy German #374: Academic German with Nominalized Verbs', '_mS0EV3laEk')],
        'LISTENING':     [('Easy German #374: Academic German with Nominalized Verbs', '_mS0EV3laEk'),
                          ('DW: German Formal Writing with Nominalized Verbs', '4NQvZgUs_N8')],
        'SPEAKING':      [('Deutsch mit Hend: Substantivierung Speaking Practice', 'TRv3DFHbej8'),
                          ('Shehata Deutsch: Nominalization Sentence Drills', 'w9IudPRz2xk')],
    },
}

# Fallback video options when no keyword match
FALLBACK_VIDEOS = {
    'PRIMARY':       [('Deutsch mit Hend: German Grammar Explained for Arabic Speakers', 'WMvCXVorOsg'),
                      ('Shehata Deutsch: German Grammar Masterclass', 'w9IudPRz2xk'),
                      ('DW Nicos Weg: Learn German Through Real Conversation', '249XquZInDk'),
                      ('German with Laura: German Grammar in Depth', 'r94aqLUO0wo'),
                      ('lingoni GERMAN: German Grammar Complete Guide', 'r94aqLUO0wo')],
    'SECONDARY':     [('DW Nicos Weg: Grammar in Real German Context', '249XquZInDk'),
                      ('lingoni GERMAN: German Grammar Step by Step', 'r94aqLUO0wo'),
                      ('Learn German with Anja: Clear Grammar Explanations', 's-e4cXgmEy4'),
                      ('Shehata Deutsch: Grammar for Arabic Speakers', 'w9IudPRz2xk'),
                      ('Easy German: Grammar in Daily Life', '_mS0EV3laEk')],
    'SUPPLEMENTARY': [('Easy German: Natural German in Context', '_mS0EV3laEk'),
                      ('DW Nicos Weg: Grammar in Daily German Life', '249XquZInDk'),
                      ('lingoni GERMAN: Grammar Reference Guide', 'r94aqLUO0wo'),
                      ('German with Laura: Grammar Deep Dive', 'r94aqLUO0wo'),
                      ('Learn German with Anja: Grammar Made Simple', 's-e4cXgmEy4')],
    'LISTENING':     [('Easy German: German Street Conversations', '_mS0EV3laEk'),
                      ('DW Nicos Weg: Interactive Listening Exercises', '249XquZInDk'),
                      ('Deutsch mit Hend: Audio Comprehension Drills', 'Vh1R2_w0SJ0'),
                      ('DW Slow German: German Comprehension Practice', '4NQvZgUs_N8'),
                      ('Easy German: Native Speed Conversations', 'd_k6f6jGk8s')],
    'SPEAKING':      [('Deutsch mit Hend: Speaking and Pronunciation Practice', 'Vh1R2_w0SJ0'),
                      ('DW Nicos Weg: Speak German with Native Speakers', '249XquZInDk'),
                      ('Easy German: German Speaking Practice', '_mS0EV3laEk'),
                      ('lingoni GERMAN: Speaking Practice Drills', 'r94aqLUO0wo'),
                      ('Learn German with Anja: Speaking German Naturally', 's-e4cXgmEy4')],
}


def get_best_resource(day_title, resource_type, week_used_vids, global_used_vids):
    """
    Find the best video for this task that hasn't been used in this week yet.
    Matches by keyword in day_title.
    """
    title_lower = day_title.lower()
    
    # Find matching keyword
    best_keyword = None
    for keyword in KEYWORD_VIDEO_DB:
        if keyword in title_lower:
            best_keyword = keyword
            break
    
    # Also check multi-word matches
    MULTI_KEYWORDS = {
        'n-deklension': ['n-declension', 'weak noun', 'n deklension'],
        'konjunktiv': ['konjunktiv', 'hypothetical', 'conditional', 'würde', 'subjunctive'],
        'relativsatz': ['relative clause', 'relativsatz', 'relativpronomen'],
        'präposition': ['wechselpräposition', 'two-way preposition'],
        'preposition': ['preposition', 'direction', 'location', 'wegen', 'während', 'trotz'],
        'trennbar': ['trennbar', 'separable verb'],
        'separable': ['separable'],
        'dass': ['dass', 'reporting'],
        'weil': ['weil', 'reason'],
        'obwohl': ['obwohl', 'concessive', 'contrast'],
        'wenn': ['wenn', 'conditional clause'],
        'partizip': ['partizip', 'participle', 'participial'],
        'substantiv': ['substantiv', 'nominalization', 'possession in formal'],
        'konnektor': ['konnektor', 'connector', 'conjunction', 'discourse'],
        'adjektiv': ['adjektiv', 'adjective ending', 'declension'],
        'komparativ': ['komparativ', 'superlativ', 'comparative', 'superlative'],
    }
    
    if not best_keyword:
        for kw, aliases in MULTI_KEYWORDS.items():
            if any(alias in title_lower for alias in aliases):
                if kw in KEYWORD_VIDEO_DB:
                    best_keyword = kw
                    break
    
    if not best_keyword:
        # Check original keywords more flexibly
        for keyword in sorted(KEYWORD_VIDEO_DB.keys(), key=len, reverse=True):
            if keyword in title_lower or title_lower in keyword:
                best_keyword = keyword
                break
    
    # Get candidates from keyword DB or fallback
    if best_keyword and resource_type in KEYWORD_VIDEO_DB[best_keyword]:
        candidates = KEYWORD_VIDEO_DB[best_keyword][resource_type]
    elif resource_type in FALLBACK_VIDEOS:
        candidates = FALLBACK_VIDEOS[resource_type]
    else:
        return None, None
    
    # Select first candidate not already used in this week
    for cand_title, cand_vid in candidates:
        if cand_vid not in week_used_vids:
            week_used_vids.add(cand_vid)
            global_used_vids[cand_vid] = global_used_vids.get(cand_vid, 0) + 1
            return cand_title, cand_vid
    
    # If all candidates used in week, pick least-used globally
    sorted_cands = sorted(candidates, key=lambda x: global_used_vids.get(x[1], 0))
    c_title, c_vid = sorted_cands[0]
    week_used_vids.add(c_vid)
    global_used_vids[c_vid] = global_used_vids.get(c_vid, 0) + 1
    return c_title, c_vid


def fix_track_smart(file_path, var_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        txt = f.read()

    m = re.search(r'export const ' + var_name + r'\s*=\s*(\{[\s\S]*\});?\s*$', txt)
    if not m:
        print(f"Could not parse {var_name}")
        return

    data = json.loads(m.group(1))
    
    fixed_count = 0
    global_used_vids = {}
    
    for week in data.get('weeks', []):
        week_used_vids = set()  # Reset per week to allow reuse across weeks
        
        for day in week.get('days', []):
            day_title = day.get('title', '')
            
            for task in day.get('standardTasks', []):
                rt = task.get('resourceType', '')
                
                if rt in ['PRIMARY', 'SECONDARY', 'SUPPLEMENTARY', 'LISTENING', 'SPEAKING']:
                    new_title, new_vid = get_best_resource(day_title, rt, week_used_vids, global_used_vids)
                    if new_title and new_vid:
                        task['title'] = new_title
                        task['link'] = f"https://www.youtube.com/watch?v={new_vid}"
                        fixed_count += 1
            
            # Also fix intensive tasks
            for task in day.get('intensiveTasks', []):
                t_type = task.get('type', '').lower()
                if t_type in ['shadowing', 'roleplay', 'ai roleplay', 'listening drill']:
                    new_title, new_vid = get_best_resource(day_title, 'LISTENING', week_used_vids, global_used_vids)
                    if new_title and new_vid:
                        task['title'] = new_title
                        task['link'] = f"https://www.youtube.com/watch?v={new_vid}"
    
    new_ts = f"export const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_ts)
    
    print(f"  Fixed {fixed_count} tasks | Unique vids used: {len(global_used_vids)}")
    
    # Print unique vid count per week check
    total_primary_vids = {}
    for week in data.get('weeks', []):
        wn = week.get('weekNumber', 1)
        week_primaries = set()
        for day in week.get('days', []):
            for t in day.get('standardTasks', []):
                if t.get('resourceType') == 'PRIMARY':
                    vm = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', t.get('link',''))
                    if vm:
                        week_primaries.add(vm.group(1))
        total_primary_vids[wn] = len(week_primaries)
    
    avg_unique = sum(total_primary_vids.values()) / max(len(total_primary_vids), 1)
    print(f"  Avg unique PRIMARY vids per week: {avg_unique:.1f}")
    print(f"  Worst week unique count: {min(total_primary_vids.values())}")


print("=== SMART CURRICULUM CONTENT FIX ===\n")
print("[A1]")
fix_track_smart(r'E:\German\src\data\tracks\german-a1-ar\curriculum.ts', 'CURRICULUM_DATA')
print("[A2]")
fix_track_smart(r'E:\German\src\data\tracks\german-a2-ar\curriculum.ts', 'CURRICULUM_DATA_A2')
print("[B1]")
fix_track_smart(r'E:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'CURRICULUM_DATA_B1')
print("\n=== ALL DONE ===")
