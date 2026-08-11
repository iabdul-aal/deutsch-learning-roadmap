/**
 * ══════════════════════════════════════════════════════════
 * MISSIONS DATA - Real-World German Simulation Scenarios
 * 12 missions covering Life, Study, and Career tracks.
 * ══════════════════════════════════════════════════════════
 */

export type MissionTrack = 'LIFE' | 'STUDY' | 'CAREER';
export type MissionDifficulty = 'A1' | 'A2' | 'B1' | 'B2';

export interface MissionVocab {
  german: string;
  arabic: string;
  example: string;
}

export interface MissionDialog {
  speaker: 'YOU' | 'OTHER';
  german: string;
  arabic: string;
  audio?: string;
}

export interface MissionTask {
  id: string;
  type: 'DIALOG' | 'FILL_IN' | 'TRANSLATE' | 'LISTEN' | 'WRITE';
  prompt: string;
  promptAR: string;
  content: string;
  answer?: string;
  explanation?: string;
  explanationAR?: string;
}

export interface Mission {
  id: string;
  title: string;
  titleAR: string;
  description: string;
  descriptionAR: string;
  track: MissionTrack;
  difficulty: MissionDifficulty;
  estimatedMinutes: number;
  scenario: string;          // Where does this take place?
  scenarioAR: string;
  keyVocab: MissionVocab[];
  dialog: MissionDialog[];
  tasks: MissionTask[];
  successCriteria: string;
  successCriteriaAR: string;
  videoId?: string;          // Embedded support video
  icon: string;              // Emoji icon
}

