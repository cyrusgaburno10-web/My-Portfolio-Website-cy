# CLAUDE.md — Personal Interactive Portfolio

This file governs how Claude builds and edits this site. The project is one person's portfolio: a hiring manager or recruiter lands here, needs to understand who this person is and what they can do within seconds, and needs a frictionless path to two outcomes — **view the work** and **get the resume / get in touch**. Every decision below is filtered through that job.

Read this before generating or editing any UI. It merges three concerns that must never be traded off against each other: the site has to look like nobody else's portfolio, it has to be built on solid technical footing, and it has to be effortless to use.

---

## 0. Next.js Version Note

This project was scaffolded against a Next.js version that may include breaking changes relative to older training data — APIs, conventions, and file structure may differ from what's remembered. Check `node_modules/next/dist/docs/` for the relevant guide before writing App Router, routing, or data-fetching code, and heed any deprecation notices encountered along the way.

---

## 1. Design Identity

Treat this portfolio the way a studio treats a client who's already rejected templated work: infer a real point of view from the owner's actual work, personality, and field, then commit to it. Before writing a single component, state in one line what's being built: *"Reading this as: [discipline]'s portfolio for [audience], with a [vibe] language, leaning toward [stack/aesthetic]."* If the owner's field, tone, or reference points aren't yet known, ask — don't default silently to a generic dev-portfolio look.

**Ground every choice in the subject.** The palette, type, and layout should come from what this specific person does and makes — their projects, their medium, their working style — not from "portfolio" as a generic category. Genericness is the failure mode to design against.

**The hero is the thesis, not a template.** Lead with the single most characteristic thing about this person's work: that might be a headline plus a live piece of their work, an animated demo, a striking image, or a confident sentence. Resist the reflex of "big name + tagline + gradient blob." The visitor should know who this is and why it matters within one screen, no scrolling required to find that answer or the primary call to action.

**Typography and structure carry personality.** Pick a deliberate display/body pairing rather than reaching for the safest default; use hierarchy, weight, and spacing to do the work rather than decoration. Structural devices — numbering, eyebrows, dividers — are only used when they encode something real (an actual sequence, an actual count). If a device doesn't carry true information, cut it.

**Spend boldness in one place.** One signature moment — a distinctive hero treatment, an interaction, a layout choice — should be the thing this site is remembered by. Everything around it stays disciplined and quiet. Before shipping, do the one-accessory-removal pass: look at the page and cut whatever isn't earning its place.

---

## 2. User Experience — the Journey Comes First

This is the layer that overrides aesthetic ambition when the two conflict. A recruiter or collaborator gives a portfolio seconds, not minutes.

- **One clear job per screen.** Hero = who + what + primary CTA. Work section = proof. About = credibility and personality. Contact/resume = conversion. Don't blur these.
- **Two CTAs, maximum, and never duplicated in intent.** Typically: "View Work" (or a specific project) and "Download Resume" / "Get in Touch." Pick one label per intent and reuse it everywhere — nav, hero, footer. Never mix "Let's Talk," "Reach Out," and "Contact Me" on the same page.
- **Navigation is a map, not a maze.** Single line at desktop, collapses cleanly on mobile, every link goes somewhere the visitor expects. If the whole site is one scrollable page, nav items are anchor jumps with smooth scroll and correct active-state highlighting — not decoration.
- **Resume download and project links must work in one click,** with an obvious hover/focus state and, for the resume, a visible file type/size cue if relevant (e.g. "Resume (PDF)"). Nothing that looks like a CTA should require a second click to discover what it does.
- **Every interactive element has a full state cycle**: default, hover, focus-visible, active/pressed, loading (for anything async, like a contact form submission), and error. A button that only has a "resting" state is unfinished.
- **Performance is UX.** A slow-loading portfolio reads as unprofessional before a single pixel is judged on taste. Treat Core Web Vitals as a design constraint, not an afterthought — see Section 5.
- **Never make the visitor work to find the point.** If a section needs more than a glance to understand its purpose, the design has failed regardless of how polished it looks.

---

## 3. Visual System

Default working dials for this kind of project — adjust only with a stated reason tied to the owner's actual field or explicit request:

| Dial | Value | Meaning |
|---|---|---|
| Design Variance | 6/10 | Confident asymmetry, not chaos; not dead-centered either |
| Motion Intensity | 5/10 | Purposeful entrance/scroll/hover motion; nothing perpetual for its own sake |
| Visual Density | 4/10 | Room to breathe; work speaks, chrome doesn't |

**Typography.** Pair a characterful display face with a clean body face — not the reflexive Inter-everywhere default (Inter is fine only if the brief is explicitly neutral/technical). Serif is earned, not assumed: only reach for it if the person's field is genuinely editorial, publishing, or heritage-craft, and never default to Fraunces or Instrument Serif. Emphasis inside a headline uses italic/bold of the *same* family, never a mixed-family flourish.

**Color.** One accent color, used identically in every section — no drifting from warm to cool grays, no surprise accent swap in the footer. Avoid the AI-purple/blue-glow default and the beige+brass+oxblood "premium craft" default alike unless the owner's actual brand calls for it. Neutral base (zinc/slate/stone family) plus one confident, restrained accent is the safe, correct starting point.

**Layout.** Grid over flex-math. Break the three-equal-cards reflex for project/skill listings — use asymmetric grids, featured + supporting sizing, or a case-study-style layout instead. No more than two consecutive sections sharing the same layout family (e.g. no third image-left/text-right row in a row). Corner-radius is one consistent system across the whole page.

