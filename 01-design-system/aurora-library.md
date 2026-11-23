# Aurora — full page library (distilled index)

Companion to `aurora-template.md`. Aurora (ThemeWagon's React + MUI admin & landing template) is the **highest-priority frontend reference** (standing rule, 2026-11-23). On 23 Nov 2026 the entire public demo at https://aurora.themewagon.com/ was captured page by page into a private local library — **131 distinct routes** across 16 sections, each with a structure note, a rendered-content capture and an HTML snapshot.

**What is published here:** the design tokens, the full page inventory with capture status, a one-line structure summary per page, and how to use the library. **What is not published:** the raw page captures and machine-readable styleguide dumps — a commercial template's rendered output is not redistributed; it stays in the owner's private library. Everything needed to *rebuild* any of these pages in your own code is in the tokens and summaries below plus `aurora-template.md`.

## Baseline design tokens

| Token | Light (landing & app) | Dark mode |
|---|---|---|
| Accent / primary | `#3385F0` (hover/darker `#2B71CC`) | `#589BF3` |
| Text | `#1B2124` (app body sample `#4D595E`) | `#9CAEB8` |
| Background | `#FFFFFF` | `#06080A` |
| Card border | `#E5E7EB`, 1px solid | (see private dark styleguide) |
| Font | Plus Jakarta Sans (Spline Sans Mono for mono accents) | same |
| Type scale | H1 42px/700 · H2 32px/700 · H3 24px/700 · H4 18px/700 · body 14px/400, line-height 22.4px | same |
| Spacing scale | xs 8 · sm 16 · md 40 · lg 72 · xl 128 px | same |
| Radii | 8px on buttons & cards | same |
| Shadows | One soft layered `sm` shadow; none at md and up (flat MUI look) | — |
| Button (primary) | bg `#3385F0`, 8px radius, padding 8×16, 14px/600, min-height 36px | — |
| Card | white bg, 1px `#E5E7EB` border, 8px radius, 16px padding, no shadow | — |

Three token sets were captured privately: landing (baseline), the dashboard/app shell, and dark mode. The demo also supports layout variants via URL params (sidenav default/slim, topnav default/stacked, combo navigation, RTL, theme presets) — configuration variants of the same pages, not separate designs.

## Capture status — summary

Of 131 routes: **116 fully usable as rebuild references** (9 with the complete rendered HTML body; 107 with the body fully captured as rendered content while the HTML snapshot holds the app shell + navigation, because the template renders page bodies client-side), **5 light** (auth/utility pages with minimal extractable text — form structure documented), **1 shell only**, and **9 not captured** (legacy/alias routes the public fetcher cannot resolve; their canonical equivalents under `/apps/…` or `/pages/…` *are* captured — check the same family first).

Marks used below: **Full** · **Content** (body in rendered-content capture; HTML = shell+nav) · **Light** · **Shell only** · **Not captured**.

## How to use this library

1. Find the page in the inventory below; the private library holds its structure note, rendered content and HTML snapshot under the same route.
2. Rebuild in your own stack (Next.js + Tailwind, or MUI) using the note for structure, the rendered content for the exact sections, the HTML snapshot for the app chrome (head, fonts, sidenav/topnav shell) and the baseline tokens above for styling.
3. For app pages the shared sidenav/topnav shell is identical across captures — build it once, then swap the main-region content per page.
4. Pages marked "Not captured" / "Shell only" need a real-browser look first; rebuild from the tokens + sibling pages in the same family.
5. Demo copy in the captures is the template vendor's placeholder content — reuse the design, never their text or business data.

## Page inventory & structure summaries

One line per page: route — capture status — the page's top sections/headings, top to bottom (from the capture notes). Headings are the demo's own section labels; they show the page's skeleton, not copy to reuse.


### Landing & marketing (9)

- `/` · Content — Customize — Explore various themes — Light — Dark — Luxury
- `/pages/landing/404` · Content — Page not found! — Start with us today!
- `/pages/landing/about-us` · Full — Get to Know Us: Together, We Create Magic! 🌟🤗 — What is Aurora — On a mission to empower — Trusted by the most innovative teams — Our brilliant teammates
- `/pages/landing/coming-soon` · Content — 360 — 07 — 51 — 37 — We are coming soon!
- `/pages/landing/contact` · Content — Where to find us? — Get in touch — Start with us today!
- `/pages/landing/faq` · Full — How can we help? — Still have questions? — Start with us today!
- `/pages/landing/homepage` · Full — Ultimate web app to enhances — make your life faster — Trusted by the most innovative teams — Our selected works — Packed with essential abilities
- `/pages/landing/maintenance` · Content — Site is temporarily unavailable now. — Start with us today!
- `/showcase` · Content — Customize — Explore various themes — Light — Dark — Luxury

### Dashboards (8)

- `/dashboard/analytics` · Content — 5.9M — 62.11% — 21.91% — 470 — Try our pro plan
- `/dashboard/crm` · Content — Good Evening, Captain! — 3,050 — 105 — 37% — 13,200
- `/dashboard/ecommerce` · Content — 2,110 — $8.2M — 1,124 — $6,322.32
- `/dashboard/employee` · Content — Good Evening, John Carter!
- `/dashboard/hiring` · Content
- `/dashboard/hrm` · Content
- `/dashboard/project` · Content
- `/dashboard/time-tracker` · Content — 123:23:01 — 66.05% — $350 — 15

### Authentication & errors (8)

- `/authentication/default/auth0/login` · Light — Log in
- `/authentication/default/firebase/forgot-password` · Light — Forgot Password?
- `/authentication/default/firebase/login` · Content — Log in
- `/authentication/default/firebase/sign-up` · Content — Sign up
- `/authentication/default/jwt/forgot-password` · Light — Forgot Password?
- `/authentication/default/jwt/login` · Light — Log in
- `/authentication/default/jwt/sign-up` · Light — Sign up
- `/error/404` · Not captured

### Apps — E-commerce storefront (customer) (13)

- `/apps/ecommerce/customer/cart` · Full — Cart — Excellent choices! — $268.00
- `/apps/ecommerce/customer/checkout` · Content — Checkout — $268.00
- `/apps/ecommerce/customer/customer-account` · Full
- `/apps/ecommerce/customer/homepage` · Content — Popular categories — Best viewed items this week — Featured products just for you — Have questions?
- `/apps/ecommerce/customer/order-confirmation` · Full — Order confirmed — Thank you for purchasing — Your order has been placed!
- `/apps/ecommerce/customer/order-details` · Full — Order details — Order #345261 — $1,177.99
- `/apps/ecommerce/customer/order-list` · Full — Order list
- `/apps/ecommerce/customer/order-track` · Content — Track order — Order #1411241235
- `/apps/ecommerce/customer/payment` · Full — Payment — $268.00
- `/apps/ecommerce/customer/product-details` · Content — VINGLI 56" Modern Sofa, Small Corduroy Couch Deep Seat — $259.00 — 4.87
- `/apps/ecommerce/customer/product-details/1` · Content — VINGLI 56" Modern Sofa, Small Corduroy Couch Deep Seat — $259.00 — 4.87
- `/apps/ecommerce/customer/products` · Content
- `/apps/ecommerce/customer/wishlist` · Shell only

### Apps — E-commerce admin (1)

- `/ecommerce/admin/create-order` · Not captured

### Apps — CRM (8)

- `/apps/crm/add-contact` · Content — Add New Contact
- `/apps/crm/deal-details` · Content — Replica Badidas Futbol
- `/apps/crm/deals` · Content — Deals
- `/apps/crm/lead-details` · Content — Tsamina Mina
- `/crm/add-contact` · Not captured
- `/crm/deal-details` · Not captured
- `/crm/deals` · Not captured
- `/crm/lead-details` · Not captured

### Apps — Project (8)

- `/apps/project/automations` · Content — Project Automations
- `/apps/project/automations/create` · Content — Create Automation
- `/apps/project/create-project` · Content — Create project — Project Name
- `/apps/project/gantt-chart` · Content — Name of the Project
- `/apps/project/project-list` · Content — TW Workspace
- `/apps/project/table-view` · Content — Name of the Project
- `/apps/project/team-member-list` · Content — ThemeWagon
- `/apps/project/timeline-view` · Content — My Timeline View

### Apps — HRM (11)

- `/apps/hrm` · Content
- `/apps/hrm/payroll` · Content
- `/apps/hrm/payroll/dashboard` · Content — Payroll
- `/apps/hrm/payroll/payroll-review` · Content — Payroll Review — $8.2M
- `/apps/hrm/payroll/run-payroll` · Content — Run Payroll
- `/apps/hrm/performance-management` · Content
- `/apps/hrm/performance-management/appraisal-cycle` · Content — Appraisal Cycle
- `/apps/hrm/performance-management/appraisal-list` · Content — Appraisal List
- `/apps/hrm/performance-management/feedback` · Content — Feedback
- `/apps/hrm/performance-management/goals` · Content — Goals
- `/apps/hrm/performance-management/new-goal` · Content — Create New Goals

### Apps — Hiring (7)

- `/apps/hiring/admin/candidate-details` · Content
- `/apps/hiring/admin/job-opening` · Content — Job Openings
- `/apps/hiring/admin/new-opening` · Content — New Opening
- `/apps/hiring/admin/pipeline` · Content — Content Writer
- `/apps/hiring/candidate/job-application` · Content — Job Application
- `/apps/hiring/candidate/job-details` · Content — Motion Graphics Designer
- `/apps/hiring/candidate/job-list` · Content — Job List

### Apps — Invoice (3)

- `/apps/invoice/create-invoice` · Content — Create invoice — $1,827.90
- `/apps/invoice/invoice-list` · Content — Invoice list
- `/apps/invoice/invoice-preview` · Content — Invoice #212041

### Apps — Content (8)

- `/apps/content` · Content
- `/apps/content/blogs/1` · Content — Architecture Through the Ages: From Ancient Masterpieces to Modern Icons — Recommendations
- `/apps/content/create-blog` · Content — Blog Details
- `/apps/content/podcasts/1` · Content — Recommendations
- `/apps/content/search` · Content — Searched for ‘Animal’
- `/apps/content/topics` · Content — Topic
- `/apps/content/upload-media` · Content — Content Details
- `/apps/content/videos/1` · Content — Exploring Modern Architecture: Innovative Designs Shaping Our World Today

### Apps — Chat, Social, Calendar, Files (7)

- `/apps/calendar` · Content — November 2026
- `/apps/chat` · Content
- `/apps/chat/new` · Content
- `/apps/file-manager` · Content
- `/apps/scheduler` · Content
- `/apps/social` · Content — +5
- `/file-manager` · Not captured

### Apps — Kanban, Members, Time Tracker (10)

- `/apps/kanban` · Content
- `/apps/kanban/boards` · Content
- `/apps/kanban/create-board` · Content
- `/apps/member` · Content — Member
- `/apps/member/new-member` · Content — Add new Member
- `/apps/member/profile` · Content
- `/apps/time-tracker/apps-sites` · Content — Apps & Sites
- `/apps/time-tracker/report` · Content — Report
- `/apps/time-tracker/screenshots` · Content — Screenshots
- `/apps/time-tracker/time-sheets` · Content — Timesheets

### Account, starter & misc pages (4)

- `/account` · Not captured
- `/pages/account` · Content — Account Settings — Personal Info
- `/pages/notifications` · Content — Notifications
- `/pages/starter` · Content — Create — Something — Beautiful

### Pricing & FAQ pages (12)

- `/pages/faq` · Content — Faq — AWS
- `/pages/faq/accounts` · Content — Faq — Accounts
- `/pages/faq/aurora` · Content — Faq
- `/pages/faq/aws` · Content — Faq — AWS
- `/pages/faq/billing` · Content — Faq — Billing
- `/pages/faq/campaign` · Content — Faq — Campaign
- `/pages/faq/pricing` · Content — Faq — Pricing
- `/pages/faq/segments` · Content — Faq — Segments
- `/pages/faq/templates` · Content — Faq — Templates
- `/pages/pricing/column` · Content — Pricing Options — Free — $14.99 — $24.99
- `/pages/pricing/table` · Content — Pricing Options
- `/pricing/table` · Not captured

### Documentation (14)

- `/documentation/api-calls` · Content — API Calls
- `/documentation/authentication` · Content — Authentication — API base for credentials login (see NEXT_PUBLIC_API_URL in the Next app) — Optional for Firebase-related flows — OAuth (enable the matching providers in authOptions)
- `/documentation/changelog` · Content — Changelog
- `/documentation/configuration` · Content — Configuration and Settings
- `/documentation/dependencies` · Content — Dependencies
- `/documentation/folder-structure` · Content — Folder Structure
- `/documentation/getting-started` · Content — Getting Started
- `/documentation/icons` · Content — Icon Registration
- `/documentation/introduction` · Content — Introduction
- `/documentation/layouts` · Content — Layouts
- `/documentation/localization` · Content — Localization
- `/documentation/migration` · Content — Migration
- `/documentation/routing` · Content — Routing
- `/documentation/theming` · Content — Theming


## Data-variant URLs (collapsed — same layout, different data)

Pure data variants were captured once via a representative:

- Product details: representative `/apps/ecommerce/customer/product-details/1` covers ids 2–15.
- Job details: representative `/apps/hiring/candidate/job-details` covers ids 1–7.
- Invoice preview: representative `/apps/invoice/invoice-preview` covers 8 invoice ids.
- Theme/layout query-param variants (dark mode, sidenav types, RTL, presets) exist for most app routes — see the baseline-tokens note above.

## Method & limits (honest notes)

- Enumeration combined the sitemap, link harvesting from rendered pages (sidebar/topnav/footer) and crawl discovery until closure: 131 distinct routes + 29 data-variant URLs + theme-param variants.
- A page counts as captured only when its files exist on disk in the private library; nothing was inventoried from a failed fetch.
- The 9 "not captured" routes are legacy/alias-style paths (e.g. `/crm/deals`, `/file-manager`, `/pricing/table`) whose canonical equivalents under `/apps/…` or `/pages/…` are captured.

