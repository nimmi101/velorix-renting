import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import CategoryCards from '../components/home/CategoryCards';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTABanner from '../components/home/CTABanner';
import PageSEO from '../components/PageSEO';

// Import pages to load as sections
import Fleet from './Fleet';
import TourPackages from './TourPackages';
import About from './About';
import Contact from './Contact';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1); // remove the '#'
      const el = document.getElementById(target);
      if (el) {
        const timer = setTimeout(() => {
          const yOffset = -72;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'instant' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash]);

  return (
    <div className="overflow-hidden">
      <PageSEO
        title="Premium Vehicle Rentals | Tours & Travel"
        description="Book luxury self-drive cars, chauffeur driven sedans, SUVs, Tempo Travellers, mini buses and coaches. Transparent pricing & verified fleet."
      />
      {/* 1. Full-viewport Parallax Hero + Search */}
      <div id="home">
        <HeroSection />
      </div>

      {/* 3. Interactive Rental Categories (4 image cards) */}
      <CategoryCards />

      {/* 5. Full Catalog Fleet Section */}
      <div id="fleet" className="scroll-mt-20">
        <Fleet isSection={true} />
      </div>

      {/* 7. Premium Tour Packages Section */}
      <div id="packages" className="scroll-mt-20 bg-white">
        <TourPackages isSection={true} />
      </div>

      {/* 8. How Renting Works Timeline (dark section) */}
      <HowItWorks />

      {/* 9. Why Choose Velorix + Animated Stats */}
      <WhyChooseUs />

      {/* 10. About Us Story Section */}
      <div id="about" className="scroll-mt-20 bg-white">
        <About isSection={true} />
      </div>

      {/* 11. Customer Testimonials */}
      <Testimonials />

      {/* 12. FAQ Accordion */}
      <FAQ />

      {/* 13. Contact Concierge Section */}
      <div id="contact" className="scroll-mt-20">
        <Contact isSection={true} />
      </div>

      {/* 14. Final CTA Banner */}
      <CTABanner />
    </div>
  );
};

export default Home;
