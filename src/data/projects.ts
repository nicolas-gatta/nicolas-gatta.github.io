import type { Project } from './models';

/** Project scope, technologies and status are sourced from the current CV. */
export const projects: Project[] = [
  {
    id: 'unmonitarr',
    number: '01',
    title: 'Unmonitarr',
    category: 'Software & Infrastructure',
    summary:
      'Webhook middleware that automatically changes newly approved media requests to an unmonitored state.',
    year: 'ACTIVELY MAINTAINED',
    tags: ['Python', 'HTML', 'JavaScript', 'CSS', 'Webhooks'],
    overview:
      'A webhook-based middleware service integrating Overseerr or Jellyseerr with Radarr or Sonar to automate the state of newly approved media requests.',
    problem:
      'Newly approved requests needed an automated path to an unmonitored state across the connected media-management services.',
    architecture: [
      'Approved media request',
      'Webhook event',
      'Unmonitarr middleware',
      'Radarr / Sonar integration',
      'Unmonitored state',
    ],
    challenges:
      'The current CV confirms the integration scope but does not document implementation trade-offs or operational constraints.',
    results: 'Actively maintained.',
    visual: 'infra',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'ptero-panel',
    number: '02',
    title: 'Ptero-Panel',
    category: 'Software & Infrastructure',
    summary:
      'A self-hosted Pterodactyl dashboard for server monitoring, control and organization.',
    year: 'ACTIVELY MAINTAINED',
    tags: ['HTML', 'JavaScript', 'CSS', 'Pterodactyl', 'Self-hosting'],
    overview:
      'A self-hosted Pterodactyl management dashboard with server monitoring and control, secure server-side API integration, hierarchical organization and persistent configuration.',
    problem:
      'Server monitoring and management needed a focused interface that could also be embedded into popular dashboard environments.',
    architecture: [
      'Management dashboard',
      'Secure server-side API',
      'Hierarchical server organization',
      'Persistent configuration',
      'Dashboard embedding',
    ],
    challenges:
      'The current CV confirms the delivered capabilities but does not describe security decisions or implementation trade-offs in detail.',
    results: 'Actively maintained.',
    visual: 'infra',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'cronario',
    number: '03',
    title: 'Cronario',
    category: 'Software & Infrastructure',
    summary:
      'A scheduling platform for planning, validating and optimizing workloads across systems.',
    year: 'IN DEVELOPMENT',
    tags: ['React', 'TypeScript', 'Vite', 'SCSS', 'JSON'],
    overview:
      'A scheduling-management platform combining cron-expression assistance, execution-timeline visualization and conflict detection.',
    problem:
      'Scheduled workloads across multiple machines and applications need to be easier to plan, validate and optimize.',
    architecture: [
      'Cron expression assistance',
      'Schedule definition',
      'Execution timeline',
      'Conflict detection',
      'Multi-system planning',
    ],
    challenges:
      'The project is still in development; the current CV does not yet document final implementation decisions or measured outcomes.',
    results: 'In development.',
    visual: 'schedule',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'tawa',
    number: '04',
    title: 'T.A.W.A.',
    category: 'Software & Data',
    summary:
      'A desktop application for managing job applications, career history and salary information.',
    year: 'IN DEVELOPMENT',
    tags: ['Vite', 'React', 'TypeScript', 'SQLite', 'ATS'],
    overview:
      'Treatment and Automation of Work Application is a desktop application for managing and tracking job applications and professional history.',
    problem:
      'Application status, salary calculations and professional history needed to be brought together in one structured tool.',
    architecture: [
      'Application tracking system',
      'Persistent SQLite data',
      'Dynamic charts',
      'Gross-to-net calculator',
      'Career and salary history',
    ],
    challenges:
      'The project is in development; detailed architecture decisions and validation results are not included in the current CV.',
    results: 'In development.',
    visual: 'schedule',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'tune-taker',
    number: '05',
    title: 'Tune Taker',
    category: 'Mobile Applications',
    summary:
      'A Flutter application for finding and downloading music through links, search or audio recognition.',
    year: 'ACTIVELY MAINTAINED',
    tags: ['Dart', 'Flutter', 'YouTube API', 'Shazam API'],
    overview:
      'An application that lets users download music from YouTube using a direct link, title or artist search, or audio recognition.',
    problem:
      'Users needed multiple fast discovery paths—direct URL, text search and audio recognition—within one application.',
    architecture: [
      'Link, title or artist input',
      'YouTube API search',
      'Shazam audio recognition',
      'Track resolution',
      'Download',
    ],
    challenges:
      'The CV confirms the integrations and speed claim but does not document platform constraints or implementation trade-offs.',
    results: 'Actively maintained; the CV reports downloads in under 10 seconds.',
    visual: 'audio',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'dermatrack',
    number: '06',
    title: 'DermaTrack',
    category: 'Artificial Intelligence',
    summary:
      'Dermatological monitoring software combining computer vision, super-resolution and purpose-built capture hardware.',
    year: 'RELEASED',
    tags: [
      'Python',
      'Django',
      'PyTorch',
      'Computer Vision',
      'IoT',
      'Super-Resolution',
    ],
    overview:
      'Dermatological monitoring software that helps dermatologists capture, process and annotate images collected through a purpose-built external device.',
    problem:
      'Dermatological image capture and annotation needed an integrated workflow with improved image quality and a purpose-built acquisition device.',
    architecture: [
      'Purpose-built external device',
      'Image capture',
      'Super-resolution processing',
      'Computer-vision workflow',
      'Dermatologist annotation interface',
    ],
    challenges:
      'The CV lists SRCNN, SRGAN, ESRGAN and EDVR as explored technologies but does not document comparative evaluation details.',
    results:
      'Released; the CV reports a 15% image-quality improvement through computer vision and super-resolution algorithms.',
    visual: 'vision',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'c-3bot',
    number: '07',
    title: 'C-3BOT',
    category: 'Artificial Intelligence',
    summary:
      'An NLP-powered chatbot prototype for code correction and optimization recommendations.',
    year: 'RELEASED',
    tags: ['Python', 'Django', 'PyTorch', 'NLP', 'BERT', 'Word2Vec'],
    overview:
      'An AI-powered chatbot prototype using natural-language processing to assist with code correction and optimization.',
    problem:
      'Code feedback needed to be organized into useful recommendations while retaining basic conversational interaction.',
    architecture: [
      'Code and conversation input',
      'NLP preprocessing',
      'Language representation',
      'Five recommendation categories',
      'Conversational response',
    ],
    challenges:
      'The CV lists BERT, TF-IDF, Bag of Words, Word2Vec and GloVe but does not provide comparative model-evaluation results.',
    results: 'Released as a working prototype.',
    visual: 'rag',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'energo-sphere',
    number: '08',
    title: 'Energo-Sphere',
    category: 'Software & Data',
    summary:
      'A web application for energy portfolio monitoring, contract management and provider notifications.',
    year: 'RELEASED',
    tags: ['Angular', 'TypeScript', 'Java', 'SQL', 'SCSS'],
    overview:
      'A web-based energy portfolio management application for monitoring consumption, managing contracts and receiving real-time provider notifications.',
    problem:
      'Energy consumption, contracts and provider communication needed a unified portfolio interface.',
    architecture: [
      'Energy and contract data',
      'Java API',
      'SQL persistence',
      'Angular portfolio interface',
      'Real-time notifications',
    ],
    challenges:
      'The current CV confirms the application scope but does not include deployment details or measured operational outcomes.',
    results: 'Released.',
    visual: 'infra',
    featured: false,
    isPlaceholder: false,
  },
];

export const projectCategories = [
  'All work',
  'Artificial Intelligence',
  'Software & Infrastructure',
  'Software & Data',
  'Mobile Applications',
];
