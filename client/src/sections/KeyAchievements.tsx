import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const ACHIEVEMENTS = [
  {
    id: '01',
    title: '11+ Years of Industry Progression',
    desc: 'Built a comprehensive career over a decade, advancing from a Site Supervisor Trainee to leadership roles including Deputy Project Manager and Project Manager.'
  },
  {
    id: '02',
    title: 'Transit Infrastructure Navigation',
    desc: 'Successfully managed complex navigation fit-outs for the Delhi Metro Rail Corporation (DMRC) across four key stations: Delhi Gate, Jama Masjid, Lal Quila, and Kashmiri Gate.'
  },
  {
    id: '03',
    title: 'Large-Scale Retail Portfolio',
    desc: 'Directed project execution across 8+ diverse retail and commercial sites simultaneously for Reliance, ensuring technical compliance and quality across multiple Indian cities.'
  },
  {
    id: '04',
    title: 'ISO 9001 Quality Leadership',
    desc: 'Implemented and maintained Quality Management Systems in line with ISO 9001 standards, focusing on reducing non-conformities and enhancing inspection documentation.'
  },
  {
    id: '05',
    title: 'Premium Brand Fit-Outs',
    desc: 'Led high-end interior execution and design development for global luxury and retail icons, including Nike, Audi, Samsung, and Grohe.'
  },
  {
    id: '06',
    title: 'High-Impact Event Execution',
    desc: 'Managed time-critical site installations and logistics for major exhibitions and national events, such as Acetech and the Tata Zest Launch at Ambience Mall.'
  },
  {
    id: '07',
    title: 'Rigorous Safety & Regulatory Oversight',
    desc: 'Consistently enforced HSE (Health, Safety, and Environment) protocols and local authority regulations across diverse project sites to ensure 100% compliance.'
  },
  {
    id: '08',
    title: 'Strategic Public Sector Projects',
    desc: 'Contributed to high-visibility redevelopment initiatives, including the ITPO Complex Redevelopment model at Pragati Maidan.'
  }
];

