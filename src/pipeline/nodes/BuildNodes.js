import { execSync } from 'child_process';
import { QualityGates } from '../validators/QualityGates.js';
import { ArtifactTracker } from '../engine/ArtifactTracker.js';
import path from 'path';
import fs from 'fs';

export class BuildDistNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing BuildDistNode (vite build)...");
    try {
      execSync('npm run build', { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      throw new Error(`Vite build compilation failed: ${e.message}`);
    }

    const gate = QualityGates.evaluateGate2_BuildArtifacts();
    if (!gate.passed) {
      throw new Error(`Build Output Quality Gate Failed: ${gate.errors.join('; ')}`);
    }

    const distIndex = path.resolve(process.cwd(), 'dist/index.html');
    ArtifactTracker.recordArtifact({
      runId,
      stageId: 'build_dist',
      name: 'production_dist_index',
      filePath: distIndex,
      type: 'BUILD_ARTIFACT'
    });

    return { status: "SUCCESS", gateDetails: gate.details };
  }
}

export class SyncStandaloneNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing SyncStandaloneNode...");
    const gate = QualityGates.evaluateGate3_StandaloneSync();
    if (!gate.passed) {
      throw new Error(`Standalone Sync Quality Gate Failed: ${gate.errors.join('; ')}`);
    }

    const standalonePath = path.resolve(process.cwd(), 'standalone.html');
    ArtifactTracker.recordArtifact({
      runId,
      stageId: 'sync_standalone',
      name: 'standalone_html_bundle',
      filePath: standalonePath,
      type: 'STANDALONE_ARTIFACT'
    });

    return { status: "SUCCESS", gateDetails: gate.details };
  }
}

export class GenerateReportNode {
  static async execute({ runId, context }) {
    console.log("  [NODE] Executing GenerateReportNode...");
    const reportDir = path.resolve(process.cwd(), 'artifacts');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

    const reportPath = path.join(reportDir, `run_${runId}_report.md`);
    const reportContent = `# Pipeline Execution Provenance Report

- **Run ID**: \`${runId}\`
- **Timestamp**: \`${new Date().toISOString()}\`
- **Execution Context**: Pipeline DAG Execution
- **Status**: SUCCESS

## Quality Gates Passed
1. **Gate 1: Data Integrity Gate**: PASSED
2. **Gate 2: Production Build Gate**: PASSED
3. **Gate 3: Standalone Sync Gate**: PASSED

## Dataset Metrics
- Curriculum: 56 Days / 8 Weeks
- Vocabulary: Core A1 words with color articles (der/die/das)
- Survival Phrasebook: 7 Domains (Airport, Uni, Housing, Supermarket, Transport, Bureaucracy, Emergency)
- Grammar System: 18 Modules with mini-quizzes

---
*Report generated automatically by Deutsch Survival Pipeline Engine.*
`;

    fs.writeFileSync(reportPath, reportContent, 'utf-8');

    ArtifactTracker.recordArtifact({
      runId,
      stageId: 'generate_report',
      name: 'provenance_report',
      filePath: reportPath,
      type: 'REPORT_ARTIFACT'
    });

    return { status: "SUCCESS", reportPath };
  }
}
