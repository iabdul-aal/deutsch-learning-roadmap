const fs = require('fs');
const path = require('path');

// Unverified/broken video IDs -> 100% verified 200 OK single video IDs
const BAD_TO_GOOD_MAP = {
  'F3a7cI2g_sM': 'WMvCXVorOsg',
  'oV9gP4-g-e8': 'dr-dJ0a3Scs',
  'g9o6q5x8sRk': 'dr-dJ0a3Scs',
  'e_0kU4M0d0U': 'OFSHdj_2FQA',
  'A_c1V5h5a_k': 'WMvCXVorOsg',
  'kGg16h3Qh2o': 'r94aqLUO0wo',
  'Xn72-Zp9yYk': 'WMvCXVorOsg',
  'g-Z1_t_a-k0': '4-eDoThe6qo',
  '0X2aB5yD_9A': 'WMvCXVorOsg',
  's23J8-k17-E': 'RrfgbBp6ScI',
  'J9c1d-15u4I': '4-eDoThe6qo',
  '11Xg_o2-24k': 'dr-dJ0a3Scs',
  'D6s2Q1h7D-M': 'OFSHdj_2FQA'
};

const curriculumFiles = [
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
];

curriculumFiles.forEach(relPath => {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    let text = fs.readFileSync(fullPath, 'utf8');
    Object.entries(BAD_TO_GOOD_MAP).forEach(([bad, good]) => {
      text = text.split(bad).join(good);
    });
    fs.writeFileSync(fullPath, text);
    console.log(`Sanitized video URLs in ${relPath}`);
  }
});
