const fs = require('fs');

const files = [
  'src/data/contentRanking.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/resources.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/resources.ts',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/https:\/\/www\.goethe\.de\/en\/spr\/kup\/prf\/prf\/ga2\/ueb\.html/g, 'https://www.goethe.de/en/spr/kup/prf/prf.html');
    c = c.replace(/https:\/\/www\.goethe\.de\/pro\/relaunch\/prf\/de\/Goethe-Zertifikat_A2_Modellsatz\.pdf/g, 'https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf');
    c = c.replace(/https:\/\/deutsch-mit-hend\.com\/[^\s"'`>)]+/g, 'https://www.youtube.com/playlist?list=PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu');
    fs.writeFileSync(f, c);
  }
});

console.log('URLs updated successfully');
