# Portfolio — Web Design · Development · Marketing

Next.js 16.1.6 App Router · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion

## Stack & Config

- **Middleware**: `proxy.ts` (NOT `middleware.ts`)
- **i18n**: `i18n-config.ts` + `get-dictionary.ts` + `dictionaries/en.json` + `dictionaries/pt.json`. Locales: `en` (default), `pt`. Export: `i18n.locales`, not `locales`.
- **params type**: `params: Promise<{ locale: string }>` with `(await params) as { locale: Locale }` cast
- **Fonts**: Geist Sans / Geist Mono · **BG**: `#fafafa` · **Accent**: `indigo-600`
- **Site URL**: `https://your-domain.vercel.app`
- **Real contacts**: email `Jssgmrs22@gmail.com`, GitHub `JoaoGuimaraes22`, LinkedIn `joão-sebastião-guimarães-4abaa7197`

## File Structure

```files
proxy.ts                      middleware (locale redirect)
i18n-config.ts                locales + Locale type
get-dictionary.ts             lazy JSON loader
dictionaries/en.json / pt.json
app/
  page.tsx                    redirects → /en
  robots.ts / sitemap.ts
  layout.tsx                  minimal shell
  [locale]/
    layout.tsx                generateMetadata (OG/Twitter/JSON-LD), ScrollProgress
    page.tsx                  HeroFull + sidebar layout (no pt-14 wrapper)
    work/[slug]/
      page.tsx                project detail page (server component)
      ScreenshotGallery.tsx   client component — infinite scroll gallery
    components/
      Navbar.tsx              CLIENT — transparent on hero, white when scrolled; passes scrolled prop down
      NavDropdown.tsx         IntersectionObserver section tracking; scrolled-aware button styles
      LanguageSwitcher.tsx    swaps locale prefix; scrolled-aware text colors
      ProfileSidebar.tsx      sticky card: photo, name, card_bio, social icons
      ScrollProgress.tsx      fixed top indigo bar, z-60
      HeroFull.tsx            CLIENT — full-viewport parallax hero (hero.jpg, Framer Motion useScroll)
      Work.tsx                id="work", image-aware cards, locale prop, click → /[locale]/work/[slug]
      Testimonials.tsx        id="testimonials", quote cards, bg-zinc-50
      Services.tsx            id="services", service cards with icon in indigo-50 box
      Process.tsx             id="process", numbered steps
      About.tsx               id="about", bio + fun fact cards
      Contact.tsx             id="contact", form + social links
public/
  profile.jpg                 profile photo
  hero.jpg                    full-viewport hero background (parallax, object-top)
  og-image.png                OG image 1200×630
  projects/
    cascais-volley.png        card thumbnail (+ others)
    cascaisvolley/1-5.png     mobile screenshot gallery (5 images per project)
    restaurant/1-5.png
    clinic/1-5.png
    plumber/1-5.png
    mechanic/1-5.png
    hairsalon/1-5.png
```

## Layout (page.tsx)

```tsx
<>
  {/* Full-viewport parallax hero — full width, no sidebar, navbar floats over it */}
  <HeroFull hero={dict.hero} />

  {/* Sidebar layout — starts after hero */}
  <div className="md:flex xl:mx-auto xl:max-w-350">
    <aside className="hidden md:flex md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-88 ...">
      <ProfileSidebar />
    </aside>
    <main className="min-w-0 flex-1">
      {/* mobile: full-screen profile card */}
      <div className="xl:max-w-4xl 2xl:max-w-5xl">
        <Work locale={locale} />
        <Testimonials />
        <Services />
        <Process />
        <About />
        <Contact />
      </div>
    </main>
  </div>
</>
```

Note: NO `pt-14` on the outer wrapper — the navbar is fixed and floats over HeroFull. The sidebar `md:sticky md:top-14` keeps content below the navbar after the hero.

## Sections

