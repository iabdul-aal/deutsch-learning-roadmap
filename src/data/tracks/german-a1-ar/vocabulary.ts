export const VOCABULARY_DATA = {
  title: "High-Frequency German A1 Vocabulary Database",
  description: "Categorized A1 core vocabulary with color-coded articles (Der = Blue, Die = Red, Das = Green), plurals, English & Arabic translations, audio TTS, and SRS mastery tracking.",
  categories: [
    "Greetings & Basics",
    "Family & People",
    "House & Furniture",
    "Food & Drinks",
    "University & Study",
    "City & Transport",
    "Health & Doctor",
    "Bureaucracy & Money",
    "Time & Numbers",
    "Verbs Core",
    "Adjectives & Opposites"
  ],
  words: [
    // Greetings & Basics
    { id: "v1", german: "Guten Tag", article: "", plural: "", english: "Good day / Hello", arabic: "نهارًا سعيدًا / مرحباً", category: "Greetings & Basics", example: "Guten Tag, Herr Müller!", status: "new" },
    { id: "v2", german: "Auf Wiedersehen", article: "", plural: "", english: "Goodbye", arabic: "إلى اللقاء / مع السلامة", category: "Greetings & Basics", example: "Auf Wiedersehen und bis morgen!", status: "new" },
    { id: "v3", german: "Danke schön", article: "", plural: "", english: "Thank you very much", arabic: "شكراً جزيلاً", category: "Greetings & Basics", example: "Vielen Dank für Ihre Hilfe!", status: "new" },
    { id: "v4", german: "Bitte schön", article: "", plural: "", english: "You're welcome / Here you go", arabic: "عفواً / تفضل", category: "Greetings & Basics", example: "Bitte schön, das macht 5 Euro.", status: "new" },
    { id: "v5", german: "Entschuldigung", article: "die", plural: "Entschuldigungen", english: "Excuse me / Sorry", arabic: "عذراً / المعذرة", category: "Greetings & Basics", example: "Entschuldigung, wo ist der Bahnhof?", status: "new" },
    { id: "v6", german: "Name", article: "der", plural: "Namen", english: "Name", arabic: "اسم", category: "Greetings & Basics", example: "Mein Name ist Ahmed.", status: "new" },
    { id: "v7", german: "Vorname", article: "der", plural: "Vornamen", english: "First name", arabic: "الاسم الأول", category: "Greetings & Basics", example: "Mein Vorname ist Hend.", status: "new" },
    { id: "v8", german: "Familienname", article: "der", plural: "Familiennamen", english: "Surname / Last name", arabic: "اسم العائلة", category: "Greetings & Basics", example: "Wie ist Ihr Familienname?", status: "new" },
    { id: "v9", german: "Sprache", article: "die", plural: "Sprachen", english: "Language", arabic: "لغة", category: "Greetings & Basics", example: "Ich lerne die deutsche Sprache.", status: "new" },
    { id: "v10", german: "Land", article: "das", plural: "Länder", english: "Country", arabic: "بلد / دولة", category: "Greetings & Basics", example: "Deutschland ist ein schönes Land.", status: "new" },

    // Family & People
    { id: "v11", german: "Mutter", article: "die", plural: "Mütter", english: "Mother", arabic: "أم", category: "Family & People", example: "Meine Mutter wohnt in Kairo.", status: "new" },
    { id: "v12", german: "Vater", article: "der", plural: "Väter", english: "Father", arabic: "أب", category: "Family & People", example: "Mein Vater spricht gut Deutsch.", status: "new" },
    { id: "v13", german: "Eltern", article: "die", plural: "(Plural only)", english: "Parents", arabic: "الوالدان", category: "Family & People", example: "Meine Eltern wohnen in Ägypten.", status: "new" },
    { id: "v14", german: "Bruder", article: "der", plural: "Brüder", english: "Brother", arabic: "أخ", category: "Family & People", example: "Ich habe einen jüngeren Bruder.", status: "new" },
    { id: "v15", german: "Schwester", article: "die", plural: "Schwestern", english: "Sister", arabic: "أخت", category: "Family & People", example: "Meine Schwester studiert Medizin.", status: "new" },
    { id: "v16", german: "Kind", article: "das", plural: "Kinder", english: "Child", arabic: "طفل", category: "Family & People", example: "Die Kinder spielen im Garten.", status: "new" },
    { id: "v17", german: "Freund", article: "der", plural: "Freunde", english: "Friend (male) / Boyfriend", arabic: "صديق", category: "Family & People", example: "Mein Freund kommt heute zu Besuch.", status: "new" },
    { id: "v18", german: "Freundin", article: "die", plural: "Freundinnen", english: "Friend (female) / Girlfriend", arabic: "صديقة", category: "Family & People", example: "Meine Freundin lernt auch Deutsch.", status: "new" },
    { id: "v19", german: "Mann", article: "der", plural: "Männer", english: "Man / Husband", arabic: "رجل / زوج", category: "Family & People", example: "Der Mann hilft mir mit den Koffern.", status: "new" },
    { id: "v20", german: "Frau", article: "die", plural: "Frauen", english: "Woman / Wife / Ms.", arabic: "امرأة / زوجة / سيدة", category: "Family & People", example: "Frau Müller arbeitet am Sprachenzentrum.", status: "new" },

    // House & Furniture
    { id: "v21", german: "Wohnung", article: "die", plural: "Wohnungen", english: "Apartment", arabic: "شقة", category: "House & Furniture", example: "Die Wohnung hat zwei Zimmer.", status: "new" },
    { id: "v22", german: "Zimmer", article: "das", plural: "Zimmer", english: "Room", arabic: "غرفة", category: "House & Furniture", example: "Das Zimmer ist sehr hell und ruhig.", status: "new" },
    { id: "v23", german: "Miete", article: "die", plural: "Mieten", english: "Rent", arabic: "إيجار", category: "House & Furniture", example: "Die Miete beträgt 400 Euro warm.", status: "new" },
    { id: "v24", german: "Schlüssel", article: "der", plural: "Schlüssel", english: "Key", arabic: "مفتاح", category: "House & Furniture", example: "Hier ist der Schlüssel für die Wohnung.", status: "new" },
    { id: "v25", german: "Bett", article: "das", plural: "Betten", english: "Bed", arabic: "سرير", category: "House & Furniture", example: "Das Bett steht im Schlafzimmer.", status: "new" },

    // Food & Drinks
    { id: "v26", german: "Wasser", article: "das", plural: "Wässer", english: "Water", arabic: "ماء", category: "Food & Drinks", example: "Ein Glas Wasser bitte!", status: "new" },
    { id: "v27", german: "Kaffee", article: "der", plural: "Kaffees", english: "Coffee", arabic: "قهوة", category: "Food & Drinks", example: "Ich trinke morgens gerne Kaffee.", status: "new" },
    { id: "v28", german: "Brot", article: "das", plural: "Brote", english: "Bread", arabic: "خبز", category: "Food & Drinks", example: "Deutsches Brot ist sehr lecker.", status: "new" },
    { id: "v29", german: "Käse", article: "der", plural: "(Uncountable)", english: "Cheese", arabic: "جبن", category: "Food & Drinks", example: "Ich möchte ein Brötchen mit Käse.", status: "new" },
    { id: "v30", german: "Apfel", article: "der", plural: "Äpfel", english: "Apple", arabic: "تفاحة", category: "Food & Drinks", example: "Ich esse jeden Tag einen Apfel.", status: "new" },

    // University & Study
    { id: "v31", german: "Universität", article: "die", plural: "Universitäten", english: "University", arabic: "جامعة", category: "University & Study", example: "Die Universität Erlangen hat viele Studenten.", status: "new" },
    { id: "v32", german: "Student", article: "der", plural: "Studenten", english: "Student (male)", arabic: "طالب جامعي", category: "University & Study", example: "Er ist Student an der FAU.", status: "new" },
    { id: "v33", german: "Studentin", article: "die", plural: "Studentinnen", english: "Student (female)", arabic: "طالبة جامعية", category: "University & Study", example: "Sie ist Studentin am Sprachenzentrum.", status: "new" },
    { id: "v34", german: "Kurs", article: "der", plural: "Kurse", english: "Course / Class", arabic: "دورة / كورس", category: "University & Study", example: "Der Deutschkurs A1 beginnt um 9 Uhr.", status: "new" },
    { id: "v35", german: "Prüfung", article: "die", plural: "Prüfungen", english: "Exam / Test", arabic: "امتحان / اختبار", category: "University & Study", example: "Die A1-Prüfung ist am Freitag.", status: "new" },

    // City & Transport
    { id: "v36", german: "Bahnhof", article: "der", plural: "Bahnhöfe", english: "Train station", arabic: "محطة قطار", category: "City & Transport", example: "Der Zug hält am Hauptbahnhof Nürnberg.", status: "new" },
    { id: "v37", german: "Zug", article: "der", plural: "Züge", english: "Train", arabic: "قطار", category: "City & Transport", example: "Der Zug nach Erlangen pünktlich.", status: "new" },
    { id: "v38", german: "Bus", article: "der", plural: "Busse", english: "Bus", arabic: "حافلة / باص", category: "City & Transport", example: "Der Bus Fährt direkt zum Campus.", status: "new" },
    { id: "v39", german: "Fahrkarte", article: "die", plural: "Fahrkarten", english: "Ticket", arabic: "تذكرة سفر", category: "City & Transport", example: "Zeigen Sie bitte Ihre Fahrkarte!", status: "new" },

    // Health & Doctor
    { id: "v40", german: "Arzt", article: "der", plural: "Ärzte", english: "Doctor (male)", arabic: "طبيب", category: "Health & Doctor", example: "Der Arzt untersucht den Patienten.", status: "new" },
    { id: "v41", german: "Ärztin", article: "die", plural: "Ärztinnen", english: "Doctor (female)", arabic: "طبيبة", category: "Health & Doctor", example: "Die Ärztin verschreibt ein Rezept.", status: "new" },
    { id: "v42", german: "Apotheke", article: "die", plural: "Apotheken", english: "Pharmacy", arabic: "صيدلية", category: "Health & Doctor", example: "Die Apotheke ist gegenüber vom Bahnhof.", status: "new" },
    { id: "v43", german: "Krankenhaus", article: "das", plural: "Krankenhäuser", english: "Hospital", arabic: "مستشفى", category: "Health & Doctor", example: "Das Krankenwagen fährt zum Krankenhaus.", status: "new" },

    // Bureaucracy & Money
    { id: "v44", german: "Pass", article: "der", plural: "Pässe", english: "Passport", arabic: "جواز سفر", category: "Bureaucracy & Money", example: "Hier ist mein Reisepass mit Visum.", status: "new" },
    { id: "v45", german: "Visum", article: "das", plural: "Visa", english: "Visa", arabic: "تأشيرة", category: "Bureaucracy & Money", example: "Mein Visum ist ein Jahr gültig.", status: "new" },
    { id: "v46", german: "Termin", article: "der", plural: "Termine", english: "Appointment", arabic: "موعد", category: "Bureaucracy & Money", example: "Ich habe einen Termin beim Bürgeramt.", status: "new" },
    { id: "v47", german: "Geld", article: "das", plural: "(Uncountable)", english: "Money", arabic: "مال / فلوس", category: "Bureaucracy & Money", example: "Ich brauche Bargeld für die Bäckerei.", status: "new" },

    // Time & Numbers
    { id: "v48", german: "Uhr", article: "die", plural: "Uhren", english: "Clock / O'clock", arabic: "ساعة", category: "Time & Numbers", example: "Es ist jetzt 10 Uhr morgens.", status: "new" },
    { id: "v49", german: "Tag", article: "der", plural: "Tage", english: "Day", arabic: "يوم", category: "Time & Numbers", example: "Schönen Tag noch!", status: "new" },
    { id: "v50", german: "Woche", article: "die", plural: "Wochen", english: "Week", arabic: "أسبوع", category: "Time & Numbers", example: "Ich lerne seit drei Wochen Deutsch.", status: "new" },

    // Verbs Core
    { id: "v51", german: "lernen", article: "", plural: "", english: "To learn / study", arabic: "يتعلم / يدرس", category: "Verbs Core", example: "Ich lerne Deutsch an der FAU.", status: "new" },
    { id: "v52", german: "sprechen", article: "", plural: "", english: "To speak", arabic: "يتحدث / يتكلم", category: "Verbs Core", example: "Sprechen Sie Englisch oder Deutsch?", status: "new" },
    { id: "v53", german: "wohnen", article: "", plural: "", english: "To live / reside", arabic: "يسكن / يقيم", category: "Verbs Core", example: "Ich wohne in Erlangen.", status: "new" },
    { id: "v54", german: "kommen", article: "", plural: "", english: "To come", arabic: "يأتي / يأتي من", category: "Verbs Core", example: "Ich komme aus Kairo in Ägypten.", status: "new" },
    { id: "v55", german: "kaufen", article: "", plural: "", english: "To buy", arabic: "يشتري", category: "Verbs Core", example: "Ich kaufe Fahrkarten im Internet.", status: "new" },

    // Adjectives & Opposites
    { id: "v56", german: "gut", article: "", plural: "", english: "Good", arabic: "جيد / ممتاز", category: "Adjectives & Opposites", example: "Das ist ein sehr gutes Buch.", status: "new" },
    { id: "v57", german: "groß", article: "", plural: "", english: "Big / Large / Tall", arabic: "كبير / واسع", category: "Adjectives & Opposites", example: "Erlangen hat einen großen Campus.", status: "new" },
    { id: "v58", german: "klein", article: "", plural: "", english: "Small / Little", arabic: "صغير", category: "Adjectives & Opposites", example: "Das Zimmer ist klein aber gemütlich.", status: "new" },
    { id: "v59", german: "schön", article: "", plural: "", english: "Beautiful / Nice", arabic: "جميل / رائع", category: "Adjectives & Opposites", example: "München ist eine schöne Stadt.", status: "new" }
  ]
};
