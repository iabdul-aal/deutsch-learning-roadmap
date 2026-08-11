# MASTER DIRECTIVE — Arabic-First German Learning Platform
# Project AGENTS.md / Agentic Skill Guide
#
# This file governs ALL agentic work on this project.
# Every agent, subagent, or AI system working on this codebase MUST read this first.

---

## PRODUCT NORTH STAR

> Build the world's best Arabic-first German learning system that takes a native Arabic speaker from absolute zero to professional/academic German competence.

The measure of success is ONE thing:
**Can the learner actually use German in the real world?**

Not: pages built, lessons created, animations added, badges designed.

---

## TECH STACK

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + custom CSS design tokens in `src/index.css`
- **State**: React Context (`AppContext`) + localStorage persistence
- **Build**: `npm run build` (must pass clean)
- **Dev**: `npm run dev` (port 5173)
- **Location**: `e:\German\`

---

## ARCHITECTURE LAYERS

```
src/
├── types/           # Shared TypeScript interfaces (DO NOT import from UI here)
│   ├── learner.ts   # LearnerModel, SkillMastery, CEFR types
│   ├── content.ts   # Concept, Lesson, Exercise, Mission types
│   └── engine.ts    # SRS card, ranking, next-action types
├── engine/          # Pure logic — no React, no UI
│   ├── srs.ts       # SM-2 spaced repetition algorithm
│   ├── learnerModel.ts   # Mastery computation, CEFR estimation
│   ├── nextAction.ts     # "What should the learner do next?"
│   └── errorIntelligence.ts  # Arabic→German error pattern matching
├── data/            # Static educational content (typed, validated)
│   ├── tracks/      # Per-CEFR-level curriculum (A1, A2, B1, B2, C1)
│   ├── knowledgeGraph.ts   # Grammar concept dependency graph
│   ├── arabicErrors.ts     # AR→DE transfer error database
│   ├── vocabulary/         # Vocabulary banks (by level, semantic field)
│   ├── missions/           # Real-world simulation missions
│   ├── contentRanking.ts   # YouTube/PDF content ranking engine
│   └── videoLibrary.ts     # Verified video IDs
├── context/
│   └── AppContext.tsx  # Global state — learner model + UI state
├── components/      # React UI components
│   ├── Dashboard/   # Mission Control dashboard
│   ├── Grammar/     # Grammar concept explorer
│   ├── Vocabulary/  # SRS vocabulary system
│   ├── Listening/   # Listening skill training
│   ├── Speaking/    # Speaking practice
│   ├── Writing/     # Writing skill training
│   ├── Reading/     # Reading comprehension
│   ├── Assessment/  # Diagnostic + weekly tests
│   ├── Missions/    # Real-world mission system
│   └── shared/      # Reusable UI atoms
└── pipeline/        # Agentic pipeline definitions
```

---

## LEARNER MODEL (MUST IMPLEMENT)

Track independently per skill:

```typescript
interface SkillMastery {
  HOEREN: number;    // 0–100 mastery score
  SPRECHEN: number;
  LESEN: number;
  SCHREIBEN: number;
  GRAMMATIK: number;
  WORTSCHATZ: number;
  AUSSPRACHE: number;
  KULTURKOMPETENZ: number;
}

