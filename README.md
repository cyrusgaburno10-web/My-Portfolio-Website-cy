# Cyrus Gaburno: AI-Native Portfolio (Portal Edition)

A single scrolling page with a persistent AI chat sidebar: instead of the chat being the whole app, it rides alongside seven sections (Process, Services, Tools, Projects, Credentials, Contact, Book a Call) so visitors can either read or ask. The header nav tracks scroll position and highlights whichever section is on screen, and clicking a nav item smooth-scrolls to it rather than loading a new page. The whole thing sits in front of an original digital-rain background: columns of automation/n8n-flavored icons (webhook, database, workflow, bot, and so on) falling in the site's own indigo/periwinkle/sky palette instead of Matrix-style green code, brightening and speeding up the deeper the conversation goes.

## Stack

- Next.js 16 (App Router) + TypeScript
- Vercel AI SDK (`ai` v7) for streaming chat, with Groq (Llama 3.3 70B) as the primary model and OpenAI (gpt-4o-mini) as an automatic fallback
- Motion (`motion/react`, the current package for what used to be Framer Motion) for entrance transitions
- Tailwind CSS v4, tokens defined in `app/globals.css`
- `lucide-react` for icons
- `react-markdown` + `remark-gfm` for formatted chat replies
- Self-hosted fonts via `next/font`: Fraunces (display), Space Grotesk (UI/body), IBM Plex Mono (labels/badges)

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with at least one provider key:

- `GROQ_API_KEY` — primary. Get one at https://console.groq.com/keys. Model defaults to `llama-3.3-70b-versatile`; if Groq has since retired that model too, set `GROQ_MODEL` to whatever's current (check https://console.groq.com/docs/models).
- `OPENAI_API_KEY` — fallback, used automatically whenever `GROQ_API_KEY` isn't set. Model defaults to `gpt-4o-mini`.

```bash
npm run dev
```

Open http://localhost:3000.

## Sections & layout

`components/layout/AppShell.tsx` is the root client component (mounted once in `app/layout.tsx`) that owns the single `useChat()` instance, the background's engagement/phase state, and renders three things around `{children}`: the fixed `PortalBackground`, the top `Header` nav, and the `ChatSidebar`.

There's exactly one route (`/`, `app/page.tsx`), composed from seven section components under `components/sections/`, each a plain Server Component wrapped in `PageContainer` with a stable `id`:

