export interface ArabicError {
  id: string;
  errorType: 'gender'|'case'|'word_order'|'verb_position'|'articles'|
             'pronunciation'|'plural'|'negation'|'prepositions'|'adjective_endings'|
             'verb_conjugation'|'separable_verbs'|'modal_verbs'|'tense_selection'|'subordinate_clause';
  arabicSource: string;
  germanRule: string;
  commonMistake: string;
  correction: string;
  explanationAR: string;
  mnemonicAR?: string;
  targetCEFR: 'A1'|'A2'|'B1'|'B2';
  frequency: 'very_high'|'high'|'medium'|'low';
  conceptId?: string;
}

export const ARABIC_ERRORS: ArabicError[] = [
  {
    id: "err_gender_1",
    errorType: "gender",
    arabicSource: "العربية تعتمد على جنسين فقط (مذكر ومؤنث) وغالباً ما يكون الجنس منطقياً أو يعتمد على نهاية الكلمة. لا يوجد محايد.",
    germanRule: "German has 3 grammatical genders (masculine, feminine, neuter) which are mostly arbitrary and must be learned with the noun.",
    commonMistake: "Die Mädchen ist schön.",
    correction: "Das Mädchen ist schön.",
    explanationAR: "في الألمانية، كلمة فتاة (Mädchen) محايدة وتأخذ الأداة Das، بالرغم من أنها تشير إلى أنثى. الجنس النحوي في الألمانية لا يتطابق دائماً مع الجنس البيولوجي.",
    mnemonicAR: "كل الكلمات التي تنتهي بـ -chen هي دائماً محايدة (das).",
    targetCEFR: "A1",
    frequency: "very_high",
    conceptId: "noun_gender"
  },
  {
    id: "err_articles_1",
    errorType: "articles",
    arabicSource: "في العربية نستخدم أداة تعريف واحدة (ال) لجميع الكلمات مهما كان جنسها أو عددها.",
    germanRule: "German uses different definite articles (der, die, das, die) depending on gender and number in the nominative case.",
    commonMistake: "Ich habe der Buch.",
    correction: "Ich habe das Buch.",
    explanationAR: "الأداة 'ال' في العربية تقابلها عدة أدوات في الألمانية حسب جنس الكلمة. كلمة كتاب (Buch) محايدة لذلك تأخذ das.",
    targetCEFR: "A1",
    frequency: "very_high",
    conceptId: "definite_articles"
  },
  {
    id: "err_verb_position_1",
    errorType: "verb_position",
    arabicSource: "في العربية، الجملة الفعلية تبدأ بالفعل. وفي الجملة الاسمية قد لا يوجد فعل ظاهر (مثل: أنا طالب).",
    germanRule: "In German main clauses, the conjugated verb must always be in the second position.",
    commonMistake: "Gestern ich ging ins Kino.",
    correction: "Gestern ging ich ins Kino.",
    explanationAR: "في الجملة الألمانية الرئيسية، يجب أن يكون الفعل المصرف دائماً في المركز الثاني. إذا بدأنا بظرف زمان (Gestern)، يجب أن يليه الفعل مباشرة.",
    mnemonicAR: "الفعل هو الملك، وعرشه دائماً في الموضع الثاني في الجملة الرئيسية.",
    targetCEFR: "A1",
    frequency: "very_high",
    conceptId: "sentence_structure_basic"
  },
  {
    id: "err_subordinate_clause_1",
    errorType: "subordinate_clause",
    arabicSource: "في العربية، ترتيب الكلمات في الجملة التابعة لا يتغير عن الجملة الرئيسية.",
    germanRule: "In German subordinate clauses (starting with weil, dass, wenn, etc.), the conjugated verb goes to the very end.",
    commonMistake: "Ich lerne Deutsch, weil ich möchte in Deutschland leben.",
    correction: "Ich lerne Deutsch, weil ich in Deutschland leben möchte.",
    explanationAR: "بعد الروابط الجانبية مثل weil (لأن)، يتم دفع الفعل المصرف (möchte) إلى نهاية الجملة تماماً.",
    mnemonicAR: "الروابط مثل weil و dass تدفع الفعل إلى آخر الجملة كأنه منبوذ.",
    targetCEFR: "A2",
    frequency: "very_high",
    conceptId: "subordinating_conjunctions"
  },
  {
    id: "err_case_akkusativ_1",
    errorType: "case",
    arabicSource: "المفعول به في العربية ينصب بالفتحة، ولا تتغير أداة التعريف (ال) بل يتغير التشكيل.",
    germanRule: "In the Accusative case, masculine definite articles change from 'der' to 'den'.",
    commonMistake: "Ich sehe der Mann.",
    correction: "Ich sehe den Mann.",
    explanationAR: "في حالة المفعول به (Akkusativ)، يتغير المذكر فقط من der إلى den. المؤنث والمحايد والجمع لا يتغيرون.",
    mnemonicAR: "المذكر فقط هو الضعيف في الأكوزاتيف، يتغير من der إلى den.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "akkusativ"
  },
  {
    id: "err_case_dativ_1",
    errorType: "case",
    arabicSource: "في العربية، المجرور يكسر ولا تتغير الكلمة بشكل جذري.",
    germanRule: "In the Dative case, articles change significantly (der/das -> dem, die -> der, die(pl) -> den + n).",
    commonMistake: "Ich helfe der Mann.",
    correction: "Ich helfe dem Mann.",
    explanationAR: "أفعال معينة مثل helfen تتطلب حالة الداتيف (Dativ). في هذه الحالة، أداة المذكر der تصبح dem.",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "dativ"
  },
  {
    id: "err_adjective_endings_1",
    errorType: "adjective_endings",
    arabicSource: "في العربية، الصفة تتبع الموصوف في التذكير والتأنيث والتعريف والتنكير دون قواعد معقدة للنهايات.",
    germanRule: "German adjectives take specific endings depending on gender, number, case, and the preceding article.",
    commonMistake: "Ich kaufe ein rotes Auto und ein groß Haus.",
    correction: "Ich kaufe ein rotes Auto und ein großes Haus.",
    explanationAR: "نهاية الصفة تتغير حسب الأداة التي تسبقها وحالة الكلمة. مع أداة النكرة للمحايد في المنصوب، نضيف -es للصفة.",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "adjective_endings"
  },
  {
    id: "err_plural_1",
    errorType: "plural",
    arabicSource: "الجمع في العربية إما مذكر سالم (ون/ين) أو مؤنث سالم (ات) أو جمع تكسير، لكنه واضح إلى حد ما.",
    germanRule: "German has multiple, often unpredictable ways to form the plural (-e, -er, -n, -en, -s, or umlaut changes).",
    commonMistake: "Ich habe zwei Bruders.",
    correction: "Ich habe zwei Brüder.",
    explanationAR: "الجمع في الألمانية لا يتم فقط بإضافة s. كلمة أخ (Bruder) جمعها بإضافة الإمالة (Umlaut) لتصبح Brüder.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "plural_formation"
  },
  {
    id: "err_separable_verbs_1",
    errorType: "separable_verbs",
    arabicSource: "الأفعال في العربية وحدة واحدة لا تنفصل.",
    germanRule: "Separable verbs in German split in main clauses, with the prefix going to the very end of the clause.",
    commonMistake: "Ich aufmache die Tür.",
    correction: "Ich mache die Tür auf.",
    explanationAR: "الأفعال المنفصلة مثل aufmachen تنفصل في الجملة الرئيسية، حيث يتم تصريف الفعل (mache) ويأتي المقطع (auf) في نهاية الجملة.",
    mnemonicAR: "المقطع المنفصل يحب الجلوس في المقعد الأخير.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "separable_verbs"
  },
  {
    id: "err_modal_verbs_1",
    errorType: "modal_verbs",
    arabicSource: "في العربية نستخدم فعلين متتالين (أريد أن أذهب)، حيث يكون الفعل الثاني مضارعاً منصوباً ويأتي بعد الفعل الأول.",
    germanRule: "Modal verbs take the second position and send the main verb to the end of the sentence in its infinitive form.",
    commonMistake: "Ich will gehen nach Hause.",
    correction: "Ich will nach Hause gehen.",
    explanationAR: "عند استخدام الأفعال المساعدة (Modalverben)، الفعل الأساسي يذهب إلى نهاية الجملة ويبقى في حالة المصدر (بدون تصريف).",
    targetCEFR: "A1",
    frequency: "medium",
    conceptId: "modal_verbs_a1"
  },
  {
    id: "err_konjunktiv_ii_1",
    errorType: "tense_selection",
    arabicSource: "للتعبير عن التمني أو الاحتمال نستخدم 'لو' أو 'ليت' مع الماضي.",
    germanRule: "Konjunktiv II is used for unreal situations, wishes, and polite requests, often formed with 'würden' + infinitive.",
    commonMistake: "Ich will ein Kaffee, bitte.",
    correction: "Ich hätte gerne einen Kaffee, bitte.",
    explanationAR: "للطلب المهذب في الألمانية نستخدم Konjunktiv II (مثل hätte) بدلاً من الفعل المباشر (will) الذي يبدو فظاً.",
    targetCEFR: "B1",
    frequency: "medium",
    conceptId: "konjunktiv_ii"
  },
  {
    id: "err_pronunciation_r_1",
    errorType: "pronunciation",
    arabicSource: "حرف الراء في العربية يلفظ بقرع طرف اللسان على اللثة.",
    germanRule: "The German 'R' is usually pronounced in the throat (uvular fricative) at the beginning of words, or vocalized at the end.",
    commonMistake: "Trinken (pronounced with rolled Arabic R)",
    correction: "trinken (pronounced with throat R)",
    explanationAR: "حرف R في بداية المقطع يلفظ من الحنجرة قريباً من حرف الغين في العربية.",
    mnemonicAR: "تخيل أنك تتغرغر بالماء عند نطق حرف R في بداية الكلمة.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "german_alphabet"
  },
  {
    id: "err_umlauts_1",
    errorType: "pronunciation",
    arabicSource: "لا توجد حروف تقابل الـ Umlauts (ä, ö, ü) في اللغة العربية.",
    germanRule: "Umlauts alter the vowel sound completely and can change the meaning of a word (e.g., schon vs. schön).",
    commonMistake: "Das Wetter ist shon.",
    correction: "Das Wetter ist schön.",
    explanationAR: "حرف ö يلفظ بضم الشفتين كنطق حرف 'o' ولكن مع محاولة نطق حرف 'e'. عدم استخدام النقطتين يغير المعنى (schon يعني 'بالفعل'، schön يعني 'جميل').",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "german_alphabet"
  },
  {
    id: "err_ch_sound_1",
    errorType: "pronunciation",
    arabicSource: "المتعلمون العرب ينطقون 'ch' كحرف الخاء أو الشين دائماً.",
    germanRule: "'ch' after a, o, u, au is pronounced like the Arabic 'خ', but after i, e, ä, ö, ü, eu, äu it is a soft palatal fricative (/ç/).",
    commonMistake: "Ich (pronounced as Ick or Ish)",
    correction: "ich (pronounced with soft /ç/)",
    explanationAR: "بعد حرف i، يلفظ الـ ch كصوت خفيف بين الشين والهاء، وليس شين صريحة ولا كاف.",
    targetCEFR: "A1",
    frequency: "medium",
    conceptId: "german_alphabet"
  },
  {
    id: "err_capitalization_1",
    errorType: "word_order",
    arabicSource: "لا توجد أحرف كبيرة (Capital letters) في اللغة العربية.",
    germanRule: "In German, ALL nouns must be capitalized, regardless of where they appear in a sentence.",
    commonMistake: "ich habe ein neues auto.",
    correction: "Ich habe ein neues Auto.",
    explanationAR: "في الألمانية، جميع الأسماء (مثل Auto) يجب أن تبدأ بحرف كبير، وكذلك أول كلمة في الجملة.",
    targetCEFR: "A1",
    frequency: "very_high",
    conceptId: "sentence_structure_basic"
  },
  {
    id: "err_compound_nouns_1",
    errorType: "word_order",
    arabicSource: "الكلمات المركبة في العربية تكتب ككلمات منفصلة (مثل: باب الغرفة).",
    germanRule: "German combines nouns into a single continuous word.",
    commonMistake: "Kranken Haus",
    correction: "Krankenhaus",
    explanationAR: "في الألمانية يتم دمج الأسماء معاً لتكوين كلمة واحدة طويلة، والجنس النحوي يتحدد دائماً من الكلمة الأخيرة.",
    targetCEFR: "A2",
    frequency: "medium",
    conceptId: "noun_gender"
  },
  {
    id: "err_perfekt_vs_praeteritum_1",
    errorType: "tense_selection",
    arabicSource: "في العربية، الماضي غالباً زمن واحد.",
    germanRule: "Spoken German mostly uses Perfekt, while written German (and certain verbs like sein/haben) uses Präteritum.",
    commonMistake: "Gestern ich warf den Ball.",
    correction: "Gestern habe ich den Ball geworfen.",
    explanationAR: "في المحادثات اليومية نستخدم الـ Perfekt بدلاً من Präteritum لمعظم الأفعال.",
    targetCEFR: "A2",
    frequency: "medium",
    conceptId: "perfekt"
  },
  {
    id: "err_reflexive_1",
    errorType: "verb_conjugation",
    arabicSource: "الأفعال الانعكاسية في العربية غالباً ما تأتي بوزن 'تفاعل' أو 'افتعل' ولا تتطلب ضميراً منفصلاً.",
    germanRule: "Reflexive verbs require a reflexive pronoun (mich, dich, sich) which must match the subject.",
    commonMistake: "Ich freue auf das Wochenende.",
    correction: "Ich freue mich auf das Wochenende.",
    explanationAR: "فعل freuen (يفرح بـ) هو فعل انعكاسي في الألمانية ويحتاج دائماً إلى الضمير الانعكاسي (mich).",
    targetCEFR: "A2",
    frequency: "medium",
    conceptId: "reflexive_verbs"
  },
  {
    id: "err_two_way_preps_1",
    errorType: "prepositions",
    arabicSource: "حروف الجر في العربية تأخذ حالة واحدة دائماً (الجر).",
    germanRule: "Two-way prepositions take Accusative for movement/direction and Dative for location/position.",
    commonMistake: "Ich gehe in der Park.",
    correction: "Ich gehe in den Park.",
    explanationAR: "لأن هناك حركة وانتقال (gehe - أذهب إلى)، حرف الجر in يأخذ حالة Akkusativ.",
    mnemonicAR: "حركة = Akkusativ (إلى أين؟)، سكون = Dativ (أين؟)",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "wechselpraepositionen"
  },
  {
    id: "err_negation_1",
    errorType: "negation",
    arabicSource: "النفي في العربية يتم بأدوات مثل 'لا' و 'لم' و 'لن' و 'ليس'.",
    germanRule: "Use 'kein' to negate nouns with indefinite or no articles. Use 'nicht' for verbs, adjectives, and nouns with definite articles.",
    commonMistake: "Ich habe nicht Auto.",
    correction: "Ich habe kein Auto.",
    explanationAR: "عند نفي اسم غير معرف أو بدون أداة (مثل Auto)، نستخدم kein وليس nicht.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "negation_nicht_kein"
  },
  {
    id: "err_gender_2",
    errorType: "gender",
    arabicSource: "الشمس في العربية مؤنث والقمر مذكر.",
    germanRule: "In German, the sun is feminine (die Sonne) and the moon is masculine (der Mond).",
    commonMistake: "Der Sonne scheint.",
    correction: "Die Sonne scheint.",
    explanationAR: "الجنس في الألمانية غير مرتبط بالمنطق أو بلغات أخرى. الشمس مؤنث (die) والقمر مذكر (der).",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "noun_gender"
  },
  {
    id: "err_articles_2",
    errorType: "articles",
    arabicSource: "نحن لا نستخدم أداة النكرة في العربية، بل نكتفي بالكلمة مجردة (كتاب).",
    germanRule: "German uses indefinite articles (ein/eine/ein) for unspecified singular nouns.",
    commonMistake: "Ich bin Student.",
    correction: "Ich bin ein Student. (Note: For professions, zero article is actually correct in German, but learners over-apply this to objects, e.g. Ich habe Auto -> Ich habe ein Auto).",
    explanationAR: "يجب استخدام أداة نكرة للأشياء غير المحددة، مثل Ich habe ein Auto.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "indefinite_articles"
  },
  {
    id: "err_verb_position_2",
    errorType: "verb_position",
    arabicSource: "أدوات الربط مثل 'و' (und) و 'لكن' (aber) لا تغير ترتيب الجملة في العربية.",
    germanRule: "Coordinating conjunctions (und, oder, aber, denn, sondern) do not count as position 1. The verb remains in position 2 of the clause.",
    commonMistake: "Ich bin müde, aber ich muss gehen jetzt.",
    correction: "Ich bin müde, aber ich muss jetzt gehen.",
    explanationAR: "aber تعتبر موضع صفر، لكن الفعل (muss) يجب أن يكون في المركز الثاني. والفعل الأساسي gehen يذهب للآخر.",
    targetCEFR: "A2",
    frequency: "medium",
    conceptId: "sentence_structure_basic"
  },
  {
    id: "err_case_akkusativ_2",
    errorType: "case",
    arabicSource: "حرف الجر 'لِـ' (für) يتبعه اسم مجرور في العربية.",
    germanRule: "The preposition 'für' always requires the Accusative case.",
    commonMistake: "Das Geschenk ist für mein Bruder.",
    correction: "Das Geschenk ist für meinen Bruder.",
    explanationAR: "حرف الجر für يتطلب دائماً حالة الأكوزاتيف، وبالتالي mein تصبح meinen.",
    targetCEFR: "A1",
    frequency: "high",
    conceptId: "prepositions_akkusativ"
  },
  {
    id: "err_case_dativ_2",
    errorType: "case",
    arabicSource: "الكلمات بعد حروف الجر 'من' (aus, von) و 'مع' (mit) تأخذ نفس الحركة الإعرابية.",
    germanRule: "Prepositions like aus, bei, mit, nach, seit, von, zu always require the Dative case.",
    commonMistake: "Ich spiele mit den Hund.",
    correction: "Ich spiele mit dem Hund.",
    explanationAR: "حرف الجر mit يطلب دائماً داتيف، لذلك der Hund تصبح dem Hund.",
    mnemonicAR: "احفظ أغنية الداتيف: aus, außer, bei, mit, nach, seit, von, zu داتيف دائماً.",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "prepositions_dativ"
  },
  {
    id: "err_adjective_endings_2",
    errorType: "adjective_endings",
    arabicSource: "الصفات تأتي بعد الموصوف في العربية (رجل طويل).",
    germanRule: "In German, attributive adjectives come BEFORE the noun they modify.",
    commonMistake: "Der Mann groß...",
    correction: "Der große Mann...",
    explanationAR: "الصفات التي تصف اسماً توضع قبله مباشرة في اللغة الألمانية وتأخذ نهايات معينة.",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "adjective_basic"
  },
  {
    id: "err_plural_2",
    errorType: "plural",
    arabicSource: "الأسماء التي تنتهي بـ er أو en في الألمانية غالباً ما تبقى كما هي في الجمع.",
    germanRule: "Many masculine and neuter nouns ending in -er, -el, -en do not add a suffix in plural, sometimes only taking an umlaut.",
    commonMistake: "Die Lehrers",
    correction: "Die Lehrer",
    explanationAR: "الكلمات المذكرة المنتهية بـ er (مثل Lehrer) لا تتغير في الجمع (فقط الأداة تتغير إلى die).",
    targetCEFR: "A1",
    frequency: "medium",
    conceptId: "plural_formation"
  },
  {
    id: "err_separable_verbs_2",
    errorType: "separable_verbs",
    arabicSource: "حين نستخدم فعلاً ماضياً (Perfekt)، الفعل لا ينفصل في العربية.",
    germanRule: "In the Perfekt tense, the prefix of a separable verb attaches to the participle with '-ge-' in the middle.",
    commonMistake: "Ich habe aufgemacht die Tür.",
    correction: "Ich habe die Tür aufgemacht.",
    explanationAR: "في حالة الماضي (Perfekt)، المقطع auf يندمج مع التصريف الثالث gemascht ليصبح aufgemacht ويأتي في نهاية الجملة.",
    targetCEFR: "A2",
    frequency: "high",
    conceptId: "perfekt"
  },
  {
    id: "err_modal_verbs_2",
    errorType: "modal_verbs",
    arabicSource: "القدرة (أستطيع) والسماح (مسموح لي) لهما نفس المعنى تقريباً لبعض المتحدثين.",
    germanRule: "'können' means ability/possibility, while 'dürfen' means permission.",
    commonMistake: "Kann ich hier rauchen? (Informal but grammatically refers to physical ability)",
    correction: "Darf ich hier rauchen?",
    explanationAR: "للسؤال عن الإذن أو السماح نستخدم فعل dürfen وليس können.",
    targetCEFR: "A1",
    frequency: "medium",
    conceptId: "modal_verbs_a1"
  },
  {
    id: "err_passive_1",
    errorType: "tense_selection",
    arabicSource: "المبني للمجهول في العربية يتم بتغيير التشكيل (كُتِبَ).",
    germanRule: "Passive voice is formed using 'werden' + past participle, focusing on the action rather than the subject.",
    commonMistake: "Das Haus ist gebaut.",
    correction: "Das Haus wird gebaut.",
    explanationAR: "للتعبير عن المبني للمجهول المستمر نستخدم werden. استخدام sein (ist) يعني أن الفعل انتهى تماماً (حالة).",
    targetCEFR: "B1",
    frequency: "low",
    conceptId: "passive_voice"
  },
  {
    id: "err_comparative_1",
    errorType: "adjective_endings",
    arabicSource: "التفضيل في العربية يستخدم وزن 'أفعل' و 'من' (أكبر من).",
    germanRule: "Comparative adds -er to the adjective and uses 'als' for 'than'.",
    commonMistake: "Er ist größer wie ich.",
    correction: "Er ist größer als ich.",
    explanationAR: "للمقارنة في حالة الاختلاف نستخدم als (أكبر من). نستخدم wie فقط للمساواة (so groß wie).",
    targetCEFR: "A2",
    frequency: "medium",
    conceptId: "comparative_superlative"
  },
  {
    id: "err_genitiv_1",
    errorType: "case",
    arabicSource: "الإضافة في العربية تتم بتركيب كلمتين (سيارة الرجل).",
    germanRule: "The Genitive case indicates possession. Masculine and neuter nouns take an -s or -es at the end.",
    commonMistake: "Das Auto von der Mann",
    correction: "Das Auto des Mannes",
    explanationAR: "رغم أن استخدام von + Dativ شائع، إلا أن الحالة الصحيحة للإضافة (المضاف إليه) هي الجينيتيف (des Mannes).",
    targetCEFR: "B1",
    frequency: "medium",
    conceptId: "genitiv"
  },
  {
    id: "err_relative_clauses_1",
    errorType: "subordinate_clause",
    arabicSource: "الاسم الموصول 'الذي/التي' ثابت لا يتغير إلا مع المثنى والجمع.",
    germanRule: "Relative pronouns change according to gender, number, and their case in the relative clause. The verb goes to the end.",
    commonMistake: "Der Mann, der ich sehe...",
    correction: "Der Mann, den ich sehe...",
    explanationAR: "الضمير الموصول يأخذ حالته من موقعه في الجملة الجانبية. بما أن الرجل مفعول به في جملة (أراه)، نستخدم den.",
    targetCEFR: "B1",
    frequency: "high",
    conceptId: "relative_clauses"
  },
  {
    id: "err_n_declension_1",
    errorType: "case",
    arabicSource: "الأسماء في العربية لا تتغير نهايتها في حالة النصب أو الجر، فقط التشكيل.",
    germanRule: "Certain masculine nouns (n-declension) take an -(e)n ending in all cases except Nominative singular.",
    commonMistake: "Ich frage der Student.",
    correction: "Ich frage den Studenten.",
    explanationAR: "كلمة Student تتبع ما يسمى N-Deklination، مما يعني أنها تأخذ حرف en في كل الحالات باستثناء الفاعل المفرد.",
    targetCEFR: "B1",
    frequency: "low",
    conceptId: "n_declension"
  },
  {
    id: "err_verb_conjugation_1",
    errorType: "verb_conjugation",
    arabicSource: "في العربية الفعل المضارع يتغير حسب الضمير بحروف المضارعة.",
    germanRule: "German regular verbs drop the -en and add -e, -st, -t, -en, -t, -en.",
    commonMistake: "Er spiel Fußball.",
    correction: "Er spielt Fußball.",
    explanationAR: "مع الضمائر er/sie/es يجب إضافة t في نهاية جذر الفعل (spielen -> spielt).",
    targetCEFR: "A1",
    frequency: "very_high",
    conceptId: "verb_conjugation_present"
  }
];

export function getErrorsByType(type: ArabicError['errorType']): ArabicError[] {
  return ARABIC_ERRORS.filter(err => err.errorType === type);
}

export function getErrorsByCEFR(cefr: 'A1'|'A2'|'B1'|'B2'): ArabicError[] {
  return ARABIC_ERRORS.filter(err => err.targetCEFR === cefr);
}

export function getTopFrequencyErrors(limit?: number): ArabicError[] {
  const sorted = [...ARABIC_ERRORS].sort((a, b) => {
    const val = { very_high: 3, high: 2, medium: 1, low: 0 };
    return val[b.frequency] - val[a.frequency];
  });
  return limit ? sorted.slice(0, limit) : sorted;
}
