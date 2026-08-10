export const GRAMMAR_DATA = {
  title: "Interactive German A1 Grammar System",
  description: "18 comprehensive A1 grammar modules covering rules, formulas, examples, mini-quizzes, real-life applications, and mastery status tracking.",
  modules: [
    {
      id: "g1",
      title: "1. Sentence Structure & The V2 Rule (موقع الفعل الثاني)",
      summary: "In German main clauses (Hauptsatz), the conjugated verb MUST ALWAYS take position 2.",
      explanation: "قاعدة V2 الذهبية: في الجمل الرئيسية بالألمانية، يأتي الفعل المصرف دائماً في المرتبة الثانية من الجملة بغض النظر عما يبدأ به الكلام (سواء فاعل، أو زمان، أو مكان).",
      formula: "Position 1 (Subject / Time / Location) + Position 2 (Conjugated Verb) + Rest of Sentence",
      examples: [
        { german: "Ich lerne heute Deutsch in der Bibliothek.", arabic: "أنا أتعلم الألمانية اليوم في المكتبة." },
        { german: "Heute lerne ich Deutsch in der Bibliothek.", arabic: "اليوم أتعلم أنا الألمانية في المكتبة (الفعل احتفظ بالمرتبة 2)." },
        { german: "In der Bibliothek lerne ich heute Deutsch.", arabic: "في المكتبة أتعلم أنا اليوم الألمانية." }
      ],
      practicalTip: "When speaking in Germany, no matter what idea you start your sentence with, make sure your verb immediately follows as the second element!",
      quiz: [
        { question: "Where must the conjugated verb sit in a German main clause?", options: ["Position 1", "Position 2", "At the very end", "Position 3"], correctIndex: 1, explanation: "The V2 Rule dictates that the conjugated verb is always in Position 2." },
        { question: "Reorder correctly: 'heute' / 'ich' / 'trinke' / 'Kaffee'", options: ["Ich trinke heute Kaffee.", "Heute ich trinke Kaffee.", "Heute Kaffee trinke ich.", "Trinke ich heute Kaffee."], correctIndex: 0, explanation: "'Ich trinke heute Kaffee' or 'Heute trinke ich Kaffee' places 'trinke' in position 2." }
      ]
    },
    {
      id: "g2",
      title: "2. Personal Pronouns (الضمائر الشخصية)",
      summary: "Master Nominative personal pronouns: ich, du, er, sie, es, wir, ihr, sie, Sie.",
      explanation: "تستخدم الضمائر الشخصية للتعبير عن الفاعل. لاحظ الفرق بين du (أنت للرفاق/الأصدقاء) و Sie (حضرتك/حضرتكم للرسميات والاحتراك في ألمانيا).",
      formula: "ich (I) | du (you-informal) | er/sie/es (he/she/it) | wir (we) | ihr (you-plural) | sie (they) | Sie (You-formal)",
      examples: [
        { german: "Ich komme aus Ägypten und du kommst aus Syrien.", arabic: "أنا قادم من مصر وأنت قادم من سوريا." },
        { german: "Er heißt Thomas und sie heißt Sarah.", arabic: "هو اسمه توماس وهي اسمها سارة." },
        { german: "Woher kommen Sie, Herr Müller?", arabic: "من أين حضرتك يا سيد مولر؟" }
      ],
      practicalTip: "In Germany, always address landlords, university officials, doctors, and police using 'Sie' until offered the 'du'.",
      quiz: [
        { question: "Which pronoun is used for formal polite address to a landlord or professor?", options: ["du", "ihr", "Sie", "er"], correctIndex: 2, explanation: "Capitalized 'Sie' is the formal address for 'You'." },
        { question: "What is the 2nd person plural pronoun (you all)?", options: ["wir", "ihr", "sie", "du"], correctIndex: 1, explanation: "'ihr' corresponds to 'you all' (informal plural)." }
      ]
    },
    {
      id: "g3",
      title: "3. Present Tense Regular Verbs (تصريف الأفعال المنتظمة)",
      summary: "Conjugating regular verbs in Präsens by replacing verb stem endings.",
      explanation: "لتصريف أي فعل منتظم (مثل kommen, wohnen, machen): نحذف en من نهاية المصدر، ثم نضيف النهاية الخاصة بكل ضمير (-e, -st, -t, -en, -t, -en).",
      formula: "Stem + Endings: ich (-e), du (-st), er/sie/es (-t), wir (-en), ihr (-t), sie/Sie (-en)",
      examples: [
        { german: "Ich wohne in Frankfurt. (wohn + e)", arabic: "أنا أسكن في فرانكفورت." },
        { german: "Du lernst Deutsch. (lern + st)", arabic: "أنت تتعلم الألمانية." },
        { german: "Wir machen die Übung. (mach + en)", arabic: "نحن نفعل التمرين." }
      ],
      practicalTip: "Verbs ending in -td or -n (like arbeiten, antworten) add an extra 'e' before -st and -t: du arbeitest, er arbeitet.",
      quiz: [
        { question: "What is the correct conjugation for 'du' with verb 'lernen'?", options: ["lerne", "lernst", "lernt", "lernen"], correctIndex: 1, explanation: "For 'du', the stem 'lern' gets '-st' -> lernst." },
        { question: "Conjugate 'wohnen' for 'er/sie/es':", options: ["wohne", "wohnst", "wohnt", "wohnen"], correctIndex: 2, explanation: "For 'er/sie/es', the stem 'wohn' gets '-t' -> wohnt." }
      ]
    },
    {
      id: "g4",
      title: "4. Irregular Verbs: SEIN & HABEN (الفعلان الكائنان: sein و haben)",
      summary: "The two most essential verbs in German. Master their unique present tense conjugations.",
      explanation: "الفعلان sein (يكون) و haben (يمتلك) هما أهم أفعال في اللغة الألمانية وتصريفهما شاذ تماماً ويجب حفظه عن ظهر قلب.",
      formula: "SEIN: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind | HABEN: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben",
      examples: [
        { german: "Ich bin Student an der Uni Frankfurt.", arabic: "أنا طالب في جامعة فرانكفورت." },
        { german: "Er hat einen Termin beim Bürgeramt.", arabic: "هو لديه موعد في مكتب تسجيل المواطنين." },
        { german: "Wir sind neu in Deutschland.", arabic: "نحن جديدون في ألمانيا." }
      ],
      practicalTip: "Expressing age and feelings uses 'sein' (Ich bin 24 Jahre alt / Ich bin müde), but having items or appointments uses 'haben' (Ich habe Hunger / Ich habe Zeit).",
      quiz: [
        { question: "Conjugate 'sein' for 'du':", options: ["bin", "bist", "ist", "seid"], correctIndex: 1, explanation: "'du bist' is the correct 2nd person singular form of sein." },
        { question: "Conjugate 'haben' for 'er/sie/es':", options: ["habe", "hast", "hat", "haben"], correctIndex: 2, explanation: "'er hat / sie hat / es hat' is the correct 3rd person form." }
      ]
    },
    {
      id: "g5",
      title: "5. Definite & Indefinite Articles (أدوات التعريف والتنكير)",
      summary: "Every noun in German has a grammatical gender: Masculine (der), Feminine (die), Neuter (das), Plural (die).",
      explanation: "الأسماء بالألمانية لها ثلاث أجناس: مذكر (der - أزرق)، مؤنث (die - أحمر)، محايد (das - أخضر)، وجمع (die). نكرة المذكر والمحايد ein، والمؤنث eine.",
      formula: "Definite: der / die / das / die (Plural) | Indefinite: ein / eine / ein / - (No plural indefinite)",
      examples: [
        { german: "Das ist der Tisch (Masculine) und das ist eine Lampe (Feminine).", arabic: "هذه هي الطاولة وهذه لمبة." },
        { german: "Das ist das Haus (Neuter) und das sind die Stühle (Plural).", arabic: "هذا هو المنزل وهذه هي الكراسي." }
      ],
      practicalTip: "Always memorize German nouns together with their article! E.g. don't memorize 'Tisch', memorize 'der Tisch'.",
      quiz: [
        { question: "What is the indefinite article for a feminine noun (e.g. Wohnung)?", options: ["ein", "eine", "einen", "der"], correctIndex: 1, explanation: "Feminine nouns use 'eine' in Nominative." },
        { question: "What article is used for all plural nouns in Nominative?", options: ["der", "das", "die", "ein"], correctIndex: 2, explanation: "Plural nouns always take 'die' in Nominative." }
      ]
    },
    {
      id: "g6",
      title: "6. Questions: W-Fragen vs. Ja/Nein Fragen (الأسئلة بكل أنواعها)",
      summary: "W-Fragen begin with a question word (verb V2). Ja/Nein questions start directly with the verb (V1).",
      explanation: "أسئلة W-Fragen تبدأ بأداة استفهام (Wer, Was, Wo, Woher, Wie) ويكون الفعل ثانياً. بينما أسئلة نعم/لا تبدأ مباشرة بالفعل المصرف في المرتبة الأولى (V1).",
      formula: "W-Frage: Question Word + Verb (V2) + Subject? | Ja/Nein: Verb (V1) + Subject + Rest?",
      examples: [
        { german: "W-Frage: Wo wohnst du in Deutschland?", arabic: "أين تسكن أنت في ألمانيا؟" },
        { german: "Ja/Nein: Wohnst du in Frankfurt?", arabic: "هل تسكن أنت في فرانكفورت؟" }
      ],
      practicalTip: "When asking for help in a shop or station, use Ja/Nein questions starting with 'Können Sie...?' (e.g., 'Können Sie mir helfen?').",
      quiz: [
        { question: "Where does the verb sit in a Ja/Nein question?", options: ["Position 1", "Position 2", "Position 3", "At the end"], correctIndex: 0, explanation: "Ja/Nein questions start directly with the conjugated verb in Position 1." }
      ]
    },
    {
      id: "g7",
      title: "7. Negation: Nicht vs. Kein (النفي بـ nicht و kein)",
      summary: "Use 'kein/keine' to negate nouns preceded by ein/eine or no article. Use 'nicht' for verbs, adjectives, names, and definite nouns.",
      explanation: "قواعد النفي: نستخدم kein / keine لنفي الأسماء المنكرة أو الأسماء التي ليس لها أداة. نستخدم nicht لنفي الأفعال والصفات والأسماء المعرفة والأماكن.",
      formula: "kein (masc/neut) / keine (fem/plural) + Noun | nicht + Verb / Adjective / Proper Name",
      examples: [
        { german: "Ich habe keinen Ausweis dabei. (kein + noun)", arabic: "ليس معي كارت هوية." },
        { german: "Ich wohne nicht in Berlin. (nicht + location)", arabic: "أنا لا أسكن في برلين." },
        { german: "Das Wasser ist nicht kalt. (nicht + adjective)", arabic: "الماء ليس بارداً." }
      ],
      practicalTip: "Remember: 'kein' inflects like 'ein' (kein Mann, keine Frau, kein Kind, keine Kinder).",
      quiz: [
        { question: "How do you negate: 'Ich habe Geld'?", options: ["Ich habe nicht Geld.", "Ich habe kein Geld.", "Ich habe nein Geld.", "Ich nicht habe Geld."], correctIndex: 1, explanation: "'Geld' is an indefinite noun, so it is negated with 'kein'." }
      ]
    },
    {
      id: "g8",
      title: "8. The Accusative Case (حالة المفعول به المباشر - Akkusativ)",
      summary: "In Accusative, ONLY masculine articles change (der → den, ein → einen, kein → keinen). Feminine, neuter, and plural stay unchanged!",
      explanation: "في حالة الأكوزاتيف (المفعول به المباشر)، التغيير الوحيد يحدث للأسماء المذكرة: يتحول der إلى den و ein إلى einen. باقي الأجناس تبقى كما هي!",
      formula: "Masculine: der → den / ein → einen | Feminine: die → die / eine → eine | Neuter: das → das / ein → ein",
      examples: [
        { german: "Ich suche den Bahnhof. (der Bahnhof → den Bahnhof)", arabic: "أنا أبحث عن محطة القطار." },
        { german: "Ich kaufe einen Apfel. (der Apfel → einen Apfel)", arabic: "أنا أشتري تفاحة." },
        { german: "Er braucht eine Kaffeemaschine (die bleibt die).", arabic: "هو يحتاج ماكينة قهوة." }
      ],
      practicalTip: "Common Accusative verbs: haben, brauchen, suchen, kaufen, essen, trinken, bestellen, sehen, finden.",
      quiz: [
        { question: "What does 'ein Mann' become in Accusative?", options: ["ein Mann", "einen Mann", "einem Mann", "eines Mannes"], correctIndex: 1, explanation: "Masculine indefinite article 'ein' becomes 'einen' in Accusative." }
      ]
    },
    {
      id: "g9",
      title: "9. Separable Verbs (الأفعال المنفصلة - Trennbare Verben)",
      summary: "Prefixes like an-, auf-, aus-, ein-, mit-, ab- split and move to the VERY END of the sentence.",
      explanation: "الأفعال المنفصلة تحتوي مقطع أمامي (مثل einkaufen, aufstehen, anrufen). ينفصل المقطع ويذهب إلى نهاية الجملة تماماً، بينما يصرف الفعل في المرتبة 2.",
      formula: "Subject + Conjugated Main Verb (V2) + Rest of Sentence + Separated Prefix (End)",
      examples: [
        { german: "Ich stehe um 7 Uhr auf. (aufstehen)", arabic: "أنا أستيقظ الساعة 7 صباحاً." },
        { german: "Wir kaufen im Supermarkt ein. (einkaufen)", arabic: "نحن نتسوق في السوبرماركت." },
        { german: "Er ruft den Hausmeister an. (anrufen)", arabic: "هو يتصل بمشرف البناية." }
      ],
      practicalTip: "Prefixes to watch for: einkaufen (shop), aufstehen (wake up), ankommen (arrive), ausfüllen (fill form), mitbringen (bring along).",
      quiz: [
        { question: "Where does the prefix go in a simple present tense sentence?", options: ["Position 1", "Position 2", "Right after the verb", "At the very end of the sentence"], correctIndex: 3, explanation: "The separable prefix goes to the absolute end of the clause." }
      ]
    },
    {
      id: "g10",
      title: "10. Possessive Articles (ضمائر الملكية)",
      summary: "Express ownership (my, your, his, her, our) in Nominative and Accusative.",
      explanation: "ضمائر الملكية: mein (لي)، dein (لك)، sein (له)، ihr (لها)، unser (لنا)، euer (لكم)، ihr/Ihr (لهم/لحضرتك). تأخذ نفس نهايات ein/eine.",
      formula: "mein/dein/sein/ihr (Masc/Neut) | meine/deine/seine/ihre (Fem/Plural) | meinen (Masc Accusative)",
      examples: [
        { german: "Das ist mein Pass und das ist meine Tasche.", arabic: "هذا جواز سفري وهذه حقيبتي." },
        { german: "Wo ist dein Schlüssel? (der Schlüssel)", arabic: "أين مفتاحك؟" },
        { german: "Ich suche meinen Ausweis. (Accusative Masc)", arabic: "أنا أبحث عن كارت هويتي." }
      ],
      practicalTip: "At German airports or bureaucracy offices, you will often hear: 'Zeigen Sie mir bitte Ihren Pass!' (Show me your passport!).",
      quiz: [
        { question: "What is 'my bag' (die Tasche)?", options: ["mein Tasche", "meine Tasche", "meinen Tasche", "meines Tasche"], correctIndex: 1, explanation: "Feminine nouns take '-e' ending -> meine Tasche." }
      ]
    },
    {
      id: "g11",
      title: "11. Modal Verbs (الأفعال الناقصة - Modalverben)",
      summary: "Können, müssen, wollen, dürfen, sollen, möchten dictate ability, duty, wish, permission.",
      explanation: "الأفعال الناقصة تأتي في المرتبة 2 (مصرّفة)، ويأتي الفعل الأساسي المكمل للمعنى في نهاية الجملة تماماً بصيغة المصدر (Infinitive).",
      formula: "Subject + Conjugated Modal Verb (V2) + Rest of Sentence + Main Verb Infinitive (End)",
      examples: [
        { german: "Ich kann Deutsch sprechen. (können + sprechen)", arabic: "أنا أستطيع تحدث الألمانية." },
        { german: "Ich muss heute den Mietvertrag unterschreiben.", arabic: "يجب علي اليوم توقيع عقد الإيجار." },
        { german: "Hier darf man nicht rauchen.", arabic: "هنا لا يُسمح للمرء بالتدخين." }
      ],
      practicalTip: "Modal verbs are crucial for polite requests: 'Ich möchte gerne... bestellen' (I would like to order...).",
      quiz: [
        { question: "Where does the second (main) verb sit when using a modal verb?", options: ["Position 1", "Position 2", "Right after the modal verb", "At the very end in infinitive form"], correctIndex: 3, explanation: "The main verb sits at the end in its unchanged infinitive form." }
      ]
    },
    {
      id: "g12",
      title: "12. The Dative Case (حالة المجرور/المفعول غير المباشر - Dativ)",
      summary: "Articles change in Dative: der/das → dem, die → der, plural die → den + -n.",
      explanation: "حالة الداتيف تعبر عن المفعول غير المباشر أو المحرور بعد حروف وأفعال معينة. التغييرات: der/das يصبح dem، و die تحول إلى der، والجمع يصبح den مع إضافة n للاسم.",
      formula: "Masculine/Neuter: dem / einem | Feminine: der / einer | Plural: den + Noun-n",
      examples: [
        { german: "Ich helfe dem Mann. (der Mann → dem Mann)", arabic: "أنا أساعد الرجل." },
        { german: "Das Buch gehört der Studentin. (die Studentin → der Studentin)", arabic: "الكتاب يخص الطالبة." },
        { german: "Wie geht es dir? – Es geht mir gut.", arabic: "كيف حالك؟ – أنا بخير." }
      ],
      practicalTip: "Key Dative verbs: helfen (help), danken (thank), gehören (belong to), gefallen (please/like), passen (fit).",
      quiz: [
        { question: "What does masculine article 'der' change to in Dative?", options: ["den", "dem", "der", "des"], correctIndex: 1, explanation: "Masculine and Neuter articles become 'dem' in Dative." }
      ]
    },
    {
      id: "g13",
      title: "13. Fixed Dative Prepositions (حروف الجر التي تأخذ داتيف دائماً)",
      summary: "Memory rhyme: 'Aus bei mit nach seit von zu – immer mit dem Dativ du!'",
      explanation: "هذه الحروف تأخذ داتيف دائماً ودون استثناء بغض النظر عن الحركة أو السكون: aus, bei, mit, nach, seit, von, zu.",
      formula: "aus (from/out of) | bei (at/with) | mit (with/by transport) | nach (to city/country, after) | seit (since/for time) | von (from/of) | zu (to person/place)",
      examples: [
        { german: "Ich fahre mit dem Bus zum Bahnhof. (mit + dem, zu + dem -> zum)", arabic: "أنا أذهب بالباص إلى محطة القطار." },
        { german: "Er wohnt bei den Eltern. (bei + den Eltern)", arabic: "هو يسكن عند الوالدين." },
        { german: "Ich lerne seit einem Monat Deutsch.", arabic: "أنا أتعلم الألمانية منذ شهر." }
      ],
      practicalTip: "Common contractions: bei + dem = beim, zu + dem = zum, zu + der = zur.",
      quiz: [
        { question: "Which preposition ALWAYS requires Dative?", options: ["für", "durch", "mit", "ohne"], correctIndex: 2, explanation: "'mit' is a fixed Dative preposition." }
      ]
    },
    {
      id: "g14",
      title: "14. Two-Way Prepositions: WO? + Dativ (حروف الجر المزدوجة للموقع)",
      summary: "Wechselpräpositionen (in, an, auf, neben, hinter, über, unter, vor, zwischen) answer 'Wo?' with DATIVE for locations.",
      explanation: "حروف الجر المزدوجة الـ 9 عند الإجابة على السؤال 'Wo?' (أين الموقع الثابت؟) تأخذ حالة الداتيف Dativ دائماً.",
      formula: "Wo? (Location/Rest) → Wechselpräposition + DATIV",
      examples: [
        { german: "Die Tasche liegt auf dem Tisch. (auf + dem Tisch - Dativ)", arabic: "الحقيبة تقع على الطاولة." },
        { german: "Ich bin im Supermarkt. (in + dem -> im - Dativ)", arabic: "أنا داخل السوبرماركت." }
      ],
      practicalTip: "Contractions: in + dem = im, an + dem = am.",
      quiz: [
        { question: "Where is the book in: 'Das Buch ist in ___ Bibliothek' (die)?", options: ["die", "der", "dem", "den"], correctIndex: 1, explanation: "Feminine 'die' becomes 'der' in Dative location (Wo?)." }
      ]
    },
    {
      id: "g15",
      title: "15. Adjective Endings Basics (نهايات الصفات البسيطة)",
      summary: "Adjectives between articles and nouns take specific agreement endings.",
      explanation: "عندما تأتي الصفة بين أداة التعريف/التنكير والاسم، يجب إضافة نهاية مناسبة للصفة بحسب الجنس والحالة.",
      formula: "Definite + Adj-e / Adj-en | Indefinite + Adj-er (Masc) / Adj-es (Neut) / Adj-e (Fem)",
      examples: [
        { german: "Das ist ein schöner Tag. (ein + Masc -> schöner)", arabic: "هذا يوم جميل." },
        { german: "Ich trinke heißen Kaffee. (Accusative Masc -> heißen)", arabic: "أنا أكتب قهوة ساخنة." }
      ],
      practicalTip: "In Accusative masculine, adjective endings are always '-en' (e.g., 'einen guten Tag').",
      quiz: [
        { question: "Complete: 'Guten Tag! Ich wünsche Ihnen einen ___ Tag' (schön)", options: ["schöne", "schöner", "schönen", "schönes"], correctIndex: 2, explanation: "Accusative masculine takes '-en' -> einen schönen Tag." }
      ]
    },
    {
      id: "g16",
      title: "16. The Past Tense: Das Perfekt (الماضي المركب - Perfekt)",
      summary: "Formed using auxiliary HABEN or SEIN (V2) + Partizip II at the end of the sentence.",
      explanation: "زمن الماضي الأكثر استخداماً للمحادثة. يتكون من الفعل المساعد haben أو sein في المرتبة 2 + التصريف الثالث للفعل (Partizip II) في نهاية الجملة.",
      formula: "Subject + haben/sein (V2) + Rest of Sentence + Partizip II (ge-...-t / ge-...-en) (End)",
      examples: [
        { german: "Ich habe gestern Deutsch gelernt. (haben + gelernt)", arabic: "أنا تعلمت الألمانية بالأمس." },
        { german: "Ich bin nach Frankfurt gefahren. (sein + gefahren for movement)", arabic: "أنا سافرت إلى فرانكفورت." }
      ],
      practicalTip: "Rule of thumb: Verbs involving movement from point A to B (gehen, fahren, kommen, fliegen) take 'SEIN'. Static/action verbs take 'HABEN'.",
      quiz: [
        { question: "Which auxiliary verb is used for 'nach Deutschland fliegen'?", options: ["haben", "sein", "werden", "können"], correctIndex: 1, explanation: "'fliegen' is a movement verb, so it takes 'sein' (ich bin geflogen)." }
      ]
    },
    {
      id: "g17",
      title: "17. Subordinate Clauses with WEIL, DASS, WENN (الجمل الجانبية - Nebensatz)",
      summary: "Conjunctions 'weil' (because), 'dass' (that), 'wenn' (if/when) kick the conjugated verb to the VERY END.",
      explanation: "عند استخدام أدوات الربط weil, dass, wenn، تتحول الجملة إلى جملة جانبية، وتنتقل الفاعلية المصرفة إلى آخر كلمة في الجملة تماماً!",
      formula: "Main Clause + , weil/dass/wenn + Subject + Rest + Conjugated Verb (Absolute End)",
      examples: [
        { german: "Ich lerne Deutsch, weil ich in Deutschland studieren möchte.", arabic: "أنا أتعلم الألمانية لأنني أريد الدراسة في ألمانيا." },
        { german: "Ich weiß, dass du heute keine Zeit hast.", arabic: "أعلم أنك لا تملك وقتاً اليوم." }
      ],
      practicalTip: "Notice the comma before weil/dass/wenn! It is mandatory in written German.",
      quiz: [
        { question: "Where does the conjugated verb go after 'weil'?", options: ["Position 1", "Position 2", "Right after weil", "To the very end of the clause"], correctIndex: 3, explanation: "Subordinate conjunctions like 'weil' push the conjugated verb to the absolute end." }
      ]
    },
    {
      id: "g18",
      title: "18. Comparative & Superlative (المقارنة والتفضيل)",
      summary: "Comparing options using '-er als' (schneller als) and superlative 'am -sten' (am schnellsten).",
      explanation: "للمقارنة نضيف er للصفة مع أداة als (أسرع من = schneller als). للتفضيل المطلق نستخدم am + الصفة مضافاً إليها sten.",
      formula: "Comparative: Adjective + er + als | Superlative: am + Adjective + sten",
      examples: [
        { german: "Der Zug ist schneller als der Bus.", arabic: "القطار أسرع من الحافلة." },
        { german: "Der ICE ist am schnellsten. (gut -> besser -> am besten)", arabic: "قطار الـ ICE هو الأسرع." }
      ],
      practicalTip: "Irregular forms: gut -> besser -> am besten | viel -> mehr -> am meisten | gern -> lieber -> am liebsten.",
      quiz: [
        { question: "What is the comparative of 'gut'?", options: ["guter", "besser", "am besten", "mehr gut"], correctIndex: 1, explanation: "'gut' has irregular comparative 'besser'." }
      ]
    }
  ]
};
