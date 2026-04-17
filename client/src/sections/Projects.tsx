import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin } from 'lucide-react';

import EXPERIENCE_DATA_JSON from '../data/experience.json';

interface ProjectObj {
  _id?: string;
  name: string;
  location: string;
  images: string[];
}

interface Experience {
  _id?: string;
  id?: number;
  company: string;
  role: string;
  duration: string;
  location: string;
  responsibilities: string[];
  projects: ProjectObj[];
  order?: number;
}

const getTextClasses = (pos: 'top' | 'bottom' | 'left' | 'right') => {
  switch (pos) {
    case 'top': return 'bottom-full mb-3 md:mb-5 left-1/2 -translate-x-1/2 text-center';
    case 'bottom': return 'top-full mt-3 md:mt-5 left-1/2 -translate-x-1/2 text-center';
    case 'left': return 'right-full mr-3 md:mr-5 top-1/2 -translate-y-1/2 text-right';
    case 'right': return 'left-full ml-3 md:ml-5 top-1/2 -translate-y-1/2 text-left';
  }
};

// --- OPTIMIZED ALGORITHMIC INFINITE TIMELINE GENERATOR ---
const generateTimeline = (count: number) => {
  if (count === 0) return { nodes: [], path: '', height: 600 };

  const nodes = [];
  
  // A pattern block holds 5 nodes and drops the Y-axis by 400px
  const xPattern = [300, 700, 1000, 500, 0];
  const yOffsets = [0, 0, 100, 200, 300];
  const posPattern = ['bottom', 'top', 'left', 'top', 'right'] as const;

  let maxY = 100;

  for (let i = 0; i < count; i++) {
      const block = Math.floor(i / 5);
      const mod = i % 5;
      
      const blockYOffset = block * 400;
      const staticY = 100 + blockYOffset + yOffsets[mod];
      if (staticY > maxY) maxY = staticY;

      nodes.push({
          pxLeft: `${(xPattern[mod] / 1000) * 100}%`,
          pxTop: `${staticY}px`,
          textPos: posPattern[mod]
      });
  }

  // Draw strict segments up to the max Y required
  const targetLevel = Math.floor(maxY / 100);
  let path = `M 100 100 L 900 100`; // Level 1
  let currentY = 100;

  for (let lvl = 2; lvl <= targetLevel; lvl++) {
      if (lvl % 4 === 2) {
          // Arc Right Down
          currentY += 200;
          path += ` A 100 100 0 0 1 900 ${currentY}`;
      }
      else if (lvl % 4 === 3) {
          // Line Left
          path += ` L 100 ${currentY}`;
      }
      else if (lvl % 4 === 0) {
          // Arc Left Down
          currentY += 200;
          path += ` A 100 100 0 0 0 100 ${currentY}`;
      }
      else if (lvl % 4 === 1) {
          // Line Right
          path += ` L 900 ${currentY}`;
      }
  }

  const height = Math.max(600, currentY + 100);

  return { nodes, path, height };
};


