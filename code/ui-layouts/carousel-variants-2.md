# Embla Carousel variants (part 2, pasted 2026-11-03) — distinguishing config

All use Carousel/Slider/SliderContainer from '@/components/ui/carousel'
(engine never included). Demo slides are coloured divs or the same set of
Unsplash interior photos (photo-1759395073808, photo-1759434192768,
photo-1758641008040, photo-1618220649687, photo-1525310072745,
photo-1603338936206, photo-1580411788548).

- ThumnailSlider: slides carry thumbnailSrc; <ThumbsSlider className='pb-1 px-1' thumbsClassName='basis-[15%] h-24' /> under a 90%-width carousel.
- AutostartSlider: plugins=[Autoplay({ playOnInit: true, delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false })], loop: true, 4 colour slides + dots.
- AutoScrollSlider: plugins=[AutoScroll({ speed: 2, stopOnInteraction: false, stopOnMouseEnter: true, startDelay: 100 })], loop: true, labelled slides "Slide 1..4" at 40%/80% widths.
- VerticalCarousel: options { loop: true, axis: 'y' }, container h-[400px], prev/next = ChevronUp/Down centred top/bottom, dots in a right-side vertical column.
- VerticalthumbsSlider: options { loop: false, axis: 'y', direction: 'rtl' }, ThumbsSlider as a w-20 side column (thumbsClassName='h-[400px]').
- VerticalthumbsAutostartSlider: axis 'y' + Autoplay({ delay: 2000, stopOnMouseEnter: false, stopOnInteraction: false }), ThumbsSlider absolutely positioned right-centre (w-20).
