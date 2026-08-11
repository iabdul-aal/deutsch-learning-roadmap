import { SchemaValidator } from './SchemaValidator.ts';
import fs from 'fs';
import path from 'path';

export interface GateResult {
  gateName: string;
  passed: boolean;
  details: Record<string, string>;
  errors: string[];
}

export class QualityGates {
  static evaluateGate1_DataIntegrity(): GateResult {
    const curr = SchemaValidator.validateCurriculum();
    const vocab = SchemaValidator.validateVocabulary();
    const surv = SchemaValidator.validateSurvival();
    const gram = SchemaValidator.validateGrammar();

    const allValid = curr.valid && vocab.valid && surv.valid && gram.valid;
    const errors = [...curr.errors, ...vocab.errors, ...surv.errors, ...gram.errors];

    return {
      gateName: "Gate 1: Data and Curriculum Integrity Gate",
      passed: allValid,
      details: {
        curriculum: curr.metric,
        vocabulary: vocab.metric,
        survival: surv.metric,
        grammar: gram.metric
      },
      errors
    };
  }

  static evaluateGate2_BuildArtifacts(): GateResult {
    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    const assetsPath = path.join(distPath, 'assets');

    const distExists = fs.existsSync(distPath);
    const indexExists = fs.existsSync(indexPath);
    const assetsExist = fs.existsSync(assetsPath);

    const passed = distExists && indexExists && assetsExist;
    const errors: string[] = [];
    if (!distExists) errors.push("dist/ folder does not exist");
    if (!indexExists) errors.push("dist/index.html missing");
    if (!assetsExist) errors.push("dist/assets folder missing");

    return {
      gateName: "Gate 2: Vite Build Output Gate",
      passed,
      details: {
        distFolder: distExists ? "Present" : "Missing",
        indexHtml: indexExists ? "Present" : "Missing",
        assets: assetsExist ? "Present" : "Missing"
      },
      errors
    };
  }

  static evaluateGate3_StandaloneSync(): GateResult {
    const standalonePath = path.resolve(process.cwd(), 'standalone.html');
    const indexPath = path.resolve(process.cwd(), 'index.html');

    const standaloneExists = fs.existsSync(standalonePath);
    const indexExists = fs.existsSync(indexPath);

    const indexContent = indexExists ? fs.readFileSync(indexPath, 'utf-8') : '';
    const hasRedirect = indexContent.includes("standalone.html");

    const passed = standaloneExists && indexExists && hasRedirect;
    const errors: string[] = [];
    if (!standaloneExists) errors.push("standalone.html missing");
    if (!hasRedirect) errors.push("index.html missing file:// fallback redirect to standalone.html");

    return {
      gateName: "Gate 3: Standalone Sync Gate",
      passed,
      details: {
        standaloneHtml: standaloneExists ? "Present" : "Missing",
        fallbackRedirect: hasRedirect ? "Active" : "Missing"
      },
      errors
    };
  }
}
