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
    page.tsx                  sticky two-column layout (xl:mx-auto xl:max-w-350)
    work/[slug]/page.tsx      project/case study detail page
    components/
      Navbar.tsx              fixed top, logo | NavDropdown | LanguageSwitcher
      NavDropdown.tsx         IntersectionObserver section tracking
      LanguageSwitcher.tsx    swaps locale prefix in pathname
      ProfileSidebar.tsx      sticky card: photo, name, card_bio, social icons
      ScrollProgress.tsx      fixed top indigo bar, z-60
      ScrollDownCue.tsx       mobile-only scroll button
      Hero.tsx                id="home", title + tagline + CTA buttons + stats
      Work.tsx                id="work", image-aware cards, locale prop, click → /[locale]/work/[slug]
      Testimonials.tsx        id="testimonials", quote cards, bg-zinc-50
      Services.tsx            id="services", service cards with icon in indigo-50 box
      Process.tsx             id="process", numbered steps
      About.tsx               id="about", bio + fun fact cards
      Contact.tsx             id="contact", form + social links
public/
  profile.jpg                 profile photo
  hero-img.jpg                hero background (opacity-25, object-top)
  og-image.png                OG image 1200×630
```

## Layout (page.tsx)

```tsx
<div className="pt-14 md:flex md:min-h-screen xl:mx-auto xl:max-w-350">
  <aside className="hidden md:flex md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-88 ...">
    <ProfileSidebar />
  </aside>
  <main className="min-w-0 flex-1">
    {/* mobile: full-screen profile card */}
    <div className="xl:max-w-4xl 2xl:max-w-5xl">
      <Hero />
      <Work locale={locale} />
      <Testimonials />
      <Services />
      <Process />
      <About />
      <Contact />
    </div>
  </main>
</div>
```

## Sections

| Section      | id             | Nav label  | Notes                                 |
| ------------ | -------------- | ---------- | ------------------------------------- |
| Hero         | `home`         | Home       | Title + tagline + CTA buttons + stats |
| Work         | `work`         | Work       | Image-aware cards, slug-based pages   |
| Testimonials | `testimonials` | —          | Quote cards, bg-zinc-50, not in nav   |
| Services     | `services`     | Services   | Icon + title + short description      |
| Process      | `process`      | _optional_ | Numbered steps (not in navbar)        |
| About        | `about`        | About      | Bio paragraphs + fun facts            |
| Contact      | `contact`      | Contact    | Form + social links                   |

Nav tracks: `home, work, services, about, contact`. Process is not tracked.

## Design Tone

- **Accent**: `indigo-600` — trustworthy, professional, client-facing
- **Background**: `#fafafa` — clean white, non-technical clients
- **Personality**: clean, professional, conversion-focused — targeted at local businesses
- **Hero tagline**: position around results (websites that convert, brands that resonate)

## Design Patterns

- **Two-tone title**: line1 `text-zinc-900`, line2 `text-zinc-200`, both `font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem]`, in `motion.div leading-none mb-12`
- **Section padding**: `px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32`
- **Scroll animations**: `useInView(ref, { once: true, margin: "-80px" })`
- **Stagger**: lift `inView` to parent, pass as prop; children use `delay: index * 0.12`
- **Cards**: `border border-zinc-100 bg-white shadow-sm hover:shadow-md` — light, clean
- **Tag pills**: `TAG_COLORS` array (indigo/blue/emerald/amber/rose/cyan) `bg-*-50 text-*-700`
- **Project cards**: click navigates via `useRouter().push()`, inner links use `e.stopPropagation()`
- **About bio**: multi-paragraph, split on `\n\n` in component

## Dictionary Shape

