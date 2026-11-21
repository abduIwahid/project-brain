# Code-display items pasted 2026-11-03 — condensed filing

## CodeBlock demo (usage only; engine '@/components/ui/code-block' not included)
<CodeBlock code={...} lang='tsx'|'css'|'python' /> — syntax-highlighted block
with three demo snippets (React counter, gradient card CSS, recursive
fibonacci). Nothing else of substance.

## TreeCodeViewer demo — contains the TimelineAnimation ENGINE verbatim
The demo renders a file-tree code viewer over sample data. The reusable
payload inside its sample data is the TimelineAnimation component source
(the engine behind saved-reference #233), preserved here verbatim:

```tsx
import { type HTMLMotionProps, motion, useInView } from 'motion/react';
import type React from 'react';
import type { Variants } from 'motion/react';

type TimelineContentProps<T extends keyof HTMLElementTagNameMap> = {
  children?: React.ReactNode;
  animationNum: number;
  className?: string;
  timelineRef: React.RefObject<HTMLElement | null>;
  as?: T;
  customVariants?: Variants;
  once?: boolean;
} & HTMLMotionProps<T>;

export const TimelineAnimation = <
  T extends keyof HTMLElementTagNameMap = 'div',
>({
  children,
  animationNum,
  timelineRef,
  className,
  as,
  customVariants,
  once = true,
  ...props
}: TimelineContentProps<T>) => {
  const isInView = useInView(timelineRef, { once });
  const MotionComponent = motion[as || 'div'] as React.ElementType;

  return (
    <MotionComponent
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      variants={customVariants || defaultSequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
```
(defaultSequenceVariants itself is referenced but was not in the paste.)
The sample hero file in the same demo carries FABRICATED social proof
("Join 80,000+ designers", "1,234+") — flagged: that pattern is banned on
Wadi's sites; the code-viewer pattern itself is a docs-site tool.

## CodeTabsMdx (UI-Layouts' own docs infrastructure, not a product component)
A server component that takes MDX code blocks, highlights them with shiki
(@/lib/shiki-highlighter), and renders either a single dark block or a
two-tab switcher ("ui-layouts" vs "shadcn" install variants) with a copy
button. ~150 lines; full text in the chat transcript of 2026-11-03 11:53.
Useful reference only if Wadi ever builds a docs/component site.

## Accordion / FAQ usages pasted the same hour
- Two-column FAQ accordion (3+3 generic "what is a UI component" Q&As) —
  pure usage of '@/components/ui/accordion', engine not included.
- Single-column FAQ ("SingleLayout"): plus-icon rotates 45deg on the open
  item, height auto animation via AnimatePresence. NOTE: as pasted, the
  header <button> never wires its onClick (handleClick is defined but not
  attached) — the demo as pasted would not open on click.
