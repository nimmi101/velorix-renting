import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const ScrollWrapper = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Out-quartic curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothTouch: false // Disable on touch devices for native swipe feel
    });

    // Request Animation Frame loop for Lenis ticks
    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    // Store lenis globally for optional controls
    window.lenis = lenis;

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollWrapper;
