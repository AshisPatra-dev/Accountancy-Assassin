// ============================================================
// ACCOUNTANCY ASSASSIN — Lazy Content Loader
// Dynamically imports micro-lesson modules per topic with
// code-splitting support for offline mobile efficiency.
// ============================================================

import { MicroLesson } from '@/data/lessonSchema';
import { getTopic } from '@/data/syllabus';

const contentRegistry: Record<string, () => Promise<{ default: MicroLesson[] }>> = {
  'S1-U1-T01': () => import('./content/s1/u1/t01'),
};

function generatePlaceholderLessons(topicId: string): MicroLesson[] {
  const meta = getTopic(topicId);
  const count = meta?.lessonCount ?? 12;
  const lessons: MicroLesson[] = [];

  for (let i = 1; i <= count; i++) {
    const kind =
      i === 1
        ? 'story'
        : i === count
        ? 'revision'
        : i % 3 === 0
        ? 'example'
        : i % 4 === 0
        ? 'practice'
        : 'theory';

    lessons.push({
      id: `${topicId}-L${String(i).padStart(2, '0')}`,
      topicId,
      order: i,
      kind,
      titleKey: `placeholder.lesson.title`,
      minutes: 3,
      reviewStatus: 'draft',
      blocks: [
        {
          type: 'text',
          key: `placeholder.lesson.desc`,
          style: 'normal',
        },
        {
          type: 'text',
          key: `placeholder.lesson.content`,
          style: kind === 'revision' ? 'rule-box' : 'callout',
        },
      ],
    });
  }

  return lessons;
}

export async function loadTopicLessons(topicId: string): Promise<MicroLesson[]> {
  const loader = contentRegistry[topicId];
  if (loader) {
    try {
      const mod = await loader();
      return mod.default;
    } catch (e) {
      console.warn(`Failed to dynamically load content for ${topicId}:`, e);
    }
  }
  return generatePlaceholderLessons(topicId);
}
