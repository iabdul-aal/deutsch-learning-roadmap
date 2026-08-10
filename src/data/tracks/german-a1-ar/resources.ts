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
  title: "Multi-Language Curated Resource Database (6 Hats Evaluated)",
  description: "Independent multi-lingual research across Arabic, English, and German ecosystems evaluated via the 6 Thinking Hats method for Goethe A1 & FAU Erlangen university prep.",
  resources: [
    {
      id: "res-hend-site",
      title: "Deutsch mit Hend Platform - Course A1 (arabic backbone)",
      creator: "Deutsch mit Hend",
      language: "Arabic / German",
      skill: "Core A1 Full Curriculum",
      level: "A1 (Beginner)",
      duration: "26 Hours Total",
      priority: "CORE",
      whySelected: "Primary core curriculum designed specifically for Arabic speakers. Explains complex German grammar logic using clear Arabic analogies, video lessons, vocabulary, and Goethe/telc exam notes.",
      sourceCommunity: "Arabic Ecosystem",
      link: "https://deutsch-mit-hend.com/home/course/%D8%AF%D9%88%D8%B1%D8%A9-a1/20"
    },
    {
      id: "res-goethe-a1-official",
      title: "Goethe-Zertifikat A1: Start Deutsch 1 Official Practice Sets & Audio",
      creator: "Goethe-Institut",
      language: "German",
      skill: "Official A1 Exam Preparation (Horen, Lesen, Schreiben, Sprechen)",
      level: "A1 (Exam Certification)",
      duration: "Official Mock Exams",
      priority: "CORE",
      whySelected: "Official Goethe-Institut Start Deutsch 1 practice sets, PDF exam papers, and listening audio files. Essential for obtaining the official Goethe A1 certificate.",
      sourceCommunity: "Official Goethe",
      link: "https://www.goethe.de/en/spr/kup/prf/prf/sd1/ueb.html"
    },
    {
      id: "res-fau-erlangen-coursebook",
      title: "FAU Erlangen-Nurnberg Sprachenzentrum Deutsch als Fremdsprache (DaF A1)",
      creator: "FAU Erlangen-Nurnberg",
      language: "German",
      skill: "Academic German & University Preparation",
      level: "A1 (Academic Track)",
      duration: "Semester Coursebook",
      priority: "CORE",
      whySelected: "Official German language department at FAU Erlangen-Nurnberg. Direct portal for international students taking DaF German courses at FAU.",
      sourceCommunity: "Academic University Track (FAU Erlangen-Nurnberg)",
      link: "https://www.sz.fau.de/abteilung-daf/"
    },
    {
      id: "res-nicos-weg",
      title: "DW Nicos Weg A1 Direct Course Module",
      creator: "Deutsche Welle (DW)",
      language: "German (Immersive)",
      skill: "Story Immersion & Comprehension",
      level: "A1 -> A2",
      duration: "100 Short Episodes",
      priority: "CORE",
      whySelected: "The gold standard for story-driven beginner German learning. Follows Nico's arrival in Germany, covering real-world situations with interactive exercises.",
      sourceCommunity: "German Ecosystem",
      link: "https://learngerman.dw.com/de/nicos-weg/c-36519789"
    },
    {
      id: "res-easy-german",
      title: "Super Easy German Beginner Playlist",
      creator: "Easy German",
      language: "German (Subtitled)",
      skill: "Authentic Beginner Listening & Culture",
      level: "A1",
      duration: "5-10 min / video",
      priority: "HIGH VALUE",
      whySelected: "Exposes learners to real spoken German on the streets of Berlin and Munich with slow clear speech and bilingual subtitles.",
      sourceCommunity: "German Ecosystem",
      link: "https://www.youtube.com/playlist?list=PL39361B7B2B15E9E0"
    },
    {
      id: "res-ygt",
      title: "YourGermanTeacher - German A1 Grammar Masterclasses",
      creator: "YourGermanTeacher",
      language: "English / German",
      skill: "Grammar Deep-Dive (Cases & Verbs)",
      level: "A1 -> B1",
      duration: "20 min / video",
      priority: "HIGH VALUE",
      whySelected: "Clear, methodical chalkboard breakdowns of Nominative, Accusative, Dative cases, and Goethe A1 exam structures.",
      sourceCommunity: "English Ecosystem",
      link: "https://www.youtube.com/playlist?list=PLv6t6Xv-gDJzg_8G4N19L7G0E7y8J2f3Z"
    },
    {
      id: "res-langenscheidt-ar",
      title: "Langenscheidt German-Arabic Dictionary (Deutsch-Arabisch)",
      creator: "Langenscheidt",
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
      id: "res-db-navigator",
      title: "Deutsche Bahn Germany-Ticket & Transport Portal",
      creator: "Deutsche Bahn (DB)",
      language: "German / English",
      skill: "Practical Train Travel & Ticket Booking",
      level: "Survival",
      duration: "Real-world App",
      priority: "CORE",
      whySelected: "Essential app for living in Germany. Practicing train schedules, delay alerts, and ticket booking in German.",
      sourceCommunity: "Official German",
      link: "https://www.bahn.de/angebot/regio/deutschland-ticket"
    }
  ]
};
