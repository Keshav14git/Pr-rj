import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Hero from '../sections/Hero';
import About from '../sections/About';
import CoreExpertise from '../sections/CoreExpertise';
import Projects from '../sections/Projects';
import KeyAchievements from '../sections/KeyAchievements';
import Skills from '../sections/Skills';
import Contact from '../sections/Contact';
import Footer from '../components/Footer';
import IntelligenceCore from '../components/IntelligenceCore';
import DynamicSectionRunner from '../components/DynamicSectionRunner';

function Home() {
  const [customSections, setCustomSections] = useState<any[]>([]);

  // Fetch dynamically built CMS sections on mount
  useEffect(() => {
    fetch('/api/portfolio/sections')
      .then(res => res.json())
      .then(data => {
         if (data.success) setCustomSections(data.data);
      })
      .catch(err => console.error("Error fetching dynamic sections:", err));
  }, []);

  // Always start at the top (Hero) on load/refresh
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Initialize Lenis for butter-smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis globally for smooth scroll navigation
    (window as any).__lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const unifiedZoneRef = useRef<HTMLDivElement>(null);

  // Helper function to inject custom sections at specific placements
  const renderInjectedSections = (placementIdx: number) => {
    const injected = customSections.filter(cs => cs.placementIndex === placementIdx);
    if (injected.length === 0) return null;
    
    return injected.map(custom => (
      <div key={`custom-${custom._id}`} className="relative z-[1] border-t border-black/5">
          <DynamicSectionRunner data={custom} />
      </div>
    ));
  };

  return (
    <main className="bg-white" role="main" aria-label="Rohit Jangra Portfolio">
      <div id="hero">
        <Hero onNavigate={handleNavigate} initialMenuOpen={false} />
      </div>
      
      {/* Placement 0: After Hero */}
      {renderInjectedSections(0)}

      {/* Unified Background Zone */}
      <div ref={unifiedZoneRef} className="relative overflow-x-clip">

        <div id="about" className="relative z-[1]">
          <About />
        </div>
        {/* Placement 1: After About */}
        {renderInjectedSections(1)}

        <div id="core-expertise" className="relative z-[1]">
          <CoreExpertise />
        </div>
        {/* Placement 2: After Core Expertise */}
        {renderInjectedSections(2)}

        <div id="experience-projects" className="relative z-[1]">
          <Projects />
        </div>
        {/* Placement 3: After Projects */}
        {renderInjectedSections(3)}

        <div id="key-achievements" className="relative z-[1]">
          <KeyAchievements />
        </div>
        {/* Placement 4: After Key Achievements */}
        {renderInjectedSections(4)}

        <div id="skills" className="relative z-[1]">
          <Skills />
        </div>
        {/* Placement 5: After Skills */}
        {renderInjectedSections(5)}
      </div>

      <div id="contact">
        <Contact />
        <Footer />
      </div>

      {/* Global Advanced AI Assistant Floating Trigger & Modal */}
      <IntelligenceCore />
    </main>
  );
}

export default Home;