const Projects = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectObj | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(0); // -1 left, 1 right
  const touchStartX = useRef(0);

  const goNext = useCallback(() => {
    if (mobileCardIndex < experiences.length - 1) {
      setSwipeDir(-1);
      setMobileCardIndex(i => i + 1);
    }
  }, [mobileCardIndex, experiences.length]);

  const goPrev = useCallback(() => {
    if (mobileCardIndex > 0) {
      setSwipeDir(1);
      setMobileCardIndex(i => i - 1);
    }
  }, [mobileCardIndex]);

  // Auto-advance carousel every 5 seconds, loop back to start
  useEffect(() => {
    if (experiences.length <= 1) return;
    const timer = setInterval(() => {
      setSwipeDir(-1);
      setMobileCardIndex(prev => (prev + 1) % experiences.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mobileCardIndex, experiences.length]);

  // Fetch Experience Data from CMS with automatic frontend parachute fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portfolio/experiences');
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
              setExperiences(data.data);
          } else {
              setExperiences(EXPERIENCE_DATA_JSON as Experience[]);
          }
        } else {
          setExperiences(EXPERIENCE_DATA_JSON as Experience[]);
        }
      } catch (err) {
        console.error("Backend offline. Engaging fallback timeline.", err);
        setExperiences(EXPERIENCE_DATA_JSON as Experience[]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lock all background scroll/interaction when modal is open
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (selectedExp) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [selectedExp]);

  const { nodes, path, height } = generateTimeline(experiences.length);

  return (
    <section className="relative min-h-fit md:min-h-[100dvh] w-full font-sans flex flex-col pt-12 pb-8 overflow-hidden bg-white">

      {/* Title */}
      <div className="relative z-20 w-full flex flex-col items-center shrink-0 mb-6 lg:mb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase">
            Professional Experience & Projects
          </h2>
          <div className="w-16 md:w-24 h-px bg-black mx-auto mt-4 md:mt-6 opacity-30" />
        </motion.div>
      </div>

      {loading ? (
        <div className="w-full flex-1 flex items-center justify-center p-12 animate-pulse flex-col opacity-50">
            <div className="w-24 h-[1px] bg-black mb-4" />
            <p className="tracking-[0.2em] uppercase text-xs font-bold text-black border border-black/10 px-6 py-2">Loading Timeline Model...</p>
        </div>
      ) : (
        <>
          {/* ========== MOBILE SWIPE CAROUSEL (< md) ========== */}
          <div className="md:hidden relative z-10 w-full px-5 py-6 flex flex-col">

            {/* Card Container — fixed height */}
            <div
              className="relative w-full h-[220px] overflow-hidden"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                if (delta < -50) goNext();
                else if (delta > 50) goPrev();
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={mobileCardIndex}
                  initial={{ x: swipeDir < 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: swipeDir < 0 ? -300 : 300, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                  onClick={() => {
                    const exp = experiences[mobileCardIndex];
                    if (exp) {
                      setSelectedExp(exp);
                      if (exp.projects && exp.projects.length > 0) setSelectedProject(exp.projects[0]);
                    }
                  }}
                >
                  {(() => {
                    const exp = experiences[mobileCardIndex];
                    if (!exp) return null;
                    return (
                      <div className="w-full h-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] rounded-2xl p-5 bg-[#0A0A0A] flex flex-col justify-between cursor-pointer active:bg-black transition-colors">
                        {/* Top */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">
                              {String(mobileCardIndex + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-wide leading-snug">
                            {exp.company}
                          </h3>
                          <p className="text-[11px] text-white/50 uppercase tracking-[0.15em] mt-1.5 font-medium">
                            {exp.role}
                          </p>
                        </div>

                        {/* Bottom */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                              <Briefcase size={10} className="text-white/30" /> {exp.duration}
                            </span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin size={10} className="text-white/30" /> {exp.location}
                            </span>
                          </div>
                          <span className="text-[10px] text-white font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">
                            {exp.projects?.length || 0} Projects →
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls: Arrows + Dots */}
            <div className="flex items-center justify-between mt-5 px-1">
              {/* Prev Arrow */}
              <button
                onClick={goPrev}
                disabled={mobileCardIndex === 0}
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center disabled:opacity-20 active:bg-black/5 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {experiences.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSwipeDir(i > mobileCardIndex ? -1 : 1); setMobileCardIndex(i); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === mobileCardIndex
                        ? 'w-5 h-1.5 bg-black'
                        : 'w-1.5 h-1.5 bg-black/15'
                    }`}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={goNext}
                disabled={mobileCardIndex === experiences.length - 1}
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center disabled:opacity-20 active:bg-black/5 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>

          {/* ========== DESKTOP S-CURVE TIMELINE (md+) ========== */}
          <div className="hidden md:flex relative z-10 w-full flex-1 justify-center">
            <div className="w-full overflow-x-auto no-scrollbar px-8 md:px-24 py-12 md:py-16">
              <div className={`relative w-full max-w-5xl mx-auto`} style={{ height: `${height}px` }}>

                {/* The SVG S-Curve Line generated mathematically */}
                <svg viewBox={`0 0 1000 ${height}`} className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  {/* Drop Shadow Line */}
                  <path
                    d={path}
                    fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="12" strokeLinecap="round" transform="translate(0, 6)"
                  />
                  {/* Main Black Line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: Math.max(2, experiences.length * 0.3), ease: "easeInOut" }}
                    d={path}
                    fill="none" stroke="black" strokeWidth="6" strokeLinecap="round"
                  />
                </svg>

                {/* The Interactive Nodes mapped to coordinates */}
                {experiences.map((exp, index) => {
                  const nodePos = nodes[index];
                  if (!nodePos) return null;

                  return (
                    <div
                      key={exp._id || index}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      style={{ left: nodePos.pxLeft, top: nodePos.pxTop }}
                      onClick={() => {
                        setSelectedExp(exp);
                        if (exp.projects && exp.projects.length > 0) {
                          setSelectedProject(exp.projects[0]);
                        }
                      }}
                    >
                      {/* The Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', delay: index * 0.15 }}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-[4px] border-black shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:scale-150 group-hover:bg-black transition-all duration-300"
                      />

                      {/* The Text Label */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                        className={`absolute w-32 md:w-40 pointer-events-none transition-all duration-300 ${getTextClasses(nodePos.textPos)}`}
                      >
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60 group-hover:text-black leading-snug">
                          {exp.company}
                        </p>
                        <p className="text-[8px] md:text-[9px] text-black/40 mt-1 hidden md:block uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100">
                          View Projects
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Two-Pane Experience Modal — portaled to body to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {selectedExp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/80 backdrop-blur-md"
              onClick={() => {
                setSelectedExp(null);
                setSelectedProject(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-7xl h-[85vh] md:h-[90vh] flex flex-col md:flex-row relative border border-black/10 shadow-2xl rounded-sm overflow-hidden bg-white"
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedExp(null);
                    setSelectedProject(null);
                  }}
                  className="absolute top-4 right-4 z-50 p-2 md:p-3 bg-black text-white hover:bg-black/80 transition-all duration-300 rounded-sm shadow-lg"
                >
                  <X size={18} />
                </button>

                {/* Left Pane — Company & Projects List */}
                <div className="w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-black/10 flex flex-col h-[40%] md:h-full bg-[#F8F8F8] shrink-0">
                  <div className="p-6 md:p-8 pb-4 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-black mb-4" />
                    <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-widest leading-relaxed">
                      {selectedExp.company}
                    </h2>
                    <p className="text-black/50 text-xs uppercase tracking-[0.2em] mt-2">
                      {selectedExp.role}
                    </p>
                    <div className="flex flex-col gap-2 text-[10px] text-black/40 mt-4 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Briefcase size={12} className="text-black/30" /> {selectedExp.duration}</span>
                      <span className="flex items-center gap-2"><MapPin size={12} className="text-black/30" /> {selectedExp.location}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-black/5 my-2 shrink-0" />

                  <div className="px-6 md:px-8 py-2 shrink-0">
                    <h3 className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em]">Projects Completed</h3>
                  </div>

                  {/* Projects List Scrollable */}
                  <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8 space-y-2 mt-2 no-scrollbar">
                    {selectedExp.projects.map((proj, idx) => {
                      const isSelected = selectedProject?.name === proj.name && selectedProject?.location === proj.location;
                      return (
                        <button
                          key={`${proj.name}-${idx}`}
                          onClick={() => setSelectedProject(proj)}
                          className={`w-full text-left p-4 rounded-sm border transition-all duration-300 group ${isSelected
                            ? 'bg-black text-white border-black shadow-lg'
                            : 'border-black/10 bg-transparent text-black/50 hover:border-black/30 hover:text-black hover:bg-black/5'
                            }`}
                        >
                          <h4 className={`text-xs font-bold uppercase tracking-widest leading-snug transition-colors duration-300 ${isSelected ? 'text-white' : 'group-hover:text-black'}`}>
                            {proj.name}
                          </h4>
                          {proj.location && (
                            <p className={`text-[9px] mt-2 tracking-widest uppercase transition-colors duration-300 ${isSelected ? 'text-white/60' : 'text-black/30'}`}>
                              {proj.location}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Pane — Image Gallery */}
                <div className="w-full md:w-[65%] lg:w-[70%] h-[60%] md:h-full flex flex-col relative bg-white p-6 md:p-10 overflow-hidden">
                  {selectedProject ? (
                    <>
                      {/* Header */}
                      <div className="shrink-0 mb-6 md:mb-8 flex flex-col gap-2">
                        <h3 className="text-black text-base md:text-xl uppercase tracking-widest font-bold flex items-center gap-4">
                          Project Gallery
                          <div className="flex-1 h-px bg-black/10" />
                        </h3>
                        <p className="text-xs text-black/50 font-bold tracking-widest uppercase">{selectedProject.name}</p>
                      </div>

                      {/* Gallery Scroll Area */}
                      <div className="flex-1 overflow-y-auto w-full no-scrollbar pr-2 md:pr-4">
                        {selectedProject.images && selectedProject.images.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-12">
                            {selectedProject.images.map((img, i) => (
                              <div key={i} className="relative w-full aspect-[4/3] rounded-sm bg-[#F5F5F5] border border-black/10 overflow-hidden group">
                                <img
                                  src={img}
                                  alt={`${selectedProject.name} Image ${i + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-[300px] md:h-full min-h-[300px] text-black/30 border border-dashed border-black/10 bg-[#FAFAFA] rounded-sm p-8 text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-dashed border-black/15 rounded-full flex items-center justify-center mb-4 md:mb-6">
                              <span className="text-xs uppercase tracking-widest">+</span>
                            </div>
                            <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-2 text-black/40">Gallery Empty</p>
                            <p className="text-[10px] md:text-xs tracking-widest uppercase max-w-sm">Use the Admin Experience DB to drop images inside this project.</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20 font-bold tracking-widest uppercase text-xs">
                        Select a project from the left
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Projects;
