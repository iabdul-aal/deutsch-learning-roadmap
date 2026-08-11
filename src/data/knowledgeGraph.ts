export interface GrammarConcept {
  id: string;
  title: string;
  titleDE: string;
  titleAR: string;
  cefr: 'A1'|'A2'|'B1'|'B2'|'C1';
  prerequisites: string[];
  description: string;
  intuition: string;
  intuitionAR: string;
  arabicErrorIds: string[];
  estimatedMinutes: number;
  masteryTest: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    explanationAR: string;
  }[];
}

export const KNOWLEDGE_GRAPH: GrammarConcept[] = [
  {
    id: "german_alphabet",
    title: "The German Alphabet and Pronunciation",
    titleDE: "Das Alphabet und die Aussprache",
    titleAR: "الأبجدية الألمانية والنطق",
    cefr: "A1",
    prerequisites: [],
    description: "Learn the German alphabet and basic pronunciation rules, including Umlauts and the R/CH sounds.",
    intuition: "German is mostly a phonetic language. Once you learn the rules, you can pronounce almost any word.",
    intuitionAR: "الألمانية لغة صوتية بشكل كبير. بمجرد أن تتعلم قواعد النطق والحروف الخاصة، يمكنك نطق أي كلمة تقريباً.",
    arabicErrorIds: ["err_pronunciation_r_1", "err_umlauts_1", "err_ch_sound_1"],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "How is the 'ö' pronounced in 'schön'?",
        options: ["Like English 'o'", "Like French 'eu'", "Like English 'sh'"],
        correctIndex: 1,
        explanation: "It's a rounded front vowel.",
        explanationAR: "يلفظ بضم الشفتين ومحاولة نطق حرف e."
      },
      {
        question: "How is 'ch' pronounced in 'ich'?",
        options: ["Like 'sh'", "Like a soft palatal fricative /ç/", "Like a hard 'k'"],
        correctIndex: 1,
        explanation: "After i/e, it is a soft sound.",
        explanationAR: "بعد الـ i يلفظ كصوت خفيف بين الشين والهاء."
      }
    ]
  },
  {
    id: "personal_pronouns",
    title: "Personal Pronouns",
    titleDE: "Personalpronomen",
    titleAR: "الضمائر الشخصية",
    cefr: "A1",
    prerequisites: [],
    description: "Learn the basic subject pronouns: ich, du, er, sie, es, wir, ihr, sie, Sie.",
    intuition: "German distinguishes between formal 'Sie' and informal 'du'/'ihr'.",
    intuitionAR: "تفرق الألمانية بين المخاطب الرسمي (Sie) وغير الرسمي (du/ihr).",
    arabicErrorIds: [],
    estimatedMinutes: 20,
    masteryTest: [
      {
        question: "Which pronoun is used for formal 'you'?",
        options: ["du", "ihr", "Sie"],
        correctIndex: 2,
        explanation: "'Sie' is the formal pronoun.",
        explanationAR: "Sie هي صيغة الاحترام الرسمية."
      },
      {
        question: "What does 'wir' mean?",
        options: ["they", "we", "he"],
        correctIndex: 1,
        explanation: "'wir' means we.",
        explanationAR: "wir تعني نحن."
      }
    ]
  },
  {
    id: "sein_haben",
    title: "Verb Conjugation: sein and haben",
    titleDE: "Konjugation: sein und haben",
    titleAR: "تصريف الأفعال: sein و haben",
    cefr: "A1",
    prerequisites: [],
    description: "The two most important verbs in German: 'to be' (sein) and 'to have' (haben).",
    intuition: "These verbs are irregular but essential for basic sentences and forming past tenses later.",
    intuitionAR: "هذه الأفعال شاذة لكنها أساسية لبناء الجمل والأزمنة المركبة لاحقاً.",
    arabicErrorIds: [],
    estimatedMinutes: 25,
    masteryTest: [
      {
        question: "Ich ___ ein Auto.",
        options: ["bin", "habe", "hat"],
        correctIndex: 1,
        explanation: "Ich habe = I have.",
        explanationAR: "أنا أملك = Ich habe."
      },
      {
        question: "Er ___ müde.",
        options: ["ist", "hat", "sein"],
        correctIndex: 0,
        explanation: "Er ist = He is.",
        explanationAR: "هو متعب = Er ist."
      }
    ]
  },
  {
    id: "verb_conjugation_present",
    title: "Regular Verb Conjugation (Present)",
    titleDE: "Regelmäßige Verben (Präsens)",
    titleAR: "تصريف الأفعال المنتظمة (المضارع)",
    cefr: "A1",
    prerequisites: [],
    description: "Learn how to conjugate regular verbs in the present tense (-e, -st, -t, -en, -t, -en).",
    intuition: "German verbs change their endings based on who is doing the action.",
    intuitionAR: "الأفعال تتغير نهاياتها حسب الفاعل، مثل اللغة العربية.",
    arabicErrorIds: ["err_verb_conjugation_1"],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "Er ___ Fußball. (spielen)",
        options: ["spiele", "spielst", "spielt"],
        correctIndex: 2,
        explanation: "Third person singular takes -t.",
        explanationAR: "مع er/sie/es نضع نهاية -t للفعل."
      },
      {
        question: "Wir ___ Deutsch. (lernen)",
        options: ["lerne", "lernen", "lernt"],
        correctIndex: 1,
        explanation: "First person plural takes -en.",
        explanationAR: "مع نحن (wir) ينتهي الفعل بـ -en."
      }
    ]
  },
  {
    id: "definite_articles",
    title: "Definite Articles (der/die/das)",
    titleDE: "Bestimmte Artikel",
    titleAR: "أدوات التعريف",
    cefr: "A1",
    prerequisites: [],
    description: "The German equivalents of 'the': der (masculine), die (feminine), das (neuter).",
    intuition: "Unlike Arabic's single 'Al', German uses different words for 'the' based on the noun's gender.",
    intuitionAR: "على عكس الـ التعريف العربية، الألمانية تستخدم أدوات مختلفة حسب جنس الكلمة.",
    arabicErrorIds: ["err_articles_1"],
    estimatedMinutes: 20,
    masteryTest: [
      {
        question: "___ Frau ist hier.",
        options: ["Der", "Die", "Das"],
        correctIndex: 1,
        explanation: "Frau is feminine.",
        explanationAR: "Frau كلمة مؤنثة تأخذ die."
      },
      {
        question: "___ Kind spielt.",
        options: ["Der", "Die", "Das"],
        correctIndex: 2,
        explanation: "Kind is neuter.",
        explanationAR: "Kind (طفل) كلمة محايدة تأخذ das."
      }
    ]
  },
  {
    id: "indefinite_articles",
    title: "Indefinite Articles (ein/eine/ein)",
    titleDE: "Unbestimmte Artikel",
    titleAR: "أدوات التنكير",
    cefr: "A1",
    prerequisites: [],
    description: "The German equivalents of 'a/an': ein, eine, ein.",
    intuition: "Arabic doesn't use words for 'a/an', but German always requires them for unspecified singular nouns.",
    intuitionAR: "في العربية لا توجد أداة تنكير، لكن الألمانية تستخدم ein و eine.",
    arabicErrorIds: ["err_articles_2"],
    estimatedMinutes: 20,
    masteryTest: [
      {
        question: "Ich habe ___ Hund.",
        options: ["ein", "eine", "einen"],
        correctIndex: 2,
        explanation: "Hund is masculine, in Accusative here.",
        explanationAR: "مفعول به مذكر يأخذ einen."
      },
      {
        question: "Das ist ___ Blume.",
        options: ["ein", "eine", "einen"],
        correctIndex: 1,
        explanation: "Blume is feminine.",
        explanationAR: "زهرة مؤنثة، تأخذ eine."
      }
    ]
  },
  {
    id: "noun_gender",
    title: "Grammatical Gender (der/die/das rules)",
    titleDE: "Das grammatische Geschlecht",
    titleAR: "الجنس النحوي",
    cefr: "A1",
    prerequisites: [],
    description: "Understanding masculine, feminine, and neuter nouns in German.",
    intuition: "Gender is a property of the WORD, not the object. You must learn the article with the noun.",
    intuitionAR: "الجنس خاصية للكلمة نفسها وليس للشيء. يجب حفظ الأداة مع الكلمة دائماً.",
    arabicErrorIds: ["err_gender_1", "err_gender_2", "err_compound_nouns_1"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Which gender is 'Mädchen' (girl)?",
        options: ["Masculine", "Feminine", "Neuter"],
        correctIndex: 2,
        explanation: "Words ending in -chen are always neuter.",
        explanationAR: "الكلمات المنتهية بـ chen تكون دائماً محايدة."
      },
      {
        question: "Which gender is 'Sonne' (sun)?",
        options: ["Masculine (der)", "Feminine (die)", "Neuter (das)"],
        correctIndex: 1,
        explanation: "The sun is feminine in German.",
        explanationAR: "الشمس مؤنث في الألمانية."
      }
    ]
  },
  {
    id: "numbers_basic",
    title: "Numbers 1-100",
    titleDE: "Zahlen 1-100",
    titleAR: "الأرقام 1-100",
    cefr: "A1",
    prerequisites: [],
    description: "Learn to count to 100 in German.",
    intuition: "In German numbers from 21-99, you say the ones before the tens, exactly like in Arabic!",
    intuitionAR: "في الألمانية من 21 لـ 99، نقرأ الآحاد قبل العشرات، تماماً كما في اللغة العربية!",
    arabicErrorIds: [],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "How do you say 25?",
        options: ["zwanzigfünf", "fünfundzwanzig", "fünfzwanzig"],
        correctIndex: 1,
        explanation: "Five and twenty.",
        explanationAR: "خمسة وعشرون."
      },
      {
        question: "What is 'einundvierzig'?",
        options: ["14", "41", "40"],
        correctIndex: 1,
        explanation: "One and forty = 41.",
        explanationAR: "واحد وأربعون."
      }
    ]
  },
  {
    id: "sentence_structure_basic",
    title: "Basic Sentence Structure (SVO, verb-second)",
    titleDE: "Einfacher Satzbau",
    titleAR: "بناء الجملة الأساسي",
    cefr: "A1",
    prerequisites: [],
    description: "The core rule of German sentence structure: the verb is always in position 2.",
    intuition: "No matter what starts the sentence, the conjugated verb is anchored in the second slot.",
    intuitionAR: "مهما كانت الكلمة الأولى في الجملة (مثل ظرف زمان)، الفعل المصرف يجب أن يأتي في الموضع الثاني.",
    arabicErrorIds: ["err_verb_position_1", "err_capitalization_1", "err_verb_position_2"],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Heute ___ ich ins Kino.",
        options: ["gehe", "ich", "gehen"],
        correctIndex: 0,
        explanation: "Verb in position 2.",
        explanationAR: "الفعل في المركز الثاني."
      },
      {
        question: "Welcher Satz ist richtig?",
        options: ["Morgen ich arbeite.", "Morgen arbeite ich.", "Ich morgen arbeite."],
        correctIndex: 1,
        explanation: "Verb 'arbeite' must be second.",
        explanationAR: "الفعل arbeite يجب أن يكون في المركز الثاني."
      }
    ]
  },
  {
    id: "negation_nicht_kein",
    title: "Negation with nicht and kein",
    titleDE: "Verneinung (nicht/kein)",
    titleAR: "النفي (nicht/kein)",
    cefr: "A1",
    prerequisites: [],
    description: "Learn how to negate sentences using 'nicht' and 'kein'.",
    intuition: "Use 'kein' to say 'not a / no' for nouns. Use 'nicht' for everything else.",
    intuitionAR: "استخدم kein لنفي الأسماء النكرة، و nicht لنفي الأفعال والصفات.",
    arabicErrorIds: ["err_negation_1"],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "Ich habe ___ Auto.",
        options: ["nicht", "kein", "keine"],
        correctIndex: 1,
        explanation: "Auto is a neuter noun without a definite article.",
        explanationAR: "ننفي الاسم النكرة بـ kein."
      },
      {
        question: "Das Auto ist ___ schnell.",
        options: ["nicht", "kein", "nichts"],
        correctIndex: 0,
        explanation: "Negating an adjective requires 'nicht'.",
        explanationAR: "لنفي الصفة نستخدم nicht."
      }
    ]
  },
  {
    id: "nominativ",
    title: "Nominative Case",
    titleDE: "Nominativ",
    titleAR: "حالة الرفع (الفاعل)",
    cefr: "A1",
    prerequisites: ["definite_articles", "noun_gender"],
    description: "The basic case used for the subject of a sentence.",
    intuition: "The Nominative is the dictionary form of words. It answers 'Who or what is doing the action?'.",
    intuitionAR: "هي حالة الكلمة الأساسية في القاموس، وتستخدم للفاعل.",
    arabicErrorIds: [],
    estimatedMinutes: 20,
    masteryTest: [
      {
        question: "___ Mann liest ein Buch.",
        options: ["Der", "Den", "Dem"],
        correctIndex: 0,
        explanation: "The man is the subject (Nominative).",
        explanationAR: "الرجل هو الفاعل."
      },
      {
        question: "Das ist ___ Frau.",
        options: ["eine", "einer", "einen"],
        correctIndex: 0,
        explanation: "Subject (predicative nominative with 'sein').",
        explanationAR: "بعد فعل sein تأتي حالة الرفع (Nominativ)."
      }
    ]
  },
  {
    id: "akkusativ",
    title: "Accusative Case",
    titleDE: "Akkusativ",
    titleAR: "حالة النصب (المفعول به)",
    cefr: "A1",
    prerequisites: ["nominativ"],
    description: "The case used for direct objects. Masculine 'der' changes to 'den'.",
    intuition: "Only masculine nouns change in the Accusative. Feminine, neuter, and plural stay the same.",
    intuitionAR: "المذكر فقط يتغير في حالة المفعول به من der إلى den. الباقي يبقى كما هو.",
    arabicErrorIds: ["err_case_akkusativ_1"],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Ich sehe ___ Mann.",
        options: ["der", "den", "dem"],
        correctIndex: 1,
        explanation: "The man is the direct object (Accusative masculine).",
        explanationAR: "الرجل مفعول به مذكر (Akkusativ)."
      },
      {
        question: "Wir trinken ___ Wasser.",
        options: ["der", "das", "den"],
        correctIndex: 1,
        explanation: "Wasser is neuter and doesn't change.",
        explanationAR: "الماء محايد (das) ولا يتغير في الأكوزاتيف."
      }
    ]
  },
  {
    id: "irregular_verbs_a1",
    title: "Common Irregular Verbs",
    titleDE: "Unregelmäßige Verben",
    titleAR: "الأفعال الشاذة الشائعة",
    cefr: "A1",
    prerequisites: ["verb_conjugation_present"],
    description: "Verbs that change their stem vowel in the 'du' and 'er/sie/es' forms (e.g., sprechen, lesen, fahren).",
    intuition: "The stem changes slightly, but the regular endings mostly stay the same.",
    intuitionAR: "تتغير بنية الفعل قليلاً مع أنتَ وهوَ، لكن النهايات تبقى عادة كما هي.",
    arabicErrorIds: [],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Du ___ sehr gut Deutsch. (sprechen)",
        options: ["sprechst", "sprichst", "sprecht"],
        correctIndex: 1,
        explanation: "sprechen changes e to i for du/er/sie/es.",
        explanationAR: "يتحول حرف e إلى i مع الضمير du."
      },
      {
        question: "Er ___ ein Buch. (lesen)",
        options: ["lest", "liest", "lesst"],
        correctIndex: 1,
        explanation: "lesen changes e to ie.",
        explanationAR: "يتحول e إلى ie مع er."
      }
    ]
  },
  {
    id: "separable_verbs",
    title: "Separable Verbs",
    titleDE: "Trennbare Verben",
    titleAR: "الأفعال المنفصلة",
    cefr: "A1",
    prerequisites: ["verb_conjugation_present", "sentence_structure_basic"],
    description: "Verbs with a prefix that splits off and goes to the end of the sentence.",
    intuition: "The main verb stays in position 2, and the prefix waits at the very end of the sentence.",
    intuitionAR: "الفعل الأساسي في المركز الثاني، والمقطع المنفصل ينتظر في آخر الجملة تماماً.",
    arabicErrorIds: ["err_separable_verbs_1"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Ich ___ morgens um 7 Uhr ___. (aufstehen)",
        options: ["stehe ... auf", "aufstehe ... -", "stehe auf ... -"],
        correctIndex: 0,
        explanation: "auf splits off to the end.",
        explanationAR: "المقطع auf ينفصل لآخر الجملة."
      },
      {
        question: "Wann ___ der Zug ___? (abfahren)",
        options: ["fährt ... ab", "abfährt ... -", "fährst ... ab"],
        correctIndex: 0,
        explanation: "fährt ab.",
        explanationAR: "يصرف الفعل fahren والمقطع ab يذهب للآخر."
      }
    ]
  },
  {
    id: "modal_verbs_a1",
    title: "Modal Verbs (können, müssen, wollen)",
    titleDE: "Modalverben",
    titleAR: "الأفعال المساعدة (الناقصة)",
    cefr: "A1",
    prerequisites: ["verb_conjugation_present"],
    description: "Verbs like can, must, want to. They send the main verb to the end of the sentence.",
    intuition: "Modal verbs act as the boss in position 2, sending the 'worker' main verb to the end in its raw (infinitive) form.",
    intuitionAR: "الفعل المساعد يأخذ المركز الثاني، ويدفع الفعل الأساسي إلى آخر الجملة ليبقى في حالة المصدر.",
    arabicErrorIds: ["err_modal_verbs_1", "err_modal_verbs_2"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Ich kann nicht gut ___.",
        options: ["schwimme", "schwimmst", "schwimmen"],
        correctIndex: 2,
        explanation: "Main verb goes to the end in infinitive form.",
        explanationAR: "الفعل الأساسي يبقى في المصدر في النهاية."
      },
      {
        question: "Wir ___ heute arbeiten.",
        options: ["musst", "müssen", "muss"],
        correctIndex: 1,
        explanation: "Conjugation of müssen for 'wir'.",
        explanationAR: "تصريف müssen مع wir."
      }
    ]
  },
  {
    id: "plural_formation",
    title: "Noun Plural Formation",
    titleDE: "Pluralbildung",
    titleAR: "صيغ الجمع",
    cefr: "A1",
    prerequisites: ["noun_gender"],
    description: "The various ways to form plurals in German (-e, -er, -n, -en, -s, or umlauts).",
    intuition: "There are patterns, but plurals generally must be learned with the noun.",
    intuitionAR: "توجد بعض الأنماط، لكن بشكل عام يجب حفظ صيغة الجمع مع كل كلمة.",
    arabicErrorIds: ["err_plural_1", "err_plural_2"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Das Auto -> Die ___",
        options: ["Autos", "Auton", "Autoe"],
        correctIndex: 0,
        explanation: "Words of foreign origin often take -s.",
        explanationAR: "الكلمات الأجنبية تجمع بإضافة s."
      },
      {
        question: "Der Bruder -> Die ___",
        options: ["Bruders", "Brüder", "Brudern"],
        correctIndex: 1,
        explanation: "Brother takes an umlaut in plural.",
        explanationAR: "يضاف إمالة (Umlaut) لجمع Bruder."
      }
    ]
  },
  {
    id: "adjective_basic",
    title: "Basic Adjectives (predicative use)",
    titleDE: "Adjektive (prädikativ)",
    titleAR: "الصفات الأساسية",
    cefr: "A1",
    prerequisites: ["nominativ"],
    description: "Using adjectives after verbs like 'sein'. In this case, they don't take endings.",
    intuition: "When an adjective follows 'is' (Das Haus ist groß), it stays exactly as it is in the dictionary.",
    intuitionAR: "عندما تأتي الصفة كخبر (بعد فعل يكون)، فإنها لا تأخذ أي نهايات.",
    arabicErrorIds: ["err_adjective_endings_2"],
    estimatedMinutes: 20,
    masteryTest: [
      {
        question: "Das Auto ist ___.",
        options: ["schnelle", "schnell", "schnelles"],
        correctIndex: 1,
        explanation: "Predicative adjectives take no endings.",
        explanationAR: "الصفة الخبرية لا تأخذ نهايات."
      },
      {
        question: "Der Kaffee ist ___.",
        options: ["heiß", "heiße", "heißer"],
        correctIndex: 0,
        explanation: "No ending needed.",
        explanationAR: "لا توجد حاجة لإضافة نهاية."
      }
    ]
  },
  {
    id: "prepositions_akkusativ",
    title: "Prepositions with Akkusativ",
    titleDE: "Präpositionen mit Akkusativ",
    titleAR: "حروف الجر مع الأكوزاتيف",
    cefr: "A1",
    prerequisites: ["akkusativ"],
    description: "Prepositions that always require the Accusative case (durch, für, gegen, ohne, um).",
    intuition: "Whenever you see one of these prepositions, the next noun MUST be in the Accusative.",
    intuitionAR: "بعد هذه الحروف (مثل für)، يجب أن تكون الكلمة في حالة النصب (Akkusativ) دائماً.",
    arabicErrorIds: ["err_case_akkusativ_2"],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "Das Geschenk ist für ___ Vater.",
        options: ["der", "den", "dem"],
        correctIndex: 1,
        explanation: "'für' takes Akkusativ, so 'der' -> 'den'.",
        explanationAR: "حرف für يطلب Akkusativ."
      },
      {
        question: "Wir gehen durch ___ Park.",
        options: ["der", "den", "dem"],
        correctIndex: 1,
        explanation: "'durch' takes Akkusativ.",
        explanationAR: "durch تطلب Akkusativ."
      }
    ]
  },
  {
    id: "dativ",
    title: "Dative Case",
    titleDE: "Dativ",
    titleAR: "حالة الجر (الداتيف)",
    cefr: "A2",
    prerequisites: ["akkusativ"],
    description: "The case used for indirect objects. Articles change significantly.",
    intuition: "The Dative usually represents the receiver of an action (to whom/for whom). All genders change their articles.",
    intuitionAR: "الداتيف يمثل المفعول لأجله أو المجرور. جميع الأدوات تتغير في هذه الحالة.",
    arabicErrorIds: ["err_case_dativ_1"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Ich helfe ___ Frau.",
        options: ["die", "der", "den"],
        correctIndex: 1,
        explanation: "helfen requires Dative. die -> der.",
        explanationAR: "فعل helfen يطلب داتيف، المؤنث die تصبح der."
      },
      {
        question: "Er gibt ___ Kind den Ball.",
        options: ["das", "dem", "den"],
        correctIndex: 1,
        explanation: "Kind is neuter, Dative is 'dem'.",
        explanationAR: "المحايد das يصبح dem في الداتيف."
      }
    ]
  },
  {
    id: "prepositions_dativ",
    title: "Prepositions with Dativ",
    titleDE: "Präpositionen mit Dativ",
    titleAR: "حروف الجر مع الداتيف",
    cefr: "A2",
    prerequisites: ["dativ"],
    description: "Prepositions that always require the Dative case (aus, bei, mit, nach, seit, von, zu).",
    intuition: "These prepositions FORCE the following noun into the Dative case, no matter what.",
    intuitionAR: "هذه الحروف تجبر الكلمة التي تليها على أن تكون في حالة الداتيف دائماً.",
    arabicErrorIds: ["err_case_dativ_2"],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Ich spiele mit ___ Hund.",
        options: ["der", "den", "dem"],
        correctIndex: 2,
        explanation: "'mit' always takes Dativ.",
        explanationAR: "mit يطلب داتيف دائماً."
      },
      {
        question: "Sie kommt aus ___ Schweiz.",
        options: ["die", "der", "den"],
        correctIndex: 1,
        explanation: "'aus' takes Dativ, 'die Schweiz' -> 'der Schweiz'.",
        explanationAR: "aus تطلب داتيف، لذلك die تصبح der."
      }
    ]
  },
  {
    id: "wechselpraepositionen",
    title: "Two-way Prepositions",
    titleDE: "Wechselpräpositionen",
    titleAR: "حروف الجر المزدوجة",
    cefr: "A2",
    prerequisites: ["prepositions_akkusativ", "prepositions_dativ"],
    description: "Prepositions (in, an, auf...) that take Akkusativ for movement to a destination, and Dativ for stationary location.",
    intuition: "Ask yourself: Is there a destination? (Where to? = Akkusativ). Or is it just a location? (Where? = Dativ).",
    intuitionAR: "إذا كان هناك انتقال لمكان (إلى أين) نستخدم Akkusativ. إذا كان سكون في مكان (أين) نستخدم Dativ.",
    arabicErrorIds: ["err_two_way_preps_1"],
    estimatedMinutes: 50,
    masteryTest: [
      {
        question: "Ich gehe in ___ Park. (movement)",
        options: ["der", "den", "dem"],
        correctIndex: 1,
        explanation: "Movement to a destination = Akkusativ.",
        explanationAR: "حركة إلى مكان تعني Akkusativ."
      },
      {
        question: "Ich bin in ___ Park. (location)",
        options: ["der", "den", "dem"],
        correctIndex: 2,
        explanation: "Static location = Dative.",
        explanationAR: "التواجد في مكان يعني Dativ."
      }
    ]
  },
  {
    id: "adjective_endings",
    title: "Adjective Endings (all declensions)",
    titleDE: "Adjektivdeklination",
    titleAR: "نهايات الصفات",
    cefr: "A2",
    prerequisites: ["akkusativ", "dativ"],
    description: "Rules for adding endings to adjectives placed before nouns.",
    intuition: "The adjective ending depends on the article before it. If the article shows the gender/case clearly, the adjective takes a simple -e or -en.",
    intuitionAR: "تعتمد نهاية الصفة على الأداة التي تسبقها. إذا كانت الأداة توضح الحالة والجنس، تكتفي الصفة بنهاية بسيطة (e أو en).",
    arabicErrorIds: ["err_adjective_endings_1"],
    estimatedMinutes: 60,
    masteryTest: [
      {
        question: "Der gut___ Mann",
        options: ["e", "er", "en"],
        correctIndex: 0,
        explanation: "Definite article, nominative -> -e.",
        explanationAR: "مع أداة التعريف وفي حالة الرفع نأخذ e."
      },
      {
        question: "Ein groß___ Haus",
        options: ["e", "es", "en"],
        correctIndex: 1,
        explanation: "Indefinite article 'ein' doesn't show neuter gender, so adjective must show it (-es).",
        explanationAR: "أداة النكرة ein لا توضح أن الكلمة محايدة، لذلك يجب أن تحمل الصفة حرف -es."
      }
    ]
  },
  {
    id: "perfekt",
    title: "The Perfect Tense",
    titleDE: "Das Perfekt",
    titleAR: "الماضي التام (Perfekt)",
    cefr: "A2",
    prerequisites: ["sein_haben", "irregular_verbs_a1"],
    description: "The most common past tense in spoken German, formed with haben/sein + past participle.",
    intuition: "Use 'haben' for most verbs. Use 'sein' for verbs involving movement (A to B) or a change of state.",
    intuitionAR: "نستخدم haben مع أغلب الأفعال. ونستخدم sein مع أفعال الحركة والانتقال أو تغير الحالة.",
    arabicErrorIds: ["err_perfekt_vs_praeteritum_1", "err_separable_verbs_2"],
    estimatedMinutes: 60,
    masteryTest: [
      {
        question: "Ich ___ gestern Fußball gespielt.",
        options: ["bin", "habe", "hatte"],
        correctIndex: 1,
        explanation: "spielen uses haben.",
        explanationAR: "فعل spielen يأخذ haben."
      },
      {
        question: "Wir ___ nach Berlin gefahren.",
        options: ["sind", "haben", "waren"],
        correctIndex: 0,
        explanation: "fahren implies movement A to B, so it uses sein.",
        explanationAR: "فعل fahren يعبر عن حركة، فيأخذ sein."
      }
    ]
  },
  {
    id: "praeteritum_modal",
    title: "Präteritum (modals + sein/haben)",
    titleDE: "Präteritum (Modalverben, sein, haben)",
    titleAR: "الماضي البسيط (الأفعال المساعدة و sein/haben)",
    cefr: "A2",
    prerequisites: ["perfekt"],
    description: "The simple past tense. While mostly used in writing, it is used in speaking for sein, haben, and modal verbs.",
    intuition: "It's much faster to say 'Ich war' (I was) than 'Ich bin gewesen', so Germans use the simple past for basic verbs.",
    intuitionAR: "من الأسهل في المحادثة قول 'كنت' (war) بدلاً من استخدام الماضي التام، لذا يستخدم الماضي البسيط مع الأفعال الأساسية.",
    arabicErrorIds: [],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Gestern ___ ich krank. (sein)",
        options: ["war", "bin", "warst"],
        correctIndex: 0,
        explanation: "war = I was.",
        explanationAR: "war تعني كنت."
      },
      {
        question: "Ich ___ das nicht machen! (wollen)",
        options: ["willte", "wollte", "wollt"],
        correctIndex: 1,
        explanation: "Simple past of wollen is wollte.",
        explanationAR: "الماضي البسيط من wollen هو wollte."
      }
    ]
  },
  {
    id: "reflexive_verbs",
    title: "Reflexive Verbs",
    titleDE: "Reflexive Verben",
    titleAR: "الأفعال الانعكاسية",
    cefr: "A2",
    prerequisites: ["akkusativ", "dativ"],
    description: "Verbs where the subject and object are the same person, requiring a reflexive pronoun (mich, dich, sich).",
    intuition: "Some actions are done 'to oneself'. In German, you must explicitly state 'myself' or 'yourself'.",
    intuitionAR: "أفعال تقع على الفاعل نفسه. في الألمانية يجب إضافة ضمير يعود على الفاعل.",
    arabicErrorIds: ["err_reflexive_1"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Ich wasche ___.",
        options: ["mich", "mir", "sich"],
        correctIndex: 0,
        explanation: "mich is the reflexive pronoun for ich in Accusative.",
        explanationAR: "الضمير الانعكاسي لـ ich هو mich."
      },
      {
        question: "Er freut ___ auf das Wochenende.",
        options: ["mich", "dich", "sich"],
        correctIndex: 2,
        explanation: "sich is the reflexive pronoun for er/sie/es.",
        explanationAR: "الضمير لـ er هو sich."
      }
    ]
  },
  {
    id: "comparative_superlative",
    title: "Comparative and Superlative",
    titleDE: "Komparativ und Superlativ",
    titleAR: "المقارنة والتفضيل",
    cefr: "A2",
    prerequisites: ["adjective_basic"],
    description: "Comparing things: fast, faster, fastest (schnell, schneller, am schnellsten).",
    intuition: "Add -er for comparative, and 'am ...-sten' for superlative.",
    intuitionAR: "نضيف er للمقارنة، و am ...-sten للتفضيل الأقصى.",
    arabicErrorIds: ["err_comparative_1"],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Mein Auto ist ___ als dein Auto.",
        options: ["schnell", "schneller", "am schnellsten"],
        correctIndex: 1,
        explanation: "Comparative uses -er + als.",
        explanationAR: "للمقارنة نضيف er."
      },
      {
        question: "Er ist ___ im Team.",
        options: ["der besser", "am besten", "besser"],
        correctIndex: 1,
        explanation: "Superlative of gut is am besten.",
        explanationAR: "التفضيل الأقصى من gut هو am besten."
      }
    ]
  },
  {
    id: "subordinating_conjunctions",
    title: "Subordinate Clauses (weil, dass, wenn)",
    titleDE: "Nebensätze",
    titleAR: "الجمل الجانبية (weil, dass, wenn)",
    cefr: "A2",
    prerequisites: ["sentence_structure_basic"],
    description: "Conjunctions that force the conjugated verb to the very end of the clause.",
    intuition: "Words like 'weil' create a dependent clause, which cannot stand alone, and pushes the verb to the end.",
    intuitionAR: "أدوات مثل weil و dass تدفع الفعل المصرف إلى آخر الجملة تماماً.",
    arabicErrorIds: ["err_subordinate_clause_1"],
    estimatedMinutes: 50,
    masteryTest: [
      {
        question: "Ich bleibe zu Hause, weil ich krank ___.",
        options: ["bin", "ist", "-"],
        correctIndex: 0,
        explanation: "Verb 'bin' goes to the end.",
        explanationAR: "الفعل bin يذهب للنهاية."
      },
      {
        question: "Er sagt, dass er morgen ___.",
        options: ["kommt", "kommen", "kommst"],
        correctIndex: 0,
        explanation: "Conjugated verb 'kommt' at the end.",
        explanationAR: "الفعل المصرف kommt في النهاية."
      }
    ]
  },
  {
    id: "konjunktiv_ii",
    title: "Konjunktiv II",
    titleDE: "Konjunktiv II",
    titleAR: "صيغة التمني والطلب المهذب",
    cefr: "B1",
    prerequisites: ["praeteritum_modal"],
    description: "Used for polite requests, wishes, and hypothetical situations (would/could).",
    intuition: "Instead of saying 'I want', you soften it to 'I would like' using Konjunktiv II.",
    intuitionAR: "تستخدم للطلب بأدب أو للتعبير عن التمني (لو كان كذا).",
    arabicErrorIds: ["err_konjunktiv_ii_1"],
    estimatedMinutes: 60,
    masteryTest: [
      {
        question: "Ich ___ gerne einen Kaffee.",
        options: ["habe", "hätte", "hatte"],
        correctIndex: 1,
        explanation: "hätte = would have (would like).",
        explanationAR: "hätte تعني أود أو أرغب في."
      },
      {
        question: "___ du mir bitte helfen?",
        options: ["Kannst", "Könntest", "Kann"],
        correctIndex: 1,
        explanation: "Könntest is the polite form of Kannst.",
        explanationAR: "Könntest هي الصيغة المهذبة من Kannst."
      }
    ]
  },
  {
    id: "passive_voice",
    title: "Passive Voice",
    titleDE: "Passiv",
    titleAR: "المبني للمجهول",
    cefr: "B1",
    prerequisites: ["perfekt", "adjective_endings"],
    description: "Focusing on the action rather than who does it. Formed with 'werden' + past participle.",
    intuition: "If the 'doer' of the action doesn't matter, make the object the subject using the passive voice.",
    intuitionAR: "عندما لا يهم الفاعل، نستخدم werden لتركيز الاهتمام على الفعل نفسه.",
    arabicErrorIds: ["err_passive_1"],
    estimatedMinutes: 50,
    masteryTest: [
      {
        question: "Das Auto ___ repariert.",
        options: ["ist", "wird", "werden"],
        correctIndex: 1,
        explanation: "wird is used for ongoing passive.",
        explanationAR: "نستخدم wird للمبني للمجهول في الحاضر."
      },
      {
        question: "Der Brief wurde ___.",
        options: ["schreiben", "geschrieben", "schrieb"],
        correctIndex: 1,
        explanation: "Passive requires the past participle.",
        explanationAR: "نحتاج التصريف الثالث للفعل."
      }
    ]
  },
  {
    id: "genitiv",
    title: "Genitive Case",
    titleDE: "Genitiv",
    titleAR: "حالة الإضافة",
    cefr: "B1",
    prerequisites: ["dativ"],
    description: "The case used to show possession (of the). Masculine/Neuter nouns take -s or -es.",
    intuition: "Instead of 'The car of the man', Genitive creates 'The car the man's'.",
    intuitionAR: "تستخدم للتعبير عن الملكية أو الإضافة (كتاب المعلم).",
    arabicErrorIds: ["err_genitiv_1"],
    estimatedMinutes: 45,
    masteryTest: [
      {
        question: "Das Auto ___ Mannes ist neu.",
        options: ["der", "den", "des"],
        correctIndex: 2,
        explanation: "des + noun-s is Genitive masculine.",
        explanationAR: "des هي أداة الجينيتيف للمذكر."
      },
      {
        question: "Die Farbe ___ Hauses ist rot.",
        options: ["des", "dem", "das"],
        correctIndex: 0,
        explanation: "des Hauses = of the house.",
        explanationAR: "لون المنزل = Die Farbe des Hauses."
      }
    ]
  },
  {
    id: "infinitive_zu",
    title: "Infinitive with zu",
    titleDE: "Infinitiv mit zu",
    titleAR: "المصدر مع zu",
    cefr: "B1",
    prerequisites: ["modal_verbs_a1"],
    description: "Using 'zu' + infinitive when a sentence has two verbs but the second isn't a modal.",
    intuition: "Similar to English 'to do', 'zu' is placed before the infinitive verb at the end of the sentence.",
    intuitionAR: "تعادل 'أن تفعل' في العربية، وتوضع قبل المصدر في آخر الجملة.",
    arabicErrorIds: [],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Ich versuche, das Buch ___ lesen.",
        options: ["zu", "an", "-"],
        correctIndex: 0,
        explanation: "zu precedes the infinitive.",
        explanationAR: "zu تسبق المصدر."
      },
      {
        question: "Es ist wichtig, viel Wasser ___ trinken.",
        options: ["zu", "zum", "-"],
        correctIndex: 0,
        explanation: "zu trinken = to drink.",
        explanationAR: "zu trinken = أن تشرب."
      }
    ]
  },
  {
    id: "relative_clauses",
    title: "Relative Clauses",
    titleDE: "Relativsätze",
    titleAR: "جمل الصلة",
    cefr: "B1",
    prerequisites: ["subordinating_conjunctions", "genitiv"],
    description: "Clauses starting with a relative pronoun (der/die/das) that describe a noun. Verb goes to the end.",
    intuition: "Relative clauses give more info about a noun. The pronoun matches the gender/number of the noun, but its case depends on its role in the clause.",
    intuitionAR: "ضمير الصلة يأخذ جنس الكلمة التي يعود عليها، لكن حالته النحوية تعتمد على موقعه في الجملة الجانبية.",
    arabicErrorIds: ["err_relative_clauses_1"],
    estimatedMinutes: 50,
    masteryTest: [
      {
        question: "Der Mann, ___ dort steht, ist mein Vater.",
        options: ["der", "den", "dem"],
        correctIndex: 0,
        explanation: "Nominative because the man 'stands'.",
        explanationAR: "فاعل الجملة الجانبية فيأخذ der."
      },
      {
        question: "Das Buch, ___ ich lese, ist gut.",
        options: ["das", "dem", "den"],
        correctIndex: 0,
        explanation: "Accusative neuter.",
        explanationAR: "مفعول به محايد."
      }
    ]
  },
  {
    id: "two_part_conjunctions",
    title: "Two-part Conjunctions (entweder...oder)",
    titleDE: "Zweiteilige Konnektoren",
    titleAR: "الروابط المزدوجة",
    cefr: "B1",
    prerequisites: ["subordinating_conjunctions"],
    description: "Pairs like entweder...oder (either...or), weder...noch (neither...nor).",
    intuition: "These frame alternative choices or conditions clearly.",
    intuitionAR: "تستخدم لربط الخيارات مثل (إما.. أو) و (لا.. ولا).",
    arabicErrorIds: [],
    estimatedMinutes: 30,
    masteryTest: [
      {
        question: "___ trinke ich Tee, oder ich trinke Kaffee.",
        options: ["Weder", "Sowohl", "Entweder"],
        correctIndex: 2,
        explanation: "Entweder...oder = Either...or.",
        explanationAR: "إما .. أو = Entweder .. oder."
      },
      {
        question: "Ich spreche ___ Deutsch als auch Englisch.",
        options: ["weder", "sowohl", "entweder"],
        correctIndex: 1,
        explanation: "sowohl...als auch = as well as.",
        explanationAR: "أتحدث كلاً من .. و."
      }
    ]
  },
  {
    id: "n_declension",
    title: "N-Declension Nouns",
    titleDE: "N-Deklination",
    titleAR: "نهايات الأسماء الشاذة (N-Deklination)",
    cefr: "B1",
    prerequisites: ["dativ", "genitiv"],
    description: "Masculine nouns (often describing people or animals) that take an -(e)n ending in all cases except Nominative.",
    intuition: "Some nouns act weirdly and add an 'n' to the end whenever they are not the subject.",
    intuitionAR: "بعض الأسماء المذكرة يضاف لها n في جميع الحالات باستثناء الفاعل.",
    arabicErrorIds: ["err_n_declension_1"],
    estimatedMinutes: 40,
    masteryTest: [
      {
        question: "Ich kenne den ___ nicht. (Student)",
        options: ["Student", "Studenten", "Students"],
        correctIndex: 1,
        explanation: "Student belongs to n-declension.",
        explanationAR: "تضاف en لكلمة Student في الأكوزاتيف."
      },
      {
        question: "Das ist das Auto des ___.",
        options: ["Herrn", "Herr", "Herren"],
        correctIndex: 0,
        explanation: "Herr adds an n (Herrn) in Genitive (and Dativ/Akk).",
        explanationAR: "كلمة Herr تصبح Herrn."
      }
    ]
  }
];

export function getConceptsByLevel(cefr: string): GrammarConcept[] {
  return KNOWLEDGE_GRAPH.filter(c => c.cefr === cefr);
}

export function getPrerequisites(conceptId: string): GrammarConcept[] {
  const concept = KNOWLEDGE_GRAPH.find(c => c.id === conceptId);
  if (!concept) return [];
  return concept.prerequisites
    .map(id => KNOWLEDGE_GRAPH.find(c => c.id === id))
    .filter((c): c is GrammarConcept => c !== undefined);
}

export function getUnlocked(completedIds: string[]): GrammarConcept[] {
  return KNOWLEDGE_GRAPH.filter(concept =>
    concept.prerequisites.every(preId => completedIds.includes(preId)) &&
    !completedIds.includes(concept.id)
  );
}

export function getConceptById(id: string): GrammarConcept | undefined {
  return KNOWLEDGE_GRAPH.find(c => c.id === id);
}
