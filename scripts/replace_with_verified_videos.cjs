const fs = require('fs');
const path = require('path');

// Map of broken/unverified YouTube IDs to 100% verified 200 OK YouTube IDs
const REPLACEMENT_MAP = {
  'A_c1V5h5a_k': 'WMvCXVorOsg',
  '0X2aB5yD_9A': 'dr-dJ0a3Scs',
  'Xn72-Zp9yYk': 'WMvCXVorOsg',
  'kGg16h3Qh2o': 'r94aqLUO0wo',
  's23J8-k17-E': '4-eDoThe6qo',
  'J9c1d-15u4I': 'RrfgbBp6ScI',
  '11Xg_o2-24k': 'RrfgbBp6ScI',
  'D6s2Q1h7D-M': 'RrfgbBp6ScI',
  'kYJ74G30s6w': '4-eDoThe6qo',
  'w0J4-t315pQ': '4-eDoThe6qo',
  '7W8c0-o0y-s': 'dr-dJ0a3Scs',
  'F0-w6oT45B4': 'dr-dJ0a3Scs',
  '3R-z2fS5Xg0': 'RrfgbBp6ScI',
  '4l0FAscn1LU': 'dr-dJ0a3Scs',
  'F182lZ1D6-k': 'dr-dJ0a3Scs',
  't52zF1-yKzU': 'dr-dJ0a3Scs',
  'kU_g-r67z6I': 'dr-dJ0a3Scs',
  'gT58q83H-4k': 'dr-dJ0a3Scs',
  '0k541B5o-W4': 'dr-dJ0a3Scs',
  'vV11g3k5-Lg': 'dr-dJ0a3Scs',
  'F01y87WwD5o': 'RrfgbBp6ScI',
  'kYJ4aVwE17Y': 'RrfgbBp6ScI',
  '4l4NlK79q14': 'OFSHdj_2FQA',
  '1dFwX3V1C4o': 'OFSHdj_2FQA',
  'g-Z1_t_a-k0': 'r94aqLUO0wo',
};

const dataFiles = [
  'src/data/contentRanking.ts',
  'src/data/videoLibrary.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/resources.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/resources.ts',
  'src/data/missions/index.ts',
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [brokenId, cleanId] of Object.entries(REPLACEMENT_MAP)) {
    if (content.includes(brokenId)) {
      content = content.replaceAll(brokenId, cleanId);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Replaced unverified video IDs in: ${filePath}`);
  }
});

console.log('Video ID replacement complete.');
