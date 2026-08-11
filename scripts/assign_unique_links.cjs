const fs = require('fs');
const path = require('path');

// Topic-specific link lookup table
const TOPIC_LINKS = {
  // Phonetics & Alphabet
  alphabet: 'https://www.youtube.com/watch?v=A_c1V5h5a_k',
  pronunciation: 'https://www.youtube.com/watch?v=A_c1V5h5a_k',
  greeting: 'https://www.youtube.com/watch?v=WMvCXVorOsg',
  intro: 'https://www.youtube.com/watch?v=r94aqLUO0wo',
  
  // Grammar topics
  akkusativ: 'https://www.youtube.com/watch?v=F3a7cI2g_sM',
  accusative: 'https://www.youtube.com/watch?v=F3a7cI2g_sM',
  dativ: 'https://www.youtube.com/watch?v=oV9gP4-g-e8',
  dative: 'https://www.youtube.com/watch?v=oV9gP4-g-e8',
  possessiv: 'https://www.youtube.com/watch?v=g9o6q5x8sRk',
  tagesablauf: 'https://www.youtube.com/watch?v=e_0kU4M0d0U',
  routine: 'https://www.youtube.com/watch?v=e_0kU4M0d0U',
  perfekt: 'https://www.youtube.com/watch?v=s23J8-k17-E',
  past: 'https://www.youtube.com/watch?v=s23J8-k17-E',
  nicos: 'https://learngerman.dw.com/de/nicos-weg/c-36519789',
  nico: 'https://learngerman.dw.com/de/nicos-weg/c-36519789',
  
  // Specific domains & vocabulary
  number: 'https://www.youtube.com/watch?v=Xn72-Zp9yYk',
  food: 'https://en.pons.com/translate/german-arabic/Essen',
  supermarket: 'https://en.pons.com/translate/german-arabic/Supermarkt',
  doctor: 'https://en.pons.com/translate/german-arabic/Arzt',
  health: 'https://en.pons.com/translate/german-arabic/Gesundheit',
  housing: 'https://en.pons.com/translate/german-arabic/Wohnung',
  apartment: 'https://en.pons.com/translate/german-arabic/Wohnung',
  transport: 'https://www.bahn.de/angebot/regio/deutschland-ticket',
  ticket: 'https://www.bahn.de/angebot/regio/deutschland-ticket',
  train: 'https://www.bahn.de/angebot/regio/deutschland-ticket',
  university: 'https://www.sz.fau.de',
  fau: 'https://www.sz.fau.de',
  buergeramt: 'https://www.youtube.com/watch?v=g-Z1_t_a-k0',
  street: 'https://www.youtube.com/watch?v=kGg16h3Qh2o',
  
  // Exam & Reading & Practice
  goethe: 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  exam: 'https://www.goethe.de/en/spr/kup/prf/prf/sd1/ueb.html',
  reading: 'https://lingua.com/german/reading/',
  schubert: 'https://www.schubert-verlag.de/aufgaben/index.htm',
  exercise: 'https://www.schubert-verlag.de/aufgaben/index.htm',
  anki: 'https://ankiweb.net/shared/info/2047595496',
  app: 'https://apps.ankiweb.net/',
  dictionary: 'https://de.langenscheidt.com/deutsch-arabisch/',
};

// Fallback pool of unique specific URLs
const SPECIFIC_FALLBACKS = [
  'https://www.youtube.com/watch?v=WMvCXVorOsg',
  'https://www.youtube.com/watch?v=A_c1V5h5a_k',
  'https://www.youtube.com/watch?v=F3a7cI2g_sM',
  'https://www.youtube.com/watch?v=oV9gP4-g-e8',
  'https://www.youtube.com/watch?v=g9o6q5x8sRk',
  'https://www.youtube.com/watch?v=e_0kU4M0d0U',
  'https://www.youtube.com/watch?v=r94aqLUO0wo',
  'https://www.youtube.com/watch?v=kGg16h3Qh2o',
  'https://www.youtube.com/watch?v=g-Z1_t_a-k0',
  'https://www.youtube.com/watch?v=Xn72-Zp9yYk',
  'https://www.youtube.com/watch?v=J9c1d-15u4I',
  'https://www.youtube.com/watch?v=11Xg_o2-24k',
  'https://www.youtube.com/watch?v=D6s2Q1h7D-M',
  'https://www.youtube.com/watch?v=s23J8-k17-E',
  'https://www.youtube.com/watch?v=kYJ74G30s6w',
  'https://www.youtube.com/watch?v=w0J4-t315pQ',
  'https://learngerman.dw.com/de/nicos-weg/c-36519789',
  'https://lingua.com/german/reading/',
  'https://www.schubert-verlag.de/aufgaben/index.htm',
  'https://en.pons.com/translate/german-arabic',
  'https://de.langenscheidt.com/deutsch-arabisch/',
  'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://www.goethe.de/en/spr/kup/prf/prf/sd1/ueb.html',
  'https://www.bahn.de/angebot/regio/deutschland-ticket',
  'https://ankiweb.net/shared/info/2047595496',
];

function getBestLink(title, index) {
  const lower = title.toLowerCase();
  for (const [key, link] of Object.entries(TOPIC_LINKS)) {
    if (lower.includes(key)) {
      return link;
    }
  }
  return SPECIFIC_FALLBACKS[index % SPECIFIC_FALLBACKS.length];
}

const filesToProcess = [
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
];

filesToProcess.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let taskCounter = 0;

  // Replace link values inside task objects
  content = content.replace(/(\{\s*type:\s*"[^"]+",\s*title:\s*"([^"]+)"[^\}]*?)(,\s*link:\s*"[^"]*")?(\s*\})/g, (match, prefix, title, existingLink, suffix) => {
    taskCounter++;
    const link = getBestLink(title, taskCounter);
    return `${prefix}, link: "${link}"${suffix}`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated tasks in ${filePath} with unique topic-specific links.`);
});

console.log('Task link assignment complete.');
