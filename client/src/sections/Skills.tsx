import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS_LIST = [
  {
    category: 'Project Management',
    skills: [
      'Execution & Leadership',
      'Site Coordination',
      'Vendor Evaluation',
      'Milestone Tracking',
      'Stakeholder Comms'
    ]
  },
  {
    category: 'Engineering & Ops',
    skills: [
      'Quality Audits',
      'MEP & FF&E Coordination',
      'Quotation Analysis',
      'Labor Optimization',
      'HSE Compliance'
    ]
  },
  {
    category: 'Financial / Commercial',
    skills: [
      'BOQ & Billing',
      'Budget Tracking',
      'BOM Preparation',
      'Tender Documentation',
      'Value Engineering'
    ]
  },
  {
    category: 'Quality & Standards',
    skills: [
      'ISO 9001 Systems',
      'Workmanship Checks',
      'Snagging / Remediation',
      'Handover Documentation'
    ]
  },
  {
    category: 'Software & IT Tools',
    skills: [
      'AutoCAD',
      'MS Project',
      'Advanced MS Excel',
      'Adobe Photoshop',
      'Windows OS Admin'
    ]
  }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Auto-advance tabs
  const goNext = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % SKILLS_LIST.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveTab((prev) => (prev - 1 + SKILLS_LIST.length) % SKILLS_LIST.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [activeTab, goNext]);

  return (
    <section className="relative h-auto lg:h-[100dvh] w-full overflow-hidden flex flex-col font-sans bg-white pb-16 lg:pb-0">

      {/* Header */}
      <div className="relative z-10 shrink-0 pt-10 lg:pt-14 pb-4 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase">
            Skills & Capabilities
          </h2>
          <div className="w-16 md:w-24 h-px bg-black mx-auto mt-4 md:mt-6 opacity-20" />
        </motion.div>
      </div>

      {/* Architectural Pillars Matrix (DESKTOP lg+) */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 lg:pb-16 flex-1 flex flex-col justify-center min-h-0">

        <div className="hidden lg:grid grid-cols-5 gap-6 h-full flex-1">

          {SKILLS_LIST.map((pillar, pIdx) => (
            <motion.div
              key={pIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: pIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col h-full bg-[#1E1E1E] rounded-2xl overflow-hidden transition-all duration-500 relative shadow-[0_8px_30px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.18),0_6px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1"
            >
              {/* Top Bar / Category Name */}
              <div className="shrink-0 bg-white/[0.04] border-b border-white/[0.06] p-4 lg:p-5 relative z-10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-white/30 text-[10px] md:text-xs font-bold tracking-[0.2em]">
                    0{pIdx + 1}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>
                <h3 className="text-white text-xs lg:text-[13px] font-bold uppercase tracking-widest leading-snug mt-3 md:mt-4">
                  {pillar.category}
                </h3>
              </div>

              {/* Vertical Skill Nodes */}
              <div className="flex-1 flex flex-col justify-evenly p-4 lg:p-6 gap-2 relative z-10">

                {/* Background Line */}
                <div className="absolute left-[23px] lg:left-[31px] top-6 bottom-6 w-px bg-white/[0.06] group-hover:bg-white/15 transition-colors duration-500 pointer-events-none hidden lg:block" />

                {pillar.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-4 lg:gap-5 relative group/skill">

                    {/* Node / Bullet Point */}
                    <div className="relative shrink-0 w-[10px] h-[10px] lg:w-3 lg:h-3 mt-[3px] lg:mt-1 rounded-full border-[1.5px] border-white/20 bg-transparent group-hover/skill:border-white group-hover/skill:bg-white group-hover/skill:shadow-[0_0_10px_rgba(255,255,255,0.25)] transition-all duration-300 z-10" />

                    {/* Skill Text */}
                    <span className="text-white/45 font-medium text-[10px] lg:text-[11px] xl:text-xs uppercase tracking-[0.15em] leading-snug group-hover/skill:text-white transition-colors duration-300">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}

        </div>

        {/* Editorial Mobile Tabs (< lg) */}
        <div className="lg:hidden w-full flex flex-col mt-2">
          
          {/* Scrollable Tabs */}
          <div className="w-full overflow-x-auto no-scrollbar border-b border-black/10">
            <div className="flex px-5 w-max">
              {SKILLS_LIST.map((pillar, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`relative py-4 px-5 text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-black' : 'text-black/30 hover:text-black/50'
                    }`}
                  >
                    {pillar.category}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content (Airy List) */}
          <div className="w-full px-8 py-10 min-h-[300px] relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, position: 'absolute' }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 w-full"
              >
                {SKILLS_LIST[activeTab].skills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-5">
                    {/* Minimal Diamond Bullet */}
                    <div className="w-1.5 h-1.5 rotate-45 bg-black/20 shrink-0" />
                    <span className="text-[15px] font-semibold tracking-wide text-black/80 leading-snug">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Arrow Controls */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md active:bg-black/80 transition-colors"
                aria-label="Previous Category"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md active:bg-black/80 transition-colors"
                aria-label="Next Category"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
