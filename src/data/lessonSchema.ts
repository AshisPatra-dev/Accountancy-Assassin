// ============================================================
// ACCOUNTANCY ASSASSIN — Micro-Lesson Data Schema
// Typed structures for micro-lessons, content blocks, tables,
// formulas, animation hooks, and revision rule boxes.
// ============================================================

export type BlockType =
  | 'text'
  | 'formula'
  | 'table'
  | 'list'
  | 'image_placeholder'
  | 'animation_hook';

export interface TextBlock {
  type: 'text';
  key: string; // i18n key
  style?: 'normal' | 'callout' | 'rule-box'; // rule-box = ruled-paper box for key rules
}

export interface FormulaBlock {
  type: 'formula';
  latex: string; // KaTeX-compatible — stays in English in all modes
  caption?: string; // i18n key
}

export interface TableBlock {
  type: 'table';
  headers: string[]; // i18n keys
  rows: string[][]; // i18n keys for each cell
}

export interface ListBlock {
  type: 'list';
  style: 'bullet' | 'numbered';
  items: string[]; // i18n keys
}

export interface AnimationHook {
  type: 'animation_hook';
  animationId: string; // matches a future animation component
  caption?: string; // i18n key
}

export type ContentBlock =
  | TextBlock
  | FormulaBlock
  | TableBlock
  | ListBlock
  | AnimationHook;

export interface MicroLesson {
  id: string; // "S1-U1-T01-L01"
  topicId: string;
  order: number; // 1-based (1 to 12)
  kind: 'story' | 'theory' | 'example' | 'practice' | 'revision';
  titleKey: string; // i18n key for this lesson's title
  minutes: number; // estimated read time 3-5
  animation?: string; // optional animation hook id
  blocks: ContentBlock[];
  glossaryTerms?: string[]; // glossary IDs used in this lesson
  formulas?: string[];
  reviewStatus: 'draft' | 'reviewed';
}

export interface TopicContent {
  topicId: string;
  lessons: MicroLesson[];
}
