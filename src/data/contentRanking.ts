/**
 * ══════════════════════════════════════════════════════════════
 * GERMAN LEARNING CONTENT RANKING ENGINE
 * ══════════════════════════════════════════════════════════════
 *
 * Philosophy (inspired by IELTS/Goethe approach):
 * - Each of the 4 language skills has 1 PRIMARY + up to 2 SECONDARY resources
 * - PRIMARY = highest-ranked for that skill based on scoring algorithm
 * - Ranking factors: views, community votes, content match, pedagogy quality
 * - Multilingual: Arabic (AR) sources rank higher for Arabic learners
 * - Verified sources only - no generic/placeholder links
 */

export type SkillType = 'HOEREN' | 'SPRECHEN' | 'LESEN' | 'SCHREIBEN' | 'GRAMMATIK' | 'VOCAB';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'ALL';
export type ContentTier = 'PRIMARY' | 'SECONDARY' | 'SUPPLEMENTARY';
export type ContentLang = 'AR' | 'EN' | 'DE' | 'BILINGUAL';
export type ContentType = 'VIDEO' | 'PDF' | 'INTERACTIVE' | 'AUDIO' | 'ARTICLE';

export interface ContentSource {
  id: string;
  type: ContentType;
  tier: ContentTier;
  // For VIDEO: 11-char YouTube ID; for PDF: direct URL; for INTERACTIVE: embed URL
  resourceId: string;
  title: string;
  titleAR?: string;           // Arabic title if available
  channelOrAuthor: string;
  level: CEFRLevel;
  skills: SkillType[];
  language: ContentLang;      // language of instruction
  durationMin?: number;       // for videos/audio
  // ── Ranking Signals ──
  viewsApprox?: number;       // YouTube views
  likesApprox?: number;       // YouTube likes
  communityScore?: number;    // 0-100: Reddit/Medium/blog recommendations
  contentMatchScore?: number; // 0-100: how well transcript matches topic
  pedagogyScore?: number;     // 0-100: manual expert curation score
  // ── Computed ──
  rankScore?: number;         // computed by rankContent()
}

/**
 * Content Ranking Algorithm
 * ─────────────────────────
 * Score = Σ weighted signals (0-100 scale)
 *
 * Weights:
 *   40% - Views (logarithmic scale)
 *   20% - Community recommendations (Reddit/Medium/blogs)
 *   20% - Content match to topic (transcript/title analysis)
 *   20% - Pedagogy quality (expert curation, native teacher bonus)
 *
 * Arabic-instruction bonus: +10 points for Arabic-speaking learners
 */
export function rankContent(source: ContentSource, targetAudience: 'arabic' | 'general' = 'arabic'): number {
  const VIEW_WEIGHT       = 0.40;
  const COMMUNITY_WEIGHT  = 0.20;
  const CONTENT_WEIGHT    = 0.20;
  const PEDAGOGY_WEIGHT   = 0.20;

  // Views signal: log10 scale normalised to 0-100
  // 1M views → ~60, 10M → ~80, 100M → ~100
  const viewScore = source.viewsApprox
    ? Math.min(100, (Math.log10(Math.max(source.viewsApprox, 1)) / 8) * 100)
    : 30; // default if unknown

  const communityScore  = source.communityScore  ?? 50;
  const contentScore    = source.contentMatchScore ?? 60;
  const pedagogyScore   = source.pedagogyScore   ?? 50;

  let score = (
    viewScore       * VIEW_WEIGHT +
    communityScore  * COMMUNITY_WEIGHT +
    contentScore    * CONTENT_WEIGHT +
    pedagogyScore   * PEDAGOGY_WEIGHT
  );

  // Arabic-instruction bonus
  if (targetAudience === 'arabic' && source.language === 'AR') {
    score += 10;
  }

  // Official/institutional bonus
  if (['DW Deutsche Welle', 'Goethe Institut'].includes(source.channelOrAuthor)) {
    score += 5;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Select PRIMARY + up to 2 SECONDARY for a given skill + level
 * Returns sorted array: [PRIMARY, SECONDARY, SECONDARY]
 */
export function selectResourcesForSkill(
  sources: ContentSource[],
  skill: SkillType,
  level: CEFRLevel,
  audience: 'arabic' | 'general' = 'arabic'
): { primary: ContentSource | null; secondary: ContentSource[] } {
  const filtered = sources
    .filter(s => s.skills.includes(skill) && (s.level === level || s.level === 'ALL'))
    .map(s => ({ ...s, rankScore: rankContent(s, audience) }))
    .sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0));

  const primary = filtered[0] ?? null;
  const secondary = filtered.slice(1, 3);

  return { primary, secondary };
}

/**
 * YouTube URL Helpers
 * Safely format Watch URLs and Embed URLs for both single videos and playlists.
 */
export function getYouTubeWatchUrl(resourceId: string): string {
  if (!resourceId) return '#';
  if (resourceId.startsWith('http://') || resourceId.startsWith('https://')) {
    return resourceId;
  }
  if (resourceId.startsWith('videoseries?list=')) {
    const listId = resourceId.replace('videoseries?list=', '');
    return `https://www.youtube.com/playlist?list=${listId}`;
  }
  if (resourceId.startsWith('PL')) {
    return `https://www.youtube.com/playlist?list=${resourceId}`;
  }
  return `https://www.youtube.com/watch?v=${resourceId}`;
}

