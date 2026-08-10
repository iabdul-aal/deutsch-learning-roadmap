import fs from 'fs';
import path from 'path';
import { StateManager } from './StateManager.js';
import { ValidateInputsNode } from '../nodes/ValidateInputsNode.js';
import { AuditCurriculumNode, AuditVocabularyNode, AuditSurvivalNode, AuditGrammarNode } from '../nodes/AuditNodes.js';
import { BuildDistNode, SyncStandaloneNode, GenerateReportNode } from '../nodes/BuildNodes.js';

const NODE_REGISTRY = {
  ValidateInputsNode,
  AuditCurriculumNode,
  AuditVocabularyNode,
  AuditSurvivalNode,
  AuditGrammarNode,
  BuildDistNode,
  SyncStandaloneNode,
  GenerateReportNode
};

export class WorkflowEngine {
  static loadWorkflowDefinition(workflowName) {
    const filePath = path.resolve(process.cwd(), `.agent/workflows/${workflowName}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Workflow definition '${workflowName}' not found at ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static async runWorkflow(workflowName) {
    const workflow = this.loadWorkflowDefinition(workflowName);
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    console.log(`=======================================================`);
    console.log(`🚀 STARTING WORKFLOW: ${workflow.name} [ID: ${runId}]`);
    console.log(`=======================================================`);

    const runRecord = {
      runId,
      workflow: workflow.name,
      status: 'RUNNING',
      startTime: new Date().toISOString(),
      completedStages: [],
      failedStages: [],
      stageOutputs: {},
      errors: []
    };

    try {
      for (const stage of workflow.stages) {
        console.log(`\n▶ [STAGE: ${stage.id}] ${stage.name}`);

        // Check dependencies
        for (const dep of stage.dependencies) {
          if (!runRecord.completedStages.includes(dep)) {
            throw new Error(`Dependency '${dep}' not completed for stage '${stage.id}'`);
          }
        }

        const nodeClass = NODE_REGISTRY[stage.node];
        if (!nodeClass) {
          throw new Error(`Unregistered node class '${stage.node}' for stage '${stage.id}'`);
        }

        // Execute stage node with optional retry policy
        let stageResult = null;
        let retries = stage.retryPolicy?.maxRetries || 0;
        let attempt = 0;

        while (attempt <= retries) {
          try {
            attempt++;
            stageResult = await nodeClass.execute({ runId, context: runRecord });
            break;
          } catch (err) {
            if (attempt > retries) throw err;
            console.warn(`  ⚠️ Attempt ${attempt} failed for stage '${stage.id}', retrying...`);
            await new Promise(r => setTimeout(r, stage.retryPolicy?.backoffMs || 200));
          }
        }

        runRecord.completedStages.push(stage.id);
        runRecord.stageOutputs[stage.id] = stageResult;
        console.log(`  ✓ Stage '${stage.id}' completed successfully.`);
      }

      runRecord.status = 'SUCCESS';
      runRecord.endTime = new Date().toISOString();
      console.log(`\n=======================================================`);
      console.log(`🎉 WORKFLOW '${workflow.name}' COMPLETED SUCCESSFULLY!`);
      console.log(`=======================================================\n`);
    } catch (err) {
      runRecord.status = 'FAILED';
      runRecord.endTime = new Date().toISOString();
      runRecord.errors.push(err.message);
      console.error(`\n=======================================================`);
      console.error(`❌ WORKFLOW '${workflow.name}' FAILED: ${err.message}`);
      console.error(`=======================================================\n`);
    } finally {
      StateManager.saveRun(runRecord);
    }

    return runRecord;
  }
}
