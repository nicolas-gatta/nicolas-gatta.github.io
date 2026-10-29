import { experiences } from './experience';

/** These labels describe the supplied representative timeline, not verified employment. */
export const organizations = [...experiences]
  .reverse()
  .map(({ id, company, isPlaceholder }) => ({
    id,
    name: company,
    isPlaceholder,
  }));
