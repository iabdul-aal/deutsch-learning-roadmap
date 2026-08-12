const fs = require('fs');
const path = require('path');

const contentRankingPath = 'src/data/contentRanking.ts';
let content = fs.readFileSync(contentRankingPath, 'utf8');

// Restore official playlist IDs in CONTENT_DB
const PLAYLIST_REPLACEMENTS = [
  { id: 'hend_a1_playlist', resourceId: 'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu' },
  { id: 'hend_a2_playlist', resourceId: 'PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_' },
  { id: 'hend_b1_playlist', resourceId: 'PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo' },
  { id: 'taleek_a1_playlist', resourceId: 'PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA' },
  { id: 'easy_a1_playlist', resourceId: 'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg' },
  { id: 'easy_a2_playlist', resourceId: 'PLk1fjOl39-5201BUdhtOM_x23poNvLouT' },
  { id: 'easy_b1_playlist', resourceId: 'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d' },
  { id: 'dw_nicos_a1_playlist', resourceId: 'PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg' },
  { id: 'lingoni_a1_playlist', resourceId: 'PLi18-1crB_5MHZdDsHSKf9n_tHDv1Rmwi' },
  { id: 'shehata_a1_playlist', resourceId: 'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu' },
  { id: 'shehata_a2_playlist', resourceId: 'PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_' },
  { id: 'shehata_b1_playlist', resourceId: 'PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo' }
];

PLAYLIST_REPLACEMENTS.forEach(p => {
  const regex = new RegExp(`id:\\s*['"]${p.id}['"],\\s*type:\\s*['"]VIDEO['"],\\s*tier:\\s*['"][A-Z]+['"],\\s*resourceId:\\s*['"][^'"]+['"]`, 'g');
  content = content.replace(regex, `id: '${p.id}',\n    type: 'VIDEO', tier: 'PRIMARY',\n    resourceId: '${p.resourceId}'`);
});

fs.writeFileSync(contentRankingPath, content);
console.log('Restored all official YouTube playlist IDs in contentRanking.ts');
