/**
 * ══════════════════════════════════════════════════════════
 * SM-2 SPACED REPETITION ENGINE
 * Pure TypeScript - no React imports, no side effects.
 * Based on the SuperMemo SM-2 algorithm.
 * ══════════════════════════════════════════════════════════
 */

import type { SRSCard, SRSCardState } from '../types/learner';

/** Quality rating 0-5 after reviewing a card:
 *  5 = perfect recall
 *  4 = correct after hesitation
 *  3 = correct with difficulty
 *  2 = incorrect but felt close
 *  1 = incorrect, wrong answer
 *  0 = complete blackout
 */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

/** Create a brand-new SRS card for a vocabulary word */
export function createCard(wordId: string): SRSCard {
  return {
    wordId,
    state: 'NEW',
    easeFactor: INITIAL_EASE,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    lapses: 0,
  };
}

/** Apply SM-2 algorithm to update a card after review */
export function reviewCard(card: SRSCard, quality: ReviewQuality): SRSCard {
  const today = new Date().toISOString().split('T')[0];
  const updated = { ...card, lastReviewDate: today };

  if (quality < 3) {
    // Incorrect - reset to learning
    updated.repetitions = 0;
    updated.interval = 1;
    updated.lapses += 1;
    updated.state = 'LEARNING';
  } else {
    // Correct
    if (card.repetitions === 0) {
      updated.interval = 1;
    } else if (card.repetitions === 1) {
      updated.interval = 6;
    } else {
      updated.interval = Math.round(card.interval * card.easeFactor);
    }
    updated.repetitions += 1;

    // Determine state
    if (updated.interval >= 21) {
      updated.state = 'MATURE';
    } else if (updated.repetitions > 0) {
      updated.state = 'REVIEW';
    }
  }

  // Update ease factor using SM-2 formula
  const newEase = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  updated.easeFactor = Math.max(MIN_EASE, newEase);

  // Set next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + updated.interval);
  updated.nextReviewDate = nextDate.toISOString().split('T')[0];

  return updated;
}

/** Returns true if a card is due for review today or overdue */
export function isDue(card: SRSCard): boolean {
  if (card.state === 'NEW') return true;
  if (card.state === 'SUSPENDED') return false;
  const today = new Date().toISOString().split('T')[0];
  return card.nextReviewDate <= today;
}

/** Get all cards due for review, sorted by overdue days (most overdue first) */
export function getDueCards(cards: Record<string, SRSCard>): SRSCard[] {
  const today = new Date().toISOString().split('T')[0];
  return Object.values(cards)
    .filter(isDue)
    .sort((a, b) => {
      if (a.state === 'NEW' && b.state !== 'NEW') return 1;
      if (b.state === 'NEW' && a.state !== 'NEW') return -1;
      return a.nextReviewDate.localeCompare(b.nextReviewDate);
    });
}

/** Get new (unseen) cards, limited to daily new card limit */
export function getNewCards(cards: Record<string, SRSCard>, limit = 10): SRSCard[] {
  return Object.values(cards)
    .filter(c => c.state === 'NEW')
    .slice(0, limit);
}

/** Stats for the SRS deck */
export function getDeckStats(cards: Record<string, SRSCard>) {
  const all = Object.values(cards);
  const today = new Date().toISOString().split('T')[0];
  return {
    total: all.length,
    new: all.filter(c => c.state === 'NEW').length,
    learning: all.filter(c => c.state === 'LEARNING').length,
    review: all.filter(c => c.state === 'REVIEW' && c.nextReviewDate <= today).length,
    mature: all.filter(c => c.state === 'MATURE').length,
    due: all.filter(isDue).length,
  };
}

/** Convert quality rating based on response time (ms) as a tie-breaker heuristic */
export function estimateQualityFromTime(isCorrect: boolean, responseMs: number): ReviewQuality {
  if (!isCorrect) return responseMs < 5000 ? 2 : 1;
  if (responseMs < 2000) return 5;
  if (responseMs < 4000) return 4;
  return 3;
}

export type { SRSCard, SRSCardState };
