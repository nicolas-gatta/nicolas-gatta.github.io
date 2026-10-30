import type { Profile } from './models';

/** Public professional profile. Detailed career data is sourced from the CV. */
export const profile: Profile = {
  name: 'Nicolas Gatta',
  role: 'AI Engineer | Data Engineer',
  statement: 'I build intelligent systems, data platforms and software.',
  location: 'Belgium',
  languages: ['French (Native)', 'English (C1)', 'Dutch (Basic)'],
  email: 'nicolasgatta1@gmail.com',
  github: 'https://github.com/nicolas-gatta',
  linkedin: 'https://www.linkedin.com/in/nicolas-gatta',
  cvPath: `${import.meta.env.BASE_URL}cv/Nicolas_Gatta_CV.pdf`,
};
