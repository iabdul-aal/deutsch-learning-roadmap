import test from 'node:test';
import assert from 'node:assert/strict';
import { WorkflowEngine } from '../src/pipeline/engine/WorkflowEngine.js';
import { StateManager } from '../src/pipeline/engine/StateManager.js';

test('Workflow Engine: Run data_integrity_audit workflow', async () => {
  const result = await WorkflowEngine.runWorkflow('data_integrity_audit');
  assert.equal(result.status, 'SUCCESS');
  assert.ok(result.runId.startsWith('run_'));
  assert.ok(result.completedStages.includes('audit_curriculum'));
});

test('State Manager: Verify run persistence', () => {
  const history = StateManager.getHistory();
  assert.ok(Array.isArray(history.runs));
  assert.ok(history.runs.length > 0);
});
