import { experiences } from './experience';
import type { Organization } from './models';

/** Organizations and relationships sourced from the current CV. */
export const organizations: Organization[] = [...experiences]
  .reverse()
  .map(({ id, company, role, period, isPlaceholder }) => ({
    id,
    name: id === 'ibm' ? 'IBM' : company,
    logo: `${import.meta.env.BASE_URL}images/organizations/${id}.${id === 'takeda' ? 'png' : 'svg'}`,
    relationship: `${role} · ${period}`,
    isPlaceholder,
  }));
