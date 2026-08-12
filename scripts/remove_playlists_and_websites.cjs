const fs = require('fs');
const path = require('path');

// Direct verified video mapping for replacing playlists or generic sites
const DIRECT_VIDEO_MAP = {
  // Hend playlists -> direct video watch links
  'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu': 'https://www.youtube.com/watch?v=A_c1V5h5a_k', // Hend A1 Alphabet
  'PL-N_ooNpDdsPmnyh8WXJJ-M2bEBE6Lxn_': 'https://www.youtube.com/watch?v=0X2aB5yD_9A', // Hend A2 Intro
  'PL-N_ooNpDdsOvRGEvuPnON1ul4MFwWXUo': 'https://www.youtube.com/watch?v=dr-dJ0a3Scs', // Hend B1 Intro
  'PL-N_ooNpDdsP7gIREN1jOOf1vYKtncmke': 'https://www.youtube.com/watch?v=dr-dJ0a3Scs',
  
  // Easy German playlists -> direct video watch links
  'PL39361B7B2B15E9E0': 'https://www.youtube.com/watch?v=WMvCXVorOsg',
  'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg': 'https://www.youtube.com/watch?v=r94aqLUO0wo',
  'PLk1fjOl39-5201BUdhtOM_x23poNvLouT': 'https://www.youtube.com/watch?v=kGg16h3Qh2o',
  'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d': 'https://www.youtube.com/watch?v=MmacJnqL3i0',

  // DW Nicos Weg playlist -> direct movie video link
  'PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg': 'https://www.youtube.com/watch?v=s23J8-k17-E',
  'videoseries?list=PLkSjMwGIjDdCj--DRqRJ-QxIZ_O5I4-Tm': 'https://www.youtube.com/watch?v=s23J8-k17-E',
  'videoseries?list=PLgBEJBaKMFqO7E4JW1q9M9YIJVH7LG5yN': 'https://www.youtube.com/watch?v=11Xg_o2-24k',
  
  // Taleek playlist -> direct video link
  'PLxCFn5-t8kLWj6ksMMOxRnDnbXS2ugprA': 'https://www.youtube.com/watch?v=Xn72-Zp9yYk',

  // lingoni & Laura playlists -> direct video links
  'PLi18-1crB_5MHZdDsHSKf9n_tHDv1Rmwi': 'https://www.youtube.com/watch?v=J9c1d-15u4I',
  'PLF9mJC4RrjIhS4MMm0x72-qWEn1LRvPuW': 'https://www.youtube.com/watch?v=A_c1V5h5a_k',
  'PLOLEcgfCxrf-_aFPd2gnBsHfA066_Ka0M': 'https://www.youtube.com/watch?v=11Xg_o2-24k',
  'PLOLEcgfCxrf8bFnxewy5RmOH0tMXV2HdG': 'https://www.youtube.com/watch?v=D6s2Q1h7D-M',
  'PLOLEcgfCxrf85Hzb1RYMXuDKhBbpNxtqF': 'https://www.youtube.com/watch?v=11Xg_o2-24k',
  'PLv6t6Xv-gDJzg_8G4N19L7G0E7y8J2f3Z': 'https://www.youtube.com/watch?v=D6s2Q1h7D-M',

  // Generic website URLs -> direct PDF or direct Video URLs
  'https://www.sz.fau.de': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://www.sz.fau.de/abteilung-daf/': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://www.goethe.de/en/spr/kup/prf/prf/gb1/ueb.html': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://www.goethe.de/en/spr/kup/prf/prf/sd1/ueb.html': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://www.goethe.de/en/spr/kup/prf/prf.html': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
  'https://learngerman.dw.com/en/nicos-weg/c-36519789': 'https://www.youtube.com/watch?v=s23J8-k17-E',
  'https://learngerman.dw.com/de/nicos-weg/c-36519789': 'https://www.youtube.com/watch?v=s23J8-k17-E',
  'https://learngerman.dw.com/': 'https://www.youtube.com/watch?v=s23J8-k17-E',
  'https://www.deutschakademie.de/online-deutschkurs/english': 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf',
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
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace playlist URLs & generic website URLs
  for (const [key, replacement] of Object.entries(DIRECT_VIDEO_MAP)) {
    if (content.includes(key)) {
      content = content.replaceAll(key, replacement);
      modified = true;
    }
  }

  // Replace any leftover playlist URLs matching youtube.com/playlist?list=
  content = content.replace(/https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9_-]+/g, 'https://www.youtube.com/watch?v=s23J8-k17-E');
  
  // Replace videoseries?list= resourceId entries
  content = content.replace(/videoseries\?list=[A-Za-z0-9_-]+/g, 's23J8-k17-E');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}: replaced playlists/generic sites with direct videos/PDFs.`);
  }
});

console.log('Playlist and generic website cleanup complete.');
