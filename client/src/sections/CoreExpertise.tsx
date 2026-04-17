import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

const EXPERTISE_DATA = [
    {
        id: '01',
        title: 'Project Management & Execution',
        desc: 'End-to-end delivery from concept development to final site handover.',
        keywords: ['Planning', 'Scheduling', 'Handover', 'Milestones'],
    },
    {
        id: '02',
        title: 'Site Coordination & Supervision',
        desc: 'Managing diverse contractors, MEP consultants, and resolving real-time workflow physical clashes.',
        keywords: ['MEP', 'Clash Resolution', 'On-Site', 'Supervision'],
    },
    {
        id: '03',
        title: 'BOQ, Estimation & Cost Control',
        desc: 'Engineering financial efficiency, stringent quotation evaluation, and zero-variance budget mapping.',
        keywords: ['BOQ', 'Budgets', 'Quotations', 'Cost Analysis'],
    },
    {
        id: '04',
        title: 'Quality Assurance & Compliance',
        desc: 'Enforcing uncompromising safety standards and strict regulatory code requirements.',
        keywords: ['QA/QC', 'Safety', 'Compliance', 'Audits'],
    },
    {
        id: '05',
        title: 'Vendor & Contractor Management',
        desc: 'Demanding quality workmanship through aggressive subcontractor coordination and tier-1 vendor sourcing.',
        keywords: ['Vendors', 'Procurement', 'Contracts', 'Sourcing'],
    },
    {
        id: '06',
        title: 'Multi-Site Project Delivery',
        desc: 'Simultaneous panoramic project control maintaining standardized execution across diverse geographic locations.',
        keywords: ['Multi-Site', 'Parallel Execution', 'Standardization', 'Pan-India'],
    },
];

