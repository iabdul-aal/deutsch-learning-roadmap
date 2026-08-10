import { CURRICULUM_DATA } from '../../data/tracks/german-a1-ar/curriculum.js';
import { VOCABULARY_DATA } from '../../data/tracks/german-a1-ar/vocabulary.js';
import { SURVIVAL_DATA } from '../../data/tracks/german-a1-ar/survival.js';
import { GRAMMAR_DATA } from '../../data/tracks/german-a1-ar/grammar.js';

export class SchemaValidator {
  static validateCurriculum() {
    const errors = [];
    if (!CURRICULUM_DATA) errors.push("CURRICULUM_DATA missing");
    if (CURRICULUM_DATA.totalWeeks !== 8) errors.push(`Expected 8 totalWeeks, got ${CURRICULUM_DATA.totalWeeks}`);
    if (CURRICULUM_DATA.totalDays !== 56) errors.push(`Expected 56 totalDays, got ${CURRICULUM_DATA.totalDays}`);

    const weeks = CURRICULUM_DATA.weeks || [];
    if (weeks.length !== 8) errors.push(`Expected 8 week objects, found ${weeks.length}`);

    let totalDaysFound = 0;
    weeks.forEach((w, wIdx) => {
      const days = w.days || [];
      if (days.length !== 7) errors.push(`Week ${w.weekNumber} expects 7 days, found ${days.length}`);
      days.forEach((d) => {
        totalDaysFound++;
        if (!d.standardTasks || d.standardTasks.length === 0) {
          errors.push(`Day ${d.dayNumber} missing standardTasks`);
        }
      });
    });

    return { valid: errors.length === 0, errors, metric: `${totalDaysFound}/56 Days Validated` };
  }

  static validateVocabulary() {
    const errors = [];
    const words = VOCABULARY_DATA.words || [];
    if (words.length < 50) errors.push(`Expected at least 50 core words, found ${words.length}`);

    const validArticles = ['der', 'die', 'das', ''];
    words.forEach((w, idx) => {
      if (!w.german || !w.arabic || !w.english) {
        errors.push(`Word #${idx} (${w.german || 'unknown'}) missing translation field`);
      }
      if (w.article !== undefined && !validArticles.includes(w.article)) {
        errors.push(`Word #${idx} (${w.german}) invalid article '${w.article}'`);
      }
    });

    return { valid: errors.length === 0, errors, metric: `${words.length} Vocabulary Words Validated` };
  }

  static validateSurvival() {
    const errors = [];
    const categories = SURVIVAL_DATA.categories || [];
    if (categories.length < 7) errors.push(`Expected 7 survival categories, found ${categories.length}`);

    let totalPhrases = 0;
    categories.forEach((cat) => {
      const phrases = cat.phrases || [];
      totalPhrases += phrases.length;
      phrases.forEach((p) => {
        if (!p.german || !p.arabic || !p.phonetic || !p.roleplay) {
          errors.push(`Phrase '${p.german || p.id}' missing required phrasebook field`);
        }
      });
    });

    return { valid: errors.length === 0, errors, metric: `${totalPhrases} Survival Phrases across ${categories.length} Categories` };
  }

  static validateGrammar() {
    const errors = [];
    const modules = GRAMMAR_DATA.modules || [];
    if (modules.length !== 18) errors.push(`Expected exactly 18 grammar modules, found ${modules.length}`);

    modules.forEach((g) => {
      if (!g.title || !g.explanation || !g.examples) {
        errors.push(`Grammar module '${g.id}' missing required explanation/examples`);
      }
    });

    return { valid: errors.length === 0, errors, metric: `${modules.length}/18 Grammar Modules Validated` };
  }
}
