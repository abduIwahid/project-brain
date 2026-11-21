'use client';
// NOTE (filed copy): this is UI-Layouts' OWN catalogue page ("Others1") —
// a header + an FAQ banner upselling their Pro plan + a grid of their
// section categories, all animated with their TimelineAnimation component
// (staggered blur/y reveals, animationNum sequencing). The page's giant
// inline UI-Layouts logo SVG (~9 paths) and the Discord/GitHub icon SVGs
// are their brand artwork and are not re-typed here; the data model and
// page structure — the only reusable information — are verbatim below.
// Full original in the chat transcript of 2026-11-03 11:30.
import { TimelineAnimation } from '@/components/ui/timeline-animation';
import { cn } from '@/lib/utils';
import { Component } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export const sectionData = [
  {
    id: 'hero-section',
    name: 'Hero Section',
    url: '/blocks/hero',
    blocks: 18,
    des: 'Beautiful hero layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1755565776530-57cc00a760c9?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'experience-section',
    name: 'Experience Section',
    url: '/experience',
    blocks: 8,
    des: 'Beautiful experience layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1755024324097-64832c4d2334?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'faqs-section',
    name: 'FAQ Section',
    url: '/blocks/faqs',
    blocks: 12,
    des: 'Beautiful FAQ layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1754851541354-081c37f1316c?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'about-section',
    name: 'About Section',
    url: '/blocks/about',
    blocks: 7,
    des: 'Beautiful about layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1743361657693-7b60363b6d16?q=80&w=627&auto=format&fit=crop',
  },
  {
    id: 'feature-section',
    name: 'Feature Section',
    url: '/blocks/feature',
    blocks: 14,
    des: 'Beautiful feature layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1751097006268-ae4601fcb117?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'pricing-section',
    name: 'Pricing Section',
    url: '/blocks/pricing',
    blocks: 8,
    des: 'Beautiful pricing layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1752440093057-1c188e7137e9?q=80&w=764&auto=format&fit=crop',
  },
  {
    id: 'newsletter-section',
    name: 'Newsletter Section',
    url: '/blocks/newsletter',
    blocks: 16,
    des: 'Beautiful newsletter layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1751093383900-dbf2a79169f8?q=80&w=880&auto=format&fit=crop',
  },
  {
    id: 'carousel-section',
    name: 'Carousel Section',
    url: '/blocks/carousel',
    blocks: 6,
    des: 'Beautiful carousel layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1751480433116-dc745e575a29?q=80&w=880&auto=format&fit=crop',
  },
  {
    id: 'testimonial-section',
    name: 'Testimonial Section',
    url: '/blocks/testimonial',
    blocks: 13,
    des: 'Beautiful testimonials layouts to start your landing page.',
    imgSrc:
      'https://images.unsplash.com/photo-1654649451086-dd75d8170a27?q=80&w=687&auto=format&fit=crop',
  },
];

// Page structure (Others1):
// - <TimelineAnimation as='header' animationNum={1}> — glass header bar with
//   the UI-Layouts wordmark (Link '/') + Discord/GitHub icon buttons.
// - FAQ banner card (animationNum={2}, customVariants = blur/y reveal with
//   i*0.4 stagger): "blocks/FAQs" eyebrow, FAQs heading, Pro upsell text and
//   a "Get the Pro" button linking to https://pro.ui-layouts.com/.
// - Grid (2/3 cols) of sectionData cards, each a <TimelineAnimation as='a'
//   animationNum={2+index}> linking to https://pro.ui-layouts.com/<url>,
//   with a 16:9 image and "Name (blocks)" caption.
