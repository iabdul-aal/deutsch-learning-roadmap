---
name: project-agentic-development
description: Project-specific agentic engineering and workflow orchestration skill for the Deutsch Survival A1 Platform. Governs repository discovery, pipeline execution, quality gate validation, deterministic runtime preservation, and artifact tracking.
---

# Deutsch Survival Project-Agentic Development Skill

This skill governs how AI coding assistants (including Antigravity, Gemini, Claude, and subagents) MUST operate within this repository (`e:\German`).

---

## 1. MANDATORY AGENTIC RULES (SELF-ENFORCING)

When operating inside this repository, EVERY agent MUST strictly obey the following self-enforcing principles:

> 🚨 **IRON RULE 1: UNDERSTAND BEFORE CODING**  
> Do NOT start modifying files or writing code before reading `.agent/architecture/system_architecture.md` and understanding the active workflow definitions in `.agent/workflows/`.

> 🚨 **IRON RULE 2: NEVER BYPASS VALIDATION GATES**  
> Never skip quality gates or comment out failing assertions. Always execute `npm run validate` or `node scripts/pipeline.js validate` after making data or code modifications.

> 🚨 **IRON RULE 3: PRESERVE 100% DETERMINISTIC RUNTIME**  
> Do NOT introduce runtime LLM dependencies (OpenAI API, Gemini API, LangChain, etc.) into the user application bundle. Development-time reasoning belongs to AI assistants; the runtime application MUST remain 100% deterministic, offline-capable, and fast.

> 🚨 **IRON RULE 4: NEVER REPLACE DETERMINISTIC LOGIC WITH LLM REASONING**  
> Quiz scoring, article color coding, SRS flashcard calculations, day tracking, and build steps MUST remain deterministic software.

> 🚨 **IRON RULE 5: IDEMPOTENCY & ARTIFACT PROVENANCE**  
> Every pipeline execution must generate inspectable artifacts in `artifacts/` with SHA-256 state tracking in `.agent/state/run_history.json`.

> 🚨 **IRON RULE 6: NO SILENT SCIENTIFIC / DOMAIN ALTERATIONS**  
> Do not alter physical German grammar rules, Goethe A1 standards, or legal Germany survival facts (e.g. 112 emergency calls, Bürgeramt registration rules) without explicit verification.

> 🚨 **IRON RULE 7: VERIFY SUCCESS BEFORE DECLARING COMPLETE**  
> Never declare success without executing `npm test` and `npm run pipeline` and verifying clean pass results.

---

## 2. REPOSITORY DISCOVERY PROCEDURE

When initiating a task in this project, follow this 4-step discovery procedure:

1. **Step 1 — Check Architecture**: Read `.agent/architecture/system_architecture.md` and `.agent/policies/agent_policy.md`.
2. **Step 2 — Identify Active Workflow**: Read available workflow DAGs in `.agent/workflows/*.json`.
3. **Step 3 — Inspect State History**: Run `node scripts/pipeline.js status` or inspect `.agent/state/run_history.json`.
4. **Step 4 — Execute Validation**: Run `npm run validate` to confirm current pipeline status before making changes.

---

## 3. AVAILABLE PIPELINE COMMANDS

Future agents should run operations using the project CLI:

```bash
# Execute full build and validation pipeline DAG
npm run pipeline

# Run all quality gates (Data Integrity, Build Output, Standalone Sync)
npm run validate

# Run automated test suite
npm test

# Inspect status of past workflow runs
node scripts/pipeline.js status

# Inspect specific run artifacts & state
node scripts/pipeline.js inspect <run_id>

# Re-sync standalone single-file HTML bundle
node scripts/pipeline.js sync
```

---

## 4. WORKFLOW STAGE & QUALITY GATE MAPPING

Every modification must satisfy the 3 Quality Gates:

```text
Input Datasets (Curriculum, Vocab, Survival, Grammar)
        ↓
Gate 1: Data Integrity Gate (56 Days, 8 Weeks, 18 Grammar, 7 Survival, Colors)
        ↓
Gate 2: Production Build Gate (vite build -> dist/)
        ↓
Gate 3: Standalone Sync Gate (standalone.html & file:// fallback redirect)
        ↓
Artifact Tracking & Provenance Log (.agent/state/run_history.json)
```

---

## 5. REFACTORING & EXTENSION CHECKLIST

Before marking any refactoring or feature task complete, execute this checklist:

- [ ] Data integrity tests pass (`npm test`).
- [ ] Quality gates pass (`npm run validate`).
- [ ] Pipeline DAG executes cleanly (`npm run pipeline`).
- [ ] Output artifacts in `dist/` and `standalone.html` are synced and intact.
- [ ] Provenance log in `.agent/state/run_history.json` updated with new run record.
- [ ] Architecture documentation updated if schemas or workflows changed.
