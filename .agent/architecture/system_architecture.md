# Deutsch Survival System Architecture Specification

## 1. Overview & System Purpose

The **Deutsch Survival Platform** is a scalable, modular language acquisition and survival platform engineered for Arabic speakers moving to Germany in 8 weeks (56 days).

It acts as an **interactive, curated learning roadmap engine** (similar to roadmap.sh), orchestrating existing best-of-breed resources (**Deutsch mit Hend** as Primary, **Piece of German** as Secondary, **DW Nicos Weg**, **Super Easy German**, **Learn German with Anja**, **YourGermanTeacher**, **Anki**, **Seedlang**, **DB Navigator**, **Dict.cc**, **NINA**, **Tandem**).

---

## 2. Agentic Workflow DAG Architecture

The repository is governed by an explicit DAG (Directed Acyclic Graph) workflow engine implemented natively in JavaScript / Node.js.

```text
                                  INPUTS
                                    ↓
                         ┌─────────────────────┐
                         │ ValidateInputsNode  │
                         └──────────┬──────────┘
                                    ↓
                 ┌──────────────────┼──────────────────┐
                 ↓                  ↓                  ↓
       ┌──────────────────┐ ┌───────────────┐ ┌────────────────┐
       │ AuditCurriculum  │ │ AuditVocab    │ │ AuditSurvival  │
       └─────────┬────────┘ └───────┬───────┘ └───────┬────────┘
                 │                  │                 │
                 └──────────────────┼─────────────────┘
                                    ↓
                         ┌─────────────────────┐
                         │  AuditGrammarNode   │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │   BuildDistNode     │  ───> Gate 2: vite build
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ SyncStandaloneNode  │  ───> Gate 3: standalone.html
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ GenerateReportNode  │  ───> Artifacts & State Log
                         └─────────────────────┘
```

---

## 3. Separation of Responsibilities

| Layer | Type | Execution | Purpose |
| :--- | :--- | :--- | :--- |
| **Orchestrator** | Node.js Engine | Deterministic | DAG execution, topological ordering, retries |
| **Validators** | Deterministic JS | Deterministic | Schema integrity, quality gate verification |
| **UI Application** | React SPA | Deterministic | Interactive web UI, audio TTS, flashcard flip, local state |
| **Standalone Target**| HTML5 / Babel | Deterministic | Single-file zero-dependency double-clickable target |
| **Content Curation**| Agentic / Dev-time| Agentic | Gap analysis, resource selection, curriculum alignment |

---

## 4. State & Artifact Lifecycle

Every pipeline execution records structured JSON state in `.agent/state/run_history.json`:
- `runId`: Unique SHA-based execution identifier.
- `status`: SUCCESS | FAILED.
- `completedStages`: List of verified DAG nodes.
- `stageOutputs`: Metric outputs per stage.
- `artifacts`: List of generated reports and bundles tracked in `artifacts/`.