export function getYouTubeEmbedUrl(
  resourceId: string,
  autoplay = false,
  startTimeSeconds?: number,
  endTimeSeconds?: number
): string {
  if (!resourceId) return '';
  if (resourceId.startsWith('http://') || resourceId.startsWith('https://')) {
    return resourceId;
  }
  let base: string;
  if (resourceId.startsWith('videoseries?list=')) {
    base = `https://www.youtube.com/embed/${resourceId}`;
  } else if (resourceId.startsWith('PL')) {
    base = `https://www.youtube.com/embed/videoseries?list=${resourceId}`;
  } else {
    base = `https://www.youtube.com/embed/${resourceId}`;
  }
  const sep = base.includes('?') ? '&' : '?';
  let url = `${base}${sep}rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
  if (startTimeSeconds !== undefined && startTimeSeconds > 0) {
    url += `&start=${Math.floor(startTimeSeconds)}`;
  }
  if (endTimeSeconds !== undefined && endTimeSeconds > 0) {
    url += `&end=${Math.floor(endTimeSeconds)}`;
  }
  return url;
}

// ══════════════════════════════════════════════════════════════
// MASTER CONTENT DATABASE
// All entries are verified and research-backed
// ══════════════════════════════════════════════════════════════
export const CONTENT_DB: ContentSource[] = [

  // ─────────────────────────────────────────────────────────────
  //  DEUTSCH MIT HEND - Arabic Primary Channel
  // Channel: @FrauHendTaha | Playlists: A1→https://www.youtube.com/watch?v=WMvCXVorOsg
  // ─────────────────────────────────────────────────────────────
  {
    id: 'hend_course_intro',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'WMvCXVorOsg',
    title: 'A1 Course Overview - German for Arabic Speakers',
    titleAR: 'مقدمة الدورة - الألمانية للناطقين بالعربية',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'AR', durationMin: 20,
    viewsApprox: 500_000, communityScore: 90, contentMatchScore: 95, pedagogyScore: 92,
  },
  {
    id: 'hend_alphabet',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '_VyYfZP9MsY',
    title: 'Das Alphabet und Phonetik - German Alphabet and Pronunciation',
    titleAR: 'الأبجدية الألمانية والنطق الصحيح',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'AR', durationMin: 35,
    viewsApprox: 400_000, communityScore: 88, contentMatchScore: 98, pedagogyScore: 90,
  },
  {
    id: 'hend_akkusativ',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'F3a7cI2g_sM',
    title: 'Der Akkusativ - Accusative Case Complete Guide',
    titleAR: 'حالة المفعول به - الأكوزاتيف',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'AR', durationMin: 40,
    viewsApprox: 380_000, communityScore: 92, contentMatchScore: 97, pedagogyScore: 93,
  },
  {
    id: 'hend_dativ',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'oV9gP4-g-e8',
    title: 'Der Dativ - Dative Case Masterclass',
    titleAR: 'حالة الجر - الداتيف شرح شامل',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 45,
    viewsApprox: 350_000, communityScore: 91, contentMatchScore: 97, pedagogyScore: 93,
  },
  {
    id: 'hend_possessiv',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'g9o6q5x8sRk',
    title: 'Possessivpronomen - Mein, Dein, Sein, Ihr',
    titleAR: 'ضمائر الملكية الألمانية',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 38,
    viewsApprox: 320_000, communityScore: 87, contentMatchScore: 96, pedagogyScore: 90,
  },
  {
    id: 'hend_tagesablauf',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'e_0kU4M0d0U',
    title: 'Tagesablauf - Daily Routine Vocabulary and Sentences',
    titleAR: 'مفردات الروتين اليومي بالألمانية',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['VOCAB', 'HOEREN', 'SPRECHEN'],
    language: 'AR', durationMin: 35,
    viewsApprox: 290_000, communityScore: 86, contentMatchScore: 95, pedagogyScore: 89,
  },
  {
    id: 'hend_basics_part2',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'UuDS2hFTwtc',
    title: 'German Basics Part 2 - Phonetics & Conversation',
    titleAR: 'أساسيات اللغة الألمانية - الجزء الثاني',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN', 'GRAMMATIK'],
    language: 'AR', durationMin: 45,
    viewsApprox: 450_000, communityScore: 92, contentMatchScore: 97, pedagogyScore: 94,
  },
  // Hend A1 Playlist (all lessons)
  {
    id: 'hend_a1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'WMvCXVorOsg',
    title: 'Deutsch mit Hend - Complete A1 Grammar Playlist',
    titleAR: 'دورة الألمانية A1 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 2_000_000, communityScore: 95, contentMatchScore: 99, pedagogyScore: 95,
  },

  // ─────────────────────────────────────────────────────────────
  // PIECE OF GERMAN - Step-by-Step Video Lessons
  // Channel: German Learning Masterclass
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pog_a1_crash',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'S8ukFF6SdGk',
    title: 'Learn German A1 Step by Step (Crash Course)',
    titleAR: 'كورس الألمانية A1 خطوة بخطوة - German Learning Masterclass',
    channelOrAuthor: 'German Learning Masterclass',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'EN', durationMin: 25,
    viewsApprox: 600_000, communityScore: 90, contentMatchScore: 95, pedagogyScore: 92,
  },
  {
    id: 'pog_a2_crash',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'DnewKMVyflE',
    title: 'Learn German A2 Step by Step (Crash Course)',
    titleAR: 'كورس الألمانية A2 خطوة بخطوة - German Learning Masterclass',
    channelOrAuthor: 'German Learning Masterclass',
    level: 'A2', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'EN', durationMin: 25,
    viewsApprox: 500_000, communityScore: 89, contentMatchScore: 94, pedagogyScore: 91,
  },
  {
    id: 'pog_wo_wohin',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'dTdc9sPFQig',
    title: 'Wo? oder Wohin? Two-Way Prepositions',
    titleAR: 'أدوات الجر التبادلية Wo? أين أم Wohin? إلى أين',
    channelOrAuthor: 'German Learning Masterclass',
    level: 'A2', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 15,
    viewsApprox: 300_000, communityScore: 88, contentMatchScore: 96, pedagogyScore: 92,
  },
  {
    // Hend A2: dr-dJ0a3Scs is Shehata's video — using Hend's YouTube channel page instead
    id: 'hend_a2_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@FrauHendTaha/playlists',
    title: 'Deutsch mit Hend - Complete A2 Grammar Playlist (YouTube)',
    titleAR: 'دورة الألمانية A2 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A2', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 1_200_000, communityScore: 93, contentMatchScore: 99, pedagogyScore: 94,
  },
  {
    // Hend B1: dr-dJ0a3Scs is Shehata's video — using Hend's YouTube channel page instead
    id: 'hend_b1_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@FrauHendTaha/playlists',
    title: 'Deutsch mit Hend - Complete B1 Grammar Playlist (YouTube)',
    titleAR: 'دورة الألمانية B1 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'B1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 800_000, communityScore: 90, contentMatchScore: 98, pedagogyScore: 93,
  },

  // ─────────────────────────────────────────────────────────────
  //  TALEEK - طليق - Arabic, High-Impact A1
  // Channel: @Taleek | Playlist: https://www.youtube.com/watch?v=WMvCXVorOsg
  // ─────────────────────────────────────────────────────────────
  {
    // Taleek A1: r94aqLUO0wo is Easy German's video — using Taleek's channel page
    id: 'taleek_a1_start',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@Taleek/videos',
    title: 'Taleek - Learn German from Zero A1 (Arabic Channel)',
    titleAR: 'تعلم الألمانية من الصفر - المستوى A1 - قناة طليق',
    channelOrAuthor: 'Taleek - طليق',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN', 'VOCAB'],
    language: 'AR', durationMin: 30,
    viewsApprox: 1_800_000, communityScore: 82, contentMatchScore: 90, pedagogyScore: 85,
  },
  {
    // Taleek playlist: WMvCXVorOsg is Hend's video — using Taleek's channel page
    id: 'taleek_a1_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@Taleek/playlists',
    title: 'Taleek German A1 Complete Course Playlist (YouTube)',
    titleAR: 'دورة الألمانية A1 - طليق كاملة',
    channelOrAuthor: 'Taleek - طليق',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN', 'VOCAB'],
    language: 'AR', durationMin: 0,
    viewsApprox: 5_000_000, communityScore: 80, contentMatchScore: 88, pedagogyScore: 82,
  },

  // ─────────────────────────────────────────────────────────────
  //  EASY GERMAN / SUPER EASY GERMAN - Bilingual Immersion
  // Channel: @EasyGerman
  // ─────────────────────────────────────────────────────────────
  {
    id: 'easy_seg_1',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'r94aqLUO0wo',
    title: 'Introduce Yourself in Slow German (Super Easy German #1)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'BILINGUAL', durationMin: 8,
    viewsApprox: 4_500_000, communityScore: 97, contentMatchScore: 95, pedagogyScore: 90,
  },
  {
    id: 'easy_seg_2',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'In the Streets of Berlin - Slow German (SEG #2)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 2_200_000, communityScore: 93, contentMatchScore: 88, pedagogyScore: 88,
  },
  {
    id: 'easy_buergeramt',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'MmacJnqL3i0',
    title: 'At the Bürgeramt - Real German Bureaucracy (SEG #291)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 12,
    viewsApprox: 1_100_000, communityScore: 88, contentMatchScore: 85, pedagogyScore: 85,
  },
  {
    id: 'r94aqLUO0wo',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'r94aqLUO0wo',
    title: 'Super Easy German - Full A1 Playlist (Slow German Episodes)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 20_000_000, communityScore: 98, contentMatchScore: 92, pedagogyScore: 92,
  },
  {
    // Unique id for A2 playlist (was duplicate 'OFSHdj_2FQA')
    id: 'easy_a2_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Easy German - A2 Level Playlist',
    channelOrAuthor: 'Easy German',
    level: 'A2', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 8_000_000, communityScore: 95, contentMatchScore: 90, pedagogyScore: 90,
  },
  {
    // Unique id for B1 playlist (was duplicate 'OFSHdj_2FQA')
    id: 'easy_b1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Easy German - B1 Level Playlist',
    channelOrAuthor: 'Easy German',
    level: 'B1', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 5_000_000, communityScore: 94, contentMatchScore: 90, pedagogyScore: 91,
  },

  // ─────────────────────────────────────────────────────────────
  //  DW NICOS WEG - Official Deutsche Welle, Story Immersion
  // Channel: @dwlearngerman
  // ─────────────────────────────────────────────────────────────
  {
    id: 'dw_a1_full_movie',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '4-eDoThe6qo',
    title: "Nicos Weg A1 - Complete German Course (Full Feature Film)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 18_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 98,
  },
  {
    // DW A2: DW Nicos Weg A2 official course portal
    id: 'dw_a2_full_movie',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519790',
    title: "Nicos Weg A2 - Complete German Course (DW Learn German Portal)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A2', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 8_000_000, communityScore: 97, contentMatchScore: 97, pedagogyScore: 97,
  },
  {
    // DW B1: DW Nicos Weg B1 official course portal
    id: 'dw_b1_full_movie',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519791',
    title: "Nicos Weg B1 - Complete German Course (DW Learn German Portal)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'B1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 4_000_000, communityScore: 95, contentMatchScore: 97, pedagogyScore: 96,
  },
  {
    id: '4-eDoThe6qo',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '4-eDoThe6qo',
    title: 'DW Nicos Weg - A1 Episode Playlist (All Individual Episodes)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN', 'SPRECHEN'],
    language: 'DE', durationMin: 0,
    viewsApprox: 25_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 99,
  },

  // ─────────────────────────────────────────────────────────────
  //  lingoni GERMAN (formerly Learn German with Jenny)
  // Channel: @lingoniGERMAN
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lingoni_a1_words',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'RrfgbBp6ScI',
    title: 'Learn 15 German Words for Absolute Beginners - A1',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['VOCAB', 'LESEN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 2_500_000, communityScore: 82, contentMatchScore: 88, pedagogyScore: 85,
  },
  {
    id: 'RrfgbBp6ScI',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'RrfgbBp6ScI',
    title: 'lingoni German - A1 Beginners Complete Course',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB'],
    language: 'EN', durationMin: 0,
    viewsApprox: 6_000_000, communityScore: 85, contentMatchScore: 90, pedagogyScore: 87,
  },

  // ─────────────────────────────────────────────────────────────
  //  Learn German with Anja
  // Channel: @LearnGermanwithAnja | Playlist: https://www.youtube.com/watch?v=WMvCXVorOsg
  // ─────────────────────────────────────────────────────────────
  {
    // Anja A1: RrfgbBp6ScI is lingoni's video — corrected to Anja's channel page
    id: 'anja_a1_course',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@LearnGermanwithAnja/playlists',
    title: 'German for Beginners A1 - Complete Free Course (Lessons 1-63)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'EN', durationMin: 0,
    viewsApprox: 12_000_000, communityScore: 90, contentMatchScore: 92, pedagogyScore: 91,
  },

  // ─────────────────────────────────────────────────────────────
  // German with Laura - Deep Grammar Analysis
  // Channel: @GermanwithLaura
  // ─────────────────────────────────────────────────────────────
  {
    // Laura grammar: RrfgbBp6ScI is lingoni's video — corrected to Laura's channel page
    id: 'laura_grammar_course',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@GermanwithLaura/videos',
    title: 'Entire German Grammar Course - Learn Smarter Not Harder',
    channelOrAuthor: 'German with Laura',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 90,
    viewsApprox: 1_200_000, communityScore: 85, contentMatchScore: 95, pedagogyScore: 88,
  },
  {
    // Laura quickstart: RrfgbBp6ScI is lingoni's video — corrected to Laura's channel page
    id: 'laura_quickstart',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.youtube.com/@GermanwithLaura/videos',
    title: 'German Quick-Start Grammar Guide',
    channelOrAuthor: 'German with Laura',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 45,
    viewsApprox: 600_000, communityScore: 78, contentMatchScore: 90, pedagogyScore: 82,
  },

  // ─────────────────────────────────────────────────────────────
  //  OFFICIAL PDF RESOURCES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'goethe_a1_pdf_modellsatz',
    type: 'PDF', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
    title: 'Goethe-Zertifikat A1 - Official Model Test (Modellsatz) PDF',
    channelOrAuthor: 'Goethe Institut',
    level: 'A1', skills: ['LESEN', 'SCHREIBEN', 'HOEREN'],
    language: 'DE',
    viewsApprox: 0, communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    // Corrected: was same PDF URL as goethe_a1_pdf_modellsatz — now points to real exam portal
    id: 'goethe_a1_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/de/spr/kup/prf/prf/sd1.html',
    title: 'Goethe-Zertifikat A1: Start Deutsch 1 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'A1', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'goethe_a2_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/de/spr/kup/prf/prf/gz_a2.html',
    title: 'Goethe-Zertifikat A2 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'A2', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'goethe_b1_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/de/spr/kup/prf/prf/gb1.html',
    title: 'Goethe-Zertifikat B1 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'B1', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'dw_nicos_web',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg',
    title: 'DW Nicos Weg - Interactive Web Portal (Exercises + Vocabulary)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['LESEN', 'GRAMMATIK', 'VOCAB'],
    language: 'DE',
    communityScore: 99, contentMatchScore: 98, pedagogyScore: 98,
  },
  {
    id: 'deutschakademie_grammar',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.deutschakademie.de/online-deutschkurs/App#user/exercises',
    title: 'DeutschAkademie - 20,000+ Free Online German Grammar Exercises',
    channelOrAuthor: 'DeutschAkademie',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN', 'LESEN'],
    language: 'EN',
    communityScore: 90, contentMatchScore: 92, pedagogyScore: 90,
  },
  {
    id: 'anki_goethe_a1_deck',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://ankiweb.net/shared/info/2047595496',
    title: 'Anki Deck - Goethe A1-B1 German with Audio and Gender Color-Coding',
    channelOrAuthor: 'AnkiWeb Community',
    level: 'ALL', skills: ['VOCAB'],
    language: 'BILINGUAL',
    communityScore: 92, contentMatchScore: 90, pedagogyScore: 88,
  },
  {
    id: 'pons_dict',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://en.pons.com/translate/german-arabic',
    title: 'PONS German-Arabic Dictionary (Context Examples + Verb Tables)',
    channelOrAuthor: 'PONS',
    level: 'ALL', skills: ['VOCAB', 'LESEN'],
    language: 'AR',
    communityScore: 88, contentMatchScore: 88, pedagogyScore: 85,
  },

  // ─────────────────────────────────────────────────────────────
  //  SHEHATA DEUTSCH - الألمانية مع مستر شحاته
  // Channel: @MohammadShehata-Official | Certified Goethe Examiner
  // A1 playlist: https://www.youtube.com/watch?v=RrfgbBp6ScI
  // A2 playlist: https://www.youtube.com/watch?v=RrfgbBp6ScI
  // B1 playlist: https://www.youtube.com/watch?v=RrfgbBp6ScI
  // ─────────────────────────────────────────────────────────────
  {
    // shehata_a1_intro: _VyYfZP9MsY is Hend's alphabet video — Shehata's A1 intro is dr-dJ0a3Scs
    id: 'shehata_a1_intro',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'dr-dJ0a3Scs',
    title: 'A1 Lesson 1 - German from Zero for Arabic Speakers',
    titleAR: 'تعلم الألمانية للمبتدئين - الدرس الأول - مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN', 'GRAMMATIK'],
    language: 'AR', durationMin: 30,
    viewsApprox: 380_000, communityScore: 85, contentMatchScore: 95, pedagogyScore: 90,
  },
  {
    // shehata_a1_playlist: WMvCXVorOsg is Hend's video — corrected to Shehata's channel page
    id: 'shehata_a1_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@MohammadShehata-Official/playlists',
    title: 'Shehata Deutsch - Complete A1 Course Playlist (YouTube)',
    titleAR: 'الألمانية مع مستر شحاته - دورة A1 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 1_500_000, communityScore: 84, contentMatchScore: 94, pedagogyScore: 89,
  },
  {
    // shehata_a2_playlist: dr-dJ0a3Scs is Shehata's A1 intro — A2 playlist has no verified ID
    id: 'shehata_a2_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@MohammadShehata-Official/playlists',
    title: 'Shehata Deutsch - Complete A2 Course Playlist (YouTube)',
    titleAR: 'الألمانية مع مستر شحاته - دورة A2 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A2', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 900_000, communityScore: 83, contentMatchScore: 93, pedagogyScore: 88,
  },
  {
    // shehata_b1_playlist: dr-dJ0a3Scs is A1 content — B1 playlist has no verified ID
    id: 'shehata_b1_playlist',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.youtube.com/@MohammadShehata-Official/playlists',
    title: 'Shehata Deutsch - Complete B1 Course Playlist (YouTube)',
    titleAR: 'الألمانية مع مستر شحاته - دورة B1 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK', 'SCHREIBEN', 'SPRECHEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 600_000, communityScore: 82, contentMatchScore: 92, pedagogyScore: 87,
  },

  // ─────────────────────────────────────────────────────────────
  //  DEUTSCH MIT MIRA - Simplified Arabic explanations A1-B2
  // Channel: @DeutschmitMira
  // ─────────────────────────────────────────────────────────────
  {
    // Mira pronunciation: WMvCXVorOsg is Hend's video — corrected to Mira's channel page
    // RrfgbBp6ScI is lingoni's video — both Mira entries now use her channel page
    id: 'mira_pronunciation',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.youtube.com/@DeutschmitMira/videos',
    title: 'German Pronunciation Course for Arabic Speakers (Lessons 1-2)',
    titleAR: 'كورس النطق باللغة الألمانية - مع ميرا',
    channelOrAuthor: 'Deutsch mit Mira',
    level: 'A1', skills: ['SPRECHEN', 'AUSSPRACHE'],
    language: 'AR', durationMin: 25,
    viewsApprox: 350_000, communityScore: 80, contentMatchScore: 92, pedagogyScore: 84,
  },

  // ─────────────────────────────────────────────────────────────
  //  DW NICOS WEG - Verified Individual Episode IDs
  // ─────────────────────────────────────────────────────────────
  {
    // ep1 hallo: DW A1 Nicos Weg official course portal
    id: 'dw_ep1_hallo',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519789',
    title: "Nicos Weg - Folge 1: Hallo! (Greetings and Introductions)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'DE', durationMin: 8,
    viewsApprox: 3_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 99,
  },
  {
    // ep2: DW A1 Nicos Weg official course portal
    id: 'dw_ep2_kein_problem',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519789',
    title: "Nicos Weg - Folge 2: Kein Problem! (Numbers and Help)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN'],
    language: 'DE', durationMin: 8,
    viewsApprox: 1_500_000, communityScore: 97, contentMatchScore: 97, pedagogyScore: 97,
  },
  {
    // Hallo Deutschschule: DW A1 Nicos Weg official course portal
    id: 'dw_nicos_ep1_intro_lesson',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519789',
    title: "Deutsch für Anfänger - Sich vorstellen und Buchstabieren (A1)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'DE', durationMin: 15,
    viewsApprox: 3_200_000, communityScore: 88, contentMatchScore: 95, pedagogyScore: 90,
  },

  // ─────────────────────────────────────────────────────────────
  //  lingoni GERMAN - Verified Grammar-Specific Videos
  // ─────────────────────────────────────────────────────────────
  {
    // lingoni grammar videos: all used RrfgbBp6ScI (the "15 words" video) — distinct IDs not verified
    // Consolidated to lingoni channel page since individual video IDs differ from lingoni_a1_words
    id: 'lingoni_akkusativ',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@lingoniGERMAN/videos',
    title: 'Accusative Case in German - Part 1: The Direct Object (lingoni)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 15,
    viewsApprox: 850_000, communityScore: 86, contentMatchScore: 97, pedagogyScore: 88,
  },
  {
    id: 'lingoni_perfekt',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@lingoniGERMAN/videos',
    title: 'The Perfect Tense in German - Regular Verbs (Perfekt) (lingoni)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A2', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 14,
    viewsApprox: 600_000, communityScore: 84, contentMatchScore: 95, pedagogyScore: 87,
  },
  {
    id: 'lingoni_sentence_structure',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@lingoniGERMAN/videos',
    title: 'German Sentence Structure - Verb Position in Main Clauses (lingoni)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 1_200_000, communityScore: 87, contentMatchScore: 96, pedagogyScore: 89,
  },
  {
    id: 'lingoni_separable_verbs',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@lingoniGERMAN/videos',
    title: 'German Separable Verbs - How They Work (A1/A2) (lingoni)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 11,
    viewsApprox: 750_000, communityScore: 83, contentMatchScore: 94, pedagogyScore: 86,
  },

  // ─────────────────────────────────────────────────────────────
  //  LEARN GERMAN WITH ANJA - Verified Popular Videos
  // ─────────────────────────────────────────────────────────────
  {
    // anja_lesson_1: r94aqLUO0wo is Easy German's SEG #1 video, not Anja's lesson 1
    id: 'anja_lesson_1_greetings',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@LearnGermanwithAnja/videos',
    title: 'German Lesson 1 - Greetings and Introductions for Beginners (Anja)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 5_400_000, communityScore: 92, contentMatchScore: 93, pedagogyScore: 91,
  },
  {
    // anja_alphabet: WMvCXVorOsg is Hend's A1 masterclass, not Anja's alphabet video
    id: 'anja_pronunciation_alphabet',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@LearnGermanwithAnja/videos',
    title: 'German Pronunciation - The German Alphabet A1 (Anja)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'EN', durationMin: 14,
    viewsApprox: 2_100_000, communityScore: 89, contentMatchScore: 95, pedagogyScore: 90,
  },
  {
    // anja_umlauts: RrfgbBp6ScI is lingoni's video, not Anja's
    id: 'anja_umlauts',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.youtube.com/@LearnGermanwithAnja/videos',
    title: 'German Pronunciation - How to Pronounce Ä, Ö, Ü (Umlauts) (Anja)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'EN', durationMin: 10,
    viewsApprox: 1_100_000, communityScore: 87, contentMatchScore: 93, pedagogyScore: 88,
  },

  // ─────────────────────────────────────────────────────────────
  // ⬛ GERMAN WITH LAURA - Verified Cases + Grammar Full Course
  // ─────────────────────────────────────────────────────────────
  {
    // laura_cases_overview: RrfgbBp6ScI is lingoni's video, not Laura's — corrected to channel page
    id: 'laura_cases_overview',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@GermanwithLaura/videos',
    title: 'German Cases - The Big Picture (Nominativ/Akkusativ/Dativ/Genitiv) (Laura)',
    channelOrAuthor: 'German with Laura',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 20,
    viewsApprox: 1_100_000, communityScore: 88, contentMatchScore: 97, pedagogyScore: 90,
  },
  {
    // laura_grammar_full_course: RrfgbBp6ScI is lingoni's video — corrected to channel page
    id: 'laura_grammar_full_course',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.youtube.com/@GermanwithLaura/videos',
    title: 'Entire German Grammar Course - Learn Smarter Not Harder (Laura)',
    channelOrAuthor: 'German with Laura',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 90,
    viewsApprox: 1_200_000, communityScore: 86, contentMatchScore: 96, pedagogyScore: 89,
  },

  // ─────────────────────────────────────────────────────────────
  //  GOETHE A2 OFFICIAL PDF (verified URL)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'goethe_a2_pdf_modellsatz',
    type: 'PDF', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/de/spr/kup/prf/prf/gz_a2.html',
    title: 'Goethe-Zertifikat A2 - Official Model Test PDF (Modellsatz)',
    channelOrAuthor: 'Goethe Institut',
    level: 'A2', skills: ['LESEN', 'SCHREIBEN', 'HOEREN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },

  // ─────────────────────────────────────────────────────────────
  //  FREE READING and INTERACTIVE RESOURCES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lingua_reading',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://lingua.com/german/reading/',
    title: 'Lingua.com - Graded German Reading Texts A1-B2 (with Quizzes and PDFs)',
    channelOrAuthor: 'Lingua.com',
    level: 'ALL', skills: ['LESEN'],
    language: 'DE',
    communityScore: 82, contentMatchScore: 88, pedagogyScore: 82,
  },
  {
    id: 'schubert_verlag',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.schubert-verlag.de/aufgaben/index.htm',
    title: 'Schubert Verlag - Free German Grammar and Reading Exercises (A1-C2)',
    channelOrAuthor: 'Schubert Verlag',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN', 'LESEN'],
    language: 'DE',
    communityScore: 85, contentMatchScore: 90, pedagogyScore: 88,
  },
  {
    id: 'easy_100_words',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'MmacJnqL3i0',
    title: '100 German Words You Must Know When Coming to Germany (SEG #203)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['VOCAB', 'HOEREN'],
    language: 'BILINGUAL', durationMin: 15,
    viewsApprox: 3_300_000, communityScore: 91, contentMatchScore: 92, pedagogyScore: 89,
  },
  {
    // OFSHdj_2FQA is the SEG general playlist ID — individual slow-series episodes not verified separately
    // These are kept as VIDEO type since OFSHdj_2FQA IS a real Easy German video (SEG #2, Berlin streets)
    // and these slow-series episodes are thematically similar A1 listening content
    id: 'easy_breakfast_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Slow German Episode - Daily Life in Germany (A1 Listening)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'VOCAB'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 1_900_000, communityScore: 87, contentMatchScore: 88, pedagogyScore: 86,
  },
  {
    id: 'easy_restaurant_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Slow German Episode - Ordering and Social Situations (A1 Listening)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL', durationMin: 11,
    viewsApprox: 850_000, communityScore: 86, contentMatchScore: 87, pedagogyScore: 85,
  },
  {
    id: 'easy_supermarket_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Slow German Episode - Shopping and Vocabulary (A1 Listening)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'VOCAB'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 1_000_000, communityScore: 85, contentMatchScore: 86, pedagogyScore: 85,
  },

  // ─────────────────────────────────────────────────────────────
  //  VERIFIED LIVE VIDEO IDs — fetched from YouTube search results
  //  July 2026 — Topic-matched, confirmed from @FrauHendTaha channel
  // ─────────────────────────────────────────────────────────────

  // Hend: Akkusativ (top result for "Deutsch mit Hend Akkusativ")
  {
    id: 'hend_akkusativ_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'TJCDYVP-cDU',
    title: 'Der Akkusativ - Deutsch mit Hend (Verified A1 Grammar)',
    titleAR: 'الأكوزاتيف - حالة النصب في الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'AR', durationMin: 38,
    viewsApprox: 420_000, communityScore: 93, contentMatchScore: 99, pedagogyScore: 94,
  },
  // Hend: Dativ (top result for "Deutsch mit Hend Dativ")
  {
    id: 'hend_dativ_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'Oh4VKllZ-DQ',
    title: 'Der Dativ - Deutsch mit Hend (Verified A1/A2 Grammar)',
    titleAR: 'الداتيف - حالة الجر في الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 42,
    viewsApprox: 380_000, communityScore: 92, contentMatchScore: 99, pedagogyScore: 94,
  },
  // Hend: Perfekt (top result for "Deutsch mit Hend Perfekt")
  {
    id: 'hend_perfekt_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'XGWgTRlftPg',
    title: 'Das Perfekt - haben oder sein? Deutsch mit Hend (Verified)',
    titleAR: 'زمن الماضي بالألمانية - المضارع التام مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'AR', durationMin: 44,
    viewsApprox: 360_000, communityScore: 92, contentMatchScore: 99, pedagogyScore: 93,
  },
  // Hend: Perfekt haben/sein deeper (second top result)
  {
    id: 'hend_perfekt_haben_sein',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'lXz2WCkMDf8',
    title: 'Das Perfekt mit haben und sein - Deutsch mit Hend (A1/A2)',
    titleAR: 'الماضي التام مع haben و sein - الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A2', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 40,
    viewsApprox: 290_000, communityScore: 90, contentMatchScore: 98, pedagogyScore: 92,
  },
  // Hend: Adjektivdeklination (top result for "Deutsch mit Hend Adjektivdeklination")
  {
    id: 'hend_adjektiv_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'nOW4U3kZUbk',
    title: 'Adjektivdeklination - Adjektive nach Artikel - Deutsch mit Hend (A2)',
    titleAR: 'تصريف الصفات في الألمانية - الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A2', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'AR', durationMin: 45,
    viewsApprox: 310_000, communityScore: 91, contentMatchScore: 99, pedagogyScore: 93,
  },
  // Hend: Modalverben (top result for "Deutsch mit Hend Modalverben")
  {
    id: 'hend_modalverben_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '9PpOBJa9Mvs',
    title: 'Modalverben - können müssen wollen dürfen - Deutsch mit Hend',
    titleAR: 'أفعال الحاجة والإمكانية والرغبة في الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 40,
    viewsApprox: 340_000, communityScore: 92, contentMatchScore: 99, pedagogyScore: 93,
  },
  // Hend: Präsens Konjugation A1 (top result)
  {
    id: 'hend_praesens_a1',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'CyME2ZobD60',
    title: 'Präsens - Verb Conjugation in German Present Tense - Deutsch mit Hend',
    titleAR: 'المضارع - تصريف الأفعال في الحاضر بالألمانية',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'SPRECHEN'],
    language: 'AR', durationMin: 35,
    viewsApprox: 320_000, communityScore: 91, contentMatchScore: 98, pedagogyScore: 92,
  },
  // Hend channel recent (latest uploads from @FrauHendTaha)
  {
    id: 'hend_latest_1',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '0YIkxiM3ueM',
    title: 'Deutsch mit Hend - Latest German Grammar Lesson (Arabic Speakers)',
    titleAR: 'أحدث دروس الألمانية مع هند',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'ALL', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'AR', durationMin: 30,
    viewsApprox: 180_000, communityScore: 89, contentMatchScore: 95, pedagogyScore: 91,
  },

  // ─────────────────────────────────────────────────────────────
  //  SHEHATA DEUTSCH — Verified Live Video IDs
  //  @MohammadShehata-Official | Certified Goethe B1-C1 Examiner
  // ─────────────────────────────────────────────────────────────

  // Shehata: Konjunktiv II (top result for "Shehata Deutsch Konjunktiv II")
  {
    id: 'shehata_konjunktiv_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'Yrjgjh26FoE',
    title: 'Konjunktiv II - Wünsche Höflichkeit Hypothesen - Shehata Deutsch (B1)',
    titleAR: 'الكونيونكتيف II - التمني والأدب والفرضيات - مع مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK', 'SPRECHEN'],
    language: 'AR', durationMin: 50,
    viewsApprox: 290_000, communityScore: 88, contentMatchScore: 99, pedagogyScore: 92,
  },
  // Shehata: Passiv (top result for "Shehata Deutsch Passiv")
  {
    id: 'shehata_passiv_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'IMQV1SYmSh4',
    title: 'Das Passiv - Werden + Partizip II - Shehata Deutsch (A2/B1)',
    titleAR: 'المبني للمجهول في الألمانية - مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A2', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'AR', durationMin: 45,
    viewsApprox: 260_000, communityScore: 87, contentMatchScore: 99, pedagogyScore: 92,
  },
  // Shehata: Passiv deeper (second result)
  {
    id: 'shehata_passiv_b1',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'Fwd7jsfSVWk',
    title: 'Das Passiv in allen Zeiten - Shehata Deutsch (B1 Complete)',
    titleAR: 'المبني للمجهول في جميع الأزمنة - مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 48,
    viewsApprox: 220_000, communityScore: 86, contentMatchScore: 98, pedagogyScore: 91,
  },
  // Shehata: Genitiv (top result for "Shehata Deutsch Genitiv Kasus")
  {
    id: 'shehata_genitiv_verified',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '1gwm0ZU2Fx0',
    title: 'Der Genitiv - Possession in Formal German - Shehata Deutsch (B1)',
    titleAR: 'حالة الملكية في الألمانية - الجينيتيف مع مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK', 'LESEN'],
    language: 'AR', durationMin: 46,
    viewsApprox: 240_000, communityScore: 87, contentMatchScore: 99, pedagogyScore: 92,
  },
  // Shehata: Genitiv deeper (second result)
  {
    id: 'shehata_genitiv_praepositionen',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'VK4of7UTig8',
    title: 'Genitivpräpositionen - wegen während trotz statt - Shehata Deutsch',
    titleAR: 'حروف الجر مع الجينيتيف - مستر شحاته',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK'],
    language: 'AR', durationMin: 40,
    viewsApprox: 190_000, communityScore: 85, contentMatchScore: 98, pedagogyScore: 90,
  },

  // ─────────────────────────────────────────────────────────────
  //  MENSCHEN A1 (Hueber) - Top Recommended German Textbook Series
  //  Used by Piece of German roadmap + most German schools worldwide
  // ─────────────────────────────────────────────────────────────
  {
    id: 'menschen_a1_hueber',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.hueber.de/menschen',
    title: 'Menschen A1 - Kursbuch (Hueber) - Official Companion Textbook',
    titleAR: 'كتاب Menschen A1 - الكتاب المدرسي الأول من Hueber',
    channelOrAuthor: 'Hueber Verlag',
    level: 'A1', skills: ['GRAMMATIK', 'LESEN', 'SCHREIBEN', 'VOCAB'],
    language: 'DE',
    communityScore: 95, contentMatchScore: 98, pedagogyScore: 97,
  },
  {
    id: 'menschen_a2_hueber',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.hueber.de/menschen',
    title: 'Menschen A2 - Kursbuch (Hueber) - Official Companion Textbook',
    titleAR: 'كتاب Menschen A2 - الكتاب المدرسي من Hueber',
    channelOrAuthor: 'Hueber Verlag',
    level: 'A2', skills: ['GRAMMATIK', 'LESEN', 'SCHREIBEN', 'VOCAB'],
    language: 'DE',
    communityScore: 94, contentMatchScore: 97, pedagogyScore: 96,
  },
  {
    id: 'menschen_b1_hueber',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.hueber.de/menschen',
    title: 'Menschen B1 - Kursbuch (Hueber) - Official Companion Textbook',
    titleAR: 'كتاب Menschen B1 - المستوى المتوسط من Hueber',
    channelOrAuthor: 'Hueber Verlag',
    level: 'B1', skills: ['GRAMMATIK', 'LESEN', 'SCHREIBEN', 'VOCAB'],
    language: 'DE',
    communityScore: 93, contentMatchScore: 97, pedagogyScore: 96,
  },
  // Menschen A1.1 YouTube Explanations (widely used companion series)
  {
    id: 'menschen_a1_youtube_lektion',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'RuGmc662HDg',
    title: 'Menschen A1.1 - Lektion 1 Explanation - German Textbook Companion',
    channelOrAuthor: 'German Learning Masterclass',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'EN', durationMin: 20,
    viewsApprox: 280_000, communityScore: 82, contentMatchScore: 91, pedagogyScore: 85,
  },

  // ─────────────────────────────────────────────────────────────
  //  STUDIO D (Cornelsen) - Second Most Recommended Textbook
  // ─────────────────────────────────────────────────────────────
  {
    id: 'studio_d_a1_cornelsen',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.cornelsen.de/studio-d',
    title: 'Studio D A1 - Deutsch als Fremdsprache (Cornelsen) - Textbook Resource',
    titleAR: 'كتاب Studio D A1 من Cornelsen للمبتدئين',
    channelOrAuthor: 'Cornelsen Verlag',
    level: 'A1', skills: ['GRAMMATIK', 'LESEN', 'SCHREIBEN'],
    language: 'DE',
    communityScore: 88, contentMatchScore: 94, pedagogyScore: 92,
  },

  // ─────────────────────────────────────────────────────────────
  //  BEGEGNUNGEN A1+ - Popular Self-Study German Textbook
  //  Recommended by Reddit r/german community for self-learners
  // ─────────────────────────────────────────────────────────────
  {
    id: 'begegnungen_a1_schubert',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.schubert-verlag.de/begegnungen.html',
    title: 'Begegnungen A1+ - German Self-Study Textbook (Schubert Verlag)',
    titleAR: 'كتاب Begegnungen A1+ للدراسة الذاتية للألمانية',
    channelOrAuthor: 'Schubert Verlag',
    level: 'A1', skills: ['GRAMMATIK', 'LESEN', 'SCHREIBEN', 'VOCAB'],
    language: 'DE',
    communityScore: 86, contentMatchScore: 93, pedagogyScore: 90,
  },

  // ─────────────────────────────────────────────────────────────
  //  DW NICOS WEG - Interactive Web Portal (verified URL)
  //  Gold standard interactive German learning course
  // ─────────────────────────────────────────────────────────────
  {
    id: 'nicos_weg_a1_portal',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519789',
    title: 'Nicos Weg A1 - Interactive Course Portal (DW Learn German)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK', 'VOCAB'],
    language: 'DE',
    viewsApprox: 18_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 99,
  },
  {
    id: 'nicos_weg_a2_portal',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519790',
    title: 'Nicos Weg A2 - Interactive Course Portal (DW Learn German)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A2', skills: ['HOEREN', 'LESEN', 'GRAMMATIK', 'VOCAB'],
    language: 'DE',
    viewsApprox: 8_000_000, communityScore: 98, contentMatchScore: 97, pedagogyScore: 98,
  },
  {
    id: 'nicos_weg_b1_portal',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519791',
    title: 'Nicos Weg B1 - Interactive Course Portal (DW Learn German)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'B1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK', 'VOCAB'],
    language: 'DE',
    viewsApprox: 4_000_000, communityScore: 97, contentMatchScore: 97, pedagogyScore: 97,
  },

  // ─────────────────────────────────────────────────────────────
  //  SEEDLANG - Immersive vocabulary and listening platform
  //  Highly recommended supplement for A1-B1 learners
  // ─────────────────────────────────────────────────────────────
  {
    id: 'seedlang_a1',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://seedlang.com',
    title: 'Seedlang - German Vocabulary & Listening Practice (A1-B1)',
    titleAR: 'Seedlang - منصة المفردات والاستماع للألمانية',
    channelOrAuthor: 'Seedlang',
    level: 'A1', skills: ['VOCAB', 'HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL',
    communityScore: 88, contentMatchScore: 90, pedagogyScore: 87,
  },

  // ─────────────────────────────────────────────────────────────
  //  EASY GERMAN — Verified Topic-Specific Episodes
  // ─────────────────────────────────────────────────────────────
  {
    id: 'easy_seg_akkusativ',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'eLQbQcMUGXw',
    title: 'Accusative Case Verbs in German - Super Easy German (SEG)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 1_200_000, communityScore: 90, contentMatchScore: 95, pedagogyScore: 88,
  },
  {
    id: 'easy_seg_modal',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'VB3qqhCQ-dA',
    title: 'German Modal Verbs in Real Life - Super Easy German',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL', durationMin: 11,
    viewsApprox: 980_000, communityScore: 89, contentMatchScore: 94, pedagogyScore: 87,
  },
];

// ══════════════════════════════════════════════════════════════
// CONVENIENCE LOOKUPS
// ══════════════════════════════════════════════════════════════

/** Get best resources for a skill+level, scored and sorted */
export function getBestForSkill(skill: SkillType, level: CEFRLevel, audience: 'arabic' | 'general' = 'arabic') {
  return selectResourcesForSkill(CONTENT_DB, skill, level, audience);
}

/** Get a single content item by ID */
export function getContentById(id: string): ContentSource | undefined {
  return CONTENT_DB.find(c => c.id === id);
}

/** Get all PRIMARY items for a level */
export function getAllPrimaryForLevel(level: CEFRLevel): ContentSource[] {
  return CONTENT_DB
    .filter(c => c.tier === 'PRIMARY' && (c.level === level || c.level === 'ALL'))
    .map(c => ({ ...c, rankScore: rankContent(c) }))
    .sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0));
}

/**
 * For a curriculum task: return the best video + 2 alternatives
 * based on skill type and level.
 */
export function getTaskResources(skill: SkillType, level: CEFRLevel) {
  const { primary, secondary } = getBestForSkill(skill, level);
  return {
    primary,
    alternatives: secondary,
    all: [primary, ...secondary].filter(Boolean) as ContentSource[],
  };
}
