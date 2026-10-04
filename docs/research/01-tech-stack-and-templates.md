# Wedding Invitation Website: Tech Stack & Templates Research

**Research Date:** October 2, 2026  
**Reference:** [myshaadhilink.in](https://myshaadhilink.in/invitation/christian-elegance?to=Guest&demo=true) - Indian wedding e-invite SaaS

## Executive Summary

Premium digital wedding invitation websites are typically built as single-page scrolling applications with envelope/intro animations, couple names, event details, countdown timers, photo galleries, RSVP, embedded maps, and guest name personalization via URL query parameters. They prioritize mobile-first design, manual RSVP via WhatsApp (India), or form backends. Most use React/Next.js with Framer Motion for animations, Tailwind CSS for styling, and deploy free to Vercel/Netlify/Cloudflare Pages.

---

## 1. Open-Source GitHub Repositories

### High-Star Projects

#### **1.1 Sakeenah (207 stars, 44 forks)**
- **URL:** https://github.com/mrofisr/sakeenah
- **Type:** Full-stack multi-tenant wedding invitation platform
- **Tech Stack:**
  - Frontend: React 19 + Vite
  - Backend: Hono (edge API framework)
  - Styling: Tailwind CSS v4
  - Animation: Motion library
  - Database: PostgreSQL
  - Deployment: Cloudflare Workers
  - Package Manager: Bun
- **Features:**
  - Guest management with individualized invitation links
  - Real-time wish collection and RSVP tracking
  - Motion animations, countdown timers
  - Google Maps integration
  - Digital envelope functionality
  - Audio integration
  - Multi-tenant architecture (unlimited weddings per deployment)
- **License:** Apache 2.0
- **Last Updated:** Feb 6, 2026
- **Notable:** Most mature open-source offering with production-ready deployment pattern

#### **1.2 Undangan Digital (Indonesian) - 727 stars, 446 forks**
- **Bootstrap-based template** with vanilla JavaScript
- **Tech Stack:**
  - HTML5/CSS3/Vanilla JavaScript
  - Bootstrap for responsive design
  - AOS (Animate On Scroll) for scroll animations
  - Font Awesome icons
  - Canvas Confetti for celebration effects
  - Google Fonts
- **Features:**
  - Responsive design
  - Scroll-triggered animations
  - Confetti celebrations
  - Traditional structure
- **URL Reference:** https://github-redirect.dependabot.com/topics/undangan-digital
- **Notable:** Large Indonesian community engagement; popular baseline template

#### **1.3 Wedding RSVP Project**
- **URL:** https://github.com/gazdagb/wedding-rsvp (2 stars)
- **Description:** Simple, stylish mobile-friendly RSVP web app
- **Tech:** Tailwind CSS
- **Notable:** Clean example of minimal wedding RSVP functionality

### Mid-Size Projects & Templates on Lovable.dev

Lovable.dev hosts several wedding templates built with React + TypeScript + Tailwind CSS:

#### **Evermore (Monochrome Wedding Site)**
- **Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Embla Carousel, Vaul
- **Features:**
  - Conditional RSVP form with guest count options
  - Polaroid photo layouts
  - Multi-page event structure (ceremony, reception, hotel details, registry)
  - Scroll-triggered animations
  - Responsive design
- **URL:** https://lovable.dev/en/templates/websites/events/evermore-elegant-wedding-invitation-template

#### **Sage Wedding Invite**
- **Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Embla Carousel, Recharts
- **Features:**
  - Animated RSVP form (adjusts based on guest responses)
  - Multi-page layout with love story, details, and RSVP
  - Hotel details page
  - Scroll-triggered animations
  - Responsive design

#### **Juniper Desert Wedding Template**
- **Stack:** React, Embla Carousel
- **Features:**
  - Live countdown timer
  - Masonry photo gallery
  - Desert/earthy aesthetic
- **URL:** https://lovable.dev/pt-br/templates/websites/events/juniper-desert-wedding-website-template

### Astro Templates

#### **Forever Astro Theme**
- **URL:** https://astro.build/themes/details/forever/
- **Stack:** Astro (static site generation)
- **Features:**
  - Live countdown from wedding date
  - Scroll-driven image crossfade through event timeline
  - Pure static file output
  - Free hosting on Vercel/Netlify/GitHub Pages
  - Minimal JavaScript

### Modern Next.js Templates (Paid/Gumroad)

#### **Modern Wedding Website Kit**
- **URL:** https://jaackevans.gumroad.com/l/iyqek
- **Stack:** Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Features:**
  - Polaroid-style photo gallery
  - Simple RSVP system with email notifications
  - Mobile-responsive
  - Free deployment on Vercel (5-minute setup)
  - Fully customizable
- **Price:** Paid template on Gumroad

### WordPress Plugin

#### **WeddingBlocks (GPL v2)**
- **URL:** https://wordpress.org/plugins/weddingblocks/
- **Description:** Gutenberg block plugin for WordPress-based wedding invitations
- **Features:**
  - 10+ custom Gutenberg blocks
  - RSVP form with database logging
  - Guestbook for wishes
  - Music player with autoplay
  - Full Site Editing (FSE) support
  - Lightweight, zero external dependencies
  - i18n ready
- **Notable:** Zero-code approach for WordPress users

---

## 2. Tech Stack Patterns

### Frontend Frameworks

**Most Common Stack:**
```
React/Next.js 13-14
  + TypeScript
  + Tailwind CSS v3-v4
  + shadcn/ui (optional, for pre-built components)
  + Framer Motion (animations)
```

**Alternative (Lightweight):**
```
Astro (static generation)
  + Tailwind CSS
  + Vanilla JavaScript
  + No JavaScript in browser (static first)
```

**Monolith Stack:**
```
Vite + React
  + Bun (package manager)
  + Hono (edge backend)
  + Motion (animation library)
```

### Animation & Interaction Libraries

| Library | Use Case | Notes |
|---------|----------|-------|
| **Framer Motion** | Envelope open, scroll animations, page transitions | Standard choice for React; 24k+ GitHub stars |
| **Motion** | Declarative animations in edge functions | Lighter alternative; used in Sakeenah |
| **AOS (Animate On Scroll)** | Scroll-triggered element animations | Lightweight vanilla JS option |
| **Lottie** | Complex vector animations (rings, confetti, decorative) | Via LottieFiles; load from CDN or npm |
| **GSAP** | Performant timeline animations | Used less common than Framer Motion in this space |

**Envelope Animation Pattern:**
- Create envelope with CSS: zero-width/height div with transparent top border
- Apply `transform: rotateX(45deg)` for partially open effect
- Animate with Framer Motion: control `rotateX`, opacity, and transition
- Trigger on scroll or user tap
- Reference: [DEV Community: Make a Slide Open Envelope](https://dev.to/superoverflow/make-a-slide-open-envelope-oem)

### Photo Gallery Libraries

| Library | Carousel Type | Notes |
|---------|---------------|-------|
| **Embla Carousel** | Lightweight, headless carousel | Used in Lovable templates; ~2k stars |
| **Swiper** | Feature-rich slider with transitions | Parallax, fade, grid layouts; 39k+ stars |
| **Lightbox Modal** | Click photo to expand full-screen | Native HTML dialog or library-based |

**Gallery Pattern:**
- Grid (4-6 images) or masonry layout
- Click to open modal/lightbox
- Embla or Swiper for carousel in modals
- Lazy loading images for performance

### Countdown Timer

**Library:** `react-countdown` (npm)
```bash
npm install react-countdown --save
```
- **URL:** https://npmjs.com/package/react-countdown
- **Stats:** 775 GitHub stars, ~202k weekly npm downloads
- **Custom Renderer Prop:** Full control over display format (days, hours, minutes, seconds)
- **Alternative:** Vanilla JavaScript with `setInterval()`

### Add-to-Calendar Button

**Purpose:** Let guests add event to Google Calendar, Apple Calendar, Outlook, etc.

**Solutions:**
- **add-to-calendar-button library**: Web component with support for .ics export
- **Manual .ics generation**: Create iCalendar file on-the-fly
- **WedSites built-in:** Auto-generates when you set event date/time/venue

**Metadata Required:**
- Event date & time
- Venue address (for map link)
- Event name
- Timezone (important for international guests)

### CSS Viewport Units for Mobile

**Critical for Mobile-First Wedding Invitations:**

| Unit | Behavior | Use Case |
|------|----------|----------|
| `100vh` | Screen height including address bar | ❌ Causes overflow on mobile |
| `100svh` | Small viewport (always fits without scroll) | Fallback but less responsive |
| `100lvh` | Large viewport (bar retracted) | Legacy `100vh` equivalent |
| **`100dvh`** | ✅ **Dynamic viewport (current visible area)** | **Recommended for full-height sections** |

**Browser Support:** All modern browsers since 2023

**Example:**
```css
.hero-section {
  height: 100dvh;  /* Responsive to address bar visibility */
}
```

### Audio/Music on Wedding Sites

**Browser Autoplay Policy:**
- ❌ **Autoplay blocked** on mobile Safari and Chrome (user gesture required)
- ❌ **Mobile browsers** don't support auto-play for audio/video
- ✅ **Workaround:** "Tap to Play" button pattern

**Implementation Pattern:**
```javascript
// User must interact first (tap/click)
document.getElementById('playBtn').addEventListener('click', () => {
  audioElement.play();
});
```

**Muted Autoplay Trick:**
Some platforms allow `<audio autoplay muted>`, then unmute on user gesture:
```javascript
audioElement.muted = true;  // Autoplay allowed
// On user tap:
audioElement.muted = false;
audioElement.play();
```

**Alternative:** Use Spotify embed or OpenSpotify link instead of audio files

---

## 3. RSVP Backend Options

### Ranking by Simplicity & Cost

#### **Tier 1: Zero-Cost, No Coding Required**

**1. WhatsApp Deep Link (wa.me)**
- **Popularity:** Very common in India/Asia; viral for wedding invitations
- **Format:** `https://wa.me/PHONENUMBER?text=PREFILLED_MESSAGE`
- **Example:** `https://wa.me/919876543210?text=I%20will%20attend%20the%20wedding`
- **Guest Experience:** Click link → Opens WhatsApp → Message pre-filled → Send
- **Backend:** None (direct peer-to-peer)
- **Tracking:** Manual SMS/WhatsApp group monitoring
- **Pros:** 
  - No backend infrastructure
  - Guests already on WhatsApp
  - Natural conversation flow
- **Cons:** 
  - No automated guest database
  - Number visible in link
  - Manual tracking required
- **Best For:** Small intimate weddings; Asia-Pacific region

**2. Google Forms**
- **Cost:** Free (Google account required)
- **Setup:** 5 minutes
- **Features:** 
  - Automated response collection
  - Google Sheets integration (auto-populates)
  - Email notifications via Apps Script
  - Conditional logic for +1, dietary prefs, song requests
- **Tracking:** View responses in Google Forms or Google Sheets
- **Deployment:** Embed form in website via iframe or link to form
- **Pros:**
  - Fastest to set up
  - Familiar UI for guests
  - Built-in spreadsheet
- **Cons:**
  - Limited customization
  - Looks like a form, not embedded invitation
  - Not as elegant as custom form
- **Reference:** https://www.lido.app/forms/google-forms-wedding-rsvp

#### **Tier 2: Free/Cheap, Light Backend**

**3. Formspree**
- **Cost:** Free tier (unlimited submissions)
- **Setup:** Add `<form action="https://formspree.io/f/YOUR_ID" method="POST">`
- **Features:**
  - Spam protection
  - Email notifications to couple
  - File uploads (for photos)
  - 3rd-party integrations (Zapier, Slack)
- **Deployment:** HTML form on your website
- **Pros:**
  - Elegant custom form possible
  - No backend code needed
  - Email notifications built-in
- **Cons:**
  - Limited response analytics
- **Reference:** https://www.netlify.com/integrations/formspree

**4. Netlify Forms**
- **Cost:** Free tier with unlimited submissions (when hosted on Netlify)
- **Setup:** 2 minutes (if site on Netlify)
- **Features:**
  - Auto-wired to Netlify deployment
  - Email notifications
  - Bot filtering
  - CSV export
- **Deployment:** Netlify-hosted site only
- **Pros:**
  - Easiest if already on Netlify
  - No configuration needed
- **Cons:**
  - Vendor lock-in to Netlify hosting
  - Limited integrations vs. Formspree
- **Reference:** https://www.netlify.com/integrations/formspree/setup-guide.md

**5. Google Apps Script + Google Sheets**
- **Cost:** Free (Google account)
- **Setup:** 15-30 minutes
- **Architecture:**
  1. Custom HTML form on website
  2. Form submits to Google Apps Script web app endpoint
  3. Apps Script writes response to Google Sheet
  4. Apps Script sends email confirmation to guest + admin alert
- **Email Automation:** Built-in with `MailApp.sendEmail()`
- **Tracking:** Guest list live in Google Sheet
- **Pros:**
  - Fully customizable form UI
  - Email notifications on submission
  - Guest list always visible to couple
  - Can auto-send reminder emails to non-responders
- **Cons:**
  - Requires light scripting
  - Apps Script has quota limits (9-minute execution timeout)
- **Reference:** 
  - https://www.mintlify.com/rampatra/wedding-website/customization/rsvp-google-sheets
  - https://www.mintlify.com/letsparty20251025/letsparty20251025.github.io/backend/google-apps-script

#### **Tier 3: Managed Services (Paid, Full-Featured)**

**6. Airtable**
- **Cost:** Free tier (12 months, limited records)
- **Features:**
  - Automations (send emails, generate PDFs)
  - Forms embedded on website
  - Prefilled form links
  - Conditional logic
  - Integration with Zapier
- **Setup:** 30 minutes
- **Pros:**
  - Powerful automations
  - Beautiful interface
  - Can generate dynamic invitation images
- **Cons:**
  - Quota limits on free tier
  - Learning curve (Airtable-specific)
- **Reference:** https://bannerbear.com/blog/how-to-automatically-generate-an-event-invitation-with-rsvp-prompt-on-airtable

**7. Supabase (PostgreSQL)**
- **Cost:** Free tier (500 MB database)
- **Setup:** 30-45 minutes
- **Architecture:**
  - React/Next.js form
  - Supabase PostgreSQL backend
  - Real-time updates via Supabase client
  - Auth optional
- **Features:**
  - Full database control
  - Real-time listeners
  - Built-in auth
  - SQL queries
- **Pros:**
  - Scalable
  - Full data ownership
  - Open source (self-hostable)
- **Cons:**
  - Requires database knowledge
  - Free tier has limitations
- **Reference:** https://dev.to/mmmagicmike/building-a-wedding-website-with-nextjs-supabase-and-tailwind-css-2k8o

#### **Tier 4: Full-Stack (Most Control)**

**8. Vercel + Neon PostgreSQL**
- **Cost:** Free tier for both
- **Architecture:**
  - Next.js API routes on Vercel serverless
  - Neon PostgreSQL database
  - Auto-injects DATABASE_URL env var
- **Setup:** 20-30 minutes
- **Pros:**
  - Serverless native (no server to manage)
  - Neon designed for serverless
  - Full control
  - Scalable
- **Cons:**
  - Requires Node.js/SQL knowledge
  - Database query performance considerations
- **Reference:** https://blog.vercel.com/templates/next.js/vercel-with-neon-postgres

**9. Cloudflare Workers + D1 Database**
- **Cost:** Free tier
- **Architecture:**
  - Edge computing (global low-latency)
  - D1 SQLite database
  - Cloudflare Email Routing
- **Setup:** 30-45 minutes
- **Pros:**
  - Ultra-low latency
  - Edge-native
  - Global CDN included
- **Cons:**
  - Newer ecosystem
  - SQLite limitations at scale
- **Notable:** Sakeenah uses Cloudflare Workers for deployment

---

## 4. Tech Stack Comparison Table

| Aspect | Sakeenah | Lovable Templates | Astro Forever | DIY Next.js |
|--------|----------|-------------------|---------------|------------|
| **Framework** | React 19 + Vite | React + TypeScript | Astro | Next.js 14 |
| **Backend** | Hono (Edge) | Frontend only | Static | API routes/Serverless |
| **Database** | PostgreSQL | None | None | Supabase/Neon/Firebase |
| **Styling** | Tailwind v4 | Tailwind + shadcn/ui | Tailwind | Tailwind + custom |
| **Animation** | Motion | Framer Motion | CSS/JS | Framer Motion |
| **Hosting** | Cloudflare Workers | Vercel/Netlify | Any | Vercel/Netlify |
| **RSVP** | Built-in multi-tenant | Via external service | Via external service | DIY or external |
| **Time to Deploy** | 45-60 min | 15-20 min | 10-15 min | 30-45 min |
| **Scalability** | Multi-wedding SaaS | Single wedding | Single wedding | Single wedding |
| **Best For** | Ambitious, full-featured | Customizable quick build | Ultra-simple, static | Balance |

---

## 5. Hosting & Deployment Options

### Free Tier Hosting with Custom Domain

#### **Vercel**
- **Cost:** Free tier with bandwidth limits
- **Features:**
  - Git-connected auto-deploys
  - Serverless functions (Free tier limitations)
  - Edge Functions
  - Analytics
  - Automatic HTTPS
- **Custom Domain:** Via any registrar; free DNS management via Vercel
- **Best For:** Next.js projects
- **Gotchas:** 
  - Free tier has function execution limits
  - Cold starts on serverless
  - Bandwidth limits (~100 GB/month)
- **Reference:** https://vercel.com/

#### **Netlify**
- **Cost:** Free tier
- **Features:**
  - Git-connected deploys
  - Netlify Functions (AWS Lambda)
  - Forms (unlimited submissions)
  - Redirect rules
  - Edge Functions
  - Split testing
- **Custom Domain:** Via any registrar
- **Best For:** Static sites, JAMstack
- **Gotchas:**
  - Function cold starts
  - Limited API Gateway integration
- **Reference:** https://www.netlify.com/

#### **Cloudflare Pages**
- **Cost:** Free tier (truly unlimited)
- **Features:**
  - Git-connected deploys
  - Global CDN (60+ data centers)
  - Cloudflare Workers integration
  - Automatic HTTPS
  - DDoS protection
  - Email Routing (free)
- **Custom Domain:** Via any registrar
- **Best For:** Static sites, high-performance requirements
- **Gotchas:**
  - Workers have usage limits but generous free tier
  - Less FaaS-focused than Vercel/Netlify
- **Reference:** https://pages.cloudflare.com/

#### **GitHub Pages**
- **Cost:** Completely free
- **Features:**
  - Static site only
  - Git-connected deploys
  - Auto-HTTPS
  - GitHub Actions for CI/CD
- **Custom Domain:** Via CNAME file in repo
- **Best For:** Simple static sites
- **Gotchas:**
  - No serverless functions
  - No dynamic backend
  - Public repo required (unless paid)
- **Reference:** https://pages.github.com/

### Domain Registration

**Free for 1 Year (with catch):**
- Some registrars offer free .me, .tk domains
- GitHub student pack includes free .io domain

**Affordable Options:**
- Namecheap: £8-12/year for .com/.in
- Google Domains: ~$12/year for .com
- Cloudflare Registrar: Cost + no markup (but in beta)

---

## 6. Mobile-First Considerations

### WhatsApp In-App Browser Quirks

**Challenges:**
- Limited DOM access (sandboxed)
- No camera/microphone access
- Slow JavaScript execution
- Custom user agents
- Restricted file downloads

**Solutions:**
- Test specifically in WhatsApp browser (link from WhatsApp)
- Avoid complex JavaScript animations
- Use CDN-cached assets
- Open external links with target="_blank"
- Focus on image-heavy, static content

### Open Graph Preview Images (og:image)

**Critical for Sharing:**
- When guest shares your wedding link on WhatsApp, Facebook, etc., a preview image appears
- **Recommended Size:** 1200x630 pixels
- **Minimum:** 600x315 pixels
- **Format:** JPG or PNG
- **Absolute URL Required:** `og:image` must be fully qualified (https://yourdomain.com/og.jpg)

**Best Practices:**
- Landscape orientation
- Clear focal point (couple photo, invitation design)
- Minimal text (must be large if included)
- Test with OG validators: https://templated.io/tools/og-image-preview/

**Image Ideas:**
- Engagement photo
- Wedding logo/monogram
- Save-the-date design
- Venue photo
- Invitation mockup

### Viewport Units for Full-Height Sections

**Use `100dvh` instead of `100vh`:**

```css
/* ❌ BAD: Overflows on mobile when address bar visible */
.hero { height: 100vh; }

/* ✅ GOOD: Responsive to address bar visibility */
.hero { height: 100dvh; }
```

### Autoplay Audio/Video Policies

**What Works:**
- Muted autoplay: `<audio autoplay muted>`
- User-triggered playback: Click button → play
- Spotify embeds
- YouTube embeds

**What Doesn't:**
- Unmuted audio autoplay (blocked)
- Video autoplay with sound (blocked)

**Recommended Pattern:**
```html
<button id="playBtn">🎵 Play Music</button>
<audio id="bgMusic" src="song.mp3"></audio>

<script>
  document.getElementById('playBtn').addEventListener('click', () => {
    document.getElementById('bgMusic').play();
  });
</script>
```

### Testing on Real Mobile Devices

**Essential Tests:**
1. Open link from WhatsApp (both iPhone Safari and Chrome)
2. Viewport scrolling (address bar hiding/showing)
3. Touch interactions (tap vs. hover)
4. Image loading on 4G
5. Form submission on mobile keyboard visible
6. Camera gallery picker for photo uploads

---

## 7. Tutorials & Learning Resources

### Blog Posts & Guides

- [DEV Community: Make a Slide Open Envelope](https://dev.to/superoverflow/make-a-slide-open-envelope-oem) - Framer Motion envelope animation tutorial
- [Building a Wedding Website with Next.js, Supabase, and Tailwind CSS](https://dev.to/mmmagicmike/building-a-wedding-website-with-nextjs-supabase-and-tailwind-css-2k8o) - Full-stack tutorial
- [Manage Your Wedding Guest List with Advanced Google Sheets Formulas](https://blog.bettersheets.co/manage-your-wedding-guest-list-with-advanced-google-sheets-formulas/) - Guest management via Sheets
- [Wedding Website Deployment with Custom Domain](https://mintlify.com/rampatra/wedding-website/deployment/custom-domain) - Multi-platform deployment guide
- [WhatsApp Deep Links: Complete Setup Guide](https://www.visitoai.com/blog/whatsapp-deep-links-complete-setup-guide) - wa.me implementation
- [Understanding CSS Dynamic Viewport Height (dvh)](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-svh-lvh-and-dvh-0c905d96e21a) - Viewport unit guide

### Video Tutorials (YouTube)

- How to make a React/Next.js website (beginner tutorial) - Styled components approach
- Wedding website with envelope animation - Framer Motion walkthroughs
- Deploy to Vercel in 5 minutes - Next.js deployment

### Interactive Resources

- [Framer Community: Wedding Templates](https://www.framer.com/community/marketplace/) - "Together Vows", "Blossom Love", "Weddingly" templates
- [Lovable.dev Wedding Templates](https://lovable.dev/templates/events/weddings/) - Multiple React templates with previews
- [Astro Wedding Themes](https://astro.build/themes/) - Static site wedding templates
- Gumroad Template: [Modern Wedding Website Kit](https://jaackevans.gumroad.com/l/iyqek) - Next.js 14 paid template

---

## 8. Recommended Tech Stack

### For Speed & Simplicity (Weekend Project)

```
Frontend: Next.js 14 + Tailwind CSS
Animation: Framer Motion
Styling Components: shadcn/ui (optional)
RSVP Backend: Google Forms + Google Sheets
Hosting: Vercel (free)
Domain: Namecheap (.in = ₹300-500/year)
Time to Launch: 2-3 days
```

**Cost:** ~$500/year for domain + hosting free
**Scalability:** Handles 500+ guests
**Customization:** High (full code control)

### For Maximum Control & Scalability

```
Frontend: React 19 + Vite + Tailwind CSS v4
Animation: Motion library + Framer Motion
Backend: Hono (edge API framework)
Database: PostgreSQL via Neon
Hosting: Cloudflare Workers + Pages
RSVP: Custom form → Hono endpoint → PostgreSQL
Domain: Namecheap
Time to Launch: 3-5 days
```

**Cost:** ~$500/year for domain; hosting free tier
**Scalability:** Production-grade SaaS potential
**Customization:** Maximum

### For No-Code Approach

```
Platform: Lovable.dev OR Framer templates
RSVP: Airtable OR Google Forms (embedded)
Hosting: Vercel/Netlify (included in platform)
Domain: Via platform
Time to Launch: 1-2 days
```

**Cost:** $200-500/year (domain only)
**Scalability:** Handles 100-500 guests
**Customization:** Medium (template-based)

### For Indian/WhatsApp-First

```
Frontend: Next.js 14 + Tailwind CSS
Animation: Framer Motion
RSVP: WhatsApp wa.me deep link (free)
Alternative RSVP: Google Forms
Hosting: Vercel
Domain: .in domain (₹300-500/year)
OG Image: 1200x630 JPG of couple/invitation
```

**Cost:** ₹300-500/year
**Hosting:** Free
**WhatsApp Share Optimized:** Full preview in WhatsApp chat

---

## 9. Key Metrics & Performance Tips

### Page Load Performance

- Target: First Contentful Paint (FCP) < 1.5s
- Tools: Google Lighthouse, WebPageTest
- Optimizations:
  - Image optimization (next/image or Cloudflare Image Optimization)
  - Lazy loading for gallery images
  - Minify CSS/JS
  - Use CDN (Cloudflare, Vercel CDN)

### SEO for Wedding Websites

- Meta title/description
- Open Graph tags (og:image, og:title, og:description)
- Structured data (Schema.org Event)
- Mobile-friendly design
- Sitemap (optional, not critical for single-page)

### Security Considerations

- Use HTTPS (automatic on Vercel/Netlify/Cloudflare)
- Validate RSVP form inputs (server-side)
- Don't expose API keys in client code
- If storing guest data, add privacy policy and GDPR notice (if EU guests)
- Rate-limit RSVP endpoint to prevent spam

---

## 10. Reference Links (Complete List)

### GitHub Repositories
- Sakeenah: https://github.com/mrofisr/sakeenah
- Undangan Digital (Indonesian): https://github-redirect.dependabot.com/topics/undangan-digital
- Wedding RSVP: https://github.com/gazdagb/wedding-rsvp

### Templates & Builders
- Lovable.dev: https://lovable.dev/templates/events/weddings/
- Framer Community: https://www.framer.com/community/marketplace/
- Astro Themes: https://astro.build/themes/
- Modern Wedding Kit (Gumroad): https://jaackevans.gumroad.com/l/iyqek
- Forever Astro Theme: https://astro.build/themes/details/forever/

### Hosting & Deployment
- Vercel: https://vercel.com/
- Netlify: https://www.netlify.com/
- Cloudflare Pages: https://pages.cloudflare.com/
- GitHub Pages: https://pages.github.com/

### RSVP & Backend
- Google Forms: https://www.google.com/forms/
- Formspree: https://formspree.io/
- Airtable: https://airtable.com/
- Supabase: https://supabase.com/
- Neon PostgreSQL: https://neon.tech/
- Google Apps Script: https://script.google.com/

### Libraries & Tools
- react-countdown: https://npmjs.com/package/react-countdown
- Framer Motion: https://www.framer.com/motion/
- Embla Carousel: https://www.embla-carousel.com/
- Swiper: https://swiperjs.com/
- Lottie: https://lottiefiles.com/
- Tailwind CSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/
- add-to-calendar-button: https://www.add-to-calendar-button.com/

### WhatsApp Integration
- wa.me Deep Links: https://www.visitoai.ai/blog/whatsapp-deep-links-complete-setup-guide
- WhatsApp Link Generator: https://rapidtoolset.com/en/tool/whatsapp-link-creator

### Design & Mobile
- OG Image Validator: https://templated.io/tools/og-image-preview/
- CSS Viewport Units Guide: https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-svh-lvh-and-dvh-0c905d96e21a

### Tutorials & Guides
- DEV Community Envelope Animation: https://dev.to/superoverflow/make-a-slide-open-envelope-oem
- Next.js + Supabase Wedding Tutorial: https://dev.to/mmmagicmike/building-a-wedding-website-with-nextjs-supabase-and-tailwind-css-2k8o
- Wedding Guest Management (Google Sheets): https://blog.bettersheets.co/manage-your-wedding-guest-list-with-advanced-google-sheets-formulas/

---

## Conclusion

The wedding invitation website space is dominated by React/Next.js with Framer Motion animations, deployed to Vercel. However, lightweight alternatives like Astro or even Bootstrap + Vanilla JS work well. The critical differentiator is RSVP backend simplicity: WhatsApp deep links are dominant in India, while Google Forms/Sheets are the easiest global solution. For a premium experience, combine Next.js frontend with Supabase/Neon backend and Cloudflare Workers deployment. Open-source options like Sakeenah provide a production-ready foundation for couples wanting full control.

