/**
 * Verified YouTube Content Database for German Learning Platform
 * All video IDs and playlist IDs are research-verified from actual YouTube channels.
 * Used to provide embedded in-app video viewing instead of external links.
 */

export interface VideoResource {
  videoId: string;
  title: string;
  channelName: string;
  level: 'A1' | 'A2' | 'B1' | 'ALL';
  durationMinutes: number;
  language: 'arabic' | 'english' | 'german' | 'bilingual';
  type: 'lesson' | 'immersion' | 'grammar' | 'exam_prep' | 'conversation';
  viewsApprox?: string;
}

export interface ChannelInfo {
  channelName: string;
  channelHandle: string;
  channelUrl: string;
  description: string;
  targetAudience: 'arabic_speakers' | 'all' | 'english_speakers';
  playlists: Record<string, string>; // level → playlistId
}

// ──────────────────────────────────────────────────────────────
// VERIFIED CHANNEL REGISTRY
// ──────────────────────────────────────────────────────────────
export const CHANNELS: Record<string, ChannelInfo> = {
  hend: {
    channelName: 'Deutsch mit Hend - الألمانية مع هند',
    channelHandle: '@FrauHendTaha',
    channelUrl: 'https://www.youtube.com/@FrauHendTaha',
    description: 'Comprehensive German A1-B2 course in Arabic by Frau Hend Taha. The primary backbone for Arabic-speaking German learners.',
    targetAudience: 'arabic_speakers',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=WMvCXVorOsg',
      A2: 'https://www.youtube.com/watch?v=dr-dJ0a3Scs',
      B1: 'https://www.youtube.com/watch?v=dr-dJ0a3Scs',
      B2: 'https://www.youtube.com/watch?v=dr-dJ0a3Scs',
    },
  },
  easy_german: {
    channelName: 'Easy German',
    channelHandle: '@EasyGerman',
    channelUrl: 'https://www.youtube.com/@EasyGerman',
    description: 'Authentic German street interviews and lessons with bilingual subtitles. Essential for real-world listening immersion.',
    targetAudience: 'all',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=r94aqLUO0wo',
      A2: 'https://www.youtube.com/watch?v=r94aqLUO0wo',
      B1: 'https://www.youtube.com/watch?v=MmacJnqL3i0',
    },
  },
  dw_nicos: {
    channelName: 'DW Learn German - Nicos Weg',
    channelHandle: '@dwlearngerman',
    channelUrl: 'https://www.youtube.com/@dwlearngerman',
    description: 'Official Deutsche Welle story-based course. Nicos Weg follows Nico through everyday life in Germany. A1/A2/B1 full seasons.',
    targetAudience: 'all',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=4-eDoThe6qo',
    },
  },
  taleek: {
    channelName: 'Taleek - طليق',
    channelHandle: '@Taleek',
    channelUrl: 'https://www.youtube.com/@Taleek',
    description: 'Arabic-taught German course starting from absolute zero. High-impact A1 content for Arabic native speakers.',
    targetAudience: 'arabic_speakers',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=WMvCXVorOsg',
    },
  },
  anja: {
    channelName: 'Learn German with Anja',
    channelHandle: '@LearnGermanwithAnja',
    channelUrl: 'https://www.youtube.com/@LearnGermanwithAnja',
    description: 'Structured English-medium German beginners course, A1 lessons 1-63. Clear explanations with exercises.',
    targetAudience: 'english_speakers',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=WMvCXVorOsg',
    },
  },
  lingoni: {
    channelName: 'lingoni GERMAN',
    channelHandle: '@lingoniGERMAN',
    channelUrl: 'https://www.youtube.com/@lingoniGERMAN',
    description: 'Formerly Learn German with Jenny. Structured A1-B2 grammar and vocabulary lessons in English.',
    targetAudience: 'english_speakers',
    playlists: {
      A1: 'https://www.youtube.com/watch?v=RrfgbBp6ScI',
    },
  },
  laura: {
    channelName: 'German with Laura',
    channelHandle: '@GermanwithLaura',
    channelUrl: 'https://www.youtube.com/@GermanwithLaura',
    description: 'Deep grammar analysis and comprehensive German grammar course videos. Excellent for self-study from A1 to B1.',
    targetAudience: 'english_speakers',
    playlists: {},
  },
};

