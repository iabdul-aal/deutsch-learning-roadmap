import test from 'node:test';
import assert from 'node:assert/strict';
import { QualityGates } from '../src/pipeline/validators/QualityGates.ts';

test('Quality Gate 1: Data Integrity Gate', () => {
  const gate = QualityGates.evaluateGate1_DataIntegrity();
  assert.equal(gate.passed, true, `Gate 1 failed: ${gate.errors.join('; ')}`);
});

test('Quality Gate 2: Build Artifacts Gate', () => {
  const gate = QualityGates.evaluateGate2_BuildArtifacts();
  assert.equal(gate.passed, true, `Gate 2 failed: ${gate.errors.join('; ')}`);
});

test('Quality Gate 3: Standalone Sync Gate', () => {
  const gate = QualityGates.evaluateGate3_StandaloneSync();
  assert.equal(gate.passed, true, `Gate 3 failed: ${gate.errors.join('; ')}`);
});