const MobileKinematicDeck = () => {
    const [frontIndex, setFrontIndex] = useState(0);

    const handleDragEnd = (_event: any, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold || info.offset.x > threshold) {
            // They swiped far enough! Advance the deck
            setFrontIndex(prev => (prev + 1) % EXPERTISE_DATA.length);
        }
    };

    return (
        <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-white px-5 py-10 font-sans">
            {/* Title Header */}
            <div className="shrink-0 z-20 flex flex-col items-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl uppercase text-black">
                        My Expertise
                    </h2>
                    <div className="w-16 h-px bg-black mx-auto mt-4 opacity-30" />
                </motion.div>
            </div>

            {/* Deck Container */}
            <div className="relative w-full max-w-sm aspect-[4/5] z-10">
                {EXPERTISE_DATA.map((item, i) => {
                    const position = (i - frontIndex + EXPERTISE_DATA.length) % EXPERTISE_DATA.length;
                    const isFront = position === 0;

                    return (
                        <motion.div
                            key={item.id}
                            className={`absolute inset-0 rounded-3xl bg-[#1E1E1E] shadow-2xl flex flex-col justify-between p-6 cursor-grab active:cursor-grabbing border-t border-white/10 ${isFront ? '' : 'pointer-events-none'}`}
                            initial={false}
                            animate={{
                                scale: 1 - position * 0.05,
                                y: position * 18,
                                zIndex: EXPERTISE_DATA.length - position,
                                opacity: position >= 3 ? 0 : 1 - position * 0.15,
                            }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            drag={isFront ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.8}
                            onDragEnd={isFront ? handleDragEnd : undefined}
                            whileTap={isFront ? { scale: 0.98 } : {}}
                        >
                            {/* Glass gradient overlay */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <span className="relative z-10 font-mono font-bold tracking-widest text-white/30 text-5xl mb-4">
                                {item.id}
                            </span>
                            <h3 className="relative z-10 font-bold uppercase tracking-[0.1em] leading-tight text-white text-xl mb-3">
                                {item.title}
                            </h3>
                            <p className="relative z-10 text-white/60 text-sm font-medium leading-relaxed">
                                {item.desc}
                            </p>
                            
                            <div className="relative z-10 mt-auto flex flex-wrap gap-2">
                                {item.keywords.map((kw) => (
                                    <span key={kw} className="px-3 py-1 flex items-center justify-center text-[10px] uppercase tracking-[0.15em] font-bold border border-white/20 text-white/80 bg-white/10 backdrop-blur-md rounded-md">
                                        {kw}
                                    </span>
                                ))}
                            </div>

                            {/* Swipe Indicator */}
                            {isFront && (
                                <motion.div 
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/20 text-[9px] uppercase tracking-widest font-bold pointer-events-none"
                                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    <span>←</span> SWIPE <span>→</span>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Deck Progress Dots */}
            <div className="absolute bottom-16 flex gap-3 z-10">
                {EXPERTISE_DATA.map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-black pointer-events-none"
                        animate={{
                            opacity: i === frontIndex ? 1 : 0.15,
                            scale: i === frontIndex ? 1.5 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>
        </section>
    );
};

const DesktopAccordion = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const indexValues = useTransform(scrollYProgress, [0, 1], [0, EXPERTISE_DATA.length - 0.01]);

    useMotionValueEvent(indexValues, "change", (latest) => {
        setActiveIndex(Math.floor(latest));
    });

    return (
        <section ref={containerRef} className="relative h-[600vh] w-full font-sans">
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col bg-white">
                <div className="absolute top-8 lg:top-12 left-0 right-0 z-20 pointer-events-none flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase">
                            My Expertise
                        </h2>
                        <div className="w-16 md:w-24 h-px bg-black mx-auto mt-4 md:mt-6 opacity-30" />
                    </motion.div>
                </div>

                <div className="relative z-10 flex flex-col w-full h-full pt-20 md:pt-28 lg:pt-32 pb-8 md:pb-12 px-5 md:px-8 lg:px-16">
                    {EXPERTISE_DATA.map((item, index) => {
                        const isActive = activeIndex === index;
                        const isCompressed = !isActive;

                        return (
                            <motion.div
                                key={item.id}
                                className="relative w-full overflow-hidden cursor-pointer rounded-lg md:rounded-2xl my-0.5 md:my-1"
                                style={{ flex: index === activeIndex ? 5 : 0.6 }}
                                animate={{ flex: index === activeIndex ? 5 : 0.6 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => {
                                    const lenis = (window as any).__lenis;
                                    if (lenis && containerRef.current) {
                                        const targetY = containerRef.current.offsetTop + (index * window.innerHeight);
                                        lenis.scrollTo(targetY, { duration: 1.2 });
                                    }
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-[#1E1E1E] pointer-events-none"
                                    initial={false}
                                    animate={{ opacity: isActive ? 1 : 0 }}
                                    transition={{ duration: 0.4 }}
                                />

                                <motion.div
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 h-[40%] w-0.5 bg-white rounded-full"
                                    initial={false}
                                    animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ originY: 0 }}
                                />

                                <div className="relative z-10 flex items-center h-full px-4 md:px-8 lg:px-16">
                                    <motion.span
                                        className="font-mono font-bold tracking-widest shrink-0 mr-3 md:mr-10 lg:mr-16"
                                        initial={false}
                                        animate={{
                                            fontSize: isActive ? 'clamp(2rem, 6vw, 4rem)' : 'clamp(0.9rem, 2vw, 1.25rem)',
                                            color: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.12)',
                                        }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {item.id}
                                    </motion.span>

                                    <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden">
                                        <motion.h3
                                            className="font-bold uppercase tracking-[0.05em] md:tracking-[0.1em] lg:tracking-[0.15em] leading-tight"
                                            initial={false}
                                            animate={{
                                                fontSize: isActive ? 'clamp(0.9rem, 3.5vw, 2.5rem)' : 'clamp(0.6rem, 1.8vw, 1.1rem)',
                                                color: isActive ? 'rgba(255,255,255,1)' : isCompressed ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.6)',
                                            }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            {item.title}
                                        </motion.h3>

                                        <motion.div
                                            initial={false}
                                            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-white/50 text-xs md:text-sm lg:text-lg font-medium leading-relaxed mt-1.5 md:mt-2 lg:mt-3 max-w-2xl">
                                                {item.desc}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-3 lg:mt-4 pb-1">
                                                {item.keywords.map((kw) => (
                                                    <span key={kw} className="px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest font-semibold border border-white/20 text-white/70 bg-white/5 rounded-md">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        className="shrink-0 ml-2 md:ml-4 lg:ml-8"
                                        initial={false}
                                        animate={{ rotate: isActive ? 180 : 0, opacity: isActive ? 1 : 0.2 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#ffffff' : '#000000'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <polyline points="19 12 12 19 5 12" />
                                        </svg>
                                    </motion.div>
                                </div>

                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                                    initial={false}
                                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 0.3 : 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ originX: 0 }}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 w-full max-w-[250px]">
                    <span className="text-[10px] font-bold text-black tracking-[0.2em] uppercase">01</span>
                    <div className="flex-1 h-[2px] bg-black/10 relative overflow-hidden">
                        <motion.div className="absolute top-0 left-0 h-full w-full bg-black origin-left" style={{ scaleX: scrollYProgress }} />
                    </div>
                    <span className="text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">
                        {String(EXPERTISE_DATA.length).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </section>
    );
};

const CoreExpertise = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024); // Use lg breakpoint to trigger mobile deck early on tablets too
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Prevent hydration mismatch or layout jump by rendering a blank section if undefined 
    if (typeof window === 'undefined') return <section className="h-[100dvh]" />;

    if (isMobile) {
        return <MobileKinematicDeck />;
    }

    return <DesktopAccordion />;
};

export default CoreExpertise;
