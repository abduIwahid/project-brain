// Embla Carousel usage variants pasted by Wadi on 2026-11-03 (part 1 of 2).
// The Carousel engine itself (@/components/ui/carousel) was never included.
// Variant A: annotated skeleton (the //!mark comments are the docs site's own)
// Variant B: AlignSlider (variable-width slides + progress bar)
// Variant C: ClassName (embla-carousel-class-names: snapped slide full opacity)
// Variant D: NumberSlider (snap counter display)
// Variant E: ScaleSlider (isScale centred scaling)

import type { EmblaOptionsType } from 'embla-carousel';
import {
  Carousel,
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
} from './carousel';

function index() {
  const OPTIONS: EmblaOptionsType = { loop: false };
  return (
    <>
      <Carousel options={OPTIONS}>
        <SliderContainer>
          <Slider></Slider>
          <Slider></Slider>
          <Slider></Slider>
        </SliderContainer>

        <SliderPrevButton>
          <ChevronLeft />
        </SliderPrevButton>

        <SliderNextButton>
          <ChevronRight />
        </SliderNextButton>

        <SliderDotButton />

        <SliderSnapDisplay />
      </Carousel>
    </>
  );
}
