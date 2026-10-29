import type { Achievement } from '../../data/models';

export const achievementDefinitions = {
  curious: { title: 'CURIOUS', description: 'You found the terminal.' },
  engineer: {
    title: 'ENGINEER',
    description: 'A closer look at the architecture.',
  },
  sysadmin: { title: 'SYSADMIN', description: 'Welcome to the homelab.' },
  petrolhead: {
    title: 'PETROLHEAD',
    description: 'A different kind of engineering.',
  },
  explorer: {
    title: 'EXPLORER',
    description: 'Five discoveries. Still curious.',
  },
} as const satisfies Record<string, Omit<Achievement, 'id'>>;

export type AchievementId = keyof typeof achievementDefinitions;
export function isAchievementId(value: unknown): value is AchievementId {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(achievementDefinitions, value)
  );
}
