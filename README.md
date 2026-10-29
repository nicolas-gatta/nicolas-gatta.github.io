# Nicolas Gatta — engineering portfolio

An engineering portfolio with a dark cinematic opening and light professional sections, built with Vite, React, TypeScript, React Router, Framer Motion, CSS Modules and Lucide. Optional React Three Fiber / drei scenes sit behind explicit “Enable 3D” controls. Everything deploys as static files with no backend, account, analytics or external font service.

## Run locally

Use Node 22.12+ (22 LTS recommended) or Node 24+.

```sh
npm install
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

On Windows with a restrictive PowerShell execution policy, use `npm.cmd` instead of `npm`. No policy changes are necessary.

## Content and the initial draft

The supplied company dates are a **representative timeline**, not confirmed employment. Project names are supplied examples; their architectures and case studies are explicitly illustrative. Education, certifications, outcomes and private details have not been invented. Replace these entries before sharing the site as a finished professional profile.

| Content                                                                       | File                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------- |
| Name, role, statement, location, social profiles, email and PDF configuration | `src/data/profile.ts`                       |
| Professional data models                                                      | `src/data/models.ts`                        |
| Experience, responsibilities and technologies                                 | `src/data/experience.ts`                    |
| Organization labels (derived from the timeline)                               | `src/data/organizations.ts`                 |
| Projects, architecture, results, screenshots and optional GitHub URLs         | `src/data/projects.ts`                      |
| Skill groups                                                                  | `src/data/skills.ts`                        |
| Education                                                                     | `src/data/education.ts`                     |
| Vehicles, manufacturer sources and illustrative interest scores               | `src/data/cars.ts`                          |
| Hidden achievements                                                           | `src/features/achievements/achievements.ts` |

The downloadable `public/cv/Nicolas_Gatta_CV.pdf` is a real, readable **CONTENT DRAFT** PDF. Replace it with the final CV, then set `cvIsPlaceholder: false` in `profile.ts`. `cvPath` uses Vite’s base URL, so downloads also work from a repository subpath. The PDF is linked in the navigation, hero, dedicated CV page and no-JavaScript version. The desktop preview is optional; mobile visitors get an open/download action.

Add education to its typed array when available. Add certifications as a confirmed content section when supplied. Project `screenshots` accepts `{ src, alt }[]`; use `${import.meta.env.BASE_URL}images/filename.webp` for files in `public/images`. `github` is optional, and no speculative repository links are shown.

## Routes and GitHub Pages

The app deliberately uses **HashRouter**. Routes look like `/#/cv`, `/#/projects/dermatrack`, `/#/lab/computer` and `/#/lab/garage`. The requested `/cv` route exists inside the router. The URL fragment is not sent to GitHub Pages, so direct links, refreshes and repository subpaths work without server rewrites or redirect hacks.

About and Experience links use `/#/?section=about` and `/#/?section=experience`; the router scrolls to accessible section landmarks. Native `#section` links would conflict with hash routing and are avoided. Unknown app routes show the “YOU DIED” page; the build also generates a matching static `404.html` for genuinely missing server paths.

The tradeoff is route-level search indexing. The static document has the requested title, description, canonical link, OpenGraph and Twitter metadata. The generated sitemap intentionally contains only the canonical document, not fragment URLs. If independently indexed case studies become important, migrate to prerendered paths with a host supporting static route files.

### Deploy

1. In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Push to `main`, or run the workflow manually.
3. The workflow installs the lockfile with `npm ci`, checks TypeScript, builds `dist`, uploads the Pages artifact and deploys it. Pull requests validate the build without deploying.

The Vite configuration automatically uses `/` for repositories ending in `.github.io` and `/repository-name/` for project repositories, using `GITHUB_REPOSITORY` in Actions. No backend secrets are needed.

For custom domains or explicit control, set these GitHub Actions repository variables (or use a local `.env.local` based on `.env.example`):

```dotenv
# User site or custom domain
VITE_BASE_PATH=/
VITE_SITE_URL=https://nicolas-gatta.github.io/
```

```dotenv
# Project repository
VITE_BASE_PATH=/portfolio/
VITE_SITE_URL=https://nicolas-gatta.github.io/portfolio/
```

The base path controls all assets, PDF links and the build. The full site URL controls the canonical link, social image, sitemap, robots file and static 404 home link. If using a custom domain, configure the domain in Pages and supply its URL here.

## Design and performance

The opening constructs an original digital environment from a point of cyan light: a horizon, perspective grid, branching data trails and abstract computational architecture. A smooth forward camera movement settles into the dark hero, where the actual name typography is revealed within the same scene. The city remains dimly visible behind the content, and the first scroll raises and flattens its perspective before the light professional sections. Procedural Canvas2D projection provides the spatial effect without loading Three.js, models or textures on the homepage. If canvas is unavailable, the hero and professional navigation still work. With JavaScript disabled, a semantic static portfolio provides About, the representative timeline, selected projects, CV and contact information.

