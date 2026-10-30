import type { Experience } from './models';

/** Professional experience sourced from Nicolas Gatta's current CV. */
export const experiences: Experience[] = [
  {
    id: 'takeda',
    year: '2024',
    company: 'Takeda Pharmaceuticals',
    role: 'Data Scientist Intern',
    period: 'Sep 2024 – Nov 2024 · Lessines, Belgium',
    summary:
      'Worked on retrieval-augmented generation and computer vision solutions for pharmaceutical production.',
    responsibilities: [
      'Improved a RAG system by optimizing clustering and model training, achieving a 5% accuracy gain.',
      'Contributed to a computer vision solution for detecting vial misplacement on the production line.',
      'Deployed solutions using Python, PyTorch, MLflow and Databricks.',
    ],
    technologies: ['Python', 'PyTorch', 'MLflow', 'Databricks', 'RAG', 'Computer Vision'],
    isPlaceholder: false,
  },
  {
    id: 'google',
    year: '2025',
    company: 'Google',
    role: 'Data Center Technician',
    period: 'Nov 2025 – Mar 2026 · Saint-Ghislain, Belgium',
    summary:
      'Supported data-center operations across hardware, physical networking and media security.',
    responsibilities: [
      'Provided operational support for the data center across hardware, physical networking and media security.',
      'Carried out large-scale maintenance and troubleshooting tasks.',
    ],
    technologies: ['Data Center Operations', 'Hardware', 'Physical Networking', 'Media Security'],
    isPlaceholder: false,
  },
  {
    id: 'ibm',
    year: '2026',
    company: 'IBM FutureNow Center',
    role: 'Data Engineer',
    period: 'Mar 2026 – Present · Antwerp, Belgium',
    summary:
      'Delivering AI automation and process-transformation work for European Commission and UCB engagements.',
    responsibilities: [
      'Generalized a Python recruitment pipeline to automate CV conversion and support reuse across multiple European Commission tenders.',
      'Designed a multi-step GPT-5 workflow to screen, compare and rank candidates against configurable requirements.',
      'Automated structured, auditable candidate-justification documents.',
      'Led the mapping and assessment of 94 end-to-end UCB business processes through Process Owner interviews.',
      'Designed and deployed a GPT-5-powered Python transcript-analysis and report-generation pipeline, reducing manual effort by 75–80% while preserving human validation.',
    ],
    technologies: ['Python', 'GPT-5', 'AI Workflows', 'Process Mapping', 'Automation'],
    isPlaceholder: false,
  },
];

export const experienceDisclaimer =
  'Roles, periods and outcomes sourced from the current CV.';