const KeyAchievements = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0); // For mobile accordion state

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const indexValues = useTransform(scrollYProgress, [0, 1], [0, ACHIEVEMENTS.length - 0.01]);

  useMotionValueEvent(indexValues, "change", (latest) => {
    setActiveIndex(Math.floor(latest));
  });

  const active = ACHIEVEMENTS[activeIndex] || ACHIEVEMENTS[0];

  return (
    <section ref={containerRef} className="relative w-full h-auto lg:h-[400vh] font-sans">

      {/* The sticky wrapper on desktop, normally flowing on mobile */}
      <div className="relative lg:sticky top-0 h-auto lg:h-[100dvh] w-full overflow-hidden flex flex-col bg-white">

        {/* Title */}
        <div className="relative z-10 shrink-0 pt-8 md:pt-10 lg:pt-14 pb-4 md:pb-6 lg:pb-8 px-5 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase">
              Professional Achievements
            </h2>
            <div className="w-16 md:w-24 h-px bg-black mx-auto mt-4 md:mt-6 opacity-20" />
          </motion.div>
        </div>

        {/* =========================================
            DESKTOP SPLIT LAYOUT (lg+) 
        ========================================= */}
        <div className="hidden lg:flex flex-1 min-h-0 flex-col lg:flex-row w-full max-w-7xl mx-auto px-5 md:px-12 lg:px-24">
          {/* Left: Featured Achievement */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center lg:pr-16 xl:pr-24 relative py-3 md:py-6 lg:py-0">
            {/* Separator */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[60%] bg-black/10 pointer-events-none" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(4px)", position: "absolute" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6 lg:gap-8 w-full"
              >
                {/* Large Number */}
                <div className="flex items-baseline gap-4 lg:gap-6">
                  <span className="text-[60px] md:text-[100px] lg:text-[120px] xl:text-[140px] font-black text-black/[0.10] leading-none tracking-tighter select-none">
                    {active.id}
                  </span>
                  <div className="w-12 h-[1px] bg-black opacity-15 hidden lg:block" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight tracking-tight mt-[-20px] md:mt-[-30px] lg:mt-[-50px]">
                  {active.title}
                </h3>

                {/* Description */}
                <p className="text-base md:text-xl text-black/50 leading-relaxed max-w-xl">
                  {active.desc}
                </p>

                {/* Progress Indicator */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold text-black tracking-[0.2em] uppercase">
                    01
                  </span>
                  <div className="flex-1 max-w-[200px] h-[2px] bg-black/10 relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full w-full bg-black origin-left"
                      style={{ scaleX: scrollYProgress }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">
                    {String(ACHIEVEMENTS.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Achievement Index */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center lg:pl-12 xl:pl-16 py-2 md:py-4 lg:py-0">
            <nav className="flex flex-col">
              {ACHIEVEMENTS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      const lenis = (window as any).__lenis;
                      if (lenis && containerRef.current) {
                        const targetY = containerRef.current.offsetTop + (index * window.innerHeight);
                        lenis.scrollTo(targetY, { duration: 1.2 });
                      }
                    }}
                    type="button"
                    className={`group flex items-center gap-3 md:gap-4 lg:gap-5 py-2 md:py-3 lg:py-[14px] text-left transition-all duration-400 border-b border-black/[0.06] first:border-t cursor-pointer ${isActive
                        ? 'opacity-100'
                        : 'opacity-40 hover:opacity-70'
                      }`}
                  >
                    {/* Number */}
                    <span className={`text-xs font-bold tracking-[0.15em] w-7 shrink-0 transition-colors duration-400 ${isActive ? 'text-black' : 'text-black/40'
                      }`}>
                      {item.id}
                    </span>

                    {/* Active Line Indicator */}
                    <div className={`h-[1px] shrink-0 bg-black transition-all duration-500 ${isActive ? 'w-6' : 'w-0'
                      }`} />

                    {/* Title */}
                    <span className={`text-[13px] md:text-[15px] lg:text-base font-semibold tracking-wide leading-snug transition-colors duration-400 ${isActive ? 'text-black' : 'text-black/40 group-hover:text-black/60'
                      }`}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* =========================================
            MOBILE ACCORDION LAYOUT (< lg) 
        ========================================= */}
        <div className="lg:hidden w-full px-5 pb-8">
          <div className="flex flex-col bg-[#0A0A0A] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] rounded-2xl p-2">
            {ACHIEVEMENTS.map((item, index) => {
              const isActive = index === mobileActiveIndex;

              return (
                <div
                  key={item.id}
                  className="flex flex-col border-b border-white/10 last:border-b-0 overflow-hidden"
                >
                  <button
                    onClick={() => setMobileActiveIndex(isActive ? -1 : index)}
                    className="flex items-center w-full py-4 px-3 text-left transition-all active:bg-white/[0.04] rounded-lg"
                  >
                    {/* Left Active Accent */}
                    <div className="w-1.5 shrink-0 self-stretch flex items-center mr-3">
                      <motion.div
                        initial={false}
                        animate={{ height: isActive ? '100%' : '0%' }}
                        className="w-[2px] bg-white rounded-full"
                      />
                    </div>

                    <span className={`text-[11px] font-bold tracking-widest mr-4 shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}>
                      {item.id}
                    </span>
                    <span className={`text-sm md:text-base font-bold tracking-wide flex-1 pr-4 leading-snug transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {item.title}
                    </span>
                    
                    {/* Plus / Minus Icon */}
                    <div className="mr-2">
                       <motion.div
                         animate={{ rotate: isActive ? 45 : 0 }}
                         transition={{ duration: 0.3 }}
                         className="flex items-center justify-center text-white/50"
                       >
                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                           <path d="M6 1V11M1 6H11" />
                         </svg>
                       </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-11 pb-5 pr-4 pt-1">
                          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyAchievements;