interface CEFREstimate {
  overall: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
  perSkill: Record<keyof SkillMastery, 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'>;
}
```

A learner may be Grammar B1 and Listening A2. The system MUST handle this.

---

## KNOWLEDGE GRAPH (MUST IMPLEMENT)

Every grammar concept has:
- `id`: unique string
- `label`: English name
- `labelDE`: German name  
- `labelAR`: Arabic name
- `cefr`: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'
- `prerequisites`: string[] (IDs of concepts that must be learned first)
- `arabicNotes`: string[] (common mistakes, transfer errors, contrasts)
- `exercises`: Exercise[]
- `mastery`: tracked in learner model

---

## ARABIC ERROR INTELLIGENCE (MUST IMPLEMENT)

Database of Arabic→German transfer errors:
```typescript
interface ArabicError {
  id: string;
  errorType: 'gender'|'case'|'word_order'|'verb_position'|'articles'|
             'pronunciation'|'plural'|'negation'|'prepositions'|'adjective_endings';
  arabicSource: string;      // Why Arabic speakers make this error
  germanRule: string;        // The actual German rule
  commonMistake: string;     // What learners say wrong
  correction: string;        // What they should say
  mnemonicAR?: string;       // Memory hook in Arabic
  targetCEFR: 'A1'|'A2'|'B1'|'B2';
  frequency: 'very_high'|'high'|'medium'|'low';
}
```

---

## SRS ENGINE (MUST IMPLEMENT)

SM-2 algorithm for vocabulary retention:
- Each word card has: ease factor, interval, repetitions, next review date
- Words move through: NEW → LEARNING → REVIEW → MATURE → SUSPENDED
- Review schedule computed from performance
- New words limited per day based on learner capacity

---

## CONTENT SCHEMA (MUST USE)

DO NOT hardcode educational content inside UI components.
Separate content from presentation:

```typescript
interface GrammarConcept {
  id: string;
  title: string;
  titleAR: string;
  cefr: CEFRLevel;
  skills: SkillType[];
  prerequisites: string[];
  intuition: string;          // Why does German do this?
  explanationAR: string;      // Arabic explanation
  explanationEN?: string;     // English notes (optional)
  examples: Example[];
  arabicErrors: ArabicError[];
  exercises: Exercise[];
  masteryTest: Question[];
  realWorldContexts: string[];
  videoIds?: string[];        // Linked YouTube videos from contentRanking
}
```

---

## UI DESIGN PRINCIPLES

### Color System
- Background: `#0d0d10` (sidebar) / `#faf9f5` (content)  
- Accent: amber-500 (#f59e0b) — the golden German thread
- Success: emerald-500
- Error: rose-500
- Info: indigo-500

### Typography
- Headings: Inter (900 weight)
- Body: Inter (400–600)
- Arabic: Cairo (600–900)
- Monospace: JetBrains Mono

### Component Conventions
- Cards: `paper-card` class (warm white, subtle shadow, rounded-2xl)
- Buttons: `btn-amber` (primary) / stone variants (secondary)
- Spacing: 4/8/12/16/24/32/48px rhythm
- Border radius: 8/12/16/24px

### Mobile-First
- All components start mobile and extend to desktop
- Sidebar: slide-over on mobile, permanent on md+
- No horizontal scroll anywhere

---

## NEXT-BEST-ACTION ALGORITHM

The dashboard MUST answer: "What should I study RIGHT NOW?"

Priority order:
1. **Due SRS vocabulary reviews** (highest priority — retention at risk)
2. **Weakest skill** (largest gap from target CEFR)
3. **Prerequisite unlocks** (completing X enables Y which the learner needs)
4. **Daily curriculum task** (if on track, follow the weekly plan)
5. **Overdue assessment** (weekly test not yet done)

---

## AGENTIC DEVELOPMENT RULES

1. **INSPECT before implementing** — read the existing file before editing
2. **BUILD → RUN → VERIFY** — always run `npm run build` after major changes
3. **NO placeholder content** — if text is needed, write real German content
4. **NO broken imports** — verify every import path exists
5. **CONTENT SEPARATION** — data in `src/data/`, logic in `src/engine/`, UI in `src/components/`
6. **TYPE SAFETY** — no `any` types, no `!` non-null assertions without guards
7. **ARABIC CORRECTNESS** — all Arabic text must be linguistically correct
8. **GERMAN CORRECTNESS** — all German content must be grammatically correct
9. **NEVER remove working features** without replacement
10. **MOBILE FIRST** — test every new view at 375px width mentally

---

## VERIFIED CONTENT DATABASE

All YouTube resources are in `src/data/contentRanking.ts`.
Key channels (all verified with real playlist/video IDs):
- **Deutsch mit Hend** (@FrauHendTaha) — PRIMARY Arabic channel
- **Shehata Deutsch** (@MohammadShehata-Official) — Certified Goethe examiner  
- **DW Nicos Weg** (@dwlearngerman) — 18M+ views, A1–B1
- **Easy German** (@EasyGerman) — SEG #1 4.5M views
- **Taleek** (@Taleek) — Arabic A1
- **lingoni GERMAN** (@lingoniGERMAN) — Structured grammar
- **Learn German with Anja** (@LearnGermanwithAnja) — Beginner friendly
- **German with Laura** (@GermanwithLaura) — Deep grammar

---

## QUALITY GATES

Before marking ANY feature complete:
- [ ] `npm run build` passes with zero errors
- [ ] No TypeScript `any` types introduced
- [ ] All German text is grammatically correct
- [ ] All Arabic text reads naturally
- [ ] Mobile layout does not break at 375px
- [ ] No hardcoded content in UI components
- [ ] Imports resolve to existing files

---

## FORBIDDEN PATTERNS

```typescript
// ❌ FORBIDDEN
const data: any = ...
import { X } from './nonExistentFile'
style={{ color: 'red' }}  // for theme colors — use CSS classes
{lesson.map(...)} // directly in JSX without null check

// ✅ REQUIRED
const data: LearnerModel = ...
import { X } from '../data/contentRanking'
className="text-rose-500"  // Tailwind class
{(lesson ?? []).map(...)}
```