| Section id | Component |
|---|---|
| `process` | `ProcessSection` — hero, stats, a featured case study, and the six-stage build process (doubles as the page's `<h1>`) |
| `services` | `ServicesSection` |
| `tools` | `ToolsSection` |
| `projects` | `ProjectsSection` (full grid, six cards, each opening a case study modal) |
| `credentials` | `CredentialsSection` |
| `contact` | `ContactSection` (also has the resume download) |
| `book-a-call` | `BookACallSection` |

`components/layout/PageContainer.tsx` renders each as a `<section id="..." className="scroll-mt-32 border-t border-line">` — the hairline divider separates sections in the long scroll, `scroll-mt-32` keeps the sticky header from covering a section's top when you jump to it, and the id is what both the header nav and in-page links (`href="#projects"`, etc.) target. `ProcessSection` passes `divider={false}` since it's first and sits directly under the header. Every `PageHeader` in a section (except the hero's own `<h1>`) is rendered `as="h2"` so the page keeps exactly one `<h1>`.

**Scrollspy:** `lib/use-active-section.ts` runs one `IntersectionObserver` over all seven section elements with a `rootMargin` that treats a thin band just below the sticky header as the "active" zone, so `Header.tsx` can highlight whichever section is currently there. On the mobile scrollable tab row, the active tab also auto-scrolls itself into view (`scrollIntoView({ inline: 'center' })`) so the highlight is never scrolled off-screen.

**The sidebar itself:** `SIDEBAR_WIDTH` (400px) on desktop (`lg:` and up), sticky and always visible, with a collapse toggle that shrinks it to a 56px icon rail. Below `lg`, it becomes a full-screen slide-over drawer opened by a floating action button (bottom-right) and closed by its own X button or backdrop tap. Sending a message from the drawer keeps it open so the reply is visible.

**Case studies:** clicking a project card (or its hover overlay) opens `components/CaseStudyModal.tsx` — a Challenge/Solution breakdown plus a numbered "How It's Built" list of the workflow's actual steps, both sourced from `lib/projects.ts` (`challenge` and `howItsBuilt` fields, one entry per project, written from the real screenshots rather than invented). The modal only ever mounts after a click, so unlike `PortalBackground`/`AvatarSlot` it's never part of the server-rendered HTML and can safely use `useReducedMotion()` to gate its own entrance animation without any hydration risk.

**A sticky-positioning bug worth knowing about:** `overflow-x: hidden` on `html`/`body` (added earlier to stop the off-canvas mobile chat drawer from causing horizontal scroll) silently breaks `position: sticky` for every descendant, including the header. Setting `overflow-x` on one axis forces the browser to compute the other axis as `auto`, which turns `body` into its own scroll container and detaches sticky descendants from the real viewport. Confirmed with Puppeteer (`header.getBoundingClientRect().top` scrolled off to `-5026` instead of staying at `0`) before fixing it — the fix is `overflow-x: clip` instead of `hidden`, which blocks the same horizontal bleed without creating a scroll container.

## How the chat works

`app/api/chat/route.ts` streams replies via `streamText`, injecting `SYSTEM_PROMPT` from `lib/prompt.ts` (kept verbatim, not summarized). A `showProjects` tool is registered so that whenever the model decides the visitor wants to see Cyrus's work, it triggers `ProjectMiniList` (`components/ProjectCard.tsx`, data in `lib/projects.ts`): three featured cards plus a "View all 6 projects" link to `#projects`. It renders compact on purpose — the sidebar is 400px wide, not a full page, so the full two-column `ProjectGrid` (used in `ProjectsSection`) would be cramped there.

Two non-obvious things this needed, both discovered by testing live against Groq/Llama rather than assuming: the tool's input schema can't be a bare empty object (`z.object({})`) — Groq's Llama tool-calling reliably fails to produce parseable arguments for a zero-property schema, so `showProjects` takes a throwaway `reason` string just to give it something to emit. And `streamText` defaults to `stopWhen: stepCountIs(1)`, so without explicitly passing `stopWhen: stepCountIs(5)`, the model would call the tool and then stop dead instead of following up with the intro sentence the tool description asks for.

The background's "engagement" score is just `message count / 12`, clamped to 1 — it drives opacity and how fast the icon columns fall (`components/PortalBackground.tsx`). Each of the 18 columns is an independently-seeded, endlessly-looping trail (bright head icon fading through four dimmer ones before a gap) built once with `lib/portal-math.ts`'s deterministic `seededRandom`, not `Math.random()`, so server and client render the exact same layout. While a reply is pending, the whole field gets a distinct flicker (`phase: 'thinking'`) that doubles as the loading indicator; while it's streaming, the columns fall faster and the avatar's floating nodes drift faster too (`phase: 'streaming'`).

Every animation in `PortalBackground.tsx` and `AvatarSlot.tsx` is applied unconditionally in the inline `style`, never gated behind a `useReducedMotion()` check in JS — the server has no way to know a client's `prefers-reduced-motion` preference, and branching on it in render output causes a real SSR hydration mismatch (confirmed by testing with Puppeteer's `prefers-reduced-motion: reduce` emulation, not just assumed). Instead each animated element carries a marker class (`rain-column-strip`, `rain-thinking-flicker`, `avatar-glow-pulse`, `avatar-node-drift`), and a single `@media (prefers-reduced-motion: reduce)` block in `globals.css` turns them off with `animation: none !important`. Same accessibility outcome, zero hydration risk.

## Assets

All real project screenshots live in `public/projects/`, wired up via the `image` field on each entry in `lib/projects.ts`:

- `asana-crm-workflow.png` — the Zapier canvas for the Asana CRM lead engagement Zap
- `asana-crm-n8n-workflow.png` — the n8n rebuild of that same workflow
- `drive-auto-sort-workflow.png` — the Document Auto-Sorter n8n canvas
- `finance-tracker-workflow.png` — the Personal Finance Tracker n8n canvas
- `lead-management-workflow.png` — the Lead Management/Enrichment n8n canvas
- `voice-receptionist-workflow.png` — the AI Voice Receptionist n8n canvas

All six were cropped before going in: the n8n screenshots had n8n's own GitHub star count baked into the top chrome (not a metric of the workflow itself), and one original screenshot was a full desktop capture that exposed the browser URL bar and OS chrome. Both are cropped out now — if you add more screenshots later, keep them to just the workflow canvas.

Real certificates live in `public/credentials/`, wired up via `components/sections/CredentialsSection.tsx`. Each card links out to the full-size image in a new tab. All five are PNGs so every card gets a real thumbnail (`zapier-certificate.png`, `n8n-certificate.png`, `make-certificate.png`, `prompt-engineering-certificate.png`, `gohighlevel-certificate.png`). The Make one arrived as a PDF (`make-certificate.pdf`, kept in the same folder for reference) and was rasterized with `pdftoppm -png -r 200` to match the resolution of the other four rather than showing a plain document-icon placeholder.

`public/resume/Cyrus-Gaburno-Resume.pdf` is wired to both "Resume (PDF)" download buttons.

## Deploy

### Vercel

No `vercel.json` needed — Vercel auto-detects the Next.js App Router project. Push to a connected repo, or run:

```bash
npx vercel
```

Set `GROQ_API_KEY` (and/or `OPENAI_API_KEY`) as environment variables in the Vercel project settings. The chat route runs on the Edge runtime (`export const runtime = 'edge'` in `app/api/chat/route.ts`), which Vercel supports natively.

### Render

Render doesn't run Next.js Edge runtime functions the way Vercel does — either switch `export const runtime = 'edge'` to `'nodejs'` in `app/api/chat/route.ts` before deploying there, or deploy as a standard Node web service:

1. Build command: `npm install && npm run build`
2. Start command: `npm start`
3. Add `GROQ_API_KEY` / `OPENAI_API_KEY` under Environment.

## Accessibility & motion

Every animated piece (rain-column fall, thinking flicker, avatar glow pulse, avatar node drift, click ripple) respects `prefers-reduced-motion` and falls back to a static render at the current engagement level — no motion is lost information, just stillness.
