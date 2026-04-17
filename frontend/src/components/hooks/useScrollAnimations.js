// Scroll Animation effect for my pages 
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useScrollAnimation(options = {}) {
  // Smooth scroll setup 
    useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });
  
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
  
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }, []);
    
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, { threshold: options.threshold || 0.2 });

    const animatedElements = document.querySelectorAll(
      '.animate-fadeUp, .animate-slideDown, .animate-slideUp, .stagger-item'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [options.threshold]);
}