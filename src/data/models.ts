export interface Profile {
  name: string;
  role: string;
  statement: string;
  location: string;
  languages: string[];
  email: string;
  github: string;
  linkedin: string;
  cvPath: string;
  cvIsPlaceholder: boolean;
}

export interface Experience {
  id: string;
  year: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  isPlaceholder: boolean;
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  period: string;
  description?: string;
}

export type ProjectVisual = 'vision' | 'rag' | 'infra' | 'schedule' | 'audio';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  year: string;
  tags: string[];
  overview: string;
  problem: string;
  architecture: string[];
  challenges: string;
  results: string;
  github?: string;
  visual: ProjectVisual;
  featured: boolean;
  isPlaceholder: boolean;
  screenshots?: { src: string; alt: string }[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Car {
  id: string;
  name: string;
  generation: string;
  engine: string;
  layout: string;
  engineering: string;
  perspective: string;
  color: string;
  body: 'coupe' | 'sedan' | 'grand-tourer';
  source: { label: string; url: string };
  ratings: { label: string; value: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}