| Section      | id             | Nav label | Dict key    | Notes                               |
| ------------ | -------------- | --------- | ----------- | ----------------------------------- |
| Hero         | `home`         | Home      | `home`      | Full-viewport parallax (HeroFull)   |
| Work         | `work`         | Work      | `work`      | Image-aware cards, slug-based pages |
| Testimonials | `testimonials` | Reviews   | `reviews`   | Quote cards, bg-zinc-50             |
| Services     | `services`     | Services  | `services`  | Icon + title + short description    |
| Process      | `process`      | Workflow  | `workflow`  | Numbered steps                      |
| About        | `about`        | About     | `about`     | Bio paragraphs + fun facts          |
| Contact      | `contact`      | Contact   | `contact`   | Form + social links                 |

All 7 sections are tracked by NavDropdown IntersectionObserver.

## HeroFull

Client component. Full-viewport parallax hero rendered **outside** the sidebar layout.

- `hero.jpg` as `<motion.img>` with `h-[130%] object-top`, `y` driven by `useScroll({ offset: ["start start", "end start"] })` → `useTransform([0,1], ["0%", "20%"])`
- Gradient overlay: `bg-linear-to-t from-zinc-900/90 via-zinc-900/50 to-zinc-900/10`
- Content bottom-left: title (white / white/25), tagline, CTAs, stats — entry animations
- Scroll cue: bouncing chevron at bottom center
- Dict fields used: `title_line1`, `title_line2`, `tagline`, `cta`, `cta_secondary`, `stats`

## Navbar (scroll-aware)

Client component. Scroll threshold: `window.scrollY > window.innerHeight * 0.8`.

| State       | Header bg                                      | Logo            | NavDropdown button              |
| ----------- | ---------------------------------------------- | --------------- | ------------------------------- |
| Transparent | `bg-transparent border-white/10`               | `text-white/90` | `border-white/20 text-white/80` |
| Scrolled    | `bg-white/90 backdrop-blur-md border-zinc-100` | `text-zinc-900` | `border-zinc-200 text-zinc-600` |

`scrolled` prop flows to `NavDropdown` and `LanguageSwitcher`.

## ScreenshotGallery (`work/[slug]/ScreenshotGallery.tsx`)

Client component. Receives `images: string[]` + `title: string`.

- Triples the array for seamless infinite scroll; starts `scrollLeft` at middle set
- **Init**: double-rAF (`rAF → rAF → measure`) — single rAF is too early for flex layout
- **Measurement**: stride = `second.getBoundingClientRect().left - first.getBoundingClientRect().left`
- **Reset**: silently teleports `scrollLeft` ±`singleSetWidth` when reaching set edges; suppressed during arrow smooth-scroll via `suppressResetRef` + 450ms timeout
- **Arrows** (desktop only, `hidden md:flex`): `scrollBy(±stride, smooth)`; pre-teleports if crossing set boundary
- **Dots**: always visible; clicking navigates to `ssw + index * stride`
- **Mobile** (`w-full`): 1 image per view · **Desktop** (`md:w-[calc((100%-2rem)/3)]`): 3 images visible
- `snap-x snap-mandatory` + `snap-start` per item · `scrollbar-none`

## Work Detail Page (`work/[slug]/page.tsx`)

Server component. Reads project from dictionary by slug. Renders:

1. Back link → `/${locale}#work`
2. Tag pills
3. Title + description quote (`border-l-4 border-indigo-200`)
4. `<ScreenshotGallery>` (if `project.images` has entries)
5. `long_description` paragraphs (split on `\n\n`)
6. Live / GitHub buttons

`generateStaticParams` pre-generates all 12 routes (6 projects × 2 locales).

## Projects (6 live)

| Slug               | Title                     | Folder           | Live                              |
| ------------------ | ------------------------- | ---------------- | --------------------------------- |
| `cascais-volley`   | Cascais Volley Cup        | `cascaisvolley/` | cascaisvolley.com                 |
| `koya-bistro`      | Koya's Bistro             | `restaurant/`    | koya-bistro.vercel.app            |
| `sorriso-plus`     | SorrisoPlus Dental Clinic | `clinic/`        | dentist-flax-psi.vercel.app       |
| `aquafix`          | AquaFix Plumbing          | `plumber/`       | plumber-xi.vercel.app             |
| `revicar`          | Revicar Auto Repair       | `mechanic/`      | mechanic-five.vercel.app          |
| `bella-hair-salon` | Bella Hair Salon          | `hairsalon/`     | hair-salon-omega-taupe.vercel.app |

