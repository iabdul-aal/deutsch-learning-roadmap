const fs = require('fs');
const path = require('path');

const tracks = [
  { name: 'german-a1-ar', dwUrl: 'https://learngerman.dw.com/en/nicos-weg/c-36519789' },
  { name: 'german-a2-ar', dwUrl: 'https://learngerman.dw.com/en/nicos-weg/c-36519790' },
  { name: 'german-b1-ar', dwUrl: 'https://learngerman.dw.com/en/nicos-weg/c-36519791' },
];

tracks.forEach(({ name, dwUrl }) => {
  const filePath = path.join(__dirname, `../src/data/tracks/${name}/curriculum.ts`);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let updatedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"link":')) {
      let title = '';
      let type = '';
      for (let j = i - 1; j >= Math.max(0, i - 6); j--) {
        if (!title && lines[j].includes('"title":')) {
          title = lines[j];
        }
        if (!type && lines[j].includes('"type":')) {
          type = lines[j];
        }
      }

      const tLower = title.toLowerCase();
      const typeLower = type.toLowerCase();
      let targetLink = null;

      if (tLower.includes('yourgermanteacher')) {
        targetLink = 'https://www.youtube.com/@YourGermanTeacher/videos';
      } else if (tLower.includes('learn german with anja') || tLower.includes('anja:')) {
        if (tLower.includes('modal')) {
          targetLink = 'https://www.youtube.com/watch?v=VB3qqhCQ-dA';
        } else {
          targetLink = 'https://www.youtube.com/@LearnGermanwithAnja/videos';
        }
      } else if (tLower.includes('shehata')) {
        targetLink = 'https://www.youtube.com/@MohammadShehata-Official/videos';
      } else if (tLower.includes('deutsch mit hend') || tLower.includes('hend:')) {
        if (tLower.includes('akkusativ') || tLower.includes('accusative')) {
          targetLink = 'https://www.youtube.com/watch?v=TJCDYVP-cDU';
        } else if (tLower.includes('dativ') || tLower.includes('dative')) {
          targetLink = 'https://www.youtube.com/watch?v=Oh4VKllZ-DQ';
        } else if (tLower.includes('separable') || tLower.includes('trennbare')) {
          targetLink = 'https://www.youtube.com/watch?v=kURGW-rVkSA';
        } else if (tLower.includes('modal')) {
          targetLink = 'https://www.youtube.com/watch?v=VB3qqhCQ-dA';
        } else if (tLower.includes('perfekt') || tLower.includes('past tense')) {
          targetLink = 'https://www.youtube.com/watch?v=XGWgTRlftPg';
        } else if (tLower.includes('routine') || tLower.includes('tagesablauf')) {
          targetLink = 'https://www.youtube.com/watch?v=OFSHdj_2FQA';
        } else if (tLower.includes('alphabet') || tLower.includes('phonetic') || tLower.includes('number')) {
          targetLink = 'https://www.youtube.com/watch?v=WMvCXVorOsg';
        } else {
          targetLink = 'https://www.youtube.com/@FrauHendTaha/videos';
        }
      } else if (tLower.includes('easy german') || tLower.includes('super easy')) {
        if (tLower.includes('100') || tLower.includes('vocab')) {
          targetLink = 'https://www.youtube.com/watch?v=MmacJnqL3i0';
        } else if (tLower.includes('introduce') || tLower.includes('seg #1') || tLower.includes('slow german #1')) {
          targetLink = 'https://www.youtube.com/watch?v=r94aqLUO0wo';
        } else if (tLower.includes('street') || tLower.includes('berlin') || tLower.includes('seg #2')) {
          targetLink = 'https://www.youtube.com/watch?v=OFSHdj_2FQA';
        } else {
          targetLink = 'https://www.youtube.com/@EasyGerman/videos';
        }
      } else if (tLower.includes('nicos weg') || tLower.includes('dw nicos')) {
        if (typeLower.includes('watch')) {
          targetLink = 'https://www.youtube.com/watch?v=4-eDoThe6qo';
        } else {
          targetLink = dwUrl;
        }
      } else if (typeLower.includes('memorize') || typeLower.includes('mobile app')) {
        targetLink = 'https://apps.ankiweb.net/';
      } else if (typeLower.includes('quiz') || typeLower.includes('test')) {
        targetLink = 'https://www.schubert-verlag.de/aufgaben/index.htm';
      } else if (typeLower.includes('writing') || typeLower.includes('write')) {
        targetLink = 'https://www.deutschakademie.de/online-deutschkurs/App#user/exercises';
      } else if (typeLower.includes('survival german') || typeLower.includes('smart review')) {
        targetLink = 'https://en.pons.com/translate/german-arabic';
      }

      if (targetLink) {
        const oldLine = lines[i];
        lines[i] = lines[i].replace(/"link":\s*".*?"/, `"link": "${targetLink}"`);
        if (oldLine !== lines[i]) {
          updatedCount++;
        }
      }
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`Updated ${updatedCount} task links in ${name}/curriculum.ts`);
});
