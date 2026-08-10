import test from 'node:test';
import assert from 'node:assert/strict';
import { SchemaValidator } from '../src/pipeline/validators/SchemaValidator.js';

test('Data Integrity: 56-Day Curriculum Schema', () => {
  const result = SchemaValidator.validateCurriculum();
  assert.equal(result.valid, true, `Curriculum errors: ${result.errors.join('; ')}`);
});

test('Data Integrity: High-Frequency Vocabulary Schema & Articles', () => {
  const result = SchemaValidator.validateVocabulary();
  assert.equal(result.valid, true, `Vocabulary errors: ${result.errors.join('; ')}`);
});

test('Data Integrity: 7 Survival Phrasebook Categories', () => {
  const result = SchemaValidator.validateSurvival();
  assert.equal(result.valid, true, `Survival errors: ${result.errors.join('; ')}`);
});

test('Data Integrity: 18 Core Grammar Modules', () => {
  const result = SchemaValidator.validateGrammar();
  assert.equal(result.valid, true, `Grammar errors: ${result.errors.join('; ')}`);
});
