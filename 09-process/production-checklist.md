# Production-readiness checklist (100 points)

Saved by Abdul Wahid on 2026-10-23 as a standing reference for project work.

**His framing, kept with the list:** these are NOT 100 mandatory features for
every website. Implement the ones relevant to the application, prioritize
security and core functionality, and verify that each implemented feature
actually works rather than merely existing in the UI.

## The list

1. Real authentication (login and logout)
2. Password reset and recovery
3. Email verification
4. User onboarding flow
5. Loading states and skeleton loaders
6. Empty states with helpful messages and actions
7. Clear error messages
8. Form validation (client-side and server-side)
9. Rate limiting and abuse prevention
10. Database backups and recovery
11. Row-level security and access control
12. Secure API keys and environment variables (never expose secrets on the frontend)
13. Responsive mobile layout
14. Custom 404 page
15. Analytics integration
16. Error tracking and monitoring
17. Privacy policy page
18. Terms of service page
19. Account deletion functionality
20. Dark mode toggle
21. Cookie consent banner (when applicable)
22. Site search functionality (when relevant)
23. Back-to-top button
24. Mobile navigation menu
25. Loading animations and transitions
26. Hover, focus, and active states
27. Scroll progress indicator
28. Copy-to-clipboard functionality (when relevant)
29. Print-friendly stylesheets (when relevant)
30. Sticky header (when appropriate)
31. Skip-to-content link for accessibility
32. Password visibility toggle
33. UTM tracking for marketing campaigns (when relevant)
34. Form submission success states
35. Form submission error states
36. Confirmation dialogs for destructive actions
37. Last-updated timestamps for relevant content
38. Expandable FAQ sections
39. Floating contact button (when appropriate)
40. Refund policy (for products or services that accept payments)
41. Cookie policy
42. Cookie preferences and consent management (when applicable)
43. Explicit consent for forms that collect personal data
44. Data minimization (collect only necessary user information)
45. Third-party SDK and dependency audits
46. Eliminate deceptive UI patterns, hidden fees, and misleading interactions
47. Avoid fake reviews and unsupported claims
48. Accessibility improvements, including descriptive alt text, sufficient color contrast, keyboard navigation, visible focus indicators, and screen-reader support
49. Clear business and contact information
50. Age verification or parental consent when legally required for services involving children's data
51. Unsubscribe functionality in marketing emails
52. Properly licensed fonts, images, icons, and other assets
53. Data access, export, and deletion request handling
54. Secure session management and session expiration
55. Multi-factor authentication (when appropriate)
56. Authorization checks on every protected server-side operation
57. Protection against common web vulnerabilities, including XSS, CSRF, SQL injection, and insecure direct object references
58. Secure HTTP headers and HTTPS enforcement
59. Input sanitization and output encoding
60. Database connection security and least-privilege permissions
61. Database migrations and schema version control
62. Transaction handling and data integrity checks
63. Automated tests for critical features
64. End-to-end testing of important user journeys
65. Cross-browser compatibility
66. Responsive testing across different screen sizes and devices
67. Performance optimization and Core Web Vitals monitoring
68. Image optimization and lazy loading
69. SEO metadata, canonical URLs, and social sharing previews
70. Sitemap.xml and robots.txt configuration
71. Custom 500 and other server-error pages
72. Graceful handling of network failures and timeouts
73. Retry mechanisms for recoverable failures
74. Offline and poor-network handling (when relevant)
75. Prevention of duplicate form submissions
76. Pagination or infinite scrolling for large datasets
77. Sorting, filtering, and search-result handling (when relevant)
78. Notifications and feedback for important user actions
79. Accessible dialogs, dropdowns, tooltips, and interactive components
80. Clear documentation and setup instructions
81. Environment-specific configurations for development, testing, and production
82. CI/CD pipeline and automated deployment checks
83. Dependency updates and vulnerability scanning
84. Structured logging and application monitoring
85. Health checks and uptime monitoring
86. Data retention and automatic deletion policies
87. Backup restoration testing
88. Disaster recovery planning
89. Protection against spam and automated bot submissions
90. Secure file upload validation and file-size limits (when applicable)
91. Audit logs for sensitive administrative actions (when applicable)
92. Role-based permissions for administrators and other user types (when applicable)
93. Clear pricing, billing, and subscription details (when applicable)
94. Payment failure handling and secure payment processing (when applicable)
95. Refund and cancellation workflows (when applicable)
96. Accessible content structure with proper headings and semantic HTML
97. Reduced-motion support for users who prefer fewer animations
98. Consistent branding, typography, spacing, and component design
99. Clear navigation and understandable calls to action
100. A production-readiness checklist covering security, functionality, accessibility, performance, privacy, and deployment

## Addendum — "vibe-coded fingerprint" scan (@yatesvids, item 47)

Before calling a site finished, scan for the giveaways: default
.vercel.app URL, no custom 404, duplicate page titles, missing meta
description / og:image / structured data / canonical tag, broken H1
structure, no sitemap.xml or llms.txt, AI crawlers blocked in robots.txt,
no favicon, no lang attribute, missing alt text, source maps in
production, console errors, oversized JS bundles. Item 46
(@adhubuildsthings) is the companion list of things to ADD: internal
links, breadcrumbs, CTA above the fold, 5+ FAQs, thank-you page, real
reviews, team photo, analytics, RLS on endpoints, cookie consent,
about/contact pages, waitlist page.

## Addendum — performance pass (from @yatesvids' overhaul prompt, 2026-10-23)

When a site feels slow, run this pass (or hand it to a coding agent as a
brief): compress images and convert them to modern formats; lazy-load
anything below the fold; remove unused code and cut JavaScript; optimize
font loading; cache static files; stop loading scripts that aren't needed;
fix layout shifts (CLS); improve Largest Contentful Paint and interaction
delays; test on a slow mobile connection; run Lighthouse, fix the biggest
issues first, and compare before/after so the improvement is measurable.

## Post-change verification (standing rule, added 2026-10-25 at Abdul Wahid's order)
After EVERY commit/change to ANY of his sites (WhyRisk, Study Hub, portfolio, future projects):
1. Deploy, then test the LIVE site as a real user — not just tsc/eslint/build gates.
2. Scope ∝ change: a big round gets a full pass (every page, button, form, error/empty/loading state, mobile width, UI/UX lens = his reels + 20 UX laws); a small change gets the changed surface + its relevant neighbours.
3. Loop: fix → redeploy → re-check, until a full scoped pass comes back clean.
4. Only then report "done" — and the report names what was actually clicked/verified.
Origin: WhyRisk Phases 1–5 were reported complete on gates alone; the app had never run against a live backend, so surface defects (wrong logo, faux-bold headings, dead OAuth buttons, missing grants) all surfaced at go-live on 2026-10-25. Never again.
