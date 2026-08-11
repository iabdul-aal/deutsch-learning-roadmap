import fs from 'fs';
import path from 'path';
import { StateManager } from './StateManager.ts';
import { ValidateInputsNode } from '../nodes/ValidateInputsNode.ts';
import { AuditCurriculumNode, AuditVocabularyNode, AuditSurvivalNode, AuditGrammarNode } from '../nodes/AuditNodes.ts';
import { BuildDistNode, SyncStandaloneNode, GenerateReportNode } from '../nodes/BuildNodes.ts';

const NODE_REGISTRY: Record<string, any> = {
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
  static loadWorkflowDefinition(workflowName: string) {
    const filePath = path.resolve(process.cwd(), `.agent/workflows/${workflowName}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Workflow definition '${workflowName}' not found at ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static async runWorkflow(workflowName: string) {
    const workflow = this.loadWorkflowDefinition(workflowName);
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    console.log("=======================================================");
    console.log(` STARTING WORKFLOW: ${workflow.id} [ID: ${runId}]`);
    console.log("=======================================================\n");

    const context: Record<string, any> = { workflowId: workflow.id, runId, startTime: new Date().toISOString() };
    const completedStages: string[] = [];

    for (const stage of workflow.stages) {
      console.log(`▶ [STAGE: ${stage.id}] ${stage.name}`);
      const NodeClass = NODE_REGISTRY[stage.node];
      if (!NodeClass) {
        throw new Error(`Node implementation '${stage.node}' not found in registry.`);
      }

      try {
        const result = await NodeClass.execute({ runId, context });
        context[stage.id] = result;
        completedStages.push(stage.id);
        console.log(`   Stage '${stage.id}' completed successfully.\n`);
      } catch (err: any) {
        console.error(`   Stage '${stage.id}' FAILED: ${err.message}\n`);
        StateManager.recordRun({
          runId,
          workflowId: workflow.id,
          status: "FAILED",
          failedStage: stage.id,
          error: err.message,
          timestamp: new Date().toISOString()
        });
        throw err;
      }
    }

    console.log("=======================================================");
    console.log(` WORKFLOW '${workflow.id}' COMPLETED SUCCESSFULLY!`);
    console.log("=======================================================\n");

    const summary = {
      runId,
      workflowId: workflow.id,
      status: "SUCCESS",
      completedStages,
      timestamp: new Date().toISOString(),
      context
    };

    StateManager.recordRun(summary);
    return summary;
  }
}
