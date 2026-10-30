import type { Skill } from './models';

/** Technical competencies listed in the current CV. */
export const skills: Skill[] = [
  { category: 'Programming', items: ['Python', 'SQL', 'Java'] },
  { category: 'AI / ML', items: ['PyTorch', 'Scikit-learn', 'OpenCV'] },
  { category: 'Data', items: ['Pandas', 'NumPy', 'Matplotlib'] },
  { category: 'Databases', items: ['MySQL', 'SQLite'] },
  { category: 'MLOps', items: ['Databricks', 'MLflow', 'Docker', 'Git'] },
  {
    category: 'Web',
    items: ['React', 'Angular', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Professional',
    items: [
      'Teamwork',
      'Flexibility',
      'Reliability',
      'Analytical Thinking',
      'Problem Solving',
      'Time Management',
      'Communication',
      'Open-mindedness',
    ],
  },
];