```json
{
  "nav": { "home", "work", "services", "about", "contact" },
  "hero": {
    "name": "João Guimarães",
    "card_bio": "Web Designer · Developer · Marketing Strategist · Available for Freelance",
    "title_line1": "WEB DESIGN",
    "title_line2": "& MARKETING",
    "tagline": "...",
    "stats": [
      { "value": "+X", "label": "Websites Launched" },
      { "value": "+X", "label": "Happy Clients" },
      { "value": "+X", "label": "Years Experience" }
    ]
  },
  "work": {
    "title_line1": "SELECTED",
    "title_line2": "WORK",
    "cta": "See all projects",
    "projects": [
      {
        "slug": "project-slug",
        "title": "Project Title",
        "description": "Short description",
        "long_description": "...",
        "image": null,
        "images": [],
        "tags": ["Web Design", "Branding", "SEO"],
        "live": null,
        "github": null
      }
    ]
  },
  "services": {
    "title_line1": "WHAT I",
    "title_line2": "OFFER",
    "items": [
      { "icon": "🖥️", "title": "Web Design & Development", "description": "..." },
      { "icon": "🎨", "title": "Branding & Visual Identity", "description": "..." },
      { "icon": "📈", "title": "SEO & Digital Marketing", "description": "..." },
      { "icon": "📱", "title": "Social Media Strategy", "description": "..." }
    ]
  },
  "process": {
    "title_line1": "HOW I",
    "title_line2": "WORK",
    "steps": [
      { "number": "01", "title": "Discover", "description": "..." },
      { "number": "02", "title": "Design", "description": "..." },
      { "number": "03", "title": "Build", "description": "..." },
      { "number": "04", "title": "Launch", "description": "..." }
    ]
  },
  "about": {
    "title_line1": "ABOUT",
    "title_line2": "ME",
    "bio": "Multi-paragraph bio separated by \\n\\n",
    "fun_facts": [{ "emoji": "☕", "text": "..." }]
  },
  "contact": {
    "title_line1": "LET'S",
    "title_line2": "TALK",
    "body": "...",
    "form_name": "Name",
    "form_email": "Email",
    "form_message": "Message",
    "form_name_placeholder": "Your Name",
    "form_email_placeholder": "your@email.com",
    "form_message_placeholder": "Tell me about your project...",
    "form_submit": "Send Message",
    "form_success": "Message sent! I'll get back to you soon.",
    "email_label": "Email me",
    "email": "Jssgmrs22@gmail.com",
    "github": "https://github.com/JoaoGuimaraes22",
    "linkedin": "https://www.linkedin.com/in/joão-sebastião-guimarães-4abaa7197/"
  }
}
```

## SEO

- `generateMetadata` in `[locale]/layout.tsx`
- JSON-LD Person schema — focus keywords: web designer, web developer, digital marketing
- Language alternates: `en` → `/en`, `pt` → `/pt`

## Tailwind v4

- `bg-linear-to-br` not `bg-gradient-to-br`
- `bg-white/3` not `bg-white/[0.03]`
- `md:w-88`, `z-60`, `max-w-350` (no arbitrary values)

## Known Gotchas

- `params` must be `Promise<{ locale: string }>`, not `Locale` directly
- Framer Motion ease with variants → type errors; use `ease: [0.16, 1, 0.3, 1] as const` inline
- `React.FormEvent` deprecated in React 19 — use `{ preventDefault(): void }`
- ScrollProgress `z-60` (above Navbar `z-50`)
- `app/page.tsx` must export a default or build fails

## Bootstrap Commands

```bash
npx create-next-app@latest my-design-portfolio \
  --typescript --tailwind --app --src-dir=no \
  --import-alias "@/*"
cd my-design-portfolio
npm install framer-motion
```

Then copy over from the existing portfolio:

- `proxy.ts`
- `i18n-config.ts`
- `get-dictionary.ts`
- `app/[locale]/components/ScrollProgress.tsx`
- `app/[locale]/components/LanguageSwitcher.tsx`
- `app/[locale]/components/NavDropdown.tsx`
- Update accent color `blue-500` → `violet-500` globally

```

```
