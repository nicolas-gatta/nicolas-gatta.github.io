import type { Skill } from './models';

/** Areas of focus, not proficiency claims or third-party endorsements. */
export const skills: Skill[] = [
  {
    category: 'Data engineering',
    items: ['Python', 'SQL', 'Data pipelines', 'Data modelling'],
  },
  {
    category: 'Artificial intelligence',
    items: ['Machine learning', 'Computer vision', 'RAG', 'Model evaluation'],
  },
  {
    category: 'Software engineering',
    items: ['TypeScript', 'React', 'API design', 'Git'],
  },
  {
    category: 'Infrastructure',
    items: ['Linux', 'Docker', 'Networking', 'Automation'],
  },
];
