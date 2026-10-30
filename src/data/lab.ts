import type { LabHotspot } from './models';

export const labHotspots: LabHotspot[] = [
  {
    id: 'server-room',
    label: 'Server room',
    description: 'Infrastructure, networking, storage and the central workstation.',
    destination: '/lab/server-room',
    topics: ['Proxmox', 'Docker', 'Linux', 'Monitoring', 'Backups'],
  },
  {
    id: 'network-panel',
    label: 'Network panel',
    description: 'A conceptual view of routing, DNS, remote access and observability.',
    topics: ['DNS', 'Reverse proxy', 'Tailscale', 'Security'],
  },
  {
    id: 'electronics',
    label: 'Electronics bench',
    description: 'A space for sensors, embedded systems and IoT experiments.',
    topics: ['ESP32', 'Sensors', 'IoT', 'Prototyping'],
  },
  {
    id: 'garage',
    label: 'Dream garage',
    description: 'Five machines, five bays and the engineering behind each one.',
    destination: '/lab/garage',
    topics: ['Powertrains', 'Chassis', 'Drivetrains', 'Design'],
  },
];
