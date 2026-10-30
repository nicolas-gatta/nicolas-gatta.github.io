import type { Certification } from './models';

export const certifications: Certification[] = [
  {
    issuer: 'Anthropic',
    credentials: [
      'Claude Certified Developer – Foundations',
      'Claude Certified Associate – Foundations',
      'Claude Certified Architect – Foundations',
      'Claude Partner Badge – Claude Code',
    ],
  },
  {
    issuer: 'Microsoft',
    credentials: ['Microsoft Certified: Azure AI Fundamentals'],
  },
  {
    issuer: 'AWS',
    credentials: ['AWS Partner: Generative AI Essentials'],
  },
];
