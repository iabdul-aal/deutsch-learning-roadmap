import { QualityGates } from '../validators/QualityGates.js';

export class ValidateInputsNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing ValidateInputsNode...");
    const gate = QualityGates.evaluateGate1_DataIntegrity();
    if (!gate.passed) {
      throw new Error(`Data Integrity Validation Failed: ${gate.errors.join('; ')}`);
    }
    return {
      status: "SUCCESS",
      details: gate.details,
      gateName: gate.gateName
    };
  }
}
