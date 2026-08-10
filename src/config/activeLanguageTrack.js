// Scalable configuration for Language & Level Tracks
export const AVAILABLE_TRACKS = [
  {
    id: 'german-a1-ar',
    name: 'German A1 → Germany Survival (8 Weeks)',
    nativeLanguage: 'Arabic (🇪🇬 / 🇸🇦 / 🇩🇿)',
    targetLanguage: 'German (🇩🇪)',
    level: 'A1 → Practical Survival',
    durationDays: 56,
    active: true,
    description: 'Designed for Arabic speakers moving to Germany in 2 months. Primary curriculum: Deutsch mit Hend + Piece of German roadmap.'
  },
  {
    id: 'german-a2-ar',
    name: 'German A2 → Work & Daily Fluency (Coming Soon)',
    nativeLanguage: 'Arabic (🇪🇬)',
    targetLanguage: 'German (🇩🇪)',
    level: 'A2 → Daily Fluency',
    durationDays: 60,
    active: false,
    description: 'Advanced daily communication, workplace German, and B1 exam preparation foundation.'
  },
  {
    id: 'spanish-a1-en',
    name: 'Spanish A1 → Latin America / Spain Survival (Coming Soon)',
    nativeLanguage: 'English (🇬🇧)',
    targetLanguage: 'Spanish (🇪🇸)',
    level: 'A1 → Beginner',
    durationDays: 45,
    active: false,
    description: 'Accelerated beginner roadmap for Spanish learners.'
  }
];

export const CURRENT_TRACK_ID = 'german-a1-ar';
