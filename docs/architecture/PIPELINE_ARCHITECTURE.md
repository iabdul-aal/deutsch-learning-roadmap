# Pipeline Architecture & User Guide

This document describes the workflow DAG pipeline architecture, Quality Gates, CLI commands, and state tracking mechanisms implemented in this repository.

---

## 1. Directory Structure

```text
e:\German\
├── .agent/
│   ├── architecture/
│   │   └── system_architecture.md
│   ├── workflows/
│   │   ├── full_build_pipeline.json
│   │   ├── data_integrity_audit.json
│   │   └── standalone_sync.json
│   ├── agents/
│   │   └── agent_definitions.md
│   ├── skills/
│   │   └── project-agentic-development/
│   │       └── SKILL.md
│   ├── policies/
│   │   └── agent_policy.md
│   ├── schemas/
│   │   ├── curriculum_schema.json
│   │   ├── vocabulary_schema.json
│   │   ├── survival_schema.json
│   │   └── grammar_schema.json
│   └── state/
│       └── run_history.json
├── src/
│   ├── pipeline/
│   │   ├── engine/
│   │   │   ├── WorkflowEngine.js
│   │   │   ├── StateManager.js
│   │   │   └── ArtifactTracker.js
│   │   ├── nodes/
│   │   │   ├── ValidateInputsNode.js
│   │   │   ├── AuditNodes.js
│   │   │   └── BuildNodes.js
│   │   └── validators/
│   │       ├── SchemaValidator.js
│   │       └── QualityGates.js
├── scripts/
│   └── pipeline.js
├── tests/
│   ├── dataIntegrity.test.js
│   ├── qualityGates.test.js
│   └── pipeline.test.js
├── artifacts/
└── logs/
```

---

## 2. CLI Entry Points

You can control and inspect the pipeline using standard npm or node commands:

```bash
# Execute full workflow DAG
npm run pipeline

# Validate all quality gates
npm run validate

# Run unit & integration test suite
npm test

# View past run history
node scripts/pipeline.js status

# Inspect specific run artifacts
node scripts/pipeline.js inspect <run_id>
```

---

## 3. Quality Gates Summary

1. **Gate 1: Data Integrity Gate**: Ensures 56-day schedule, 8 weeks, 18 grammar modules, 7 survival phrasebook categories, and article color tags (`der`, `die`, `das`).
2. **Gate 2: Production Build Gate**: Ensures clean Vite production output in `dist/`.
3. **Gate 3: Standalone Sync Gate**: Ensures `standalone.html` bundle sync and `index.html` fallback redirect.
