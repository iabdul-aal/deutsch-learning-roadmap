import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = [
  ['—', ' - '],
  ['–', ' - '],
  ['•', ' | '],
  ['“', '"'],
  ['”', '"'],
  ['’', "'"],
  ['‘', "'"],
  ['⚡', ''],
  ['✓', '[Done]'],
  ['→', '->'],
  ['←', '<-'],
  ['▲', '^'],
  ['▼', 'v'],
  ['↺', '(Flip)'],
  ['🗣️', ''],
  ['💡', 'Note: '],
  ['⚠️', 'Alert: ']
];

const filesToClean = [
  'src/App.jsx',
  'src/components/Sidebar.jsx',
  'src/components/TodayDashboard.jsx',
  'src/components/CurriculumView.jsx',
  'src/components/GermanySurvivalView.jsx',
  'src/components/PronunciationView.jsx',
  'src/components/VocabularyView.jsx',
  'src/components/GrammarView.jsx',
  'src/components/SkillsTrackersView.jsx',
  'src/components/WeeklyAssessmentsView.jsx',
  'src/components/ResourceDatabaseView.jsx',
  'src/components/MobileAppsView.jsx',
  'standalone.html'
];

filesToClean.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    replacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Cleaned non-ASCII symbols in:', filePath);
  }
});