export const MISSIONS: Mission[] = [
  // ── LIFE TRACK ─────────────────────────────────────────────────

  {
    id: 'mission_introductions',
    title: 'Introduce Yourself in Germany',
    titleAR: 'تقديم نفسك في ألمانيا',
    description: 'You arrive at a German language course and need to introduce yourself to your classmates and teacher.',
    descriptionAR: 'وصلت إلى دورة اللغة الألمانية وتحتاج إلى تقديم نفسك لزملائك ومعلمتك.',
    track: 'LIFE',
    difficulty: 'A1',
    estimatedMinutes: 15,
    scenario: 'German language course - first day',
    scenarioAR: 'دورة اللغة الألمانية - اليوم الأول',
    icon: '',
    keyVocab: [
      { german: 'Ich heiße...', arabic: 'اسمي...', example: 'Ich heiße Ahmad.' },
      { german: 'Ich komme aus...', arabic: 'أنا من...', example: 'Ich komme aus Ägypten.' },
      { german: 'Ich wohne in...', arabic: 'أسكن في...', example: 'Ich wohne in Berlin.' },
      { german: 'Ich bin ... Jahre alt.', arabic: 'عمري ... سنة.', example: 'Ich bin 28 Jahre alt.' },
      { german: 'Mein Beruf ist...', arabic: 'مهنتي هي...', example: 'Mein Beruf ist Ingenieur.' },
      { german: 'Ich lerne Deutsch, weil...', arabic: 'أتعلم الألمانية لأن...', example: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.' },
      { german: 'Ich spreche Arabisch und Englisch.', arabic: 'أتكلم العربية والإنجليزية.', example: 'Ich spreche Arabisch und Englisch.' },
      { german: 'Freut mich!', arabic: 'يسعدني!', example: 'Freut mich, Sie kennenzulernen!' },
    ],
    dialog: [
      { speaker: 'OTHER', german: 'Guten Morgen! Ich bin Frau Müller, Ihre Deutschlehrerin. Wie heißen Sie?', arabic: 'صباح الخير! أنا الآنسة مولر، معلمة الألمانية. ما اسمك؟' },
      { speaker: 'YOU', german: 'Guten Morgen! Ich heiße Ahmad Al-Rashidi.', arabic: 'صباح الخير! اسمي أحمد الرشيدي.' },
      { speaker: 'OTHER', german: 'Woher kommen Sie, Herr Al-Rashidi?', arabic: 'من أين أنت يا سيد الرشيدي؟' },
      { speaker: 'YOU', german: 'Ich komme aus Jordanien. Ich wohne jetzt in München.', arabic: 'أنا من الأردن. أسكن الآن في ميونيخ.' },
      { speaker: 'OTHER', german: 'Sehr gut! Warum lernen Sie Deutsch?', arabic: 'ممتاز! لماذا تتعلم الألمانية؟' },
      { speaker: 'YOU', german: 'Ich lerne Deutsch, weil ich hier studieren möchte.', arabic: 'أتعلم الألمانية لأنني أريد الدراسة هنا.' },
      { speaker: 'OTHER', german: 'Wunderbar! Willkommen im Kurs!', arabic: 'رائع! مرحباً في الدورة!' },
    ],
    tasks: [
      {
        id: 't1', type: 'FILL_IN',
        prompt: 'Complete the introduction:',
        promptAR: 'أكمل التعريف بالنفس:',
        content: 'Ich _____ Ahmad. Ich _____ aus Syrien. Ich _____ in Hamburg.',
        answer: 'heiße / komme / wohne',
        explanation: 'heiße (my name is), komme (I come), wohne (I live)',
        explanationAR: 'heiße = اسمي، komme = أنا من، wohne = أسكن',
      },
      {
        id: 't2', type: 'TRANSLATE',
        prompt: 'Translate to German:',
        promptAR: 'ترجم إلى الألمانية:',
        content: 'My name is Sara. I am from Morocco. I am 24 years old.',
        answer: 'Ich heiße Sara. Ich komme aus Marokko. Ich bin 24 Jahre alt.',
      },
      {
        id: 't3', type: 'WRITE',
        prompt: 'Write your own self-introduction (4-5 sentences):',
        promptAR: 'اكتب تعريفاً بنفسك (4-5 جمل):',
        content: 'Use: Name, Herkunft (origin), Wohnort (city), Alter (age), Beruf oder Ziel (job/goal)',
      },
    ],
    successCriteria: 'You can confidently introduce yourself including name, origin, city, age, and reason for learning German.',
    successCriteriaAR: 'تستطيع تقديم نفسك بثقة بما في ذلك الاسم والبلد والمدينة والعمر وسبب تعلم الألمانية.',
    videoId: 'r94aqLUO0wo',
  },

  {
    id: 'mission_doctor_visit',
    title: 'Visit the Doctor (Arztbesuch)',
    titleAR: 'زيارة الطبيب',
    description: 'You are not feeling well and need to visit a German doctor. Learn to describe symptoms and understand medical instructions.',
    descriptionAR: 'لا تشعر بتحسن وتحتاج إلى زيارة طبيب ألماني. تعلم وصف الأعراض وفهم التعليمات الطبية.',
    track: 'LIFE',
    difficulty: 'A2',
    estimatedMinutes: 20,
    scenario: 'German doctor\'s office (Arztpraxis)',
    scenarioAR: 'عيادة طبيب ألماني',
    icon: '',
    keyVocab: [
      { german: 'Ich habe Schmerzen.', arabic: 'عندي ألم.', example: 'Ich habe Kopfschmerzen.' },
      { german: 'Mir ist schwindelig.', arabic: 'أشعر بالدوار.', example: 'Mir ist sehr schwindelig.' },
      { german: 'Ich habe Fieber.', arabic: 'عندي حمى.', example: 'Ich habe seit zwei Tagen Fieber.' },
      { german: 'Seit wann haben Sie...?', arabic: 'منذ متى...؟', example: 'Seit wann haben Sie Husten?' },
      { german: 'das Rezept', arabic: 'الوصفة الطبية', example: 'Hier ist das Rezept für die Apotheke.' },
      { german: 'die Krankenversicherung', arabic: 'التأمين الصحي', example: 'Haben Sie eine Krankenversicherung?' },
      { german: 'dreimal täglich', arabic: 'ثلاث مرات يومياً', example: 'Nehmen Sie die Tabletten dreimal täglich.' },
      { german: 'einen Termin machen', arabic: 'حجز موعد', example: 'Ich möchte einen Termin machen.' },
    ],
    dialog: [
      { speaker: 'OTHER', german: 'Guten Morgen! Was kann ich für Sie tun?', arabic: 'صباح الخير! كيف أستطيع مساعدتك؟' },
      { speaker: 'YOU', german: 'Guten Morgen. Ich fühle mich nicht gut. Ich habe Halsschmerzen und Fieber.', arabic: 'صباح الخير. لا أشعر بتحسن. عندي ألم في الحلق وحمى.' },
      { speaker: 'OTHER', german: 'Seit wann haben Sie diese Symptome?', arabic: 'منذ متى لديك هذه الأعراض؟' },
      { speaker: 'YOU', german: 'Seit drei Tagen. Ich habe auch Husten.', arabic: 'منذ ثلاثة أيام. لدي أيضاً سعال.' },
      { speaker: 'OTHER', german: 'Haben Sie Allergien gegen Medikamente?', arabic: 'هل لديك حساسية من أي دواء؟' },
      { speaker: 'YOU', german: 'Nein, keine Allergien.', arabic: 'لا، لا توجد حساسية.' },
      { speaker: 'OTHER', german: 'Ich schreibe Ihnen ein Rezept. Nehmen Sie die Tabletten zweimal täglich, nach dem Essen.', arabic: 'سأكتب لك وصفة طبية. تناول الأقراص مرتين يومياً بعد الأكل.' },
      { speaker: 'YOU', german: 'Danke, Herr Doktor. Wie lange muss ich die Tabletten nehmen?', arabic: 'شكراً دكتور. كم يوماً يجب أن آخذ الأقراص؟' },
      { speaker: 'OTHER', german: 'Sieben Tage. Und trinken Sie viel Wasser. Gute Besserung!', arabic: 'سبعة أيام. واشرب الكثير من الماء. تمنياتي بالشفاء!' },
    ],
    tasks: [
      {
        id: 't1', type: 'FILL_IN',
        prompt: 'Complete the sentences using the correct verb:',
        promptAR: 'أكمل الجمل باستخدام الفعل الصحيح:',
        content: 'Ich _____ Kopfschmerzen. (have) / Mir _____ schwindelig. (feel) / Ich _____ seit zwei Tagen Fieber. (have)',
        answer: 'habe / ist / habe',
        explanationAR: 'تذكر: "Mir ist schwindelig" هو تعبير ثابت - لا تقل "Ich bin schwindelig"',
      },
      {
        id: 't2', type: 'TRANSLATE',
        prompt: 'Translate to German:',
        promptAR: 'ترجم إلى الألمانية:',
        content: 'I have had a headache for two days. I also have a fever. I have no allergies.',
        answer: 'Ich habe seit zwei Tagen Kopfschmerzen. Ich habe auch Fieber. Ich habe keine Allergien.',
      },
    ],
    successCriteria: 'You can describe symptoms, answer doctor\'s questions, and understand basic medical instructions.',
    successCriteriaAR: 'تستطيع وصف الأعراض والإجابة على أسئلة الطبيب وفهم التعليمات الطبية الأساسية.',
    videoId: 'g-Z1_t_a-k0',
  },

  {
    id: 'mission_renting_apartment',
    title: 'Rent an Apartment (Wohnung mieten)',
    titleAR: 'استئجار شقة',
    description: 'You need to find and rent an apartment in Germany. Navigate the rental process, communicate with landlords, and understand contracts.',
    descriptionAR: 'تحتاج إلى إيجاد شقة وتأجيرها في ألمانيا. تعلم التعامل مع المالك وفهم العقود.',
    track: 'LIFE',
    difficulty: 'A2',
    estimatedMinutes: 25,
    scenario: 'Apartment viewing and rental office',
    scenarioAR: 'معاينة الشقة ومكتب الإيجار',
    icon: '',
    keyVocab: [
      { german: 'die Kaltmiete', arabic: 'الإيجار بدون تدفئة', example: 'Die Kaltmiete beträgt 650 Euro.' },
      { german: 'die Nebenkosten', arabic: 'التكاليف الإضافية', example: 'Die Nebenkosten betragen 120 Euro.' },
      { german: 'die Kaution', arabic: 'التأمين / الكفالة', example: 'Die Kaution beträgt drei Monatsmieten.' },
      { german: 'der Mietvertrag', arabic: 'عقد الإيجار', example: 'Ich möchte den Mietvertrag lesen.' },
      { german: 'die Besichtigung', arabic: 'المعاينة', example: 'Wann kann ich die Wohnung besichtigen?' },
      { german: 'möbliert / unmöbliert', arabic: 'مفروشة / غير مفروشة', example: 'Ist die Wohnung möbliert?' },
      { german: 'der Hausmeister', arabic: 'حارس العمارة / مشرف المبنى', example: 'Der Hausmeister heißt Herr Weber.' },
      { german: 'das Einwohnermeldeamt', arabic: 'مكتب تسجيل السكان', example: 'Ich muss mich beim Einwohnermeldeamt anmelden.' },
    ],
    dialog: [
      { speaker: 'OTHER', german: 'Guten Tag! Sie interessieren sich für die Wohnung?', arabic: 'مرحباً! أنت مهتم بالشقة؟' },
      { speaker: 'YOU', german: 'Ja, genau. Wie groß ist die Wohnung?', arabic: 'نعم، بالضبط. ما مساحة الشقة؟' },
      { speaker: 'OTHER', german: 'Die Wohnung hat 65 Quadratmeter. Zwei Zimmer, Küche und Badezimmer.', arabic: 'الشقة مساحتها 65 متراً مربعاً. غرفتان ومطبخ وحمام.' },
      { speaker: 'YOU', german: 'Wie hoch ist die Miete?', arabic: 'كم الإيجار؟' },
      { speaker: 'OTHER', german: 'Die Kaltmiete ist 750 Euro. Mit Nebenkosten 900 Euro monatlich.', arabic: 'الإيجار بدون تدفئة 750 يورو. مع التكاليف الإضافية 900 يورو شهرياً.' },
      { speaker: 'YOU', german: 'Ist eine Einbauküche vorhanden?', arabic: 'هل يوجد مطبخ مدمج؟' },
      { speaker: 'OTHER', german: 'Ja, die Küche ist komplett eingerichtet. Wann möchten Sie einziehen?', arabic: 'نعم، المطبخ مجهز بالكامل. متى تريد الانتقال؟' },
      { speaker: 'YOU', german: 'Am ersten des nächsten Monats, wenn möglich.', arabic: 'في أول الشهر القادم، إذا أمكن.' },
    ],
    tasks: [
      {
        id: 't1', type: 'FILL_IN',
        prompt: 'Fill in the correct word:',
        promptAR: 'أكمل بالكلمة الصحيحة:',
        content: 'Die _____ ist 700 Euro. (cold rent) / Die _____ beträgt 150 Euro. (utility costs) / Ich brauche einen _____. (rental contract)',
        answer: 'Kaltmiete / Nebenkosten / Mietvertrag',
      },
      {
        id: 't2', type: 'WRITE',
        prompt: 'Write an email to a landlord asking about an apartment (5-6 sentences):',
        promptAR: 'اكتب بريداً إلكترونياً إلى مالك شقة يسأل عن شقة (5-6 جمل):',
        content: 'Include: greeting, your name, interest in the apartment, questions about size/price/availability, closing',
      },
    ],
    successCriteria: 'You can communicate with a landlord, ask about rental details, and understand basic lease terms.',
    successCriteriaAR: 'تستطيع التواصل مع مالك الشقة والسؤال عن تفاصيل الإيجار وفهم بنود العقد الأساسية.',
    videoId: 'OFSHdj_2FQA',
  },

  {
    id: 'mission_supermarket',
    title: 'Shopping at the Supermarket',
    titleAR: 'التسوق في السوبرماركت',
    description: 'Navigate a German supermarket: find items, ask for help, understand prices, and check out at the register.',
    descriptionAR: 'تسوق في سوبرماركت ألماني: ابحث عن المنتجات واطلب المساعدة وافهم الأسعار وادفع عند الكاشير.',
    track: 'LIFE',
    difficulty: 'A1',
    estimatedMinutes: 15,
    scenario: 'German supermarket (REWE, Edeka, Aldi)',
    scenarioAR: 'سوبرماركت ألماني',
    icon: '',
    keyVocab: [
      { german: 'Wo finde ich...?', arabic: 'أين أجد...؟', example: 'Wo finde ich die Milch?' },
      { german: 'Was kostet...?', arabic: 'كم يكلف...؟', example: 'Was kostet das Brot?' },
      { german: 'das Sonderangebot', arabic: 'العرض الخاص', example: 'Das ist im Sonderangebot.' },
      { german: 'die Kasse', arabic: 'الكاشير / صندوق الدفع', example: 'Die Kasse ist dort drüben.' },
      { german: 'Tüte / Tasche', arabic: 'كيس / حقيبة', example: 'Brauchen Sie eine Tüte?' },
      { german: 'Bargeld / Karte', arabic: 'نقداً / بطاقة', example: 'Zahlen Sie mit Karte?' },
      { german: 'bio / ökologisch', arabic: 'عضوي', example: 'Das ist Bio-Gemüse.' },
      { german: 'das Haltbarkeitsdatum', arabic: 'تاريخ انتهاء الصلاحية', example: 'Das Haltbarkeitsdatum ist morgen.' },
    ],
    dialog: [
      { speaker: 'YOU', german: 'Entschuldigung, wo finde ich die Eier?', arabic: 'عذراً، أين أجد البيض؟' },
      { speaker: 'OTHER', german: 'Die Eier sind in Gang drei, auf der rechten Seite.', arabic: 'البيض في الممر الثالث، على الجانب الأيمن.' },
      { speaker: 'YOU', german: 'Danke! Und wo ist die Käsetheke?', arabic: 'شكراً! وأين قسم الجبن؟' },
      { speaker: 'OTHER', german: 'Die Käsetheke ist hinten links, neben der Fleischabteilung.', arabic: 'قسم الجبن في الخلف على اليسار، بجانب قسم اللحوم.' },
      { speaker: 'YOU', german: 'Vielen Dank! Nehmen Sie auch Karte?', arabic: 'شكراً جزيلاً! هل تقبلون البطاقة أيضاً؟' },
      { speaker: 'OTHER', german: 'Ja, natürlich. EC-Karte und Kreditkarte.', arabic: 'نعم، بالطبع. بطاقة EC والبطاقة الائتمانية.' },
    ],
    tasks: [
      {
        id: 't1', type: 'TRANSLATE',
        prompt: 'Translate these shopping phrases to German:',
        promptAR: 'ترجم هذه الجمل التسويقية إلى الألمانية:',
        content: '1. Where can I find bread?\n2. How much does this cost?\n3. Do you have a bag?\n4. I would like to pay by card.',
        answer: '1. Wo finde ich das Brot? / 2. Was kostet das? / 3. Haben Sie eine Tüte? / 4. Ich möchte mit Karte bezahlen.',
      },
    ],
    successCriteria: 'You can navigate a German supermarket, ask for items, and check out successfully.',
    successCriteriaAR: 'تستطيع التنقل في سوبرماركت ألماني والسؤال عن المنتجات والدفع بنجاح.',
    videoId: '4l4NlK79q14',
  },

  // ── STUDY TRACK ─────────────────────────────────────────────────

  {
    id: 'mission_university_email',
    title: 'Email a German Professor',
    titleAR: 'إرسال بريد إلكتروني لأستاذ ألماني',
    description: 'Write a formal German email to a university professor requesting information about a seminar or thesis supervision.',
    descriptionAR: 'اكتب بريداً إلكترونياً رسمياً بالألمانية إلى أستاذ جامعي تطلب معلومات عن ندوة أو الإشراف على أطروحتك.',
    track: 'STUDY',
    difficulty: 'B1',
    estimatedMinutes: 25,
    scenario: 'German university email',
    scenarioAR: 'بريد إلكتروني جامعي ألماني',
    icon: '',
    keyVocab: [
      { german: 'Sehr geehrte/r Frau/Herr Professor...', arabic: 'السيدة/السيد الأستاذ العزيز/ة...', example: 'Sehr geehrte Frau Professorin Schmidt,' },
      { german: 'Ich wende mich an Sie, weil...', arabic: 'أتواصل معك لأن...', example: 'Ich wende mich an Sie, weil ich an Ihrem Seminar interessiert bin.' },
      { german: 'Mit freundlichen Grüßen', arabic: 'مع خالص التحيات', example: 'Mit freundlichen Grüßen, Ahmad Al-Rashidi' },
      { german: 'die Sprechstunde', arabic: 'ساعة الاستشارة / الإرشاد', example: 'Wann ist Ihre Sprechstunde?' },
      { german: 'die Anmeldung', arabic: 'التسجيل', example: 'Wie kann ich mich für das Seminar anmelden?' },
      { german: 'beifügen / im Anhang', arabic: 'مرفق', example: 'Im Anhang finden Sie meinen Lebenslauf.' },
      { german: 'im Voraus danken', arabic: 'أشكرك مسبقاً', example: 'Ich danke Ihnen im Voraus für Ihre Hilfe.' },
    ],
    dialog: [],
    tasks: [
      {
        id: 't1', type: 'WRITE',
        prompt: 'Write a formal email to Professor Dr. Weber asking about attending his/her seminar on German literature next semester:',
        promptAR: 'اكتب بريداً إلكترونياً رسمياً إلى البروفيسور دكتور ويبر تسأل عن حضور ندوته/ندوتها حول الأدب الألماني الفصل القادم:',
        content: 'Include: Formal salutation / Your name and student ID / Reason for writing / Specific question about the seminar / Request for office hours / Formal closing',
        explanation: 'German formal emails follow strict conventions: Sehr geehrte/r (not Liebe/r), Sie (formal you), professional closing.',
        explanationAR: 'الرسائل الرسمية الألمانية لها قواعد صارمة: Sehr geehrte/r (وليس Liebe/r)، استخدم Sie (المحترم)، وخاتمة مهنية.',
      },
      {
        id: 't2', type: 'FILL_IN',
        prompt: 'Complete the formal email opening:',
        promptAR: 'أكمل مقدمة البريد الإلكتروني الرسمي:',
        content: '_____ geehrte Frau Professorin Schmidt, ich _____ mich an Sie wegen des Seminars "Deutsche Literatur im 20. Jahrhundert". Ich bin Student im dritten _____ des Bachelorstudiengangs Germanistik.',
        answer: 'Sehr / wende / Semester',
      },
    ],
    successCriteria: 'You can write a formal German university email with correct salutation, content, and closing.',
    successCriteriaAR: 'تستطيع كتابة بريد إلكتروني رسمي ألماني جامعي بالتحية والمحتوى والخاتمة الصحيحة.',
  },

  // ── CAREER TRACK ────────────────────────────────────────────────

  {
    id: 'mission_job_interview',
    title: 'German Job Interview',
    titleAR: 'مقابلة عمل ألمانية',
    description: 'Prepare for and practice a German job interview. Learn to present your qualifications, answer common questions, and ask professional questions.',
    descriptionAR: 'استعد لمقابلة عمل ألمانية وتدرب عليها. تعلم تقديم مؤهلاتك والإجابة على الأسئلة الشائعة.',
    track: 'CAREER',
    difficulty: 'B1',
    estimatedMinutes: 30,
    scenario: 'Job interview at a German company',
    scenarioAR: 'مقابلة عمل في شركة ألمانية',
    icon: '',
    keyVocab: [
      { german: 'Erzählen Sie von sich.', arabic: 'أخبرني عن نفسك.', example: 'Erzählen Sie mir etwas über sich.' },
      { german: 'Meine Stärken sind...', arabic: 'نقاط قوتي هي...', example: 'Meine Stärken sind Teamfähigkeit und Zuverlässigkeit.' },
      { german: 'Meine Schwächen sind...', arabic: 'نقاط ضعفي هي...', example: 'Meine Schwäche ist manchmal Perfektionismus.' },
      { german: 'Ich bringe mit...', arabic: 'أحضر معي... / لدي...', example: 'Ich bringe fünf Jahre Berufserfahrung mit.' },
      { german: 'Gehaltsvorstellung', arabic: 'التوقعات المالية', example: 'Meine Gehaltsvorstellung liegt bei 45.000 Euro jährlich.' },
      { german: 'Warum bewerben Sie sich?', arabic: 'لماذا تتقدم للوظيفة؟', example: 'Warum bewerben Sie sich bei uns?' },
      { german: 'Teamfähigkeit', arabic: 'القدرة على العمل في فريق', example: 'Ich bin sehr teamfähig.' },
      { german: 'der Lebenslauf', arabic: 'السيرة الذاتية', example: 'Hier ist mein Lebenslauf.' },
    ],
    dialog: [
      { speaker: 'OTHER', german: 'Guten Tag, Herr Al-Rashidi. Bitte nehmen Sie Platz. Erzählen Sie mir kurz etwas über sich.', arabic: 'مرحباً سيد الرشيدي. تفضل بالجلوس. أخبرني باختصار عن نفسك.' },
      { speaker: 'YOU', german: 'Guten Tag, Frau Schneider. Ich bin Ahmad Al-Rashidi, Softwareentwickler mit sechs Jahren Erfahrung. Ich habe in Jordanien studiert und drei Jahre bei einem internationalen Unternehmen gearbeitet.', arabic: 'مرحباً آنسة شنايدر. أنا أحمد الرشيدي، مطور برمجيات بخبرة ست سنوات. درست في الأردن وعملت ثلاث سنوات في شركة دولية.' },
      { speaker: 'OTHER', german: 'Warum möchten Sie bei uns arbeiten?', arabic: 'لماذا تريد العمل معنا؟' },
      { speaker: 'YOU', german: 'Ihr Unternehmen ist bekannt für innovative Technologien. Ich möchte meine Kenntnisse in einem deutschen Umfeld weiterentwickeln und zum Wachstum des Unternehmens beitragen.', arabic: 'شركتكم معروفة بالتقنيات المبتكرة. أريد تطوير مهاراتي في بيئة ألمانية والمساهمة في نمو الشركة.' },
      { speaker: 'OTHER', german: 'Was sind Ihre Stärken?', arabic: 'ما نقاط قوتك؟' },
      { speaker: 'YOU', german: 'Ich bin sehr analytisch und lösungsorientiert. Außerdem bin ich teamfähig und lerne schnell neue Technologien.', arabic: 'أنا تحليلي جداً وأركز على الحلول. فضلاً عن ذلك، أستطيع العمل في فريق وأتعلم التقنيات الجديدة بسرعة.' },
    ],
    tasks: [
      {
        id: 't1', type: 'WRITE',
        prompt: 'Write a 4-sentence answer to "Erzählen Sie von sich" (Tell me about yourself):',
        promptAR: 'اكتب إجابة من 4 جمل على سؤال "أخبرني عن نفسك":',
        content: 'Include: your name, your profession/field, your experience, why you are interested in this company',
        explanationAR: 'في المقابلات الألمانية: كن موجزاً ومهنياً. تجنب المعلومات الشخصية جداً مثل الحالة الاجتماعية أو الأطفال.',
      },
    ],
    successCriteria: 'You can introduce yourself professionally, answer common interview questions, and present your qualifications in German.',
    successCriteriaAR: 'تستطيع تقديم نفسك مهنياً والإجابة على أسئلة المقابلة الشائعة وعرض مؤهلاتك بالألمانية.',
  },
];

// ── Helpers ──────────────────────────────────────────────────────
export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id);
}

export function getMissionsByTrack(track: MissionTrack): Mission[] {
  return MISSIONS.filter(m => m.track === track);
}

export function getMissionsByDifficulty(level: MissionDifficulty): Mission[] {
  return MISSIONS.filter(m => m.difficulty === level);
}

export function getMissionsForLevel(cefr: string): Mission[] {
  const levelMap: Record<string, MissionDifficulty[]> = {
    A1: ['A1'],
    A2: ['A1', 'A2'],
    B1: ['A1', 'A2', 'B1'],
    B2: ['A1', 'A2', 'B1', 'B2'],
  };
  const allowed = levelMap[cefr] ?? ['A1'];
  return MISSIONS.filter(m => allowed.includes(m.difficulty));
}