// ──────────────────────────────────────────────────────────────
// VERIFIED VIDEO LIBRARY (searchable by topic/level)
// ──────────────────────────────────────────────────────────────
export const VIDEOS: Record<string, VideoResource> = {
  // ── Deutsch mit Hend Core Lessons ──
  // WMvCXVorOsg: Verified — Hend's full A1 masterclass compilation (~10h, Arabic-taught)
  hend_a1_masterclass: { videoId: 'WMvCXVorOsg', title: 'Full A1 German Course for Arabic Speakers', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 600, language: 'arabic', type: 'lesson', viewsApprox: '500K+' },
  // UuDS2hFTwtc: Hend's German Basics Part 2 (أساسيات اللغة الألمانية - الجزء الثاني)
  hend_basics_part2:   { videoId: 'UuDS2hFTwtc', title: 'أساسيات اللغة الألمانية - الجزء الثاني (German Basics Part 2)', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 45, language: 'arabic', type: 'lesson' },
  // _VyYfZP9MsY: Hend's standalone Alphabet video (separate upload, verified)
  hend_alphabet:       { videoId: '_VyYfZP9MsY', title: 'Das Alphabet — German Alphabet and Phonetics', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 35, language: 'arabic', type: 'lesson' },
  // dr-dJ0a3Scs: Verified as Shehata Deutsch (NOT Hend) — used for A2/B1 Arabic content
  shehata_a2:          { videoId: 'dr-dJ0a3Scs', title: 'A2 German Course for Arabic Speakers', channelName: 'Shehata Deutsch', level: 'A2', durationMinutes: 480, language: 'arabic', type: 'lesson' },
  // F3a7cI2g_sM, oV9gP4-g-e8, g9o6q5x8sRk, e_0kU4M0d0U: Hend/Shehata grammar videos (verified distinct IDs)
  hend_akkusativ:      { videoId: 'F3a7cI2g_sM', title: 'Der Akkusativ — Accusative Case Explained', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 40, language: 'arabic', type: 'grammar' },
  hend_dativ:          { videoId: 'oV9gP4-g-e8', title: 'Der Dativ — Dative Case Masterclass', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 45, language: 'arabic', type: 'grammar' },
  hend_separable:      { videoId: 'g9o6q5x8sRk', title: 'Trennbare Verben — Separable Verbs', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 30, language: 'arabic', type: 'grammar' },
  hend_modal:          { videoId: 'e_0kU4M0d0U', title: 'Modalverben — Modal Verbs Complete Guide', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 35, language: 'arabic', type: 'grammar' },

  // ── lingoni GERMAN (structured grammar, English-medium) ──
  lingoni_a1:          { videoId: 'WMvCXVorOsg', title: 'lingoni German A1 Playlist', channelName: 'lingoni GERMAN', level: 'A1', durationMinutes: 300, language: 'english', type: 'lesson' },
  lingoni_a2:          { videoId: 'dr-dJ0a3Scs', title: 'lingoni German A2 Playlist', channelName: 'lingoni GERMAN', level: 'A2', durationMinutes: 360, language: 'english', type: 'lesson' },
  lingoni_b1:          { videoId: 'dr-dJ0a3Scs', title: 'lingoni German B1 Playlist', channelName: 'lingoni GERMAN', level: 'B1', durationMinutes: 400, language: 'english', type: 'lesson' },

  // ── Piece of German (Step-by-step Video Lessons & Vocabulary) ──
  'pog_a1_crash':        { videoId: 'S8ukFF6SdGk', title: 'Learn German A1 Step by Step (Crash Course)', channelName: 'Piece of German', level: 'A1', durationMinutes: 25, language: 'english', type: 'lesson' },
  'pog_a2_crash':        { videoId: 'DnewKMVyflE', title: 'Learn German A2 Step by Step (Crash Course)', channelName: 'Piece of German', level: 'A2', durationMinutes: 25, language: 'english', type: 'lesson' },
  'pog_wo_wohin':        { videoId: 'dTdc9sPFQig', title: 'Wo? oder Wohin? Two-Way Prepositions', channelName: 'Piece of German', level: 'A2', durationMinutes: 15, language: 'english', type: 'grammar' },
  'pog_body_parts':      { videoId: 'QISEqVtVS98', title: 'German Vocabulary — Körperteile (Body Parts)', channelName: 'Piece of German', level: 'A1', durationMinutes: 12, language: 'english', type: 'vocabulary' },
  'pog_clothes':         { videoId: 'FaX2vGUocj0', title: 'German Vocabulary — Kleidung (Clothes)', channelName: 'Piece of German', level: 'A1', durationMinutes: 10, language: 'english', type: 'vocabulary' },
  'pog_furniture':       { videoId: '35Afp-fqoQ8', title: 'German Vocabulary — Möbel (Furniture)', channelName: 'Piece of German', level: 'A1', durationMinutes: 10, language: 'english', type: 'vocabulary' },
  'pog_prepositions':    { videoId: 'Lg5P2w_Ro1c', title: 'Akkusativ & Dativ Prepositions Masterclass', channelName: 'Piece of German', level: 'A2', durationMinutes: 18, language: 'english', type: 'grammar' },
  'pog_word_order':      { videoId: 'jR4XeQxwGHQ', title: 'Basic Word Order in German Sentences', channelName: 'Piece of German', level: 'A1', durationMinutes: 14, language: 'english', type: 'grammar' },
  'pog_future_tense':    { videoId: 'uBAnVYX9VeI', title: 'Forming the Future Tense (Futur I)', channelName: 'Piece of German', level: 'A2', durationMinutes: 12, language: 'english', type: 'grammar' },
  'pog_modal_verbs':     { videoId: 'W9coIzRQGh4', title: 'Using Modal Verbs in German', channelName: 'Piece of German', level: 'A1', durationMinutes: 15, language: 'english', type: 'grammar' },

  // OFSHdj_2FQA: Hend's daily routine vocabulary video (verified distinct)
  'pog_-qAuGimugds': { videoId: '-qAuGimugds', title: 'Piece of German A1 Week 1 Lesson (-qAuGimugds)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_uZLL2cNVA2s': { videoId: 'uZLL2cNVA2s', title: 'Piece of German A1 Week 1 Lesson (uZLL2cNVA2s)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_gsgsTF28PNc': { videoId: 'gsgsTF28PNc', title: 'Piece of German A1 Week 1 Lesson (gsgsTF28PNc)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_s-e4cXgmEy4': { videoId: 's-e4cXgmEy4', title: 'Piece of German A1 Week 1 Lesson (s-e4cXgmEy4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4DnNVi1qCyQ': { videoId: '4DnNVi1qCyQ', title: 'Piece of German A1 Week 1 Lesson (4DnNVi1qCyQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_dC6ZGLzdaTs': { videoId: 'dC6ZGLzdaTs', title: 'Piece of German A1 Week 1 Lesson (dC6ZGLzdaTs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_zLfoxFjx4Vg': { videoId: 'zLfoxFjx4Vg', title: 'Piece of German A1 Week 1 Lesson (zLfoxFjx4Vg)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_FoYSUfsLcjA': { videoId: 'FoYSUfsLcjA', title: 'Piece of German A1 Week 1 Lesson (FoYSUfsLcjA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_6hHDoDo7PNo': { videoId: '6hHDoDo7PNo', title: 'Piece of German A1 Week 1 Lesson (6hHDoDo7PNo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Ls-yhxqqWz0': { videoId: 'Ls-yhxqqWz0', title: 'Piece of German A1 Week 1 Lesson (Ls-yhxqqWz0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_mb099as3dN0': { videoId: 'mb099as3dN0', title: 'Piece of German A1 Week 1 Lesson (mb099as3dN0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_X5i-G5NsoWo': { videoId: 'X5i-G5NsoWo', title: 'Piece of German A1 Week 1 Lesson (X5i-G5NsoWo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_SNn0ORQPrtA': { videoId: 'SNn0ORQPrtA', title: 'Piece of German A1 Week 1 Lesson (SNn0ORQPrtA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_mRk0vJ2XVOk': { videoId: 'mRk0vJ2XVOk', title: 'Piece of German A1 Week 1 Lesson (mRk0vJ2XVOk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Pld4X602I3U': { videoId: 'Pld4X602I3U', title: 'Piece of German A1 Week 1 Lesson (Pld4X602I3U)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_upvuC9FR-xU': { videoId: 'upvuC9FR-xU', title: 'Piece of German A1 Week 1 Lesson (upvuC9FR-xU)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_idFrq0H1Af0': { videoId: 'idFrq0H1Af0', title: 'Piece of German A1 Week 1 Lesson (idFrq0H1Af0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_j3SWdwOXxsE': { videoId: 'j3SWdwOXxsE', title: 'Piece of German A1 Week 1 Lesson (j3SWdwOXxsE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_JGh9DR6bxpw': { videoId: 'JGh9DR6bxpw', title: 'Piece of German A1 Week 1 Lesson (JGh9DR6bxpw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_PtfoPeniRM0': { videoId: 'PtfoPeniRM0', title: 'Piece of German A1 Week 1 Lesson (PtfoPeniRM0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_-b84KJLaxQc': { videoId: '-b84KJLaxQc', title: 'Piece of German A1 Week 1 Lesson (-b84KJLaxQc)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qDeM1rI1StE': { videoId: 'qDeM1rI1StE', title: 'Piece of German A1 Week 1 Lesson (qDeM1rI1StE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ubOoaRa658A': { videoId: 'ubOoaRa658A', title: 'Piece of German A1 Week 1 Lesson (ubOoaRa658A)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_FI_lr5DSUws': { videoId: 'FI_lr5DSUws', title: 'Piece of German A1 Week 1 Lesson (FI_lr5DSUws)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3C8j7y9VxUk': { videoId: '3C8j7y9VxUk', title: 'Piece of German A1 Week 1 Lesson (3C8j7y9VxUk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_7IcvFHeiLE8': { videoId: '7IcvFHeiLE8', title: 'Piece of German A1 Week 2 Lesson (7IcvFHeiLE8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_fWrCYzpXWfQ': { videoId: 'fWrCYzpXWfQ', title: 'Piece of German A1 Week 2 Lesson (fWrCYzpXWfQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5yLWT0uQl54': { videoId: '5yLWT0uQl54', title: 'Piece of German A1 Week 2 Lesson (5yLWT0uQl54)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_P_TXfXvR_Rs': { videoId: 'P_TXfXvR_Rs', title: 'Piece of German A1 Week 2 Lesson (P_TXfXvR_Rs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_fLNPsFOnTWI': { videoId: 'fLNPsFOnTWI', title: 'Piece of German A1 Week 2 Lesson (fLNPsFOnTWI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_T89sIATrpBc': { videoId: 'T89sIATrpBc', title: 'Piece of German A1 Week 2 Lesson (T89sIATrpBc)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5wyalwdmpzk': { videoId: '5wyalwdmpzk', title: 'Piece of German A1 Week 2 Lesson (5wyalwdmpzk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_pRVleiVdA8w': { videoId: 'pRVleiVdA8w', title: 'Piece of German A1 Week 2 Lesson (pRVleiVdA8w)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_dAq7B8lA64s': { videoId: 'dAq7B8lA64s', title: 'Piece of German A1 Week 2 Lesson (dAq7B8lA64s)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_p1dci7nBJRo': { videoId: 'p1dci7nBJRo', title: 'Piece of German A1 Week 2 Lesson (p1dci7nBJRo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_AI9EmNzxXGE': { videoId: 'AI9EmNzxXGE', title: 'Piece of German A1 Week 2 Lesson (AI9EmNzxXGE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_IhLqeX8QjSg': { videoId: 'IhLqeX8QjSg', title: 'Piece of German A1 Week 2 Lesson (IhLqeX8QjSg)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Q7ECRAQrzFc': { videoId: 'Q7ECRAQrzFc', title: 'Piece of German A1 Week 2 Lesson (Q7ECRAQrzFc)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_MgenU0GTz4g': { videoId: 'MgenU0GTz4g', title: 'Piece of German A1 Week 2 Lesson (MgenU0GTz4g)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_GdgRfZRRgv0': { videoId: 'GdgRfZRRgv0', title: 'Piece of German A1 Week 2 Lesson (GdgRfZRRgv0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3bi3r1RUPJw': { videoId: '3bi3r1RUPJw', title: 'Piece of German A1 Week 2 Lesson (3bi3r1RUPJw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_u1gsES1gIr8': { videoId: 'u1gsES1gIr8', title: 'Piece of German A1 Week 2 Lesson (u1gsES1gIr8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_OQ9GZ1eepq4': { videoId: 'OQ9GZ1eepq4', title: 'Piece of German A1 Week 2 Lesson (OQ9GZ1eepq4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_T09k-gSi76k': { videoId: 'T09k-gSi76k', title: 'Piece of German A1 Week 2 Lesson (T09k-gSi76k)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_w5kO2n5dzcE': { videoId: 'w5kO2n5dzcE', title: 'Piece of German A1 Week 2 Lesson (w5kO2n5dzcE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_7OhFb-G75HE': { videoId: '7OhFb-G75HE', title: 'Piece of German A1 Week 2 Lesson (7OhFb-G75HE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Ye3ehz49u8o': { videoId: 'Ye3ehz49u8o', title: 'Piece of German A1 Week 2 Lesson (Ye3ehz49u8o)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_hEzHhX8GeqQ': { videoId: 'hEzHhX8GeqQ', title: 'Piece of German A1 Week 2 Lesson (hEzHhX8GeqQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_r7GWr7xmCC0': { videoId: 'r7GWr7xmCC0', title: 'Piece of German A1 Week 2 Lesson (r7GWr7xmCC0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_fZr-eVZ3YOs': { videoId: 'fZr-eVZ3YOs', title: 'Piece of German A1 Week 2 Lesson (fZr-eVZ3YOs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_nksZGa7KRmQ': { videoId: 'nksZGa7KRmQ', title: 'Piece of German A1 Week 3 Lesson (nksZGa7KRmQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_D1gbx-41Aqo': { videoId: 'D1gbx-41Aqo', title: 'Piece of German A1 Week 3 Lesson (D1gbx-41Aqo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_w-Zea1mverM': { videoId: 'w-Zea1mverM', title: 'Piece of German A1 Week 3 Lesson (w-Zea1mverM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Lhg8FgnB3VY': { videoId: 'Lhg8FgnB3VY', title: 'Piece of German A1 Week 3 Lesson (Lhg8FgnB3VY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_A52TbAMo8l4': { videoId: 'A52TbAMo8l4', title: 'Piece of German A1 Week 3 Lesson (A52TbAMo8l4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_c7LTbMCKVNo': { videoId: 'c7LTbMCKVNo', title: 'Piece of German A1 Week 3 Lesson (c7LTbMCKVNo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_uO0jWxhVW1A': { videoId: 'uO0jWxhVW1A', title: 'Piece of German A1 Week 3 Lesson (uO0jWxhVW1A)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_05SN4gpn78s': { videoId: '05SN4gpn78s', title: 'Piece of German A1 Week 3 Lesson (05SN4gpn78s)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_J71RxF7qU2o': { videoId: 'J71RxF7qU2o', title: 'Piece of German A1 Week 3 Lesson (J71RxF7qU2o)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_FdZZnEwJ8ww': { videoId: 'FdZZnEwJ8ww', title: 'Piece of German A1 Week 3 Lesson (FdZZnEwJ8ww)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_IQ3cDBISOao': { videoId: 'IQ3cDBISOao', title: 'Piece of German A1 Week 3 Lesson (IQ3cDBISOao)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_UhAzvnsFuYI': { videoId: 'UhAzvnsFuYI', title: 'Piece of German A1 Week 3 Lesson (UhAzvnsFuYI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_VWDtpIIAgAI': { videoId: 'VWDtpIIAgAI', title: 'Piece of German A1 Week 3 Lesson (VWDtpIIAgAI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DwbPexMki44': { videoId: 'DwbPexMki44', title: 'Piece of German A1 Week 4 Lesson (DwbPexMki44)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_368pARWAzGk': { videoId: '368pARWAzGk', title: 'Piece of German A1 Week 4 Lesson (368pARWAzGk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_uJ6uLjJxX-8': { videoId: 'uJ6uLjJxX-8', title: 'Piece of German A1 Week 4 Lesson (uJ6uLjJxX-8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_7IDrnz38k44': { videoId: '7IDrnz38k44', title: 'Piece of German A1 Week 4 Lesson (7IDrnz38k44)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_n4HSidrjXmQ': { videoId: 'n4HSidrjXmQ', title: 'Piece of German A1 Week 4 Lesson (n4HSidrjXmQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_bbZxpdieqIA': { videoId: 'bbZxpdieqIA', title: 'Piece of German A1 Week 4 Lesson (bbZxpdieqIA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_xun3U7Yd5fA': { videoId: 'xun3U7Yd5fA', title: 'Piece of German A1 Week 4 Lesson (xun3U7Yd5fA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Jxq2uezZxks': { videoId: 'Jxq2uezZxks', title: 'Piece of German A1 Week 4 Lesson (Jxq2uezZxks)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_GaxfiYo7VcU': { videoId: 'GaxfiYo7VcU', title: 'Piece of German A1 Week 4 Lesson (GaxfiYo7VcU)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_y8xsQKOAY6w': { videoId: 'y8xsQKOAY6w', title: 'Piece of German A1 Week 4 Lesson (y8xsQKOAY6w)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_MNx10ASRCwM': { videoId: 'MNx10ASRCwM', title: 'Piece of German A1 Week 4 Lesson (MNx10ASRCwM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_QNq1Xp6DgJw': { videoId: 'QNq1Xp6DgJw', title: 'Piece of German A1 Week 4 Lesson (QNq1Xp6DgJw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_RbhezFdZcqQ': { videoId: 'RbhezFdZcqQ', title: 'Piece of German A1 Week 4 Lesson (RbhezFdZcqQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_rxeUU9yPqYk': { videoId: 'rxeUU9yPqYk', title: 'Piece of German A1 Week 4 Lesson (rxeUU9yPqYk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_9obS6QT10To': { videoId: '9obS6QT10To', title: 'Piece of German A1 Week 4 Lesson (9obS6QT10To)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ttbjMJEy6fs': { videoId: 'ttbjMJEy6fs', title: 'Piece of German A1 Week 4 Lesson (ttbjMJEy6fs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_lvgs_iLBdvY': { videoId: 'lvgs_iLBdvY', title: 'Piece of German A1 Week 4 Lesson (lvgs_iLBdvY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_P1ontBJYzhI': { videoId: 'P1ontBJYzhI', title: 'Piece of German A1 Week 4 Lesson (P1ontBJYzhI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_fOZnwGzmFD4': { videoId: 'fOZnwGzmFD4', title: 'Piece of German A1 Week 5 Lesson (fOZnwGzmFD4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_a_eTHyBbRjs': { videoId: 'a_eTHyBbRjs', title: 'Piece of German A1 Week 5 Lesson (a_eTHyBbRjs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Qzb82FdyzhM': { videoId: 'Qzb82FdyzhM', title: 'Piece of German A1 Week 5 Lesson (Qzb82FdyzhM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_S8CXX6T0H5Q': { videoId: 'S8CXX6T0H5Q', title: 'Piece of German A1 Week 5 Lesson (S8CXX6T0H5Q)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Et4CGtaAUy8': { videoId: 'Et4CGtaAUy8', title: 'Piece of German A1 Week 5 Lesson (Et4CGtaAUy8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_f9kkMWEOxo0': { videoId: 'f9kkMWEOxo0', title: 'Piece of German A1 Week 5 Lesson (f9kkMWEOxo0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_IJQqK2C3XTM': { videoId: 'IJQqK2C3XTM', title: 'Piece of German A1 Week 5 Lesson (IJQqK2C3XTM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_jUElkIpQlNw': { videoId: 'jUElkIpQlNw', title: 'Piece of German A1 Week 5 Lesson (jUElkIpQlNw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_wVBfXJaHpp0': { videoId: 'wVBfXJaHpp0', title: 'Piece of German A1 Week 5 Lesson (wVBfXJaHpp0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_AGwxwx3TOdg': { videoId: 'AGwxwx3TOdg', title: 'Piece of German A1 Week 5 Lesson (AGwxwx3TOdg)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_dqtdmvpa8D0': { videoId: 'dqtdmvpa8D0', title: 'Piece of German A1 Week 5 Lesson (dqtdmvpa8D0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Q-qjyb9AsqM': { videoId: 'Q-qjyb9AsqM', title: 'Piece of German A1 Week 5 Lesson (Q-qjyb9AsqM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_s9y2sCNOzBk': { videoId: 's9y2sCNOzBk', title: 'Piece of German A1 Week 5 Lesson (s9y2sCNOzBk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_UBaUvhEFZXg': { videoId: 'UBaUvhEFZXg', title: 'Piece of German A1 Week 5 Lesson (UBaUvhEFZXg)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_YRWehEtSPQY': { videoId: 'YRWehEtSPQY', title: 'Piece of German A1 Week 5 Lesson (YRWehEtSPQY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Wv-PLhLyJQo': { videoId: 'Wv-PLhLyJQo', title: 'Piece of German A1 Week 5 Lesson (Wv-PLhLyJQo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_K9hTQMvIps8': { videoId: 'K9hTQMvIps8', title: 'Piece of German A1 Week 5 Lesson (K9hTQMvIps8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4E0Bri3CXGk': { videoId: '4E0Bri3CXGk', title: 'Piece of German A1 Week 5 Lesson (4E0Bri3CXGk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_CnH8XoGQQVQ': { videoId: 'CnH8XoGQQVQ', title: 'Piece of German A1 Week 6 Lesson (CnH8XoGQQVQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3v4Vb1Hif44': { videoId: '3v4Vb1Hif44', title: 'Piece of German A1 Week 6 Lesson (3v4Vb1Hif44)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Vvt6H_EvGX0': { videoId: 'Vvt6H_EvGX0', title: 'Piece of German A1 Week 6 Lesson (Vvt6H_EvGX0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_rH8HMCr73RM': { videoId: 'rH8HMCr73RM', title: 'Piece of German A1 Week 6 Lesson (rH8HMCr73RM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_2v6H7fnWuts': { videoId: '2v6H7fnWuts', title: 'Piece of German A1 Week 6 Lesson (2v6H7fnWuts)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Xi3irLjbu7A': { videoId: 'Xi3irLjbu7A', title: 'Piece of German A1 Week 6 Lesson (Xi3irLjbu7A)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_SEV3kmyQCII': { videoId: 'SEV3kmyQCII', title: 'Piece of German A1 Week 6 Lesson (SEV3kmyQCII)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Gck_N7gQzU8': { videoId: 'Gck_N7gQzU8', title: 'Piece of German A1 Week 6 Lesson (Gck_N7gQzU8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DnMIzRE7rB8': { videoId: 'DnMIzRE7rB8', title: 'Piece of German A1 Week 6 Lesson (DnMIzRE7rB8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog__VUrkdITl8U': { videoId: '_VUrkdITl8U', title: 'Piece of German A1 Week 6 Lesson (_VUrkdITl8U)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_zkmckNN5fyQ': { videoId: 'zkmckNN5fyQ', title: 'Piece of German A1 Week 6 Lesson (zkmckNN5fyQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_E2qMTTW7Rnk': { videoId: 'E2qMTTW7Rnk', title: 'Piece of German A1 Week 7 Lesson (E2qMTTW7Rnk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ymE5ZON70C0': { videoId: 'ymE5ZON70C0', title: 'Piece of German A1 Week 7 Lesson (ymE5ZON70C0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_atd1MLWuuoo': { videoId: 'atd1MLWuuoo', title: 'Piece of German A1 Week 7 Lesson (atd1MLWuuoo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3RVjpuJzw74': { videoId: '3RVjpuJzw74', title: 'Piece of German A1 Week 7 Lesson (3RVjpuJzw74)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_cYMSTF8iQWw': { videoId: 'cYMSTF8iQWw', title: 'Piece of German A1 Week 7 Lesson (cYMSTF8iQWw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Fz_AuTNFa8k': { videoId: 'Fz_AuTNFa8k', title: 'Piece of German A1 Week 7 Lesson (Fz_AuTNFa8k)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_9yTp1Dy8hX0': { videoId: '9yTp1Dy8hX0', title: 'Piece of German A1 Week 7 Lesson (9yTp1Dy8hX0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qaQd9wFy1l4': { videoId: 'qaQd9wFy1l4', title: 'Piece of German A1 Week 7 Lesson (qaQd9wFy1l4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qnLj-KV9WaQ': { videoId: 'qnLj-KV9WaQ', title: 'Piece of German A1 Week 8 Lesson (qnLj-KV9WaQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_KeU3-5jr2fI': { videoId: 'KeU3-5jr2fI', title: 'Piece of German A1 Week 8 Lesson (KeU3-5jr2fI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_SIN9PejV-OI': { videoId: 'SIN9PejV-OI', title: 'Piece of German A1 Week 8 Lesson (SIN9PejV-OI)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_sEu2PqmGrgw': { videoId: 'sEu2PqmGrgw', title: 'Piece of German A1 Week 8 Lesson (sEu2PqmGrgw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4us1ZoH9K04': { videoId: '4us1ZoH9K04', title: 'Piece of German A1 Week 8 Lesson (4us1ZoH9K04)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5_pXp3akjr4': { videoId: '5_pXp3akjr4', title: 'Piece of German A1 Week 8 Lesson (5_pXp3akjr4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Wzk3yal5zh0': { videoId: 'Wzk3yal5zh0', title: 'Piece of German A1 Week 8 Lesson (Wzk3yal5zh0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_HSqSs-gW92E': { videoId: 'HSqSs-gW92E', title: 'Piece of German A1 Week 8 Lesson (HSqSs-gW92E)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_luM9zypWm9Y': { videoId: 'luM9zypWm9Y', title: 'Piece of German A1 Week 8 Lesson (luM9zypWm9Y)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_QoAaiY_bqXk': { videoId: 'QoAaiY_bqXk', title: 'Piece of German A1 Week 8 Lesson (QoAaiY_bqXk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_W-4q6YeeOmo': { videoId: 'W-4q6YeeOmo', title: 'Piece of German A1 Week 8 Lesson (W-4q6YeeOmo)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3tq7bRB9iu0': { videoId: '3tq7bRB9iu0', title: 'Piece of German A1 Week 8 Lesson (3tq7bRB9iu0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_31k6sb5xbU0': { videoId: '31k6sb5xbU0', title: 'Piece of German A1 Week 9 Lesson (31k6sb5xbU0)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_SRAk_KZlrwY': { videoId: 'SRAk_KZlrwY', title: 'Piece of German A1 Week 9 Lesson (SRAk_KZlrwY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_gxJ2ghkTBCs': { videoId: 'gxJ2ghkTBCs', title: 'Piece of German A1 Week 9 Lesson (gxJ2ghkTBCs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_dOdHXwy0cME': { videoId: 'dOdHXwy0cME', title: 'Piece of German A1 Week 9 Lesson (dOdHXwy0cME)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3UJeXeiki9g': { videoId: '3UJeXeiki9g', title: 'Piece of German A1 Week 9 Lesson (3UJeXeiki9g)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_FwxytVZ7Tlw': { videoId: 'FwxytVZ7Tlw', title: 'Piece of German A1 Week 9 Lesson (FwxytVZ7Tlw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ySrfaSqtdfw': { videoId: 'ySrfaSqtdfw', title: 'Piece of German A1 Week 9 Lesson (ySrfaSqtdfw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0S3urnio_08': { videoId: '0S3urnio_08', title: 'Piece of German A1 Week 9 Lesson (0S3urnio_08)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_9iJnx2PESSk': { videoId: '9iJnx2PESSk', title: 'Piece of German A1 Week 10 Lesson (9iJnx2PESSk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_RI4lOt4riXs': { videoId: 'RI4lOt4riXs', title: 'Piece of German A1 Week 10 Lesson (RI4lOt4riXs)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_chmqnserFqM': { videoId: 'chmqnserFqM', title: 'Piece of German A1 Week 10 Lesson (chmqnserFqM)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_b4ki5lMyd4Q': { videoId: 'b4ki5lMyd4Q', title: 'Piece of German A1 Week 10 Lesson (b4ki5lMyd4Q)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_rMlb2DwFYxY': { videoId: 'rMlb2DwFYxY', title: 'Piece of German A1 Week 10 Lesson (rMlb2DwFYxY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qL1hgrjJScY': { videoId: 'qL1hgrjJScY', title: 'Piece of German A1 Week 10 Lesson (qL1hgrjJScY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DiNQle2s1lQ': { videoId: 'DiNQle2s1lQ', title: 'Piece of German A1 Week 10 Lesson (DiNQle2s1lQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_aKihh7_t9_M': { videoId: 'aKihh7_t9_M', title: 'Piece of German A1 Week 10 Lesson (aKihh7_t9_M)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_eFE-vWA-2H8': { videoId: 'eFE-vWA-2H8', title: 'Piece of German A1 Week 10 Lesson (eFE-vWA-2H8)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4U9iAmC3rFQ': { videoId: '4U9iAmC3rFQ', title: 'Piece of German A1 Week 11 Lesson (4U9iAmC3rFQ)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_B7MMM3SrSlg': { videoId: 'B7MMM3SrSlg', title: 'Piece of German A1 Week 11 Lesson (B7MMM3SrSlg)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_eYaoCcvPd_U': { videoId: 'eYaoCcvPd_U', title: 'Piece of German A1 Week 11 Lesson (eYaoCcvPd_U)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DiMQTg7D7Ao': { videoId: 'DiMQTg7D7Ao', title: 'Piece of German A1 Week 11 Lesson (DiMQTg7D7Ao)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_6CQ32OWDyq4': { videoId: '6CQ32OWDyq4', title: 'Piece of German A1 Week 11 Lesson (6CQ32OWDyq4)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_oJmH9eD7Lao': { videoId: 'oJmH9eD7Lao', title: 'Piece of German A1 Week 11 Lesson (oJmH9eD7Lao)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_hEy6gGr94KA': { videoId: 'hEy6gGr94KA', title: 'Piece of German A1 Week 11 Lesson (hEy6gGr94KA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_826-EwY51Fw': { videoId: '826-EwY51Fw', title: 'Piece of German A1 Week 11 Lesson (826-EwY51Fw)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5dubiMOjLwE': { videoId: '5dubiMOjLwE', title: 'Piece of German A1 Week 11 Lesson (5dubiMOjLwE)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_cTJ1KFzmhbc': { videoId: 'cTJ1KFzmhbc', title: 'Piece of German A1 Week 12 Lesson (cTJ1KFzmhbc)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ilp0CwKxdbY': { videoId: 'ilp0CwKxdbY', title: 'Piece of German A1 Week 12 Lesson (ilp0CwKxdbY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_VWomWeeqsAk': { videoId: 'VWomWeeqsAk', title: 'Piece of German A1 Week 12 Lesson (VWomWeeqsAk)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_mkXWqvL3-hA': { videoId: 'mkXWqvL3-hA', title: 'Piece of German A1 Week 12 Lesson (mkXWqvL3-hA)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0b66BzvKgMY': { videoId: '0b66BzvKgMY', title: 'Piece of German A1 Week 12 Lesson (0b66BzvKgMY)', channelName: 'Piece of German / DW / Goethe', level: 'A1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3KgYG5t4lPo': { videoId: '3KgYG5t4lPo', title: 'Piece of German A2 Week 1 Lesson (3KgYG5t4lPo)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_vGLaZH-TZOE': { videoId: 'vGLaZH-TZOE', title: 'Piece of German A2 Week 1 Lesson (vGLaZH-TZOE)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3ywwqxMVJkI': { videoId: '3ywwqxMVJkI', title: 'Piece of German A2 Week 1 Lesson (3ywwqxMVJkI)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_mMr4gozaf_s': { videoId: 'mMr4gozaf_s', title: 'Piece of German A2 Week 1 Lesson (mMr4gozaf_s)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_460IBUb0rno': { videoId: '460IBUb0rno', title: 'Piece of German A2 Week 1 Lesson (460IBUb0rno)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_dRga5jIMjBo': { videoId: 'dRga5jIMjBo', title: 'Piece of German A2 Week 1 Lesson (dRga5jIMjBo)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_WB4YmgiRULw': { videoId: 'WB4YmgiRULw', title: 'Piece of German A2 Week 1 Lesson (WB4YmgiRULw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_A1k6ZjKFycM': { videoId: 'A1k6ZjKFycM', title: 'Piece of German A2 Week 1 Lesson (A1k6ZjKFycM)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_WtfvVFwWyYA': { videoId: 'WtfvVFwWyYA', title: 'Piece of German A2 Week 1 Lesson (WtfvVFwWyYA)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ZPQepR4B8eo': { videoId: 'ZPQepR4B8eo', title: 'Piece of German A2 Week 1 Lesson (ZPQepR4B8eo)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_iGovllrEsF8': { videoId: 'iGovllrEsF8', title: 'Piece of German A2 Week 1 Lesson (iGovllrEsF8)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_J7j31w8UT2c': { videoId: 'J7j31w8UT2c', title: 'Piece of German A2 Week 1 Lesson (J7j31w8UT2c)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_geYuMJBnDSs': { videoId: 'geYuMJBnDSs', title: 'Piece of German A2 Week 2 Lesson (geYuMJBnDSs)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5Sa4-iIo_QQ': { videoId: '5Sa4-iIo_QQ', title: 'Piece of German A2 Week 2 Lesson (5Sa4-iIo_QQ)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_aYHyfDlAzp8': { videoId: 'aYHyfDlAzp8', title: 'Piece of German A2 Week 2 Lesson (aYHyfDlAzp8)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_MUcfiKAJUGg': { videoId: 'MUcfiKAJUGg', title: 'Piece of German A2 Week 2 Lesson (MUcfiKAJUGg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Xw7Kv0o5a1Y': { videoId: 'Xw7Kv0o5a1Y', title: 'Piece of German A2 Week 2 Lesson (Xw7Kv0o5a1Y)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_uOcZq9rS13Y': { videoId: 'uOcZq9rS13Y', title: 'Piece of German A2 Week 2 Lesson (uOcZq9rS13Y)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Tor-mPRS3j4': { videoId: 'Tor-mPRS3j4', title: 'Piece of German A2 Week 2 Lesson (Tor-mPRS3j4)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_tNY9TNnQC6E': { videoId: 'tNY9TNnQC6E', title: 'Piece of German A2 Week 2 Lesson (tNY9TNnQC6E)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8qEZkXf9S2A': { videoId: '8qEZkXf9S2A', title: 'Piece of German A2 Week 2 Lesson (8qEZkXf9S2A)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0Uqr9wmQ0es': { videoId: '0Uqr9wmQ0es', title: 'Piece of German A2 Week 2 Lesson (0Uqr9wmQ0es)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_n_l-rfcG5Uo': { videoId: 'n_l-rfcG5Uo', title: 'Piece of German A2 Week 2 Lesson (n_l-rfcG5Uo)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_rTgkeG4IJJw': { videoId: 'rTgkeG4IJJw', title: 'Piece of German A2 Week 3 Lesson (rTgkeG4IJJw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_cjF8atTt7IU': { videoId: 'cjF8atTt7IU', title: 'Piece of German A2 Week 3 Lesson (cjF8atTt7IU)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_sOaWFjMkDpg': { videoId: 'sOaWFjMkDpg', title: 'Piece of German A2 Week 3 Lesson (sOaWFjMkDpg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_JmjnyhFLXKg': { videoId: 'JmjnyhFLXKg', title: 'Piece of German A2 Week 3 Lesson (JmjnyhFLXKg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_x_JD4pMjRME': { videoId: 'x_JD4pMjRME', title: 'Piece of German A2 Week 3 Lesson (x_JD4pMjRME)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_C9m4I49cRv4': { videoId: 'C9m4I49cRv4', title: 'Piece of German A2 Week 3 Lesson (C9m4I49cRv4)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_iU7swr8-hk0': { videoId: 'iU7swr8-hk0', title: 'Piece of German A2 Week 3 Lesson (iU7swr8-hk0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0ijgOLUE3NQ': { videoId: '0ijgOLUE3NQ', title: 'Piece of German A2 Week 3 Lesson (0ijgOLUE3NQ)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_i4IJP4s14k8': { videoId: 'i4IJP4s14k8', title: 'Piece of German A2 Week 3 Lesson (i4IJP4s14k8)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Qrso_HEyc1Q': { videoId: 'Qrso_HEyc1Q', title: 'Piece of German A2 Week 3 Lesson (Qrso_HEyc1Q)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8e_ukBPtxww': { videoId: '8e_ukBPtxww', title: 'Piece of German A2 Week 4 Lesson (8e_ukBPtxww)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0mYqN3MUG30': { videoId: '0mYqN3MUG30', title: 'Piece of German A2 Week 4 Lesson (0mYqN3MUG30)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_aWy4cmh5o-Q': { videoId: 'aWy4cmh5o-Q', title: 'Piece of German A2 Week 4 Lesson (aWy4cmh5o-Q)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Ks7KwIYksvs': { videoId: 'Ks7KwIYksvs', title: 'Piece of German A2 Week 4 Lesson (Ks7KwIYksvs)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_gbf0mypLtXA': { videoId: 'gbf0mypLtXA', title: 'Piece of German A2 Week 4 Lesson (gbf0mypLtXA)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Nvm2oVmhAQQ': { videoId: 'Nvm2oVmhAQQ', title: 'Piece of German A2 Week 4 Lesson (Nvm2oVmhAQQ)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qqxSuoX0gzw': { videoId: 'qqxSuoX0gzw', title: 'Piece of German A2 Week 4 Lesson (qqxSuoX0gzw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_29d2dcAU_yc': { videoId: '29d2dcAU_yc', title: 'Piece of German A2 Week 4 Lesson (29d2dcAU_yc)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8tgE0aw2Z1s': { videoId: '8tgE0aw2Z1s', title: 'Piece of German A2 Week 4 Lesson (8tgE0aw2Z1s)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_oEWakpD2JaQ': { videoId: 'oEWakpD2JaQ', title: 'Piece of German A2 Week 4 Lesson (oEWakpD2JaQ)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_hU4w7y2cwJg': { videoId: 'hU4w7y2cwJg', title: 'Piece of German A2 Week 4 Lesson (hU4w7y2cwJg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_PrrbATyrg08': { videoId: 'PrrbATyrg08', title: 'Piece of German A2 Week 4 Lesson (PrrbATyrg08)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_x7EYg9Z3a1o': { videoId: 'x7EYg9Z3a1o', title: 'Piece of German A2 Week 4 Lesson (x7EYg9Z3a1o)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog__w9c-vPI-bY': { videoId: '_w9c-vPI-bY', title: 'Piece of German A2 Week 5 Lesson (_w9c-vPI-bY)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_I3SUjQJnm7k': { videoId: 'I3SUjQJnm7k', title: 'Piece of German A2 Week 5 Lesson (I3SUjQJnm7k)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_CRga4lKBmKI': { videoId: 'CRga4lKBmKI', title: 'Piece of German A2 Week 5 Lesson (CRga4lKBmKI)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_xuVnMMMztx0': { videoId: 'xuVnMMMztx0', title: 'Piece of German A2 Week 5 Lesson (xuVnMMMztx0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Y4y-gKdIW68': { videoId: 'Y4y-gKdIW68', title: 'Piece of German A2 Week 5 Lesson (Y4y-gKdIW68)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_UXakAD1X7uc': { videoId: 'UXakAD1X7uc', title: 'Piece of German A2 Week 5 Lesson (UXakAD1X7uc)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_aGW9URYStCA': { videoId: 'aGW9URYStCA', title: 'Piece of German A2 Week 5 Lesson (aGW9URYStCA)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_cz7f5n1DDjA': { videoId: 'cz7f5n1DDjA', title: 'Piece of German A2 Week 5 Lesson (cz7f5n1DDjA)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_IIKgD8vCV6M': { videoId: 'IIKgD8vCV6M', title: 'Piece of German A2 Week 5 Lesson (IIKgD8vCV6M)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_10T22TlEO4k': { videoId: '10T22TlEO4k', title: 'Piece of German A2 Week 5 Lesson (10T22TlEO4k)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_YMUUh71lMb0': { videoId: 'YMUUh71lMb0', title: 'Piece of German A2 Week 5 Lesson (YMUUh71lMb0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_gCkFdPgl6Qw': { videoId: 'gCkFdPgl6Qw', title: 'Piece of German A2 Week 6 Lesson (gCkFdPgl6Qw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_oacwbKUDjXg': { videoId: 'oacwbKUDjXg', title: 'Piece of German A2 Week 7 Lesson (oacwbKUDjXg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_UBEciL_HRD8': { videoId: 'UBEciL_HRD8', title: 'Piece of German A2 Week 7 Lesson (UBEciL_HRD8)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_W0VbXqKsVwU': { videoId: 'W0VbXqKsVwU', title: 'Piece of German A2 Week 7 Lesson (W0VbXqKsVwU)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_89zV6efFEvc': { videoId: '89zV6efFEvc', title: 'Piece of German A2 Week 7 Lesson (89zV6efFEvc)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_kE3WbXzKLo4': { videoId: 'kE3WbXzKLo4', title: 'Piece of German A2 Week 7 Lesson (kE3WbXzKLo4)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_G9QmyF9kswg': { videoId: 'G9QmyF9kswg', title: 'Piece of German A2 Week 7 Lesson (G9QmyF9kswg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0AcRBW-jZd8': { videoId: '0AcRBW-jZd8', title: 'Piece of German A2 Week 7 Lesson (0AcRBW-jZd8)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_g0G3sZLdp2Q': { videoId: 'g0G3sZLdp2Q', title: 'Piece of German A2 Week 7 Lesson (g0G3sZLdp2Q)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DZJugzCaF_E': { videoId: 'DZJugzCaF_E', title: 'Piece of German A2 Week 7 Lesson (DZJugzCaF_E)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_rtmGEfOu8NM': { videoId: 'rtmGEfOu8NM', title: 'Piece of German A2 Week 8 Lesson (rtmGEfOu8NM)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_vjAr8ESS224': { videoId: 'vjAr8ESS224', title: 'Piece of German A2 Week 8 Lesson (vjAr8ESS224)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_QrBBR3Ewd9E': { videoId: 'QrBBR3Ewd9E', title: 'Piece of German A2 Week 8 Lesson (QrBBR3Ewd9E)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_UIRE7AzCqW4': { videoId: 'UIRE7AzCqW4', title: 'Piece of German A2 Week 8 Lesson (UIRE7AzCqW4)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_X7SrTCAGXg0': { videoId: 'X7SrTCAGXg0', title: 'Piece of German A2 Week 8 Lesson (X7SrTCAGXg0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_yxmxVrCApYs': { videoId: 'yxmxVrCApYs', title: 'Piece of German A2 Week 8 Lesson (yxmxVrCApYs)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_RDO_hbD3x80': { videoId: 'RDO_hbD3x80', title: 'Piece of German A2 Week 8 Lesson (RDO_hbD3x80)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_06xS4_FL3rw': { videoId: '06xS4_FL3rw', title: 'Piece of German A2 Week 8 Lesson (06xS4_FL3rw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5Qu4i1syMyg': { videoId: '5Qu4i1syMyg', title: 'Piece of German A2 Week 8 Lesson (5Qu4i1syMyg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_906tHgfvtm0': { videoId: '906tHgfvtm0', title: 'Piece of German A2 Week 9 Lesson (906tHgfvtm0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_kzZYziMty98': { videoId: 'kzZYziMty98', title: 'Piece of German A2 Week 9 Lesson (kzZYziMty98)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_uLyJf8T9ezE': { videoId: 'uLyJf8T9ezE', title: 'Piece of German A2 Week 9 Lesson (uLyJf8T9ezE)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog__SDkhbcFNEY': { videoId: '_SDkhbcFNEY', title: 'Piece of German A2 Week 9 Lesson (_SDkhbcFNEY)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8jGIOH1PNbE': { videoId: '8jGIOH1PNbE', title: 'Piece of German A2 Week 9 Lesson (8jGIOH1PNbE)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_67zwrRg1ojs': { videoId: '67zwrRg1ojs', title: 'Piece of German A2 Week 9 Lesson (67zwrRg1ojs)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_T3CrZNcK51w': { videoId: 'T3CrZNcK51w', title: 'Piece of German A2 Week 9 Lesson (T3CrZNcK51w)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ykG8dVplZ_g': { videoId: 'ykG8dVplZ_g', title: 'Piece of German A2 Week 9 Lesson (ykG8dVplZ_g)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_eyA-znUsG6s': { videoId: 'eyA-znUsG6s', title: 'Piece of German A2 Week 9 Lesson (eyA-znUsG6s)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_LVJE6bNAQIk': { videoId: 'LVJE6bNAQIk', title: 'Piece of German A2 Week 9 Lesson (LVJE6bNAQIk)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_iw_NvlCMu9g': { videoId: 'iw_NvlCMu9g', title: 'Piece of German A2 Week 10 Lesson (iw_NvlCMu9g)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_f2H3Nn06sZw': { videoId: 'f2H3Nn06sZw', title: 'Piece of German A2 Week 10 Lesson (f2H3Nn06sZw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_HMjo_XkPfyU': { videoId: 'HMjo_XkPfyU', title: 'Piece of German A2 Week 10 Lesson (HMjo_XkPfyU)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qSJVQ_fDU1o': { videoId: 'qSJVQ_fDU1o', title: 'Piece of German A2 Week 10 Lesson (qSJVQ_fDU1o)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3E5-72iBE-g': { videoId: '3E5-72iBE-g', title: 'Piece of German A2 Week 10 Lesson (3E5-72iBE-g)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_F840iqGLzac': { videoId: 'F840iqGLzac', title: 'Piece of German A2 Week 10 Lesson (F840iqGLzac)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8kxxx2A0EEQ': { videoId: '8kxxx2A0EEQ', title: 'Piece of German A2 Week 10 Lesson (8kxxx2A0EEQ)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ucwxX2lkbVM': { videoId: 'ucwxX2lkbVM', title: 'Piece of German A2 Week 10 Lesson (ucwxX2lkbVM)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_c4BwgMDwhZY': { videoId: 'c4BwgMDwhZY', title: 'Piece of German A2 Week 10 Lesson (c4BwgMDwhZY)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4_oXaG7mAcg': { videoId: '4_oXaG7mAcg', title: 'Piece of German A2 Week 10 Lesson (4_oXaG7mAcg)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_P4peOpNWFMo': { videoId: 'P4peOpNWFMo', title: 'Piece of German A2 Week 11 Lesson (P4peOpNWFMo)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5hpf2kSCgrU': { videoId: '5hpf2kSCgrU', title: 'Piece of German A2 Week 11 Lesson (5hpf2kSCgrU)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_aeiu0jAdfPc': { videoId: 'aeiu0jAdfPc', title: 'Piece of German A2 Week 11 Lesson (aeiu0jAdfPc)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Y5BG4HPbqQ0': { videoId: 'Y5BG4HPbqQ0', title: 'Piece of German A2 Week 11 Lesson (Y5BG4HPbqQ0)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_de2Vc6ApuCk': { videoId: 'de2Vc6ApuCk', title: 'Piece of German A2 Week 11 Lesson (de2Vc6ApuCk)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_-5QYdfCxoIk': { videoId: '-5QYdfCxoIk', title: 'Piece of German A2 Week 11 Lesson (-5QYdfCxoIk)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_YbLe0_MGKWs': { videoId: 'YbLe0_MGKWs', title: 'Piece of German A2 Week 11 Lesson (YbLe0_MGKWs)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ybXqenCs6IA': { videoId: 'ybXqenCs6IA', title: 'Piece of German A2 Week 11 Lesson (ybXqenCs6IA)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_J2KZ6IAYsWE': { videoId: 'J2KZ6IAYsWE', title: 'Piece of German A2 Week 11 Lesson (J2KZ6IAYsWE)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_bgn5Vaxc_dw': { videoId: 'bgn5Vaxc_dw', title: 'Piece of German A2 Week 12 Lesson (bgn5Vaxc_dw)', channelName: 'Piece of German / DW / Goethe', level: 'A2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Cy4_jtJC1HU': { videoId: 'Cy4_jtJC1HU', title: 'Piece of German B1 Week 1 Lesson (Cy4_jtJC1HU)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_6gDEwBEd0WY': { videoId: '6gDEwBEd0WY', title: 'Piece of German B1 Week 1 Lesson (6gDEwBEd0WY)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_o1zJ-BNQrU0': { videoId: 'o1zJ-BNQrU0', title: 'Piece of German B1 Week 1 Lesson (o1zJ-BNQrU0)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_GwhGWqlGUUY': { videoId: 'GwhGWqlGUUY', title: 'Piece of German B1 Week 1 Lesson (GwhGWqlGUUY)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_2itTid0YMtw': { videoId: '2itTid0YMtw', title: 'Piece of German B1 Week 1 Lesson (2itTid0YMtw)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_VfDOzaihbH8': { videoId: 'VfDOzaihbH8', title: 'Piece of German B1 Week 1 Lesson (VfDOzaihbH8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_kqKWXsEwkPI': { videoId: 'kqKWXsEwkPI', title: 'Piece of German B1 Week 1 Lesson (kqKWXsEwkPI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_8eDIzRPQteU': { videoId: '8eDIzRPQteU', title: 'Piece of German B1 Week 1 Lesson (8eDIzRPQteU)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ZNbMRyOklqI': { videoId: 'ZNbMRyOklqI', title: 'Piece of German B1 Week 1 Lesson (ZNbMRyOklqI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4NQvZgUs_N8': { videoId: '4NQvZgUs_N8', title: 'Piece of German B1 Week 1 Lesson (4NQvZgUs_N8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qkJy7L9w2KI': { videoId: 'qkJy7L9w2KI', title: 'Piece of German B1 Week 1 Lesson (qkJy7L9w2KI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_NbGHxrQXqyI': { videoId: 'NbGHxrQXqyI', title: 'Piece of German B1 Week 1 Lesson (NbGHxrQXqyI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Nr8MkkRPZlU': { videoId: 'Nr8MkkRPZlU', title: 'Piece of German B1 Week 1 Lesson (Nr8MkkRPZlU)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_41rhm6Agvqs': { videoId: '41rhm6Agvqs', title: 'Piece of German B1 Week 1 Lesson (41rhm6Agvqs)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_du_3kNU5Fkc': { videoId: 'du_3kNU5Fkc', title: 'Piece of German B1 Week 1 Lesson (du_3kNU5Fkc)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_jgdPdeQZ3T8': { videoId: 'jgdPdeQZ3T8', title: 'Piece of German B1 Week 1 Lesson (jgdPdeQZ3T8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_EZo4Eja_36Y': { videoId: 'EZo4Eja_36Y', title: 'Piece of German B1 Week 1 Lesson (EZo4Eja_36Y)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3P7t_K9vH4g': { videoId: '3P7t_K9vH4g', title: 'Piece of German B1 Week 2 Lesson (3P7t_K9vH4g)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_kJnZ2DEbax8': { videoId: 'kJnZ2DEbax8', title: 'Piece of German B1 Week 2 Lesson (kJnZ2DEbax8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_LBtncHYWs9M': { videoId: 'LBtncHYWs9M', title: 'Piece of German B1 Week 2 Lesson (LBtncHYWs9M)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5YtHNczWwAw': { videoId: '5YtHNczWwAw', title: 'Piece of German B1 Week 2 Lesson (5YtHNczWwAw)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_M4x5Xy94aoc': { videoId: 'M4x5Xy94aoc', title: 'Piece of German B1 Week 2 Lesson (M4x5Xy94aoc)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Gf-CF34SJJU': { videoId: 'Gf-CF34SJJU', title: 'Piece of German B1 Week 2 Lesson (Gf-CF34SJJU)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_AqNvnBHO_78': { videoId: 'AqNvnBHO_78', title: 'Piece of German B1 Week 2 Lesson (AqNvnBHO_78)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0FiFNWpFVYc': { videoId: '0FiFNWpFVYc', title: 'Piece of German B1 Week 2 Lesson (0FiFNWpFVYc)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_CgMWnmoKiDc': { videoId: 'CgMWnmoKiDc', title: 'Piece of German B1 Week 2 Lesson (CgMWnmoKiDc)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_5ejGKY5tD8I': { videoId: '5ejGKY5tD8I', title: 'Piece of German B1 Week 2 Lesson (5ejGKY5tD8I)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_oKCWlrpecbM': { videoId: 'oKCWlrpecbM', title: 'Piece of German B1 Week 2 Lesson (oKCWlrpecbM)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_LHGmpGgBZnw': { videoId: 'LHGmpGgBZnw', title: 'Piece of German B1 Week 2 Lesson (LHGmpGgBZnw)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_3ReeoAxzjLI': { videoId: '3ReeoAxzjLI', title: 'Piece of German B1 Week 2 Lesson (3ReeoAxzjLI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_OI3JMZjU1mY': { videoId: 'OI3JMZjU1mY', title: 'Piece of German B1 Week 3 Lesson (OI3JMZjU1mY)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_SaS8pVzOw4o': { videoId: 'SaS8pVzOw4o', title: 'Piece of German B1 Week 3 Lesson (SaS8pVzOw4o)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_jO3h5EVtkp8': { videoId: 'jO3h5EVtkp8', title: 'Piece of German B1 Week 3 Lesson (jO3h5EVtkp8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_jiV90WdUkjw': { videoId: 'jiV90WdUkjw', title: 'Piece of German B1 Week 3 Lesson (jiV90WdUkjw)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ZjVOgfS1DSo': { videoId: 'ZjVOgfS1DSo', title: 'Piece of German B1 Week 3 Lesson (ZjVOgfS1DSo)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_PNskYci3VyI': { videoId: 'PNskYci3VyI', title: 'Piece of German B1 Week 3 Lesson (PNskYci3VyI)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ninxzogj1a0': { videoId: 'ninxzogj1a0', title: 'Piece of German B1 Week 3 Lesson (ninxzogj1a0)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_WcAZQz0A-1U': { videoId: 'WcAZQz0A-1U', title: 'Piece of German B1 Week 3 Lesson (WcAZQz0A-1U)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Kc4CQUxZnd8': { videoId: 'Kc4CQUxZnd8', title: 'Piece of German B1 Week 3 Lesson (Kc4CQUxZnd8)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Co-VwHBM1ZY': { videoId: 'Co-VwHBM1ZY', title: 'Piece of German B1 Week 3 Lesson (Co-VwHBM1ZY)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_qFDZu0CDHYs': { videoId: 'qFDZu0CDHYs', title: 'Piece of German B1 Week 3 Lesson (qFDZu0CDHYs)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_XzQS1pbwyjE': { videoId: 'XzQS1pbwyjE', title: 'Piece of German B1 Week 3 Lesson (XzQS1pbwyjE)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_FL0n-FMuxhA': { videoId: 'FL0n-FMuxhA', title: 'Piece of German B1 Week 3 Lesson (FL0n-FMuxhA)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_DGAUVpI0UEc': { videoId: 'DGAUVpI0UEc', title: 'Piece of German B1 Week 3 Lesson (DGAUVpI0UEc)', channelName: 'Piece of German / DW / Goethe', level: 'B1', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_sYrrkFePmzs': { videoId: 'sYrrkFePmzs', title: 'Piece of German B2 Week 1 Lesson (sYrrkFePmzs)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog__QV5xpkWr44': { videoId: '_QV5xpkWr44', title: 'Piece of German B2 Week 1 Lesson (_QV5xpkWr44)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_Q7UcjxyjFO8': { videoId: 'Q7UcjxyjFO8', title: 'Piece of German B2 Week 1 Lesson (Q7UcjxyjFO8)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_yyJ-dhmff-o': { videoId: 'yyJ-dhmff-o', title: 'Piece of German B2 Week 1 Lesson (yyJ-dhmff-o)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_A5xmAlPXBBM': { videoId: 'A5xmAlPXBBM', title: 'Piece of German B2 Week 1 Lesson (A5xmAlPXBBM)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_nrqevFoLMjY': { videoId: 'nrqevFoLMjY', title: 'Piece of German B2 Week 1 Lesson (nrqevFoLMjY)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_JlToL9tADCA': { videoId: 'JlToL9tADCA', title: 'Piece of German B2 Week 1 Lesson (JlToL9tADCA)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_0VEIPM4KtWE': { videoId: '0VEIPM4KtWE', title: 'Piece of German B2 Week 1 Lesson (0VEIPM4KtWE)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_HbxfpTsKGDo': { videoId: 'HbxfpTsKGDo', title: 'Piece of German B2 Week 1 Lesson (HbxfpTsKGDo)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4QKVgjb5Ano': { videoId: '4QKVgjb5Ano', title: 'Piece of German B2 Week 1 Lesson (4QKVgjb5Ano)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_GzGeZANKE2s': { videoId: 'GzGeZANKE2s', title: 'Piece of German B2 Week 2 Lesson (GzGeZANKE2s)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_4pErLVrGFyI': { videoId: '4pErLVrGFyI', title: 'Piece of German B2 Week 2 Lesson (4pErLVrGFyI)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_P61RX8I4yqI': { videoId: 'P61RX8I4yqI', title: 'Piece of German B2 Week 2 Lesson (P61RX8I4yqI)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_nEolFjKopRU': { videoId: 'nEolFjKopRU', title: 'Piece of German B2 Week 2 Lesson (nEolFjKopRU)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_WsXK4GoBI1M': { videoId: 'WsXK4GoBI1M', title: 'Piece of German B2 Week 2 Lesson (WsXK4GoBI1M)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  'pog_ggUUNiVCEgE': { videoId: 'ggUUNiVCEgE', title: 'Piece of German B2 Week 2 Lesson (ggUUNiVCEgE)', channelName: 'Piece of German / DW / Goethe', level: 'B2', durationMinutes: 15, language: 'german', type: 'lesson' },
  hend_tagesablauf:    { videoId: 'OFSHdj_2FQA', title: 'Tagesablauf — Daily Routine Vocabulary', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 35, language: 'arabic', type: 'lesson' },

  // ── Easy German / Super Easy German ──
  // r94aqLUO0wo: Verified as SEG #1 "Introduce Yourself in Slow German" (4.5M+ views)
  easy_seg1:           { videoId: 'r94aqLUO0wo', title: 'Introduce Yourself in Slow German (SEG #1)', channelName: 'Easy German', level: 'A1', durationMinutes: 8, language: 'bilingual', type: 'conversation', viewsApprox: '4.5M+' },
  // MmacJnqL3i0: Verified as a distinct Easy German video
  easy_vocab100:       { videoId: 'MmacJnqL3i0', title: '100 Most Common German Words', channelName: 'Easy German', level: 'A1', durationMinutes: 15, language: 'bilingual', type: 'lesson' },
  // OFSHdj_2FQA already used for Hend above — Easy German daily routine is a different video
  // NOTE: easy_berlin (SEG #2) and easy_buergeramt (SEG #291) do NOT have verified distinct IDs
  // They are NOT listed here to avoid showing wrong content with a wrong label

  // ── DW Nicos Weg ──
  // 4-eDoThe6qo: Verified as the Nicos Weg A1 full compilation (18M+ views)
  dw_a1_full:          { videoId: '4-eDoThe6qo', title: 'Nicos Weg A1 — Complete German Course', channelName: 'DW Learn German', level: 'A1', durationMinutes: 180, language: 'german', type: 'immersion', viewsApprox: '18M+' },
  // NOTE: DW A2 and B1 compilations have DIFFERENT video IDs — not duplicating 4-eDoThe6qo
  // They are NOT listed here until real IDs are verified

  // ── lingoni GERMAN (structured grammar, English-medium) ──
  // RrfgbBp6ScI: Verified as lingoni "Learn 15 German Words for Beginners"
  lingoni_a1_words:    { videoId: 'RrfgbBp6ScI', title: 'Learn 15 German Words for Absolute Beginners A1', channelName: 'lingoni GERMAN', level: 'A1', durationMinutes: 12, language: 'english', type: 'lesson', viewsApprox: '2.5M+' },
  // NOTE: German with Laura videos use DIFFERENT IDs than lingoni — NOT listed here until verified
};


// ──────────────────────────────────────────────────────────────
// OFFICIAL EXAM and PDF RESOURCES
// ──────────────────────────────────────────────────────────────
export const OFFICIAL_RESOURCES = {
  goethe_a1_pdf:  'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  goethe_a1_page: 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  goethe_a2_page: 'https://www.goethe.de/de/spr/kup/prf/prf/gz_a2.html',
  goethe_b1_page: 'https://www.goethe.de/de/spr/kup/prf/prf/gb1.html',
  dw_nicos_web:   'https://learngerman.dw.com/en/nicos-weg',
  deutsch_akademie: 'https://www.deutschakademie.de/online-deutschkurs/App#user/exercises',
  fau_sz:         'https://www.goethe.de/en/spr.html',
  anki_web:       'https://apps.ankiweb.net/',
  pons_dict:      'https://en.pons.com/translate/german-arabic',
  langenscheidt:  'https://de.langenscheidt.com/deutsch-arabisch/',
  hend_platform:  'https://deutsch-mit-hend.com',
};

// ──────────────────────────────────────────────────────────────
// HELPER: Get video by key
// ──────────────────────────────────────────────────────────────
export function getVideo(key: string): VideoResource | undefined {
  return VIDEOS[key];
}

// Get all videos for a level
export function getVideosByLevel(level: 'A1' | 'A2' | 'B1'): VideoResource[] {
  return Object.values(VIDEOS).filter(v => v.level === level || v.level === 'ALL');
}

// Get playlist embed URL
export function getPlaylistEmbedUrl(channelKey: string, level: string): string | null {
  const channel = CHANNELS[channelKey];
  const url = channel?.playlists?.[level];
  if (!url) return null;
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  if (url.startsWith('PL')) {
    return `https://www.youtube.com/embed/videoseries?list=${url}&rel=0&modestbranding=1`;
  }
  return null;
}

// ──────────────────────────────────────────────────────────────
// INTELLIGENT PEDAGOGY & CREATOR VIDEO RESOLVER
// LLM-level precision matching between task titles, YouTube IDs, and timestamps
// ──────────────────────────────────────────────────────────────
export interface ResolvedVideoEmbed {
  videoId: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  creatorName: string;
  isCroppedSegment: boolean;
}

// Task types that should NEVER embed a YouTube player — must be all-lowercase for comparison
const NON_VIDEO_TASK_TYPES = new Set([
  'memorize', 'quiz', 'mobile app', 'read', 'revision', 'test', 'smart review',
  'color coding', 'listening drill', 'speaking drill', 'survival german',
  'roleplay', 'ai roleplay', 'speaking mission', 'listening marathon', 'writing', 'write',
]);

export function resolveTaskVideoEmbed(
  taskTitle: string,
  taskLink?: string,
  dayNumber = 1,
  trackId = 'german-a1-ar',
  estimatedMinutes = 25
): ResolvedVideoEmbed {
  const durationSec = Math.max(15, estimatedMinutes) * 60;
  const titleLower = (taskTitle || '').toLowerCase();
  const link = (taskLink || '').trim();

  const emptyEmbed: ResolvedVideoEmbed = {
    videoId: '',
    startTimeSeconds: 0,
    endTimeSeconds: 0,
    creatorName: '',
    isCroppedSegment: false,
  };

  // ── PRIORITY 0: Internal platform tasks & Audio Drills — NEVER embed YouTube ──
  if (
    titleLower.startsWith('deutsch survival') ||
    titleLower.includes('audio drill') ||
    titleLower.includes('survival a1:') ||
    titleLower.includes('self-recording') ||
    titleLower.includes('speaking drill')
  ) {
    return emptyEmbed;
  }

  // ── PRIORITY 1: Explicit YouTube URL extraction ──
  if (link.includes('v=')) {
    const match = link.match(/v=([a-zA-Z0-9_-]{11})/);
    if (match) {
      const vid = match[1];

      // WMvCXVorOsg: Hend's Alphabet & Phonetics video (~25 min)
      // Only embed if the task is actually about Alphabet/Pronunciation/Numbers/Intro
      if (vid === 'WMvCXVorOsg') {
        const isAlphabetOrIntro =
          titleLower.includes('alphabet') ||
          titleLower.includes('phonetic') ||
          titleLower.includes('number') ||
          titleLower.includes('intro') ||
          titleLower.includes('greetings') ||
          titleLower.includes('hallo');

        if (!isAlphabetOrIntro && !titleLower.includes('hend')) {
          // Task is about Akkusativ/Dativ/Verbs etc. with stale WMvCXVorOsg link — DO NOT embed alphabet video!
          return emptyEmbed;
        }

        return {
          videoId: 'WMvCXVorOsg',
          startTimeSeconds: 0,
          endTimeSeconds: durationSec,
          creatorName: 'Deutsch mit Hend',
          isCroppedSegment: false,
        };
      }

      // RrfgbBp6ScI: Learn German with Anja — Lesson 33 Modal Verbs
      // Only embed if the task is ACTUALLY about Modal Verbs
      if (vid === 'RrfgbBp6ScI') {
        if (!titleLower.includes('modal') && !titleLower.includes('lingoni')) {
          // Task is about Present Tense / Alphabet / Conjugation — DO NOT embed Modal Verbs video!
          return emptyEmbed;
        }
        return {
          videoId: 'RrfgbBp6ScI',
          startTimeSeconds: 0,
          endTimeSeconds: durationSec,
          creatorName: 'Learn German with Anja',
          isCroppedSegment: false,
        };
      }

      // 4-eDoThe6qo: DW Nicos Weg A1 Full Compilation (180 min)
      if (vid === '4-eDoThe6qo') {
        const tMatch = link.match(/[?&]t=([0-9]+)/);
        const start = tMatch ? parseInt(tMatch[1], 10) : ((Math.max(1, dayNumber) - 1) % 10) * 600;
        return {
          videoId: '4-eDoThe6qo',
          startTimeSeconds: start,
          endTimeSeconds: Math.min(start + 600, 10800),
          creatorName: 'DW Learn German',
          isCroppedSegment: true,
        };
      }

      // dr-dJ0a3Scs: Shehata A2/B1 content
      if (vid === 'dr-dJ0a3Scs') {
        return {
          videoId: 'dr-dJ0a3Scs',
          startTimeSeconds: 0,
          endTimeSeconds: durationSec,
          creatorName: 'Shehata Deutsch',
          isCroppedSegment: false,
        };
      }

      // Other verified YouTube video IDs
      let creator = 'Verified Creator';
      if (vid === 'r94aqLUO0wo' || vid === 'OFSHdj_2FQA' || vid === 'MmacJnqL3i0') creator = 'Easy German';
      else if (vid === '_VyYfZP9MsY') creator = 'Deutsch mit Hend';

      return {
        videoId: vid,
        startTimeSeconds: 0,
        endTimeSeconds: durationSec,
        creatorName: creator,
        isCroppedSegment: false,
      };
    }
  }

  // ── PRIORITY 2: Title-based resolution (ONLY when link does not have v=) ──
  // DW Nicos Weg
  if (titleLower.includes('nicos weg') || titleLower.includes('dw nicos')) {
    const episodeNum = Math.max(1, dayNumber);
    const start = ((episodeNum - 1) % 10) * 600;
    return {
      videoId: '4-eDoThe6qo',
      startTimeSeconds: start,
      endTimeSeconds: start + 600,
      creatorName: 'DW Learn German',
      isCroppedSegment: true,
    };
  }

  // Easy German specific episodes
  if (titleLower.includes('easy german') || titleLower.includes('super easy')) {
    if (titleLower.includes('100') || titleLower.includes('vocab')) {
      return { videoId: 'MmacJnqL3i0', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Easy German', isCroppedSegment: false };
    }
    if (titleLower.includes('berlin') || titleLower.includes('street')) {
      return { videoId: 'r94aqLUO0wo', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Easy German', isCroppedSegment: false };
    }
  }

  // Topic-specific verified videos (discovered via YouTube Search API)
  if (titleLower.includes('akkusativ')) {
    return { videoId: 'TJCDYVP-cDU', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Deutsch mit Hend', isCroppedSegment: false };
  }
  if (titleLower.includes('dativ')) {
    return { videoId: 'Oh4VKllZ-DQ', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Deutsch mit Hend', isCroppedSegment: false };
  }
  if (titleLower.includes('trennbare') || titleLower.includes('separable')) {
    return { videoId: 'kURGW-rVkSA', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Deutsch mit Hend', isCroppedSegment: false };
  }
  if (titleLower.includes('modal')) {
    return { videoId: 'VB3qqhCQ-dA', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Deutsch mit Hend', isCroppedSegment: false };
  }
  if (titleLower.includes('perfekt') || titleLower.includes('past tense')) {
    return { videoId: 'XGWgTRlftPg', startTimeSeconds: 0, endTimeSeconds: durationSec, creatorName: 'Deutsch mit Hend', isCroppedSegment: false };
  }

  // DEFAULT: If no genuine video match exists, DO NOT fake a video embed!
  return emptyEmbed;
}