- Routes and secret interfaces are split into separate chunks. Computer and garage scene chunks load only after their own Enable 3D button is pressed.
- Primitive geometry stands in for final 3D assets. There are no model downloads, external environments, postprocessing or texture files. When adding GLB assets, compress geometry with Meshopt/Draco, use small WebP/AVIF textures, and import them only inside the scene chunks.
- WebGL uses a low-power preference, DPR capped at 1.5, demand-based rendering and a paused frame loop while the tab is hidden. Mobile and reduced-motion visitors keep the lightweight illustrated view unless they explicitly opt in.
- Scene/import/context failures recover to the illustrated interface. All OS actions and car specifications remain available as ordinary React controls. The optional shared Three.js chunk is large by design; Vite may report a size warning for it. It is never requested by the homepage or CV.
- Only one self-hosted Inter Latin variable WOFF2 is used and preloaded. System fonts remain available as fallbacks.
- Motion honors the OS preference. The full opening lasts approximately 6.8 seconds on the first visit; a new homepage load in the same session uses a brief 1.6-second horizon/grid pulse. Internal route navigation does not replay the sequence. Skip and Escape finish it immediately. Direct section links and reduced-motion visitors go straight to the completed hero. Optional synthesized sound starts only after a visitor explicitly enables it, and stops when the sequence ends or the page is left; no audio autoplays.

The favicon is `public/favicon.svg`. The social card is `public/images/social-preview.png`, with its editable SVG source beside it. Both metadata URL and base path are configurable; replace the social card when final branding is ready.

## Validation

The browser smoke suite uses the installed `playwright-core` and local Chrome; it does not download browsers. Start the production preview in a separate terminal:

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

Then run:

```sh
npm run test:smoke
node scripts/intro-check.mjs
```

Set `CHROME_PATH` if Chrome is not at its standard Windows location (or installed as the `chrome` channel elsewhere). Set `TEST_URL` to test a different origin or a repository subpath. Screenshots and results go to ignored `.qa/`.

The suite checks real downloads, timeline expansion, section navigation, project search, direct-route refreshes, CV access, terminal commands/history, illustrated computer controls, vehicle selection, optional WebGL, responsive pages from 320px to desktop, intro skip/session behavior, no-JavaScript access and recovery when WebGL is forcibly disabled. Run `npm audit` for dependency advisories.

Final local desktop Lighthouse checks in Chrome 156 (Windows, production preview):

| Page | Performance | Accessibility | Best Practices | SEO |
| ---- | ----------- | ------------- | -------------- | --- |
| Home | 100         | 100           | 100            | 100 |
| CV   | 100         | 100           | 100            | 100 |

The 14 portfolio browser checks and nine cinematic checks pass. They cover phase continuity, the first scroll, session behavior, reduced motion, keyboard controls, canvas failure and explicit sound opt-in. The portfolio has also been verified under `/portfolio/`. TypeScript and production builds pass, and the dependency audit reports zero vulnerabilities. For Lighthouse, run the **production preview** and choose Desktop. Scores depend on machine, browser, extensions and hosting; these are lab measurements, not guarantees for every device or a substitute for a full accessibility audit.

During development, remove the session-storage key `ng:world-intro-seen:v1` and reload to replay the full opening. The opening clock lives in `src/features/intro/useWorldSequence.ts`; procedural geometry and construction timings live in `DigitalWorldRenderer.ts`. `DigitalHero.tsx` constructs the actual hero letters, so no duplicate title or page swap is needed. The first opening is 6.8 seconds, a session return is 1.6 seconds, and no asset download controls either duration.

## Exploring

The Lab’s NICO OS is ordinary accessible HTML next to an optional 3D workstation. A monitor click or Start NICO OS powers it on. The garage has five vehicle studies, keyboard selection and explicit illustrative asset/rating labels.

The footer or `Ctrl` + backtick opens the fictional terminal. Try `help`, `whoami`, `neofetch`, `projects`, `skills`, `cars`, `homelab`, `cv`, `system`, `matrix`, `sudo`, `clear` or `exit`. Commands are simulated; no input is executed on the visitor’s device. Escape closes overlays. The Konami sequence toggles a small developer grid with viewport and FPS diagnostics. Discoveries are remembered only in the current browser session.

## Structure

```text
src/
  components/         layout, navigation, construction guides, error handling
  data/               typed professional content and vehicles
  features/           intro, terminal, achievements, secrets, WebGL lifecycle
  pages/              Home, CV, Projects, ProjectDetail, Lab, Computer, Garage,
                      Contact, NotFound; each with scoped CSS Modules
  three/scenes/       optional low-poly desk and garage scenes
  index.css           typography, tokens, shared controls, accessibility
public/
  cv/                 replaceable PDF
  images/             social card and future project images
scripts/
  smoke.mjs           browser integration checks
.github/workflows/
  deploy.yml          checks, build and native GitHub Pages deployment
```

No publication is performed by local development commands. The Pages workflow deploys only when pushed or manually triggered on GitHub.
