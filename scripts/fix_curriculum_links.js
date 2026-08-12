/**
 * Deep LLM-Level Curriculum Link Audit & Fix
 * Fixes wrong YouTube links on non-video task types (Memorize, Quiz, Mobile App, Read)
 * and fixes "Learn German with Anja" mismatch (was pointing to Hend masterclass WMvCXVorOsg)
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load curriculum files as text and parse
const A1_PATH = path.join(__dirname, '..', 'src', 'data', 'tracks', 'german-a1-ar', 'curriculum.ts');
const A2_PATH = path.join(__dirname, '..', 'src', 'data', 'tracks', 'german-a2-ar', 'curriculum.ts');
const B1_PATH = path.join(__dirname, '..', 'src', 'data', 'tracks', 'german-b1-ar', 'curriculum.ts');

// Correct links by task type
const TYPE_CORRECT_LINKS = {
  'Memorize':      'https://apps.ankiweb.net/',
  'Mobile App':    'https://apps.ankiweb.net/',
  'Quiz':          'https://www.schubert-verlag.de/aufgaben/index.htm',
  'Read':          'https://learngerman.dw.com/en/nicos-weg',
  'Revision':      'https://learngerman.dw.com/en/nicos-weg',
  'Test':          'https://learngerman.dw.com/en/nicos-weg',
  'Smart Review':  'https://en.pons.com/translate/german-arabic',
  'Color Coding':  'https://learngerman.dw.com/en/nicos-weg',
  'Listening Drill':'https://en.pons.com/translate/german-arabic',
  'Speaking Drill':'https://en.pons.com/translate/german-arabic',
  'Survival German':'https://en.pons.com/translate/german-arabic',
  'Writing':       'https://www.deutschakademie.de/online-deutschkurs/App#user/exercises',
  'Speaking Mission':'https://en.pons.com/translate/german-arabic',
  'Listening Marathon':'https://www.youtube.com/watch?v=4-eDoThe6qo', // DW Nicos Weg — this IS a video
};

// For Anja Watch/Listen tasks — correct video
const ANJA_CORRECT_ID = 'RrfgbBp6ScI';

// Task types that should NEVER have a YouTube embed
const NON_VIDEO_TYPES = new Set([
  'Memorize', 'Quiz', 'Mobile App', 'Read', 'Revision', 'Test',
  'Smart Review', 'Color Coding', 'Listening Drill', 'Speaking Drill',
  'Survival German', 'Writing', 'Speaking Mission'
]);

function fixTasks(tasks, trackLabel) {
  let fixed = 0;
  for (const task of tasks) {
    const titleLower = (task.title || '').toLowerCase();
    const currentLink = task.link || '';

    // 1. Fix non-video tasks that have YouTube links
    if (NON_VIDEO_TYPES.has(task.type) && currentLink.includes('youtube.com')) {
      const correctLink = TYPE_CORRECT_LINKS[task.type] || 'https://en.pons.com/translate/german-arabic';
      console.log(`  [FIX] ${trackLabel} Day? | ${task.type}: "${task.title.slice(0,50)}"`)
      console.log(`        ${currentLink} → ${correctLink}`);
      task.link = correctLink;
      fixed++;
    }

    // 2. Fix "Learn German with Anja" Watch/Listen tasks pointing to WMvCXVorOsg
    if ((task.type === 'Watch' || task.type === 'Listen') &&
        titleLower.includes('anja') &&
        currentLink.includes('WMvCXVorOsg') &&
        !currentLink.includes('t=')) {
      const correctLink = `https://www.youtube.com/watch?v=${ANJA_CORRECT_ID}`;
      console.log(`  [FIX] ${trackLabel} | Anja Watch: "${task.title.slice(0,50)}"`)
      console.log(`        ${currentLink} → ${correctLink}`);
      task.link = correctLink;
      fixed++;
    }

    // 3. Fix Shadowing tasks pointing to generic r94aqLUO0wo (Easy German intro) when title says Nicos Weg
    if (task.type === 'Shadowing' && titleLower.includes('nicos') && currentLink.includes('r94aqLUO0wo')) {
      const correctLink = 'https://www.youtube.com/watch?v=4-eDoThe6qo';
      console.log(`  [FIX] ${trackLabel} | Shadowing Nicos: "${task.title.slice(0,50)}"`);
      console.log(`        ${currentLink} → ${correctLink}`);
      task.link = correctLink;
      fixed++;
    }
  }
  return fixed;
}

function fixCurriculum(data, trackLabel) {
  let totalFixed = 0;
  for (const week of (data.weeks || [])) {
    for (const day of (week.days || [])) {
      const allTasks = [...(day.standardTasks || []), ...(day.intensiveTasks || [])];
      totalFixed += fixTasks(allTasks, `${trackLabel} Day ${day.dayNumber}`);
    }
  }
  return totalFixed;
}

// ── Process each track ────────────────────────────────────────
console.log('=================================================');
console.log('LLM-LEVEL CURRICULUM LINK AUDIT & FIX');
console.log('=================================================\n');

// Dynamic imports for TS files via tsx
const { CURRICULUM_DATA: A1 } = await import('../src/data/tracks/german-a1-ar/curriculum.ts');
const { CURRICULUM_DATA_A2: A2 } = await import('../src/data/tracks/german-a2-ar/curriculum.ts');
const { CURRICULUM_DATA_B1: B1 } = await import('../src/data/tracks/german-b1-ar/curriculum.ts');

console.log('── A1 TRACK ──');
const fixedA1 = fixCurriculum(A1, 'A1');
fs.writeFileSync(A1_PATH, `export const CURRICULUM_DATA = ${JSON.stringify(A1, null, 2)};\n`, 'utf-8');
console.log(`\n✅ A1: Fixed ${fixedA1} task links\n`);

console.log('── A2 TRACK ──');
const fixedA2 = fixCurriculum(A2, 'A2');
fs.writeFileSync(A2_PATH, `export const CURRICULUM_DATA_A2 = ${JSON.stringify(A2, null, 2)};\n`, 'utf-8');
console.log(`\n✅ A2: Fixed ${fixedA2} task links\n`);

console.log('── B1 TRACK ──');
const fixedB1 = fixCurriculum(B1, 'B1');
fs.writeFileSync(B1_PATH, `export const CURRICULUM_DATA_B1 = ${JSON.stringify(B1, null, 2)};\n`, 'utf-8');
console.log(`\n✅ B1: Fixed ${fixedB1} task links\n`);

console.log('=================================================');
console.log(`TOTAL FIXED: ${fixedA1 + fixedA2 + fixedB1} task links corrected`);
console.log('=================================================');
