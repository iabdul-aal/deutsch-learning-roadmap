export interface MobileApp {
  id: string;
  name: string;
  category: string;
  platform: string;
  rating: string;
  freeTrial: boolean;
  offline: boolean;
  bestFor: string;
  description: string;
  recommendedUse: string;
  storeUrl: string;
  tags: string[];
}

export interface MobileAppsData {
  title: string;
  description: string;
  disclaimer: string;
  apps: MobileApp[];
}

export const MOBILE_APPS_DATA: MobileAppsData = {
  title: "A1 Mobile Apps Directory and Offline Self-Study Companion",
  description: "Curated directory of top-rated mobile applications for practicing German vocabulary, listening, shadowing, and grammar on Android and iOS.",
  disclaimer: "All apps listed are evaluated for self-study compatibility alongside the 56-Day Curriculum.",
  apps: [
    {
      id: "app-anki",
      name: "AnkiMobile / AnkiDroid",
      category: "Flashcards SRS",
      platform: "Android / iOS / Web",
      rating: "4.9 / 5.0",
      freeTrial: true,
      offline: true,
      bestFor: "Long-term Vocabulary and Goethe A1 Word Deck Spaced Repetition",
      description: "The premier open-source spaced-repetition card system. Syncs across mobile and web for daily 10-minute vocabulary drills.",
      recommendedUse: "Daily 15 min: Review 25 new Goethe A1 cards + 50 review cards.",
      storeUrl: "https://apps.ankiweb.net/",
      tags: ["SRS", "Offline", "Spaced Repetition", "Core"]
    },
    {
      id: "app-dw-nicos",
      name: "DW Learn German (Nicos Weg)",
      category: "Interactive Story and Immersion",
      platform: "Android / iOS / Web",
      rating: "4.8 / 5.0",
      freeTrial: true,
      offline: true,
      bestFor: "Immersive A1 Storytelling and Interactive Video Exercises",
      description: "Official Deutsche Welle app featuring Nico's journey through Germany. Includes transcriptions, vocabulary, and instant exercise checks.",
      recommendedUse: "Daily 20 min: Watch 1 episode and complete corresponding grammar exercises.",
      storeUrl: "https://learngerman.dw.com",
      tags: ["Story", "Video", "Official DW", "Free"]
    },
    {
      id: "app-langenscheidt",
      name: "Langenscheidt German-Arabic Dictionary",
      category: "German-Arabic Dictionary",
      platform: "Android / iOS / Web",
      rating: "4.9 / 5.0",
      freeTrial: true,
      offline: true,
      bestFor: "Official German-Arabic Word Translations and Audio Pronunciation",
      description: "The gold-standard German-Arabic dictionary by Langenscheidt. Provides accurate Arabic translations, example sentences, and audio clips.",
      recommendedUse: "Reference: Look up unknown noun genders (Der/Die/Das) and Arabic translations.",
      storeUrl: "https://de.langenscheidt.com/deutsch-arabisch/",
      tags: ["Dictionary", "Arabic-German", "Langenscheidt", "Official"]
    },
    {
      id: "app-seedlang",
      name: "Seedlang German",
      category: "Pronunciation and Native Video Drills",
      platform: "Android / iOS / Web",
      rating: "4.8 / 5.0",
      freeTrial: true,
      offline: false,
      bestFor: "Native Speaker Video Pronunciation and Shadowing Drills",
      description: "Created in collaboration with Easy German. Uses thousands of short native video clips to teach real spoken German.",
      recommendedUse: "3x per week: 15 min video trivia and listening comprehension drills.",
      storeUrl: "https://seedlang.com/",
      tags: ["Video", "Pronunciation", "Easy German", "Interactive"]
    },
    {
      id: "app-duolingo",
      name: "Duolingo German",
      category: "Gamified Practice",
      platform: "Android / iOS / Web",
      rating: "4.6 / 5.0",
      freeTrial: true,
      offline: false,
      bestFor: "Casual Daily Streak Maintenance and Sentence Repetition",
      description: "Bite-sized gamified lessons designed to build daily practice habits and basic sentence structure familiarity.",
      recommendedUse: "Supplementary: 5 min daily during commute for streak maintenance.",
      storeUrl: "https://www.duolingo.com/",
      tags: ["Gamified", "Casual", "Streak", "Supplementary"]
    },
    {
      id: "app-tandem",
      name: "Tandem Language Exchange",
      category: "Peer Conversation Partner",
      platform: "Android / iOS",
      rating: "4.5 / 5.0",
      freeTrial: true,
      offline: false,
      bestFor: "Finding Native German Speaking Partners for Language Exchange",
      description: "Global language exchange community connecting learners with native German speakers learning Arabic or English.",
      recommendedUse: "Week 4+: Practice simple text and voice message exchanges with native speakers.",
      storeUrl: "https://www.tandem.net",
      tags: ["Conversation", "Peer Exchange", "Native Speakers"]
    }
  ]
};
