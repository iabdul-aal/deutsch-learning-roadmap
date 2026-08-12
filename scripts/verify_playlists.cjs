const https = require('https');

const playlists = [
  { name: 'Deutsch mit Hend A1', listId: 'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu' },
  { name: 'Deutsch mit Hend A2', listId: 'PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_' },
  { name: 'Deutsch mit Hend B1', listId: 'PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo' },
  { name: 'DW Nicos Weg A1-B1',  listId: 'PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg' },
  { name: 'Easy German A1',      listId: 'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg' },
  { name: 'Easy German A2',      listId: 'PLk1fjOl39-5201BUdhtOM_x23poNvLouT' },
  { name: 'Easy German B1',      listId: 'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d' },
  { name: 'Taleek German A1',    listId: 'PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA' },
  { name: 'lingoni GERMAN A1',  listId: 'PLi18-1crB_5MHZdDsHSKf9n_tHDv1Rmwi' },
  { name: 'Learn German Anja',   listId: 'PLF9mJC4RrjIhS4MMm0x72-qWEn1LRvPuW' },
];

async function run() {
  console.log('Verifying official YouTube course playlists...');
  for (const item of playlists) {
    await new Promise(resolve => {
      const url = `https://www.youtube.com/playlist?list=${item.listId}`;
      https.get(url, res => {
        console.log(`[HTTP ${res.statusCode}] ${item.name} -> ${url}`);
        resolve();
      }).on('error', err => {
        console.error(`[ERROR] ${item.name}: ${err.message}`);
        resolve();
      });
    });
  }
}

run();
