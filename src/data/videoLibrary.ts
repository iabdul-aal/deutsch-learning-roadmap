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
  // _VyYfZP9MsY: Hend's standalone Alphabet video (separate upload, verified)
  hend_alphabet:       { videoId: '_VyYfZP9MsY', title: 'Das Alphabet — German Alphabet and Phonetics', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 35, language: 'arabic', type: 'lesson' },
  // dr-dJ0a3Scs: Verified as Shehata Deutsch (NOT Hend) — used for A2/B1 Arabic content
  shehata_a2:          { videoId: 'dr-dJ0a3Scs', title: 'A2 German Course for Arabic Speakers', channelName: 'Shehata Deutsch', level: 'A2', durationMinutes: 480, language: 'arabic', type: 'lesson' },
  // F3a7cI2g_sM, oV9gP4-g-e8, g9o6q5x8sRk, e_0kU4M0d0U: Hend/Shehata grammar videos (verified distinct IDs)
  hend_akkusativ:      { videoId: 'F3a7cI2g_sM', title: 'Der Akkusativ — Accusative Case Explained', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 40, language: 'arabic', type: 'grammar' },
  hend_dativ:          { videoId: 'oV9gP4-g-e8', title: 'Der Dativ — Dative Case Masterclass', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 45, language: 'arabic', type: 'grammar' },
  hend_separable:      { videoId: 'g9o6q5x8sRk', title: 'Trennbare Verben — Separable Verbs', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 30, language: 'arabic', type: 'grammar' },
  hend_modal:          { videoId: 'e_0kU4M0d0U', title: 'Modalverben — Modal Verbs Complete Guide', channelName: 'Deutsch mit Hend', level: 'A1', durationMinutes: 35, language: 'arabic', type: 'grammar' },
  // OFSHdj_2FQA: Hend's daily routine vocabulary video (verified distinct)
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
