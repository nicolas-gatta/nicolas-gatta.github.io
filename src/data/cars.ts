import type { Car } from './models';
export type { Car } from './models';

/** Curated engineering notes. Ratings are illustrative personal-interest scores, not specifications. */
export const cars: Car[] = [
  {
    id: 'rx7',
    name: 'Mazda RX-7',
    generation: 'FD · Third generation',
    engine: '13B-REW · Twin-rotor, twin-turbo',
    source: {
      label: 'Mazda heritage',
      url: 'https://www.mazdausa.com/discover/rx-7-heaven',
    },
    layout: 'Front mid-engine / Rear-wheel drive',
    engineering:
      'A compact rotary engine and sequential twin turbochargers make the FD an unusually elegant exercise in packaging and power delivery.',
    perspective:
      'An alternative answer to a familiar problem: how much character and performance can fit into a small, lightweight system?',
    color: '#87aeb3',
    body: 'coupe',
    ratings: [
      { label: 'Engineering curiosity', value: 9 },
      { label: 'System complexity', value: 8 },
      { label: 'Design character', value: 10 },
    ],
  },
  {
    id: 'supra',
    name: 'Toyota Supra',
    generation: 'A80 · Fourth generation',
    engine: '2JZ-GTE · Twin-turbo inline-six',
    source: {
      label: 'Toyota archive',
      url: 'https://global.toyota/en/detail/7868203',
    },
    layout: 'Front-engine / Rear-wheel drive',
    engineering:
      'The twin-turbo inline-six and a six-speed transmission developed with Getrag give the A80 a distinctive powertrain. Lightweight materials help balance its grand-touring brief.',
    perspective:
      'A useful reminder that a robust foundation can give a system a life far beyond its original specification.',
    color: '#b5b9b2',
    body: 'grand-tourer',
    ratings: [
      { label: 'Engineering curiosity', value: 9 },
      { label: 'System complexity', value: 8 },
      { label: 'Design character', value: 9 },
    ],
  },
  {
    id: 'skyline',
    name: 'Nissan Skyline GT-R',
    generation: 'R34 · Fifth GT-R generation',
    engine: 'RB26DETT · Twin-turbo inline-six',
    source: {
      label: 'Nissan heritage',
      url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/280_skyline_gt-r_v-spec_ii.html',
    },
    layout: 'Front-engine / All-wheel drive',
    engineering:
      'A rigid, compact body, tuned multilink suspension and an active limited-slip differential on the V-Spec show the close relationship between structure and traction.',
    perspective:
      'Interesting at the boundary between hardware and software: sensing, feedback and control becoming part of the driving experience.',
    color: '#6892ae',
    body: 'coupe',
    ratings: [
      { label: 'Engineering curiosity', value: 10 },
      { label: 'System complexity', value: 9 },
      { label: 'Design character', value: 10 },
    ],
  },
  {
    id: '3000gt',
    name: 'Mitsubishi 3000GT',
    generation: 'Z16A · VR-4',
    engine: 'Twin-turbo V6 · 3.0 litre',
    source: {
      label: 'Mitsubishi heritage',
      url: 'https://www.mitsubishi-motors.com/en/company/history/car/',
    },
    layout: 'Front-engine / All-wheel drive',
    engineering:
      'Selected VR-4 versions combined all-wheel drive, four-wheel steering, active aerodynamics and electronically controlled suspension.',
    perspective:
      'A fascinating integration challenge: many ambitious subsystems working together inside one grand tourer.',
    color: '#ad8c82',
    body: 'grand-tourer',
    ratings: [
      { label: 'Engineering curiosity', value: 10 },
      { label: 'System complexity', value: 10 },
      { label: 'Design character', value: 9 },
    ],
  },
  {
    id: 'evolution',
    name: 'Mitsubishi Lancer Evolution',
    generation: 'Evolution IX · CT9A',
    engine: '4G63 · Turbocharged inline-four',
    source: {
      label: 'Mitsubishi heritage',
      url: 'https://www.mitsubishi-motors.com/en/company/history/car/',
    },
    layout: 'Front-engine / All-wheel drive',
    engineering:
      'A rally-derived platform with a turbocharged four-cylinder and active drivetrain control, tuned around traction and response.',
    perspective:
      'Purpose-led engineering: a practical body wrapped around a tightly integrated performance system.',
    color: '#c6c2af',
    body: 'sedan',
    ratings: [
      { label: 'Engineering curiosity', value: 9 },
      { label: 'System complexity', value: 9 },
      { label: 'Design character', value: 8 },
    ],
  },
];
