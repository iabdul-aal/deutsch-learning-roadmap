export interface ResourceItem {
  id: string;
  title: string;
  creator: string;
  language: string;
  skill: string;
  level: string;
  duration: string;
  priority: 'CORE' | 'HIGH VALUE' | 'REFERENCE';
  whySelected: string;
  sourceCommunity: string;
  link: string;
}

export interface ResourceDatabase {
  title: string;
  description: string;
  resources: ResourceItem[];
}

export const RESOURCES_DATA: ResourceDatabase = {
  title: "Multi-Language Curated Resource Database",
  description: "Independent multi-lingual research across Arabic, English, and German ecosystems for Goethe A1 and German university preparation.",
  resources: [
    {
      id: "res-hend-site",
      title: "Deutsch mit Hend - Complete A1 Video Course (Arabic Backbone)",
      creator: "Frau Hend Taha (@FrauHendTaha)",
      language: "Arabic / German",
      skill: "Core A1 Full Curriculum & Phonetics",
      level: "A1 (Beginner)",
      duration: "26 Hours Total (Video Series)",
      priority: "CORE",
      whySelected: "Primary core curriculum designed specifically for Arabic speakers. Explains complex German grammar logic using clear Arabic analogies, video lessons, vocabulary, and Goethe/TELC exam notes.",
      sourceCommunity: "Arabic Ecosystem (Egypt / MENA)",
      link: "https://www.youtube.com/watch?v=WMvCXVorOsg"
    },
    {
      id: "res-hend-lesson2",
      title: "Deutsch mit Hend - German Basics Part 2 (أساسيات اللغة الألمانية - الجزء الثاني)",
      creator: "Frau Hend Taha (@FrauHendTaha)",
      language: "Arabic / German",
      skill: "A1 Basics & Pronunciation Deep Dive",
      level: "A1 (Beginner)",
      duration: "Lesson 2 Video Series",
      priority: "CORE",
      whySelected: "Direct continuation of Hend's A1 course covering German phonetics, basic conversation structures, and foundational vocabulary.",
      sourceCommunity: "Arabic Ecosystem (Egypt / MENA)",
      link: "https://www.youtube.com/watch?v=UuDS2hFTwtc"
    },
    {
      id: "res-piece-of-german-a1",
      title: "Piece of German - Step by Step A1 Day-by-Day Learning Plan",
      creator: "Piece of German",
      language: "English / German",
      skill: "Structured Day-by-Day Guided Curriculum",
      level: "A1 (Beginner)",
      duration: "Self-Paced Daily Plan (1-3h/day)",
      priority: "HIGH VALUE",
      whySelected: "Comprehensive day-by-day structured learning path for German A1, providing step-by-step guidance, drills, and daily progress milestones.",
      sourceCommunity: "Global German Learners",
      link: "https://www.pieceofgerman.com/a1-1"
    },
    {
      id: "res-goethe-a1-official",
      title: "Goethe-Zertifikat A1: Start Deutsch 1 Official Practice Sets & Audio",
      creator: "Goethe-Institut",
      language: "German",
      skill: "Official A1 Exam Preparation (Hören, Lesen, Schreiben, Sprechen)",
      level: "A1 (Exam Certification)",
      duration: "Official Practice Papers",
      priority: "CORE",
      whySelected: "Official Goethe-Institut Start Deutsch 1 practice sets, PDF exam papers, and listening audio files. Essential for obtaining the official Goethe A1 certificate.",
      sourceCommunity: "Official Goethe-Institut",
      link: "https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf"
    },
    {
      id: "res-fau-erlangen-coursebook",
      title: "FAU Erlangen-Nürnberg Language Center (DaF A1 Course Portal)",
      creator: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
      language: "German / English",
      skill: "Academic German & University Preparation",
      level: "A1 (Academic Track)",
      duration: "Semester Coursebook & Direct Portal",
      priority: "CORE",
      whySelected: "Official German language department at FAU Erlangen-Nürnberg. Direct portal for international students taking DaF German courses at German universities.",
      sourceCommunity: "German University Ecosystem (FAU Erlangen)",
      link: "https://www.sz.fau.de/abteilungen/deutsch-als-fremdsprache/"
    },
    {
      id: "res-nicos-weg",
      title: "DW Nicos Weg A1 Interactive Course Module",
      creator: "Deutsche Welle (DW Learngerman)",
      language: "German (Immersive)",
      skill: "Story Immersion & Interactive Exercises",
      level: "A1 -> A2",
      duration: "100 Short Interactive Episodes",
      priority: "CORE",
      whySelected: "The gold standard for story-driven beginner German learning. Follows Nico's arrival in Germany, covering real-world situations with interactive exercises.",
      sourceCommunity: "Official Deutsche Welle",
      link: "https://learngerman.dw.com/en/nicos-weg"
    },
    {
      id: "res-easy-german",
      title: "Super Easy German Beginner Playlist & Street Interviews",
      creator: "Easy German",
      language: "German (Bilingual Subtitles)",
      skill: "Authentic Beginner Listening & Culture",
      level: "A1",
      duration: "5-10 min / video",
      priority: "HIGH VALUE",
      whySelected: "Exposes learners to real spoken German on the streets of Berlin and Munich with slow, clear speech and bilingual subtitles.",
      sourceCommunity: "German Ecosystem",
      link: "https://www.youtube.com/watch?v=r94aqLUO0wo"
    },
    {
      id: "res-ygt",
      title: "YourGermanTeacher - German A1 Grammar Masterclasses",
      creator: "YourGermanTeacher",
      language: "English / German",
      skill: "Grammar Deep-Dive (Cases, Verbs & Articles)",
      level: "A1 -> B1",
      duration: "15-20 min / video",
      priority: "HIGH VALUE",
      whySelected: "Clear, methodical chalkboard breakdowns of Nominative, Accusative, Dative cases, and Goethe A1 exam structures.",
      sourceCommunity: "English Ecosystem",
      link: "https://www.youtube.com/watch?v=RrfgbBp6ScI"
    },
    {
      id: "res-schubert-a1",
      title: "Schubert Verlag Online-Aufgaben A1 Interactive Exercises",
      creator: "Schubert-Verlag Leipzig",
      language: "German",
      skill: "Grammar & Vocabulary Drills",
      level: "A1",
      duration: "Interactive Modules",
      priority: "CORE",
      whySelected: "High-quality, free interactive online exercises for A1 grammar, verb conjugation, article declension, and vocabulary.",
      sourceCommunity: "German Publisher Ecosystem",
      link: "https://www.schubert-verlag.de/aufgaben/index.htm"
    },
    {
      id: "res-deutschakademie-app",
      title: "DeutschAkademie Free Online German Course App",
      creator: "DeutschAkademie Wien & Berlin",
      language: "German / English",
      skill: "Grammar Exercises & Writing Practice",
      level: "A1 -> C1",
      duration: "20,000+ Exercises",
      priority: "HIGH VALUE",
      whySelected: "Comprehensive free online exercise database structured according to European Reference Framework (CEFR) levels.",
      sourceCommunity: "Austrian / German Language School Ecosystem",
      link: "https://www.deutschakademie.de/online-deutschkurs/App#user/exercises"
    },
    {
      id: "res-langenscheidt-ar",
      title: "Langenscheidt German-Arabic Dictionary (Deutsch-Arabisch)",
      creator: "Langenscheidt Verlag",
      language: "German / Arabic",
      skill: "German-Arabic Vocabulary Lookup & Pronunciation",
      level: "All Levels",
      duration: "Reference Tool",
      priority: "REFERENCE",
      whySelected: "The #1 official German-Arabic dictionary by Langenscheidt with verified Arabic translations, audio pronunciation, and example sentences.",
      sourceCommunity: "Official German-Arabic Dictionary",
      link: "https://de.langenscheidt.com/deutsch-arabisch/"
    },
    {
      id: "res-pons-dict",
      title: "PONS German-Arabic Online Dictionary & Vocabulary Trainer",
      creator: "PONS Verlag",
      language: "German / Arabic",
      skill: "Translation & Contextual Sentences",
      level: "All Levels",
      duration: "Reference Tool",
      priority: "REFERENCE",
      whySelected: "Highly accurate German-Arabic dictionary with full context sentences, verb conjugation tables, and audio clips.",
      sourceCommunity: "Official German-Arabic Dictionary",
      link: "https://en.pons.com/translate/german-arabic"
    },
    {
      id: "res-anki-web",
      title: "AnkiWeb & AnkiDroid SRS Flashcard Platform",
      creator: "Damien Elmes & Anki Community",
      language: "Multilingual",
      skill: "Spaced Repetition Vocabulary Retention",
      level: "All Levels",
      duration: "Daily 10-15 min",
      priority: "CORE",
      whySelected: "The world's leading spaced repetition software (SRS) for memorizing German noun genders, plurals, and high-frequency word banks.",
      sourceCommunity: "Global SRS Community",
      link: "https://apps.ankiweb.net/"
    },
    {
      id: "res-db-navigator",
      title: "Deutsche Bahn Deutschland-Ticket & Regional Transport Portal",
      creator: "Deutsche Bahn (DB)",
      language: "German / English",
      skill: "Practical Germany Survival & Travel Navigation",
      level: "Survival / Daily Life",
      duration: "Real-world App",
      priority: "REFERENCE",
      whySelected: "Official transit portal for living and traveling in Germany. Essential for understanding station announcements, ticket types, and transit German.",
      sourceCommunity: "Official German Transit Ecosystem",
      link: "https://www.bahn.de/angebot/regio/deutschland-ticket"
    }
  ]
};