**Motion.** Every animation must be explainable in one sentence: it draws attention, tells the story in sequence, confirms an action, or shows a state change. Entrance transitions on the hero and scroll-reveals on project sections are worth having; infinite decorative loops on static content are not. All motion above a light touch respects `prefers-reduced-motion` and degrades to instant/static, no exceptions.

**Content density.** Short, confident copy per section — a headline, a brief supporting line, one asset or one CTA. Project descriptions get a case-study treatment (problem, approach, outcome) rather than a dense spec dump. Long project lists get a real UI (cards, filterable grid, featured + "view all") rather than a bare bulleted list.

**Copy voice.** Words are interface, not decoration — write from the visitor's side of the screen ("View the project," not "Explore my portfolio piece"). Plain, active, specific language beats clever wordplay; concrete verbs beat "elevate / seamless / unleash." No em-dashes anywhere in shipped copy — use a period, comma, or restructure the sentence. No filler eyebrows or micro-labels that don't carry real information (no `01 / Work`, no `Portfolio · 2026`).

**Images.** Real project screenshots, real photography, or generated assets — never a div-built fake screenshot or a hand-drawn placeholder icon standing in for actual work. If a real asset genuinely isn't available yet, leave an explicit, labeled placeholder and say so rather than papering over it with decoration.

---

## 4. Engineering Standards

**Stack defaults** (deviate only if the project already commits to something else): React/Next.js with Server Components by default; Tailwind (latest major) for styling; Motion (`motion/react`) for UI-level animation, GSAP+ScrollTrigger only for genuine scroll-hijack/pin work, never both in the same component tree. Self-host fonts via `next/font` or `@font-face` with `font-display: swap` — no runtime Google Fonts `<link>` tags.

**Client/server boundary.** Server Components render static layout. Anything touching motion values, scroll listeners, or pointer tracking is an isolated leaf component with `'use client'` at the top.

**State discipline.** Local `useState`/`useReducer` for isolated UI only. Never drive continuous values (scroll position, pointer coordinates, drag physics) through React state — use Motion's `useMotionValue`/`useTransform`/`useScroll`, or the animation library's native primitives. `window.addEventListener('scroll', ...)` and raw `requestAnimationFrame` loops touching state are both banned; use `IntersectionObserver`, `useScroll()`, or CSS scroll-driven animations instead.

**Icons.** One icon library for the whole project (Phosphor, HugeIcons, Radix Icons, or Tabler, in that preference order). Never hand-roll SVG icon paths.

**Responsiveness.** Standard breakpoints (`sm/md/lg/xl/2xl`), content contained to a sane max-width, CSS Grid over flexbox percentage math for multi-column layouts. Full-height hero sections use `min-h-[100dvh]`, never `h-screen`, to avoid mobile viewport jump. Every high-variance desktop layout has an explicit, stated mobile collapse — not an assumption that Tailwind "handles it."

**CSS specificity hygiene.** Watch for selectors that cancel each other out — a type-based section selector fighting an element-based CTA selector is a common source of broken spacing. Keep spacing/padding rules predictable and traceable to one source per element.

**Dependency honesty.** Check what's already installed before importing a new package; state the install command rather than assuming a library is present.

---

## 5. Accessibility & Performance

These are floor requirements, not stretch goals, for a site whose entire purpose is to be judged favorably and quickly by strangers.

- Animate only `transform` and `opacity` for anything performance-sensitive; never `top`/`left`/`width`/`height`.
- Full `prefers-reduced-motion` support: every non-trivial animation has a static/instant fallback.
- Dark mode is a first-class target, not an afterthought — respect `prefers-color-scheme`, maintain WCAG AA contrast in both modes, no pure `#000`/`#fff`.
- Every CTA and form field passes a real contrast check — no white-on-white buttons, no low-contrast placeholder-as-label patterns.
- Keyboard navigation and visible focus states work across the whole page, including any custom nav or card interactions.
- Target Core Web Vitals: LCP < 2.5s (hero image preloaded/prioritized), INP < 200ms, CLS < 0.1 (reserve space for images and embeds up front). Run a Lighthouse pass before calling any page done.
- Lazy-load anything below the fold that isn't cheap; be deliberate about bundle weight from animation and 3D libraries.

---

## 6. Before Calling Anything Done

Walk this list on every page or section before it ships:

1. Can a first-time visitor state who this person is and what to do next within 5 seconds of landing?
2. Is there exactly one primary CTA per intent (view work / get resume / contact), worded identically everywhere it appears?
3. Does the hero fit the initial viewport with the CTA visible, no scroll required?
4. Is there one locked accent color, one corner-radius system, and one theme (light/dark/auto) for the entire page?
5. Does every animation have a one-sentence justification, and does everything above a light touch respect reduced-motion?
6. Do all interactive elements have hover, focus, active, loading, and error states where relevant?
7. Are project/work images real (screenshots, photography, or generated), never div-built fakes?
8. Has every visible string been re-read for grammatical soundness, filler language, and stray em-dashes?
9. Does the page hold up on mobile with an explicit, tested collapse — and pass a Lighthouse check for Core Web Vitals?
10. Is there exactly one design/animation library doing each job, with nothing hand-rolled that a library already solves well?

If any answer is no, the work isn't finished — fix it before moving on.
