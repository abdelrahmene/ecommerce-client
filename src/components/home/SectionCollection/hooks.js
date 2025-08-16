import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useInView } from 'react-intersection-observer';

const AUTOPLAY_INTERVAL = 2000; // 2 secondes

export const useCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    align: 'center',
    containScroll: 'trimSnaps',
    duration: 25,
    startIndex: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollTo = useCallback((index) => {
    if (emblaApi) {
      emblaApi.scrollTo(index, true);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    onScroll();
    setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);

    // Autoplay
    let autoplayTimer = 0;
    const autoplay = () => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext({ duration: 35 });
        autoplayTimer = window.setTimeout(autoplay, AUTOPLAY_INTERVAL);
      } else {
        emblaApi.scrollTo(0, true);
        autoplayTimer = window.setTimeout(autoplay, AUTOPLAY_INTERVAL);
      }
    };

    const stopAutoplay = () => {
      window.clearTimeout(autoplayTimer);
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = window.setTimeout(autoplay, AUTOPLAY_INTERVAL);
    };

    startAutoplay();

    emblaApi.on('pointerDown', stopAutoplay);
    emblaApi.on('pointerUp', startAutoplay);

    return () => {
      stopAutoplay();
      if (emblaApi) {
        emblaApi.off('select', onSelect);
        emblaApi.off('scroll', onScroll);
        emblaApi.off('reInit', onSelect);
        emblaApi.off('pointerDown', stopAutoplay);
        emblaApi.off('pointerUp', startAutoplay);
      }
    };
  }, [emblaApi, onSelect, onScroll]);

  return {
    emblaRef,
    activeIndex,
    scrollSnaps,
    scrollTo,
    prevBtnEnabled,
    nextBtnEnabled,
    scrollProgress
  };
};

export const useSectionVisibility = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return { ref, inView };
};

export const useAutoplay = (emblaApi, enabled = true) => {
  useEffect(() => {
    if (!emblaApi || !enabled) return;

    let autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 2000);

    const onPointerDown = () => {
      clearInterval(autoplayInterval);
    };

    const onPointerUp = () => {
      autoplayInterval = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 2000);
    };

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);

    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
    };
  }, [emblaApi, enabled]);
};