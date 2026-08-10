# Agent vs. Deterministic Software Policy

This document defines the strict boundary policy governing agentic reasoning vs. deterministic software execution within the **Deutsch Survival A1 Platform**.

---

## 1. Core Principle

> **Agentic reasoning plans, inspects, audits, and orchestrates. Deterministic software calculates, validates, transforms, builds, and executes.**

No LLM or agentic reasoning engine may replace a deterministic computation, numerical calculation, data transformation, or validation check.

---

## 2. Permitted Agentic Responsibilities

Agents (such as Antigravity or dev-time automation agents) are explicitly permitted to perform:

1. **Repository Auditing & Gap Identification**: Analyzing curriculum content coverage, identifying missing survival phrases or weak grammar explanations.
2. **Workflow Planning & Decomposition**: Orchestrating multi-stage execution DAGs based on human intent.
3. **Diagnostic Analysis**: Interpreting validation gate failures and recommending corrective architectural or data fixes.
4. **Content Alignment & Quality Curation**: Evaluating secondary resource suitability (e.g. Deutsch mit Hend vs. Piece of German alignment).
5. **Documentation & Report Generation**: Summarizing run provenance, quality audit reports, and architecture specifications.

---

## 3. Mandatory Deterministic Responsibilities

The following operations MUST remain 100% deterministic software:

1. **Web Application Runtime**: React SPA execution, state updates, local storage sync, and browser rendering.
2. **Schema & Data Validation**: Checking curriculum day counts (56 days), week numbers (8 weeks), article color codes (der/die/das), grammar module counts (18 modules), and survival phrase category mappings.
3. **Build & Bundle Execution**: Running `vite build` into static `dist/` assets.
4. **Standalone Synchronization**: Generating self-contained `standalone.html` from underlying templates.
5. **Quiz & Assessment Scoring**: Grading user quiz answers and calculating percentages.
6. **Spaced Repetition Algorithm**: Computing review intervals and card status toggles.
7. **State Management & Hashing**: Computing SHA-256 fingerprints of data artifacts and tracking workflow state history.

---

## 4. Runtime LLM Policy

```text
LLM used ONLY as development-time orchestration, architectural reasoning, and content curation.
Runtime application remains 100% deterministic, standalone, and offline-capable without external API dependencies.
```

If a future feature requires a runtime LLM (e.g. AI conversational speaking partner), it MUST be implemented via an explicit optional adapter with fallback to deterministic roleplay scripts.
