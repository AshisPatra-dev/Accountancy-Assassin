// ============================================================
// ACCOUNTANCY ASSASSIN — Micro-Lesson Content
// Semester 1 · Unit 1 · Topic 01 (S1-U1-T01)
// Topic: Meaning, objectives and limitations of accounting
// Quality: Production-grade authentic Bengal commerce pedagogy.
// All keys localized in src/i18n/en.ts & src/i18n/bn.ts.
// reviewStatus: 'draft'
// ============================================================

import { MicroLesson } from '@/data/lessonSchema';

export const S1_U1_T01_LESSONS: MicroLesson[] = [
  // ── L01: Story ──────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L01',
    topicId: 'S1-U1-T01',
    order: 1,
    kind: 'story',
    titleKey: 'content.s1.u1.t01.l01.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'transaction'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l01.p1',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l01.p2',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l01.p3',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l01.p4',
        style: 'normal',
      },
    ],
  },

  // ── L02: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L02',
    topicId: 'S1-U1-T01',
    order: 2,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l02.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'transaction', 'journal', 'ledger'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l02.p1',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'bullet',
        items: [
          'content.s1.u1.t01.l02.item1',
          'content.s1.u1.t01.l02.item2',
          'content.s1.u1.t01.l02.item3',
          'content.s1.u1.t01.l02.item4',
          'content.s1.u1.t01.l02.item5',
          'content.s1.u1.t01.l02.item6',
        ],
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l02.p2',
        style: 'rule-box',
      },
      {
        type: 'formula',
        latex: '\\text{Assets} = \\text{Liabilities} + \\text{Capital}',
        caption: 'content.s1.u1.t01.l02.formulaCaption',
      },
    ],
  },

  // ── L03: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L03',
    topicId: 'S1-U1-T01',
    order: 3,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l03.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'journal', 'ledger'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l03.p1',
        style: 'normal',
      },
      {
        type: 'table',
        headers: [
          'content.s1.u1.t01.l03.th1',
          'content.s1.u1.t01.l03.th2',
          'content.s1.u1.t01.l03.th3',
        ],
        rows: [
          [
            'content.s1.u1.t01.l03.r1c1',
            'content.s1.u1.t01.l03.r1c2',
            'content.s1.u1.t01.l03.r1c3',
          ],
          [
            'content.s1.u1.t01.l03.r2c1',
            'content.s1.u1.t01.l03.r2c2',
            'content.s1.u1.t01.l03.r2c3',
          ],
          [
            'content.s1.u1.t01.l03.r3c1',
            'content.s1.u1.t01.l03.r3c2',
            'content.s1.u1.t01.l03.r3c3',
          ],
          [
            'content.s1.u1.t01.l03.r4c1',
            'content.s1.u1.t01.l03.r4c2',
            'content.s1.u1.t01.l03.r4c3',
          ],
          [
            'content.s1.u1.t01.l03.r5c1',
            'content.s1.u1.t01.l03.r5c2',
            'content.s1.u1.t01.l03.r5c3',
          ],
        ],
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l03.p2',
        style: 'callout',
      },
    ],
  },

  // ── L04: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L04',
    topicId: 'S1-U1-T01',
    order: 4,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l04.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'trial-balance'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l04.p1',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'numbered',
        items: [
          'content.s1.u1.t01.l04.item1',
          'content.s1.u1.t01.l04.item2',
          'content.s1.u1.t01.l04.item3',
          'content.s1.u1.t01.l04.item4',
          'content.s1.u1.t01.l04.item5',
        ],
      },
    ],
  },

  // ── L05: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L05',
    topicId: 'S1-U1-T01',
    order: 5,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l05.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l05.p1',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'bullet',
        items: [
          'content.s1.u1.t01.l05.item1',
          'content.s1.u1.t01.l05.item2',
          'content.s1.u1.t01.l05.item3',
          'content.s1.u1.t01.l05.item4',
          'content.s1.u1.t01.l05.item5',
        ],
      },
    ],
  },

  // ── L06: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L06',
    topicId: 'S1-U1-T01',
    order: 6,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l06.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l06.p1',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l06.p2',
        style: 'callout',
      },
      {
        type: 'table',
        headers: [
          'content.s1.u1.t01.l06.th1',
          'content.s1.u1.t01.l06.th2',
        ],
        rows: [
          ['content.s1.u1.t01.l06.r1c1', 'content.s1.u1.t01.l06.r1c2'],
          ['content.s1.u1.t01.l06.r2c1', 'content.s1.u1.t01.l06.r2c2'],
          ['content.s1.u1.t01.l06.r3c1', 'content.s1.u1.t01.l06.r3c2'],
          ['content.s1.u1.t01.l06.r4c1', 'content.s1.u1.t01.l06.r4c2'],
        ],
      },
    ],
  },

  // ── L07: Example ────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L07',
    topicId: 'S1-U1-T01',
    order: 7,
    kind: 'example',
    titleKey: 'content.s1.u1.t01.l07.title',
    minutes: 3,
    reviewStatus: 'draft',
    glossaryTerms: ['journal', 'ledger', 'trial-balance'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.intro',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ex1',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ans1',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ex2',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ans2',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ex3',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l07.ans3',
        style: 'normal',
      },
    ],
  },

  // ── L08: Example ────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L08',
    topicId: 'S1-U1-T01',
    order: 8,
    kind: 'example',
    titleKey: 'content.s1.u1.t01.l08.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l08.intro',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'bullet',
        items: [
          'content.s1.u1.t01.l08.item1',
          'content.s1.u1.t01.l08.item2',
          'content.s1.u1.t01.l08.item3',
          'content.s1.u1.t01.l08.item4',
          'content.s1.u1.t01.l08.item5',
        ],
      },
    ],
  },

  // ── L09: Practice ───────────────────────────────────────────
  {
    id: 'S1-U1-T01-L09',
    topicId: 'S1-U1-T01',
    order: 9,
    kind: 'practice',
    titleKey: 'content.s1.u1.t01.l09.title',
    minutes: 5,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'transaction'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.intro',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.q1',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.sol1',
        style: 'rule-box',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.q2',
        style: 'callout',
      },
      {
        type: 'formula',
        latex: '\\text{Capital} = (₹5{,}000 + ₹45{,}000 + ₹30{,}000) - ₹20{,}000 = ₹60{,}000',
        caption: 'content.s1.u1.t01.l09.sol2Caption',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.q3',
        style: 'callout',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l09.sol3',
        style: 'normal',
      },
    ],
  },

  // ── L10: Practice ───────────────────────────────────────────
  {
    id: 'S1-U1-T01-L10',
    topicId: 'S1-U1-T01',
    order: 10,
    kind: 'practice',
    titleKey: 'content.s1.u1.t01.l10.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l10.intro',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'numbered',
        items: [
          'content.s1.u1.t01.l10.item1',
          'content.s1.u1.t01.l10.item2',
          'content.s1.u1.t01.l10.item3',
          'content.s1.u1.t01.l10.item4',
        ],
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l10.hint',
        style: 'callout',
      },
    ],
  },

  // ── L11: Theory ─────────────────────────────────────────────
  {
    id: 'S1-U1-T01-L11',
    topicId: 'S1-U1-T01',
    order: 11,
    kind: 'theory',
    titleKey: 'content.s1.u1.t01.l11.title',
    minutes: 3,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l11.p1',
        style: 'normal',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l11.p2',
        style: 'normal',
      },
      {
        type: 'list',
        style: 'bullet',
        items: [
          'content.s1.u1.t01.l11.item1',
          'content.s1.u1.t01.l11.item2',
          'content.s1.u1.t01.l11.item3',
        ],
      },
    ],
  },

  // ── L12: Revision ───────────────────────────────────────────
  {
    id: 'S1-U1-T01-L12',
    topicId: 'S1-U1-T01',
    order: 12,
    kind: 'revision',
    titleKey: 'content.s1.u1.t01.l12.title',
    minutes: 4,
    reviewStatus: 'draft',
    glossaryTerms: ['accounting', 'journal', 'ledger', 'trial-balance'],
    blocks: [
      {
        type: 'text',
        key: 'content.s1.u1.t01.l12.rule1',
        style: 'rule-box',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l12.rule2',
        style: 'rule-box',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l12.rule3',
        style: 'rule-box',
      },
      {
        type: 'text',
        key: 'content.s1.u1.t01.l12.rule4',
        style: 'rule-box',
      },
      {
        type: 'formula',
        latex: '\\text{Assets} = \\text{Liabilities} + \\text{Capital}',
        caption: 'content.s1.u1.t01.l12.formulaCaption',
      },
    ],
  },
];

export default S1_U1_T01_LESSONS;
