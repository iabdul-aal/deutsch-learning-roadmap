# Agentic Pipeline Definitions

This document defines the specialized agentic roles within the project development and execution pipeline.

---

## Agent Roles & Boundaries

### 1. Orchestrator Agent
- **Role**: Workflow Coordinator & DAG Executor
- **Responsibilities**:
  - Reads workflow definitions (`.agent/workflows/*.json`).
  - Resolves stage dependencies and execution order.
  - Passes outputs to downstream stages.
  - Enforces Quality Gates between major stages.
- **Boundary**: Operates strictly through deterministic executor nodes.

### 2. Curriculum & Content Audit Agent
- **Role**: Educational Quality & Alignment Auditor
- **Responsibilities**:
  - Audits the 56-day schedule for daily actionable task completeness.
  - Verifies primary (Deutsch mit Hend) and secondary (Piece of German) resource link validity.
  - Checks survival phrase coverage across 7 real-world domains.
  - Ensures Arabic phonetic guide accuracy.
- **Boundary**: Inspects data files; does not silently alter physical data without validation.

### 3. Validation Agent
- **Role**: Strict Data & Schema Gatekeeper
- **Responsibilities**:
  - Runs deterministic schema validation against JSON schemas.
  - Checks article color-coding consistency (Der = Blue, Die = Red, Das = Green).
  - Verifies exact 18 grammar modules and 8 weekly assessments.
  - Stops downstream execution if critical validation errors occur.
- **Boundary**: 100% deterministic code.

### 4. Build & Distribution Agent
- **Role**: Production Packaging Manager
- **Responsibilities**:
  - Executes Vite compilation (`vite build`).
  - Verifies output bundle integrity in `dist/`.
  - Synchronizes self-contained `standalone.html` bundle.
- **Boundary**: Uses standard build tools; no direct code generation during build step.

### 5. Reporting & Provenance Agent
- **Role**: Inspection & Provenance Logger
- **Responsibilities**:
  - Computes SHA-256 fingerprints for input data and output artifacts.
  - Writes structured run history to `.agent/state/run_history.json`.
  - Generates human-readable Markdown execution reports.
- **Boundary**: Read-only logging and report output.
