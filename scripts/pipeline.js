import { WorkflowEngine } from '../src/pipeline/engine/WorkflowEngine.ts';
import { StateManager } from '../src/pipeline/engine/StateManager.ts';
import { QualityGates } from '../src/pipeline/validators/QualityGates.ts';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  switch (command) {
    case 'run': {
      const workflowName = args[1] || 'full_build_pipeline';
      const result = await WorkflowEngine.runWorkflow(workflowName);
      process.exit(result.status === 'SUCCESS' ? 0 : 1);
      break;
    }
    case 'validate': {
      console.log("=== RUNNING QUALITY GATES & DATA VALIDATION ===");
      const gate1 = QualityGates.evaluateGate1_DataIntegrity();
      const gate2 = QualityGates.evaluateGate2_BuildArtifacts();
      const gate3 = QualityGates.evaluateGate3_StandaloneSync();

      console.log(`\n1. ${gate1.gateName}: ${gate1.passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   Details:`, gate1.details);
      if (gate1.errors.length) console.log(`   Errors:`, gate1.errors);

      console.log(`\n2. ${gate2.gateName}: ${gate2.passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   Details:`, gate2.details);

      console.log(`\n3. ${gate3.gateName}: ${gate3.passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   Details:`, gate3.details);

      const allPassed = gate1.passed && gate2.passed && gate3.passed;
      process.exit(allPassed ? 0 : 1);
      break;
    }
    case 'status': {
      const history = StateManager.getHistory();
      console.log(`=== PIPELINE RUN HISTORY (Total: ${history.runs.length}) ===\n`);
      history.runs.slice(0, 10).forEach((run, i) => {
        console.log(`${i + 1}. [ID: ${run.runId}] Workflow: '${run.workflow}' | Status: ${run.status} | Time: ${run.startTime}`);
      });
      break;
    }
    case 'inspect': {
      const runId = args[1];
      if (!runId) {
        console.error("Usage: node scripts/pipeline.js inspect <run_id>");
        process.exit(1);
      }
      const runRecord = StateManager.getRunById(runId);
      if (!runRecord) {
        console.error(`Run ID '${runId}' not found in history.`);
        process.exit(1);
      }
      console.log(`=== RUN INSPECTION: ${runId} ===`);
      console.log(JSON.stringify(runRecord, null, 2));

      const artifactPath = path.resolve(process.cwd(), `artifacts/${runId}_artifacts.json`);
      if (fs.existsSync(artifactPath)) {
        console.log(`\n=== ARTIFACTS ===`);
        console.log(fs.readFileSync(artifactPath, 'utf-8'));
      }
      break;
    }
    case 'sync': {
      const result = await WorkflowEngine.runWorkflow('standalone_sync');
      process.exit(result.status === 'SUCCESS' ? 0 : 1);
      break;
    }
    default: {
      console.log(`
Deutsch Survival Pipeline CLI
Usage:
  node scripts/pipeline.js run [workflow_name]  (Execute workflow DAG)
  node scripts/pipeline.js validate             (Run all quality gates)
  node scripts/pipeline.js status               (List past workflow runs)
  node scripts/pipeline.js inspect <run_id>      (Inspect detailed run state & artifacts)
  node scripts/pipeline.js sync                  (Sync standalone HTML bundle)
`);
    }
  }
}

main().catch(err => {
  console.error("CLI Error:", err);
  process.exit(1);
});
