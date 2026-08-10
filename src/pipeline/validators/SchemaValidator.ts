import { CURRICULUM_DATA } from '../../data/tracks/german-a1-ar/curriculum.ts';
import { VOCABULARY_DATA } from '../../data/tracks/german-a1-ar/vocabulary.ts';
import { SURVIVAL_DATA } from '../../data/tracks/german-a1-ar/survival.ts';
import { GRAMMAR_DATA } from '../../data/tracks/german-a1-ar/grammar.ts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  metric: string;
}

export class SchemaValidator {
  static validateCurriculum(): ValidationResult {
    const errors: string[] = [];
    if (!CURRICULUM_DATA) errors.push("CURRICULUM_DATA missing");
    if (CURRICULUM_DATA.totalWeeks !== 8) errors.push(`Expected 8 totalWeeks, got ${CURRICULUM_DATA.totalWeeks}`);
    if (CURRICULUM_DATA.totalDays !== 56) errors.push(`Expected 56 totalDays, got ${CURRICULUM_DATA.totalDays}`);

    const weeks = CURRICULUM_DATA.weeks || [];
    if (weeks.length !== 8) errors.push(`Expected 8 week objects, found ${weeks.length}`);

    let totalDaysFound = 0;
    weeks.forEach((w) => {
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

  static validateVocabulary(): ValidationResult {
    const errors: string[] = [];
    const words = VOCABULARY_DATA.words || [];
    if (words.length < 50) errors.push(`Expected at least 50 core words, found ${words.length}`);

    const validArticles = ['der', 'die', 'das', ''];
    words.forEach((w, idx) => {
      if (!w.german || !w.arabic || !w.english) {
        errors.push(`Word #${idx} (${w.german || 'unknown'}) missing translation field`);
      }
      if (!validArticles.includes(w.article)) {
        errors.push(`Word #${idx} (${w.german}) invalid article: ${w.article}`);
      }
    });

    return { valid: errors.length === 0, errors, metric: `${words.length} Vocabulary Words Validated` };
  }

  static validateSurvival(): ValidationResult {
    const errors: string[] = [];
    const categories = SURVIVAL_DATA.categories || [];
    if (categories.length !== 7) errors.push(`Expected 7 survival categories, found ${categories.length}`);

    let totalPhrases = 0;
    categories.forEach((cat) => {
      const phrases = cat.phrases || [];
      totalPhrases += phrases.length;
      phrases.forEach((p) => {
        if (!p.id || !p.german || !p.arabic || !p.phonetic) {
          errors.push(`Survival phrase (${p.id || 'unknown'}) missing required fields`);
        }
      });
    });

    return { valid: errors.length === 0, errors, metric: `${totalPhrases} Survival Phrases across ${categories.length} Categories` };
  }

  static validateGrammar(): ValidationResult {
    const errors: string[] = [];
    const modules = GRAMMAR_DATA.modules || [];
    if (modules.length !== 18) errors.push(`Expected 18 grammar modules, found ${modules.length}`);

    modules.forEach((m) => {
      if (!m.id || !m.title || (!m.formula && !m.explanation)) {
        errors.push(`Grammar module (${m.id || 'unknown'}) missing essential rule fields`);
      }
    });

    return { valid: errors.length === 0, errors, metric: `${modules.length}/18 Grammar Modules Validated` };
  }
}