Note: folder names under `public/projects/` do not always match slugs (e.g. `hairsalon/` → slug `bella-hair-salon`).

## Design Tone

- **Accent**: `indigo-600` — trustworthy, professional, client-facing
- **Background**: `#fafafa` — clean white, non-technical clients
- **Personality**: clean, professional, conversion-focused — targeted at local businesses

## Design Patterns

- **Two-tone title** (sidebar layout sections): line1 `text-zinc-900`, line2 `text-zinc-200`, both `font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem]`, in `motion.div leading-none mb-12`
- **Two-tone title** (HeroFull, dark bg): line1 `text-white`, line2 `text-white/25`, larger `xl:text-[8rem]`
- **Section padding**: `px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32`
- **Scroll animations**: `useInView(ref, { once: true, margin: "-80px" })`
- **Stagger**: lift `inView` to parent, pass as prop; children use `delay: index * 0.12`
- **Cards**: `border border-zinc-100 bg-white shadow-sm hover:shadow-md` — light, clean
- **Tag pills**: `TAG_COLORS` array (indigo/blue/emerald/amber/rose/cyan) `bg-*-50 text-*-700`
- **Project cards**: click navigates via `useRouter().push()`, inner links use `e.stopPropagation()`

## Dictionary Shape

```json
{
  "nav": { "home", "work", "reviews", "services", "workflow", "about", "contact" },
  "hero": {
    "name": "João Guimarães",
    "card_bio": "...",
    "title_line1": "WEB DESIGN",
    "title_line2": "& MARKETING",
    "tagline": "...",
    "cta": "Start a Project",
    "cta_secondary": "See My Work",
    "stats": [{ "value": "+X", "label": "..." }]
  },
  "work": {
    "title_line1": "SELECTED", "title_line2": "WORK", "cta": "See all projects",
    "projects": [{
      "slug": "project-slug", "title": "...", "description": "...",
      "long_description": "Multi-paragraph. Split on \\n\\n.",
      "image": "/projects/thumbnail.png",
      "images": ["/projects/folder/1.png", "...5 total"],
      "tags": ["Web Design", "Development", "Industry"],
      "live": "https://...", "github": null
    }]
  },
  "services": { "title_line1", "title_line2", "items": [{ "icon", "title", "description" }] },
  "process":  { "title_line1", "title_line2", "steps": [{ "number", "title", "description" }] },
  "about":    { "title_line1", "title_line2", "bio": "split on \\n\\n", "fun_facts": [{ "emoji", "text" }] },
  "contact":  { "title_line1", "title_line2", "body", "form_name", "form_email", "form_message",
                "form_name_placeholder", "form_email_placeholder", "form_message_placeholder",
                "form_submit", "form_success", "email_label", "email", "github", "linkedin" }
}
```

## SEO

- `generateMetadata` in `[locale]/layout.tsx`
- JSON-LD Person schema — focus keywords: web designer, web developer, digital marketing
- Language alternates: `en` → `/en`, `pt` → `/pt`

## Tailwind v4

- `bg-linear-to-br` not `bg-gradient-to-br`
- `bg-white/3` not `bg-white/[0.03]`
- `md:w-88`, `z-60`, `max-w-350` (no arbitrary values for these)
- Arbitrary calc: `w-[calc((100%-2rem)/3)]` — no underscores needed (linter enforces this)

## Known Gotchas

- `params` must be `Promise<{ locale: string }>`, not `Locale` directly
- Framer Motion ease with variants → type errors; use `ease: [0.16, 1, 0.3, 1] as const` inline
- `React.FormEvent` deprecated in React 19 — use `{ preventDefault(): void }`
- ScrollProgress `z-60` (above Navbar `z-50`)
- `app/page.tsx` must export a default or build fails
- Project image folder names don't always match slugs — see Projects table above
- Navbar is now a client component (`"use client"`) — do not make it a server component again
- HeroFull is outside the sidebar layout — `id="home"` lives there, not in a section inside `<main>`
- ScreenshotGallery: use double-rAF for init; suppress resets during smooth scroll (suppressResetRef)
