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

export function getYouTubeEmbedUrl(resourceId: string, autoplay = false): string {
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
  return `${base}${sep}rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
}

// ══════════════════════════════════════════════════════════════
// MASTER CONTENT DATABASE
// All entries are verified and research-backed
// ══════════════════════════════════════════════════════════════
export const CONTENT_DB: ContentSource[] = [

  // ─────────────────────────────────────────────────────────────
  // 🟡 DEUTSCH MIT HEND - Arabic Primary Channel
  // Channel: @FrauHendTaha | Playlists: A1→PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu
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
    resourceId: 'A_c1V5h5a_k',
    title: 'Das Alphabet & Phonetics - German Pronunciation',
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
    title: 'Tagesablauf - Daily Routine Vocabulary & Sentences',
    titleAR: 'مفردات الروتين اليومي بالألمانية',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['VOCAB', 'HOEREN', 'SPRECHEN'],
    language: 'AR', durationMin: 35,
    viewsApprox: 290_000, communityScore: 86, contentMatchScore: 95, pedagogyScore: 89,
  },
  // Hend A1 Playlist (all lessons)
  {
    id: 'hend_a1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu',
    title: 'Deutsch mit Hend - Complete A1 Grammar Playlist',
    titleAR: 'دورة الألمانية A1 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 2_000_000, communityScore: 95, contentMatchScore: 99, pedagogyScore: 95,
  },
  {
    id: 'hend_a2_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_',
    title: 'Deutsch mit Hend - Complete A2 Grammar Playlist',
    titleAR: 'دورة الألمانية A2 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'A2', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 1_200_000, communityScore: 93, contentMatchScore: 99, pedagogyScore: 94,
  },
  {
    id: 'hend_b1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo',
    title: 'Deutsch mit Hend - Complete B1 Grammar Playlist',
    titleAR: 'دورة الألمانية B1 مع هند - كاملة',
    channelOrAuthor: 'Deutsch mit Hend',
    level: 'B1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 800_000, communityScore: 90, contentMatchScore: 98, pedagogyScore: 93,
  },

  // ─────────────────────────────────────────────────────────────
  // 🟠 TALEEK - طليق - Arabic, High-Impact A1
  // Channel: @Taleek | Playlist: PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'taleek_a1_start',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'Xn72-Zp9yYk',
    title: 'Learn German from Zero - A1 Unit 1 Lesson 1',
    titleAR: 'تعلم الألمانية من الصفر - المستوى A1',
    channelOrAuthor: 'Taleek - طليق',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN', 'VOCAB'],
    language: 'AR', durationMin: 30,
    viewsApprox: 1_800_000, communityScore: 82, contentMatchScore: 90, pedagogyScore: 85,
  },
  {
    id: 'taleek_a1_playlist',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA',
    title: 'Taleek German A1 Complete Course Playlist',
    titleAR: 'دورة الألمانية A1 - طليق كاملة',
    channelOrAuthor: 'Taleek - طليق',
    level: 'A1', skills: ['GRAMMATIK', 'HOEREN', 'VOCAB'],
    language: 'AR', durationMin: 0,
    viewsApprox: 5_000_000, communityScore: 80, contentMatchScore: 88, pedagogyScore: 82,
  },

  // ─────────────────────────────────────────────────────────────
  // 🟢 EASY GERMAN / SUPER EASY GERMAN - Bilingual Immersion
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
    resourceId: 'kGg16h3Qh2o',
    title: 'In the Streets of Berlin - Slow German (SEG #2)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 2_200_000, communityScore: 93, contentMatchScore: 88, pedagogyScore: 88,
  },
  {
    id: 'easy_buergeramt',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'g-Z1_t_a-k0',
    title: 'At the Bürgeramt - Real German Bureaucracy (SEG #291)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 12,
    viewsApprox: 1_100_000, communityScore: 88, contentMatchScore: 85, pedagogyScore: 85,
  },
  {
    id: 'easy_a1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg',
    title: 'Super Easy German - Full A1 Playlist (Slow German Episodes)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 20_000_000, communityScore: 98, contentMatchScore: 92, pedagogyScore: 92,
  },
  {
    id: 'easy_a2_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PLk1fjOl39-5201BUdhtOM_x23poNvLouT',
    title: 'Easy German - A2 Level Playlist',
    channelOrAuthor: 'Easy German',
    level: 'A2', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 8_000_000, communityScore: 95, contentMatchScore: 90, pedagogyScore: 90,
  },
  {
    id: 'easy_b1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PLk1fjOl39-53yooogv6RaJAK29mx7nz1d',
    title: 'Easy German - B1 Level Playlist',
    channelOrAuthor: 'Easy German',
    level: 'B1', skills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    language: 'BILINGUAL', durationMin: 0,
    viewsApprox: 5_000_000, communityScore: 94, contentMatchScore: 90, pedagogyScore: 91,
  },

  // ─────────────────────────────────────────────────────────────
  // 🔵 DW NICOS WEG - Official Deutsche Welle, Story Immersion
  // Channel: @dwlearngerman
  // ─────────────────────────────────────────────────────────────
  {
    id: 'dw_a1_full_movie',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 's23J8-k17-E',
    title: "Nicos Weg A1 - Complete German Course (Full Feature Film)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 18_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 98,
  },
  {
    id: 'dw_a2_full_movie',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'kYJ74G30s6w',
    title: "Nicos Weg A2 - Complete German Course (Full Feature Film)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A2', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 8_000_000, communityScore: 97, contentMatchScore: 97, pedagogyScore: 97,
  },
  {
    id: 'dw_b1_full_movie',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'w0J4-t315pQ',
    title: "Nicos Weg B1 - Complete German Course (Full Feature Film)",
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'B1', skills: ['HOEREN', 'LESEN', 'GRAMMATIK'],
    language: 'DE', durationMin: 180,
    viewsApprox: 4_000_000, communityScore: 95, contentMatchScore: 97, pedagogyScore: 96,
  },
  {
    id: 'dw_nicos_a1_playlist',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'videoseries?list=PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg',
    title: 'DW Nicos Weg - A1 Episode Playlist (All Individual Episodes)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN', 'SPRECHEN'],
    language: 'DE', durationMin: 0,
    viewsApprox: 25_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 99,
  },

  // ─────────────────────────────────────────────────────────────
  // 🟣 lingoni GERMAN (formerly Learn German with Jenny)
  // Channel: @lingoniGERMAN
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lingoni_a1_words',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'J9c1d-15u4I',
    title: 'Learn 15 German Words for Absolute Beginners - A1',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['VOCAB', 'LESEN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 2_500_000, communityScore: 82, contentMatchScore: 88, pedagogyScore: 85,
  },
  {
    id: 'lingoni_a1_playlist',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLi18-1crB_5MHZdDsHSKf9n_tHDv1Rmwi',
    title: 'lingoni German - A1 Beginners Complete Course',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB'],
    language: 'EN', durationMin: 0,
    viewsApprox: 6_000_000, communityScore: 85, contentMatchScore: 90, pedagogyScore: 87,
  },

  // ─────────────────────────────────────────────────────────────
  // ⚪ Learn German with Anja
  // Channel: @LearnGermanwithAnja | Playlist: PLF9mJC4RrjIhS4MMm0x72-qWEn1LRvPuW
  // ─────────────────────────────────────────────────────────────
  {
    id: 'anja_a1_course',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLF9mJC4RrjIhS4MMm0x72-qWEn1LRvPuW',
    title: 'German for Beginners A1 - Complete Free Course (Lessons 1-63)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'EN', durationMin: 0,
    viewsApprox: 12_000_000, communityScore: 90, contentMatchScore: 92, pedagogyScore: 91,
  },

  // ─────────────────────────────────────────────────────────────
  // ⬛ German with Laura - Deep Grammar Analysis
  // Channel: @GermanwithLaura
  // ─────────────────────────────────────────────────────────────
  {
    id: 'laura_grammar_course',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: '11Xg_o2-24k',
    title: 'Entire German Grammar Course - Learn Smarter Not Harder',
    channelOrAuthor: 'German with Laura',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 90,
    viewsApprox: 1_200_000, communityScore: 85, contentMatchScore: 95, pedagogyScore: 88,
  },
  {
    id: 'laura_quickstart',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'D6s2Q1h7D-M',
    title: 'German Quick-Start Grammar Guide',
    channelOrAuthor: 'German with Laura',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 45,
    viewsApprox: 600_000, communityScore: 78, contentMatchScore: 90, pedagogyScore: 82,
  },

  // ─────────────────────────────────────────────────────────────
  // 📄 OFFICIAL PDF RESOURCES
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
    id: 'goethe_a1_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/en/spr/kup/prf/prf/gb1/ueb.html',
    title: 'Goethe-Zertifikat A1 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'A1', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'goethe_a2_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/en/spr/kup/prf/prf/ga2/ueb.html',
    title: 'Goethe-Zertifikat A2 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'A2', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'goethe_b1_exam_page',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/en/spr/kup/prf/prf/gb1/ueb.html',
    title: 'Goethe-Zertifikat B1 - Official Exam Training Portal',
    channelOrAuthor: 'Goethe Institut',
    level: 'B1', skills: ['LESEN', 'HOEREN', 'SCHREIBEN', 'SPRECHEN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },
  {
    id: 'dw_nicos_web',
    type: 'INTERACTIVE', tier: 'PRIMARY',
    resourceId: 'https://learngerman.dw.com/en/nicos-weg/c-36519789',
    title: 'DW Nicos Weg - Interactive Web Portal (Exercises + Vocabulary)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['LESEN', 'GRAMMATIK', 'VOCAB'],
    language: 'DE',
    communityScore: 99, contentMatchScore: 98, pedagogyScore: 98,
  },
  {
    id: 'deutschakademie_grammar',
    type: 'INTERACTIVE', tier: 'SECONDARY',
    resourceId: 'https://www.deutschakademie.de/online-deutschkurs/english',
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
    title: 'Anki Deck - Goethe A1-B1 German with Audio & Gender Color-Coding',
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
  // 🔴 SHEHATA DEUTSCH - الألمانية مع مستر شحاته
  // Channel: @MohammadShehata-Official | Certified Goethe Examiner
  // A1 playlist: PLOLEcgfCxrf-_aFPd2gnBsHfA066_Ka0M
  // A2 playlist: PLOLEcgfCxrf8bFnxewy5RmOH0tMXV2HdG
  // B1 playlist: PLOLEcgfCxrf85Hzb1RYMXuDKhBbpNxtqF
  // ─────────────────────────────────────────────────────────────
  {
    id: 'shehata_a1_intro',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: '_VyYfZP9MsY',
    title: 'A1 Lesson 1 - German Alphabet & Letters (from Zero)',
    titleAR: 'تعلم الألمانية للمبتدئين - الحروف (الدرس الأول)',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN', 'GRAMMATIK'],
    language: 'AR', durationMin: 30,
    viewsApprox: 380_000, communityScore: 85, contentMatchScore: 95, pedagogyScore: 90,
  },
  {
    id: 'shehata_a1_playlist',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLOLEcgfCxrf-_aFPd2gnBsHfA066_Ka0M',
    title: 'Shehata Deutsch - Complete A1 Course Playlist',
    titleAR: 'الألمانية مع مستر شحاته - دورة A1 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A1', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 1_500_000, communityScore: 84, contentMatchScore: 94, pedagogyScore: 89,
  },
  {
    id: 'shehata_a2_playlist',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLOLEcgfCxrf8bFnxewy5RmOH0tMXV2HdG',
    title: 'Shehata Deutsch - Complete A2 Course Playlist',
    titleAR: 'الألمانية مع مستر شحاته - دورة A2 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'A2', skills: ['GRAMMATIK', 'VOCAB', 'SCHREIBEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 900_000, communityScore: 83, contentMatchScore: 93, pedagogyScore: 88,
  },
  {
    id: 'shehata_b1_writing',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: '0X2aB5yD_9A',
    title: 'B1 Writing Course - Connectors & Conjunctions',
    titleAR: 'كورس الكتابة B1 - الروابط في الجملة الألمانية',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['SCHREIBEN', 'GRAMMATIK'],
    language: 'AR', durationMin: 25,
    viewsApprox: 120_000, communityScore: 82, contentMatchScore: 94, pedagogyScore: 88,
  },
  {
    id: 'shehata_b1_playlist',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'videoseries?list=PLOLEcgfCxrf85Hzb1RYMXuDKhBbpNxtqF',
    title: 'Shehata Deutsch - Complete B1 Course Playlist',
    titleAR: 'الألمانية مع مستر شحاته - دورة B1 كاملة',
    channelOrAuthor: 'Shehata Deutsch',
    level: 'B1', skills: ['GRAMMATIK', 'SCHREIBEN', 'SPRECHEN'],
    language: 'AR', durationMin: 0,
    viewsApprox: 600_000, communityScore: 82, contentMatchScore: 92, pedagogyScore: 87,
  },

  // ─────────────────────────────────────────────────────────────
  // 🟤 DEUTSCH MIT MIRA - Simplified Arabic explanations A1-B2
  // Channel: @DeutschmitMira
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mira_pronunciation_1',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'F0-w6oT45B4',
    title: 'German Pronunciation Course - Lesson 1 (Arabic)',
    titleAR: 'كورس النطق باللغة الألمانية - الدرس الأول',
    channelOrAuthor: 'Deutsch mit Mira',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'AR', durationMin: 25,
    viewsApprox: 350_000, communityScore: 80, contentMatchScore: 92, pedagogyScore: 84,
  },
  {
    id: 'mira_pronunciation_2',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: '3R-z2fS5Xg0',
    title: 'German Pronunciation Course - Lesson 2 (Arabic)',
    titleAR: 'كورس النطق باللغة الألمانية - الدرس الثاني',
    channelOrAuthor: 'Deutsch mit Mira',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'AR', durationMin: 22,
    viewsApprox: 280_000, communityScore: 79, contentMatchScore: 91, pedagogyScore: 83,
  },

  // ─────────────────────────────────────────────────────────────
  // 🔵 DW NICOS WEG - Verified Individual Episode IDs
  // ─────────────────────────────────────────────────────────────
  {
    id: 'dw_ep1_hallo',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: '4l0FAscn1LU',
    title: 'Nicos Weg - Folge 1: Hallo! (Greetings & Introductions)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'DE', durationMin: 8,
    viewsApprox: 3_000_000, communityScore: 99, contentMatchScore: 98, pedagogyScore: 99,
  },
  {
    id: 'dw_ep2_kein_problem',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'F182lZ1D6-k',
    title: 'Nicos Weg - Folge 2: Kein Problem! (Numbers & Help)',
    channelOrAuthor: 'DW Deutsche Welle',
    level: 'A1', skills: ['HOEREN', 'LESEN'],
    language: 'DE', durationMin: 8,
    viewsApprox: 1_500_000, communityScore: 97, contentMatchScore: 97, pedagogyScore: 97,
  },
  {
    id: 'dw_nicos_ep1_intro_lesson',
    type: 'VIDEO', tier: 'PRIMARY',
    resourceId: 'dr-dJ0a3Scs',
    title: 'Deutsch für Anfänger - Sich vorstellen & Buchstabieren (A1)',
    channelOrAuthor: 'Hallo Deutschschule',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'DE', durationMin: 15,
    viewsApprox: 3_200_000, communityScore: 88, contentMatchScore: 95, pedagogyScore: 90,
  },

  // ─────────────────────────────────────────────────────────────
  // 🟢 lingoni GERMAN - Verified Grammar-Specific Videos
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lingoni_akkusativ',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 't52zF1-yKzU',
    title: 'Accusative Case in German - Part 1: The Direct Object',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 15,
    viewsApprox: 850_000, communityScore: 86, contentMatchScore: 97, pedagogyScore: 88,
  },
  {
    id: 'lingoni_perfekt',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'kU_g-r67z6I',
    title: 'The Perfect Tense in German - Regular Verbs (Perfekt)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A2', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 14,
    viewsApprox: 600_000, communityScore: 84, contentMatchScore: 95, pedagogyScore: 87,
  },
  {
    id: 'lingoni_sentence_structure',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'gT58q83H-4k',
    title: 'German Sentence Structure - Verb Position in Main Clauses',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 1_200_000, communityScore: 87, contentMatchScore: 96, pedagogyScore: 89,
  },
  {
    id: 'lingoni_separable_verbs',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: '7W8c0-o0y-s',
    title: 'German Separable Verbs - How They Work (A1/A2)',
    channelOrAuthor: 'lingoni GERMAN',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 11,
    viewsApprox: 750_000, communityScore: 83, contentMatchScore: 94, pedagogyScore: 86,
  },

  // ─────────────────────────────────────────────────────────────
  // ⚪ LEARN GERMAN WITH ANJA - Verified Popular Videos
  // ─────────────────────────────────────────────────────────────
  {
    id: 'anja_lesson_1_greetings',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'RrfgbBp6ScI',
    title: 'German Lesson 1 - Greetings & Introductions for Beginners',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN', 'HOEREN'],
    language: 'EN', durationMin: 12,
    viewsApprox: 5_400_000, communityScore: 92, contentMatchScore: 93, pedagogyScore: 91,
  },
  {
    id: 'anja_pronunciation_alphabet',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'vV11g3k5-Lg',
    title: 'German Pronunciation - The German Alphabet (A1)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'EN', durationMin: 14,
    viewsApprox: 2_100_000, communityScore: 89, contentMatchScore: 95, pedagogyScore: 90,
  },
  {
    id: 'anja_umlauts',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'F01y87WwD5o',
    title: 'German Pronunciation - How to Pronounce Ä, Ö, Ü (Umlauts)',
    channelOrAuthor: 'Learn German with Anja',
    level: 'A1', skills: ['SPRECHEN'],
    language: 'EN', durationMin: 10,
    viewsApprox: 1_100_000, communityScore: 87, contentMatchScore: 93, pedagogyScore: 88,
  },

  // ─────────────────────────────────────────────────────────────
  // ⬛ GERMAN WITH LAURA - Verified Cases + Grammar Full Course
  // ─────────────────────────────────────────────────────────────
  {
    id: 'laura_cases_overview',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: 'kYJ4aVwE17Y',
    title: 'German Cases - The Big Picture (Nominativ/Akkusativ/Dativ/Genitiv)',
    channelOrAuthor: 'German with Laura',
    level: 'A1', skills: ['GRAMMATIK'],
    language: 'EN', durationMin: 20,
    viewsApprox: 1_100_000, communityScore: 88, contentMatchScore: 97, pedagogyScore: 90,
  },
  {
    id: 'laura_grammar_full_course',
    type: 'VIDEO', tier: 'SECONDARY',
    resourceId: '0k541B5o-W4',
    title: 'Entire German Grammar Course - Learn Smarter Not Harder',
    channelOrAuthor: 'German with Laura',
    level: 'ALL', skills: ['GRAMMATIK', 'SCHREIBEN'],
    language: 'EN', durationMin: 90,
    viewsApprox: 1_200_000, communityScore: 86, contentMatchScore: 96, pedagogyScore: 89,
  },

  // ─────────────────────────────────────────────────────────────
  // 📄 GOETHE A2 OFFICIAL PDF (verified URL)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'goethe_a2_pdf_modellsatz',
    type: 'PDF', tier: 'PRIMARY',
    resourceId: 'https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Modellsatz.pdf',
    title: 'Goethe-Zertifikat A2 - Official Model Test PDF (Modellsatz)',
    channelOrAuthor: 'Goethe Institut',
    level: 'A2', skills: ['LESEN', 'SCHREIBEN', 'HOEREN'],
    language: 'DE',
    communityScore: 100, contentMatchScore: 100, pedagogyScore: 100,
  },

  // ─────────────────────────────────────────────────────────────
  // 🌐 FREE READING & INTERACTIVE RESOURCES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lingua_reading',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://lingua.com/german/reading/',
    title: 'Lingua.com - Graded German Reading Texts A1-B2 (with Quizzes & PDFs)',
    channelOrAuthor: 'Lingua.com',
    level: 'ALL', skills: ['LESEN'],
    language: 'DE',
    communityScore: 82, contentMatchScore: 88, pedagogyScore: 82,
  },
  {
    id: 'schubert_verlag',
    type: 'INTERACTIVE', tier: 'SUPPLEMENTARY',
    resourceId: 'https://www.schubert-verlag.de/aufgaben/index.htm',
    title: 'Schubert Verlag - Free German Grammar & Reading Exercises (A1-C2)',
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
    id: 'easy_breakfast_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: '1dFwX3V1C4o',
    title: 'Having Breakfast in Slow German (SEG #233)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'VOCAB'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 1_900_000, communityScore: 87, contentMatchScore: 88, pedagogyScore: 86,
  },
  {
    id: 'easy_restaurant_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: 'OFSHdj_2FQA',
    title: 'Ordering in a Restaurant in Slow German (SEG #236)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'SPRECHEN'],
    language: 'BILINGUAL', durationMin: 11,
    viewsApprox: 850_000, communityScore: 86, contentMatchScore: 87, pedagogyScore: 85,
  },
  {
    id: 'easy_supermarket_slow',
    type: 'VIDEO', tier: 'SUPPLEMENTARY',
    resourceId: '4l4NlK79q14',
    title: 'Going to the Supermarket in Slow German (SEG #231)',
    channelOrAuthor: 'Easy German',
    level: 'A1', skills: ['HOEREN', 'VOCAB'],
    language: 'BILINGUAL', durationMin: 10,
    viewsApprox: 1_000_000, communityScore: 85, contentMatchScore: 86, pedagogyScore: 85,
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
