export type TerminalAction =
  | 'projects'
  | 'cv'
  | 'clear'
  | 'matrix'
  | 'system'
  | 'exit';
export interface CommandResponse {
  lines: string[];
  action?: TerminalAction;
  kind?: 'system' | 'neofetch';
}
export const commandNames = [
  'help',
  'about',
  'projects',
  'skills',
  'whoami',
  'neofetch',
  'cv',
  'clear',
  'sudo',
  'matrix',
  'system',
  'exit',
];

export function executeCommand(input: string): CommandResponse {
  const command = input.trim().toLowerCase().split(/\s+/)[0];
  switch (command) {
    case 'help':
      return {
        lines: [
          'A small window into the person behind the portfolio.',
          '',
          'about       The engineer',
          'projects    Open selected work',
          'skills      A few tools of the trade',
          'whoami      An existential query',
          'neofetch    System information',
          'cv          Open the professional CV',
          'system      Character status',
          'matrix      Follow the data',
          'clear       Clear the screen',
          'exit        Back to the portfolio',
          '',
          'Tip: ↑ / ↓ browse history. Tab completes commands. Escape closes.',
        ],
      };
    case 'about':
      return {
        lines: [
          'Nicolas Gatta',
          'AI Engineer | Data Engineer · Belgium',
          '',
          'I build intelligent systems, data platforms and software.',
          'Curiosity is usually where the interesting work begins.',
        ],
      };
    case 'projects':
      return { lines: ['Opening selected work…'], action: 'projects' };
    case 'skills':
      return {
        lines: [
          'CODE       Python / SQL / Java',
          'AI / ML    PyTorch / Scikit-learn / OpenCV',
          'DATA       Pandas / NumPy / Databricks / MLflow',
          'WEB        React / Angular / TypeScript',
          '',
          'An evolving toolkit, driven by the problem.',
        ],
      };
    case 'whoami':
      return {
        lines: [
          'nicolas',
          'AI Engineer | Data Engineer',
          'Human',
          'Probably debugging something.',
        ],
      };
    case 'neofetch':
      return {
        lines: [
          'Nicolas@portfolio',
          'Role       AI Engineer | Data Engineer',
          'Focus      AI / Data / Software',
          'Languages  FR / EN / NL',
          'Location   Belgium',
          'Stack      Python / SQL / PyTorch / Databricks',
          'Uptime     Still curious',
        ],
        kind: 'neofetch',
      };
    case 'cv':
      return { lines: ['Opening the professional CV…'], action: 'cv' };
    case 'clear':
      return { lines: [], action: 'clear' };
    case 'sudo':
      return {
        lines: [
          'Nice try.',
          'This is a portfolio. You already have visitor privileges.',
        ],
      };
    case 'matrix':
      return {
        lines: ['A brief look behind the data. Press Escape to return.'],
        action: 'matrix',
      };
    case 'system':
      return {
        lines: [
          'CHARACTER STATUS',
          'NICOLAS GATTA',
          'CLASS       Data Engineer',
          'SUBCLASS    AI Engineer',
          'SKILLS      Python · SQL · AI / ML · Data Engineering · DevOps',
          'PASSIVE     +10 curiosity',
          'QUEST       Build something useful',
          '',
          'A fictional character sheet. For actual credentials, use “cv”.',
        ],
        action: 'system',
        kind: 'system',
      };
    case 'exit':
      return { lines: ['Connection closed. See you outside.'], action: 'exit' };
    default:
      return {
        lines: [
          `Command not found: ${command}`,
          'Try “help”. Curiosity is encouraged.',
        ],
      };
  }
}
