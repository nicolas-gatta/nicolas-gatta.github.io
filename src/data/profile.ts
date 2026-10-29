import type { Profile } from './models';

/** Replace the draft PDF in public/cv and set cvIsPlaceholder to false. */
export const profile: Profile = {
  name: 'Nicolas Gatta',
  role: 'Data Engineer',
  statement: 'I build intelligent systems, data platforms and software.',
  location: 'Belgium',
  languages: ['French', 'English', 'Dutch'],
  email: 'nicolasgatta1@gmail.com',
  github: 'https://github.com/nicolas-gatta',
  linkedin: 'https://www.linkedin.com/in/nicolas-gatta',
  cvPath: `${import.meta.env.BASE_URL}cv/Nicolas_Gatta_CV.pdf`,
  cvIsPlaceholder: true,
};
