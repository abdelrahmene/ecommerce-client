import { useState, useEffect } from 'react';

export const useScrollSnap = (containerRef) => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      if (containerRef.current) {
        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;
        const newSection = Math.floor(scrollPosition / windowHeight);
        
        if (newSection !== currentSection) {
          setCurrentSection(newSection);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentSection, containerRef]);

  return { currentSection };
};