import { SchemaValidator } from '../validators/SchemaValidator.js';

export class AuditCurriculumNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing AuditCurriculumNode...");
    const res = SchemaValidator.validateCurriculum();
    if (!res.valid) throw new Error(res.errors.join('; '));
    return { status: "SUCCESS", metric: res.metric };
  }
}

export class AuditVocabularyNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing AuditVocabularyNode...");
    const res = SchemaValidator.validateVocabulary();
    if (!res.valid) throw new Error(res.errors.join('; '));
    return { status: "SUCCESS", metric: res.metric };
  }
}

export class AuditSurvivalNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing AuditSurvivalNode...");
    const res = SchemaValidator.validateSurvival();
    if (!res.valid) throw new Error(res.errors.join('; '));
    return { status: "SUCCESS", metric: res.metric };
  }
}

export class AuditGrammarNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing AuditGrammarNode...");
    const res = SchemaValidator.validateGrammar();
    if (!res.valid) throw new Error(res.errors.join('; '));
    return { status: "SUCCESS", metric: res.metric };
  }
}
