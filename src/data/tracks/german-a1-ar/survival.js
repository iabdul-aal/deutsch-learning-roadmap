export const SURVIVAL_DATA = {
  title: "Germany Survival Module (Practical Phrasebook & Scenarios)",
  description: "Essential German phrases, Goethe-Zertifikat A1 exam prompts, FAU Erlangen-Nürnberg university phrases, and interactive scenario roleplays across 7 critical domains.",
  categories: [
    {
      id: "arrival",
      title: "Airport & Arrival",
      icon: "Plane",
      description: "Navigating Frankfurt / Munich Airport, passport control, luggage claim, train transfer.",
      phrases: [
        {
          id: "arr-1",
          german: "Guten Tag, hier ist mein Reisepass und mein Visum.",
          arabic: "مساء/صباح الخير، تفضل هذا هو جواز سفري وتأشيرتي.",
          phonetic: "غووتن تاغ، هير إيست ماين رايزه-باس أوند ماين فيزوم.",
          example: "At Passport Control: Present your passport to the Bundespolizei officer.",
          roleplay: "Officer: 'Pässe bitte.' -> You: 'Guten Tag, hier ist mein Reisepass und mein Visum.'"
        },
        {
          id: "arr-2",
          german: "Ich studiere an der FAU Erlangen-Nürnberg.",
          arabic: "أنا أدرس في جامعة إرلانغن-نورنبرغ (FAU).",
          phonetic: "إيش شتوديره أن دير إف-آ-أو إرلانغن-نورنبرغ.",
          example: "Explaining your purpose of entry to customs officers.",
          roleplay: "Officer: 'Was machen Sie in Deutschland?' -> You: 'Ich studiere an der FAU Erlangen-Nürnberg.'"
        },
        {
          id: "arr-3",
          german: "Wo ist das Gepäckband für den Flug aus Kairo?",
          arabic: "أين شريط الأمتعة الخاص بالرحلة القادمة من القاهرة؟",
          phonetic: "فو إيست داس غيبِك-باند فور دين فلوغ أوس كايـرو؟",
          example: "Finding baggage claim at Frankfurt/Munich Airport.",
          roleplay: "You: 'Entschuldigung, wo ist das Gepäckband für den Flug aus Kairo?' -> Info Staff: 'Halle B, Band 14.'"
        },
        {
          id: "arr-4",
          german: "Wo ist der Fernbahnhof für Züge nach Nürnberg?",
          arabic: "أين تقع محطة القطارات البعيدة للقطارات المتجهة إلى نورنبرغ؟",
          phonetic: "فو إيست دير فيرن-بان-هوف فور تسوغه ناخ نورنبرغ؟",
          example: "Transferring from airport terminal to ICE train station.",
          roleplay: "You: 'Wo ist der Fernbahnhof?' -> Staff: 'Folgen Sie den grünen Schildern (T).'"
        },
        {
          id: "arr-5",
          german: "Ich möchte eine Fahrkarte nach Erlangen kaufen.",
          arabic: "أود شراء تذكرة قطار إلى إرلانغن.",
          phonetic: "إيش موشته آينه فار-كارته ناخ إرلانغن كوفن.",
          example: "Buying a ticket at DB Reisezentrum ticket counter.",
          roleplay: "Clerk: 'Wie kann ich Ihnen helfen?' -> You: 'Ich möchte eine Fahrkarte nach Erlangen kaufen.'"
        }
      ]
    },
    {
      id: "university",
      title: "University & Academic Life (FAU Erlangen-Nürnberg)",
      icon: "GraduationCap",
      description: "Enrollment (Immatrikulation), FAU Sprachenzentrum, student office, Mensa & library.",
      phrases: [
        {
          id: "uni-1",
          german: "Ich möchte mich für den Studiengang Informatik an der FAU immatrikulieren.",
          arabic: "أود التسجيل في تخصص علوم الحاسوب في جامعة FAU.",
          phonetic: "إيش موشته ميش فور دين شتودين-غانغ إنفورماتيك أن دير إف-آ-أو إماتريكوليرن.",
          example: "At Student Records Office (Immatrikulationsamt FAU Erlangen).",
          roleplay: "Clerk: 'Guten Tag, wie kann ich helfen?' -> You: 'Ich möchte mich immatrikulieren.'"
        },
        {
          id: "uni-2",
          german: "Sehr geehrte Frau Prof. Dr. Müller, ich benötige eine Bestätigung.",
          arabic: "الأستاذة الدكتورة مولر المحترمة، أحتاج إلى إفادة رسمية.",
          phonetic: "زير غيرته فراو بروفيسور دوكتور مولر، إيش بينوتيكه آينه بيشتيتيغونغ.",
          example: "Formal academic email to a German university professor.",
          roleplay: "Email Subject: 'Sprechstunde & Kursbestätigung - FAU Erlangen'"
        },
        {
          id: "uni-3",
          german: "Wo ist die Universitätsbibliothek und wie lautet das WLAN-Passwort?",
          arabic: "أين تقع مكتبة الجامعة وما هي كلمة سر الإنترنت؟",
          phonetic: "فو إيست دي أونيفيرزيتيتس-بيبيليوتيك أوند في لاوتت داس فيلان-باسفورت؟",
          example: "Asking campus security or students at FAU library.",
          roleplay: "Student: 'Die Bibliothek ist im Gebäude 3, WLAN ist Eduroam.'"
        },
        {
          id: "uni-4",
          german: "Ich habe den Deutschkurs A1 am Sprachenzentrum absolviert.",
          arabic: "أكملت كورس اللغة الألمانية للمستوى A1 في مركز اللغات بالجامعة.",
          phonetic: "إيش هابه دين دويتش-كورس أ-آينس أم شبراخن-تسينتروم أبسولفيرت.",
          example: "Verifying your German language certificate level at FAU Sprachenzentrum.",
          roleplay: "Advisor: 'Haben Sie ein A1-Zertifikat?' -> You: 'Ja, vom Sprachenzentrum / Goethe-Institut.'"
        },
        {
          id: "uni-5",
          german: "Gibt es heute ein vegetarisches Gericht in der Mensa?",
          arabic: "هل توجد وجبة نباتية اليوم في مطعم الجامعة (المينسا)؟",
          phonetic: "غيبت إيس هويته آين فيغيتاريشيس غيريشت ين دير مينسا؟",
          example: "Ordering food at Studentenwerk Erlangen-Nürnberg Mensa counter.",
          roleplay: "Staff: 'Ja, Kichererbsen-Curry mit Reis auf Linie 1.'"
        }
      ]
    },
    {
      id: "housing",
      title: "Housing, Landlord & WG Life",
      icon: "Home",
      description: "Apartment searching, WG interviews, Nebenkosten, Hausordnung & Studentenwerk.",
      phrases: [
        {
          id: "hou-1",
          german: "Sehr geehrter Herr Schmidt, ich interessiere mich für die 1-Zimmer-Wohnung.",
          arabic: "السيد شميدت المحترم، أنا مهتم بشقة الغرفة الواحدة.",
          phonetic: "زير غيرتر هير شميدت، إيش إينتريزيره ميش فور دي آين-تسيمر-فوهنونغ.",
          example: "First message to a landlord on WG-Gesucht / ImmobilienScout24.",
          roleplay: "Writing inquiry email for a student room near FAU campus."
        },
        {
          id: "hou-2",
          german: "Wie hoch ist die Kaltmiete und wie viel betragen die Nebenkosten?",
          arabic: "كم تبلغ قيمة الإيجار الصافي وكم تبلغ المصاريف الإضافية (الخدمات)؟",
          phonetic: "في هوخ إيست دي كالت-ميته أوند في فيل بيتراغن دي نيبن-كوستن؟",
          example: "Asking landlord during apartment viewing (Besichtigung).",
          roleplay: "Landlord: 'Die Kaltmiete ist 350 Euro, Nebenkosten 100 Euro.'"
        },
        {
          id: "hou-3",
          german: "Brauche ich eine Wohnungsgeberbestätigung für die Bürgeramt-Anmeldung?",
          arabic: "هل أحتاج إلى تأكيد المؤجر لتسجيل السكن في دائرة النفوس؟",
          phonetic: "براوخه إيش آينه فوهنونغس-غيبير-بيشتيتيغونغ فور دي بورغرامت-أنميلدونغ؟",
          example: "Mandatory landlord paper for legal residence registration in Germany.",
          roleplay: "You: 'Können Sie die Bestätigung ausfüllen?' -> Landlord: 'Ja, natürlich.'"
        },
        {
          id: "hou-4",
          german: "Die Heizung im Zimmer ist kaputt. Wann kommt der Hausmeister?",
          arabic: "التدفئة في الغرفة معطلة. متى يأتي حارس البناية لإصلاحها؟",
          phonetic: "دي هايتسونغ إم تسيمر إيست كابوت. فأن كومت دير هاوس-مايستر؟",
          example: "Reporting winter heating issue to house caretaker / Studentenwerk.",
          roleplay: "Caretaker: 'Ich komme morgen um 9 Uhr vorbei.'"
        },
        {
          id: "hou-5",
          german: "Darf ich die Waschmaschine im Keller benutzen?",
          arabic: "هل يُسمح لي باستخدام الغسالة في القبو؟",
          phonetic: "دارف إيش دي فاش-ماشينه إم كيلر بينوتسن؟",
          example: "Asking flatmates (WG-Bewohner) about laundry room rules.",
          roleplay: "Flatmate: 'Ja, du brauchst Waschmarken von der Kasse.'"
        }
      ]
    },
    {
      id: "daily_life",
      title: "Supermarket, Pharmacy & Doctors",
      icon: "ShoppingBag",
      description: "Supermarket shopping (REWE/ALDI), pharmacy (Apotheke) & doctor appointments.",
      phrases: [
        {
          id: "sup-1",
          german: "Entschuldigung, wo finde ich die haltbare Milch und das Vollkornbrot?",
          arabic: "معذرة، أين أجد الحليب طويل الأجل والخبز الأسمر؟",
          phonetic: "إينتشولديغونغ، فو فينده إيش دي هالت باره ميلش أوند داس فولكورن-بروت؟",
          example: "Asking supermarket clerk at ALDI / REWE.",
          roleplay: "Clerk: 'Milch ist in Gang 4, Brot ist vorne beim Bäcker.'"
        },
        {
          id: "sup-2",
          german: "Ich hätte gerne zwei Brötchen und ein Stück Käse, bitte.",
          arabic: "أود الحصول على اثنين من الخبز الصغير وقطعة جبن، من فضلك.",
          phonetic: "إيش هيته غيرنه تسفاي بروتشن أوند آين شتوك كيزه، بيته.",
          example: "Ordering fresh bakery products at Bäckerei counter.",
          roleplay: "Baker: 'Sonst noch etwas?' -> You: 'Nein danke, das ist alles.'"
        },
        {
          id: "sup-3",
          german: "Kann ich mit EC-Karte oder Kreditkarte bezahlen?",
          arabic: "هل يمكنني الدفع ببطاقة المصرف الإلكترونية أو بطاقة الائتمان؟",
          phonetic: "كأن إيش مِت إي-سي-كارته أودر كريديت-كارته بيتسالن؟",
          example: "At store cash register (Kasse).",
          roleplay: "Cashier: 'Zahlen Sie bar oder mit Karte?' -> You: 'Mit Karte bitte.'"
        },
        {
          id: "sup-4",
          german: "Ich habe seit zwei Tagen Kopfschmerzen und Fieber.",
          arabic: "أعاني من صداع وحمى منذ يومين.",
          phonetic: "إيش هابه زايت تسفاي تاغن كوبف-شمرتسن أوند فيبر.",
          example: "Describing medical symptoms to doctor (Hausarzt).",
          roleplay: "Doctor: 'Was fehlt Ihnen?' -> You: 'Ich habe Kopfschmerzen und Fieber.'"
        },
        {
          id: "sup-5",
          german: "Haben Sie ein rezeptfreies Medikament gegen Erkältung?",
          arabic: "هل لديك دواء بدون وصفة طبية لنزلات البرد؟",
          phonetic: "هابن زي آين ريتسبت-فرايس ميديكامينت غيغن إيركيلتونغ؟",
          example: "Buying over-the-counter medicine at German Apotheke.",
          roleplay: "Pharmacist: 'Ja, nehmen Sie diese Schmerztabletten dreimal täglich.'"
        }
      ]
    },
    {
      id: "bureaucracy",
      title: "Bureaucracy, Visas, Goethe & Banking",
      icon: "FileText",
      description: "Anmeldung at Bürgeramt, Ausländerbehörde visa renewal, Goethe A1 exam, bank opening.",
      phrases: [
        {
          id: "bur-1",
          german: "Ich habe einen Termin um 10:30 Uhr für die Anmeldung meiner Wohnung.",
          arabic: "لدي موعد الساعة 10:30 لتسجيل سكن الجُديد في دائرة النفوس.",
          phonetic: "إيش هابه آينن تيرمين أوم تسين أور درايسيش فور دي أنميلدونغ ماينر فوهنونغ.",
          example: "Arriving at Bürgeramt / Rathaus Erlangen / Nürnberg.",
          roleplay: "Clerk: 'Terminnummer A-45?' -> You: 'Ja, das bin ich.'"
        },
        {
          id: "bur-2",
          german: "Ich möchte ein Girokonto für Studenten eröffnen.",
          arabic: "أود فتح حساب بنكي جاري للطلاب.",
          phonetic: "إيش موشته آين جيرو-كونتو فور شتودينتن إيرؤفنمن.",
          example: "Opening student bank account at Sparkasse / Deutsche Bank.",
          roleplay: "Clerk: 'Haben Sie Ihren Pass und die Immatrikulationsbescheinigung?' -> You: 'Ja, hier.'"
        },
        {
          id: "bur-3",
          german: "Hier ist mein Goethe-Zertifikat A1 Start Deutsch 1.",
          arabic: "تفضل هذه شهادة غوته A1 المعتمدة (Start Deutsch 1).",
          phonetic: "هير إيست ماين غوته-تسيرتيفيكات أ-آينس شتارت دويتش آينس.",
          example: "Presenting official Goethe A1 exam certificate at German Embassy / Ausländerbehörde.",
          roleplay: "Officer: 'Haben Sie den A1-Sprachnachweis?' -> You: 'Ja, vom Goethe-Institut.'"
        },
        {
          id: "bur-4",
          german: "Ich beantrage die Verlängerung meiner Aufenthaltserlaubnis.",
          arabic: "أتقدم بطلب لتمديد تصريح إقامتي.",
          phonetic: "إيش بيأنشترآغه دي فيرلينغيرونغ ماينر أوفينتهالتس-إيرلاوبنيس.",
          example: "Submitting visa extension application at Ausländerbehörde.",
          roleplay: "Officer: 'Haben Sie den Finanzierungsnachweis (Sperrkonto)?' -> You: 'Ja, hier.'"
        }
      ]
    },
    {
      id: "transport",
      title: "Trains, Buses & DB Navigator",
      icon: "Train",
      description: "Train travel, platforms (Gleis), train delays (Verspätung), Semesterticket.",
      phrases: [
        {
          id: "tra-1",
          german: "Von welchem Gleis fährt der Regionalzug nach Erlangen ab?",
          arabic: "من أي رصيف يغادر القطار الإقليمي المتجه إلى إرلانغن؟",
          phonetic: "فون فيلشيم غلايس فيرت دير ريغيونال-تسوغ ناخ إرلانغن أب؟",
          example: "Asking station info at Nürnberg Hauptbahnhof.",
          roleplay: "You: 'Entschuldigung, Gleis für Erlangen?' -> Info: 'Gleis 4, Abfahrt 14:12 Uhr.'"
        },
        {
          id: "tra-2",
          german: "Gilt mein Semesterticket auch für die S-Bahn nach Nürnberg?",
          arabic: "هل تذكرتي الجامعية (تكت الفصل) صالحة لقطار الـ S-Bahn إلى نورنبرغ؟",
          phonetic: "غيلت ماين سيميستر-تيكت آوخ فور دي إس-بان ناخ نورنبرغ؟",
          example: "Checking regional transport coverage with conductor (Schaffner).",
          roleplay: "Conductor: 'Ja, im gesamten VGN-Netz gültig.'"
        },
        {
          id: "tra-3",
          german: "Der ICE hat 15 Minuten Verspätung.",
          arabic: "قطار الـ ICE به تأخير لمدة 15 دقيقة.",
          phonetic: "دير إي-تسيه-إيه هات فيفتسين مينوتن فير شبيتونغ.",
          example: "Reading German station announcement display board.",
          roleplay: "Announcement: 'Achtung an Gleis 2: ICE 504 ca. 15 Minuten später.'"
        },
        {
          id: "tra-4",
          german: "Muss ich in Bamberg umsteigen?",
          arabic: "هل يجب عليّ تغيير القطار في بامبرغ؟",
          phonetic: "موس إيش ين بامبيرغ أوم-شتايغن؟",
          example: "Verifying train connection details on DB Navigator app.",
          roleplay: "You: 'Muss ich umsteigen?' -> Passenger: 'Nein, das ist ein Direktzug.'"
        }
      ]
    },
    {
      id: "emergency",
      title: "Emergency & Health Services (112 / 110)",
      icon: "AlertTriangle",
      description: "Calling 112 ambulance / fire brigade, 110 police, reporting theft or medical urgency.",
      phrases: [
        {
          id: "eme-1",
          german: "Notruf 112: Ich brauche sofort einen Krankenwagen!",
          arabic: "طوارئ 112: أحتاج إلى سيارة إسعاف فوراً!",
          phonetic: "نوت-روف هونديرت-تسفولف: إيش براوخه زوفورت آينن كرانكن-فاغن!",
          example: "Urgent medical emergency call in Germany.",
          roleplay: "Dispatcher: 'Wo ist der Notfallort?' -> You: 'Erlangen, Bismarckstraße 12.'"
        },
        {
          id: "eme-2",
          german: "Polizei 110: Mein Rucksack mit Pass und Geld wurde gestohlen.",
          arabic: "الشرطة 110: تم سرقة حقيبة ظهري مع الجواز والمال.",
          phonetic: "بوليتساي هونديرت-تسين: ماين روك-زاك مِت باس أوند geld فورده غيشتولن.",
          example: "Reporting theft at police station (Polizeidienststelle).",
          roleplay: "Police: 'Wann und wo ist es passiert?' -> You: 'Vor 10 Minuten am Bahnhof.'"
        },
        {
          id: "eme-3",
          german: "Hilfe! Es brennt in der Küche!",
          arabic: "النجدة! هناك حريق في المطبخ!",
          phonetic: "هيلفه! إيس برينت ين دير كوشه!",
          example: "Shouting for help in building or WG apartment.",
          roleplay: "You: 'Hilfe! Rufen Sie die Feuerwehr (112)!'"
        },
        {
          id: "eme-4",
          german: "Wo ist der ärztliche Bereitschaftsdienst (116 117)?",
          arabic: "أين تقع خدمة الطبيب المناوب خارج أوقات العمل الرسمية (116 117)؟",
          phonetic: "فو إيست دير إيرتسليشه بيرايتشافتس-دينست؟",
          example: "Non-life-threatening medical care on weekends/nights in Germany.",
          roleplay: "Call 116 117 for non-emergency doctor on call on weekends."
        }
      ]
    }
  ]
};
