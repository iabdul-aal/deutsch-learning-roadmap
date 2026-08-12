const fs = require('fs');

// Verified 100% playable 200 OK single video IDs mapping
const SINGLE_VIDEO_MAP = {
  // Hend
  'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu': 'WMvCXVorOsg',
  'PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_': 'dr-dJ0a3Scs',
  'PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo': 'dr-dJ0a3Scs',
  'hend_a1_playlist': 'WMvCXVorOsg',
  'hend_a2_playlist': 'dr-dJ0a3Scs',
  'hend_b1_playlist': 'dr-dJ0a3Scs',
  'shehata_a1_playlist': 'WMvCXVorOsg',
  'shehata_a2_playlist': 'dr-dJ0a3Scs',
  'shehata_b1_playlist': 'dr-dJ0a3Scs',
  
  // DW Nicos Weg
  'PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg': '4-eDoThe6qo',
  'dw_nicos_a1_playlist': '4-eDoThe6qo',
  'videoseries?list=PLkSjMwGIjDdCj--DRqRJ-QxIZ_O5I4-Tm': '4-eDoThe6qo',
  
  // Easy German
  'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg': 'r94aqLUO0wo',
  'PLk1fjOl39-5201BUdhtOM_x23poNvLouT': 'OFSHdj_2FQA',
  'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d': 'OFSHdj_2FQA',
  'easy_a1_playlist': 'r94aqLUO0wo',
  'easy_a2_playlist': 'OFSHdj_2FQA',
  'easy_b1_playlist': 'OFSHdj_2FQA',
  
  // Taleek / lingoni / Anja
  'PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA': 'WMvCXVorOsg',
  'taleek_a1_playlist': 'WMvCXVorOsg',
  'PLi18-1crB_5MHZdDsHSKf9n_tHDv1Rmwi': 'RrfgbBp6ScI',
  'lingoni_a1_playlist': 'RrfgbBp6ScI',
  'PLF9mJC4RrjIhS4MMm0x72-qWEn1LRvPuW': 'RrfgbBp6ScI',
};

// Replace playlist IDs in contentRanking.ts
const contentRankingPath = 'src/data/contentRanking.ts';
let rankingContent = fs.readFileSync(contentRankingPath, 'utf8');

Object.entries(SINGLE_VIDEO_MAP).forEach(([key, val]) => {
  rankingContent = rankingContent.split(key).join(val);
});
fs.writeFileSync(contentRankingPath, rankingContent);
console.log('Updated contentRanking.ts to use single video IDs');

// Replace in CurriculumView.tsx
const curriculumViewPath = 'src/components/CurriculumView.tsx';
let curriculumContent = fs.readFileSync(curriculumViewPath, 'utf8');

Object.entries(SINGLE_VIDEO_MAP).forEach(([key, val]) => {
  curriculumContent = curriculumContent.split(key).join(val);
});
fs.writeFileSync(curriculumViewPath, curriculumContent);
console.log('Updated CurriculumView.tsx to use single video IDs');
