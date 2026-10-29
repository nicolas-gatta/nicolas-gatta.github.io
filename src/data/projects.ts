import type { Project } from './models';

/** The supplied project names are presented as illustrative case studies.
 * Replace proposed architectures and outcomes with verified details.
 */
export const projects: Project[] = [
  {
    id: 'dermatrack',
    number: '01',
    title: 'DermaTrack',
    category: 'Artificial Intelligence',
    summary:
      'A closer look at the intersection of imaging, connected devices and computer vision.',
    year: '2024 — 2025',
    tags: ['Computer Vision', 'Super Resolution', 'IoT', 'Medical Imaging'],
    overview:
      'An illustrative exploration of how connected imaging hardware and computer vision could support consistent image capture and analysis. The project name and focus areas are supplied; the case study is a draft.',
    problem:
      'Image quality and capture conditions can vary between devices. An engineering approach needs to consider the complete path from acquisition to analysis, including uncertainty and responsible handling of sensitive data.',
    architecture: [
      'Connected image capture',
      'Quality checks & preparation',
      'Super-resolution research',
      'Computer vision evaluation',
      'Review interface',
    ],
    challenges:
      'Balancing image enhancement with the risk of introducing artificial details, evaluating models across capture conditions, and maintaining traceability from source image to output.',
    results:
      'Final implementation, evaluation results and screenshots are awaiting confirmation. This illustration does not describe a clinically validated or deployed medical system.',
    visual: 'vision',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'knowledge-systems',
    number: '02',
    title: 'Knowledge Systems',
    category: 'Artificial Intelligence',
    summary:
      'Exploring retrieval-augmented generation with a focus on useful, traceable answers.',
    year: 'EXPLORATION',
    tags: ['RAG', 'Python', 'Vector Search', 'LLMs'],
    overview:
      'A representative AI / RAG project concept: turning a collection of documents into a searchable knowledge interface. The architecture below is a proposal rather than a claim of a delivered product.',
    problem:
      'Useful information often lives across disconnected documents. A retrieval system should make relevant context accessible while keeping sources visible and handling missing evidence honestly.',
    architecture: [
      'Document ingestion',
      'Chunking & indexing',
      'Semantic retrieval',
      'Grounded generation',
      'Citation & evaluation',
    ],
    challenges:
      'Choosing meaningful evaluation cases, measuring retrieval quality, handling document updates, and avoiding unsupported answers when the knowledge base is incomplete.',
    results:
      'This draft is ready for real datasets, implementation notes and evaluation evidence. No performance or accuracy figures are asserted.',
    visual: 'rag',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'unmonitarr',
    number: '03',
    title: 'Unmonitarr',
    category: 'Software & Infrastructure',
    summary:
      'Thinking through the small automations that make a self-hosted environment easier to run.',
    year: 'LAB / SOFTWARE',
    tags: ['Automation', 'Self-hosting', 'APIs'],
    overview:
      'A supplied project name, presented here as a placeholder for a future automation case study. The proposed focus is practical software that connects services and reduces repetitive maintenance.',
    problem:
      'Self-hosted services can accumulate repetitive tasks. Small, focused tools can help when they have clear boundaries, observable behavior and predictable failure handling.',
    architecture: [
      'Service adapters',
      'Rules & scheduling',
      'Background tasks',
      'Activity logging',
    ],
    challenges:
      'Idempotent operations, API changes, retries and providing enough visibility to understand what an automation has changed.',
    results:
      'Repository, final scope and delivered features will be added after confirmation.',
    visual: 'infra',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'ptero-panel',
    number: '04',
    title: 'Ptero-Panel',
    category: 'Software & Infrastructure',
    summary:
      'A systems interface concept for managing services with less friction.',
    year: 'LAB / SOFTWARE',
    tags: ['Web Interfaces', 'Infrastructure', 'APIs'],
    overview:
      'An illustrative project entry using the supplied Ptero-Panel name. The proposed case study explores service management through a clear web interface.',
    problem:
      'An operational interface must communicate the current state of a service clearly and make important actions understandable.',
    architecture: [
      'Management interface',
      'API boundary',
      'Service operations',
      'State & activity',
    ],
    challenges:
      'Handling asynchronous state, making destructive actions explicit and maintaining useful feedback when a remote service is unavailable.',
    results:
      'Final architecture, technology choices and implementation details are awaiting confirmation.',
    visual: 'infra',
    featured: false,
    isPlaceholder: true,
  },
  {
    id: 'cronario',
    number: '05',
    title: 'Cronario',
    category: 'Software & Infrastructure',
    summary:
      'An exploration of scheduling, dependable execution and useful operational feedback.',
    year: 'LAB / SOFTWARE',
    tags: ['Scheduling', 'Automation', 'Observability'],
    overview:
      'A supplied project name with an illustrative scheduling-system case study. This draft describes design questions rather than delivered capabilities.',
    problem:
      'Scheduled work needs more than a timer: execution history, failure visibility and understandable scheduling rules are essential.',
    architecture: [
      'Schedule definition',
      'Task queue',
      'Execution worker',
      'Run history & alerts',
    ],
    challenges:
      'Time zones, duplicate execution, missed schedules and making retries safe for the task being run.',
    results:
      'Implementation, screenshots and verified outcomes will be added as the case study is completed.',
    visual: 'schedule',
    featured: false,
    isPlaceholder: true,
  },
  {
    id: 'tune-taker',
    number: '06',
    title: 'Tune Taker',
    category: 'Experiments',
    summary:
      'A small space for experimenting with audio, software and better everyday tools.',
    year: 'LAB / EXPERIMENT',
    tags: ['Audio', 'Software', 'Experimentation'],
    overview:
      'An illustrative entry for the supplied Tune Taker project name. The final feature set and technical approach have not yet been provided.',
    problem:
      'Audio tools are a useful place to explore responsive interfaces and the relationship between raw signals and meaningful user feedback.',
    architecture: [
      'Audio input',
      'Signal preparation',
      'Processing experiment',
      'Playback & interface',
    ],
    challenges:
      'Keeping interaction responsive, handling different input formats and making processing feedback understandable.',
    results:
      'Final scope and results are awaiting confirmation. The visual is an abstract illustration rather than a product screenshot.',
    visual: 'audio',
    featured: false,
    isPlaceholder: true,
  },
  {
    id: 'homelab',
    number: '07',
    title: 'The Homelab',
    category: 'Software & Infrastructure',
    summary:
      'A hands-on environment for understanding how the pieces of a system fit together.',
    year: 'ONGOING EXPLORATION',
    tags: ['Linux', 'Networking', 'Containers', 'Self-hosting'],
    overview:
      'A representative infrastructure project focused on learning by building complete systems. Specific hardware, services and topology are intentionally left open until confirmed.',
    problem:
      'Working across the application and infrastructure boundary helps reveal practical tradeoffs in reliability, deployment and maintenance.',
    architecture: [
      'Network boundary',
      'Compute & containers',
      'Storage & backups',
      'Monitoring & operations',
    ],
    challenges:
      'Making services observable, protecting access, planning recovery and keeping an experimental environment maintainable.',
    results:
      'The production topology, hardware inventory and measured outcomes will be documented after confirmation.',
    visual: 'infra',
    featured: false,
    isPlaceholder: true,
  },
];

export const projectCategories = [
  'All work',
  'Artificial Intelligence',
  'Software & Infrastructure',
  'Experiments',
];
