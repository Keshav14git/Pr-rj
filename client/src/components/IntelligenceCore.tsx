import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Static Scenario Data (Blueprint Generator) ---
const SCENARIOS = {
    retail: {
        id: 'retail',
        label: 'High-Budget Retail Fit-outs',
        title: 'Retail Execution Portfolio',
        assertion: 'Delivering flagship retail environments with surgical precision and zero brand compromise.',
        metrics: [
            { value: '35+', label: 'Retail Outlets Delivered' },
            { value: '$2M+', label: 'Avg. Project Budget' },
            { value: '100%', label: 'Brand Standard Compliance' }
        ],
        body: 'In luxury and high-street retail, handover delays mean direct revenue loss. My approach isolates critical-path dependencies (like bespoke millwork and imported fixtures) from standard civil progress, allowing parallel execution. I have successfully managed multi-site rollouts across India, ensuring exact global brand guidelines are met without exception.',
        action: 'Request Retail Case Studies'
    },
    corporate: {
        id: 'corporate',
        label: 'Corporate Workspace Rollouts',
        title: 'Corporate Workspace & Institutional',
        assertion: 'Structuring high-density corporate environments geared for modern productivity.',
        metrics: [
            { value: '500k+', label: 'Sq.Ft. Delivered' },
            { value: '25+', label: 'Corporate Clients' },
            { value: 'A Grade', label: 'Safety & Compliance' }
        ],
        body: 'Corporate fit-outs demand minimal disruption, stringent MEP coordination, and flawless acoustic treatments. I specialize in bridging the gap between base-builder infrastructure and tenant requirements, delivering entire floors on fast-track schedules while maintaining top-tier safety mandates.',
        action: 'View Corporate Projects'
    },
    fasttrack: {
        id: 'fasttrack',
        label: 'Fast-Track Execution Strategies',
        title: 'Rapid Project Turnaround',
        assertion: 'Accelerating project lifecycles through aggressive vendor management and overlapping phases.',
        metrics: [
            { value: '-20%', label: 'Avg. Schedule Reduction' },
            { value: '24/7', label: 'Site Operational Capability' },
            { value: 'Zero', label: 'Compromise on Quality' }
        ],
        body: 'When time is the ultimate constraint, traditional sequential construction fails. I implement aggresive fast-track execution by overlapping design approvals with early procurement, and maintaining round-the-clock specialized shifts for civil and MEP integrations.',
        action: 'Discuss a Timeline'
    }
};

// Helper component for cinematic terminal typing effect
const TypewriterText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
    return (
        <motion.span className={`inline-block ${className}`}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.01, delay: delay + index * 0.015 }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// 3x3 "M" Dot Matrix Animation Component
const MineThinkingSpinner = () => {
    // 3x3 Grid. The "M" pattern is indices: [0, 2, 3, 4, 5, 6, 8]
    const dots = Array.from({ length: 9 }, (_, i) => i);
    const mPattern = [0, 2, 3, 4, 5, 6, 8];

    return (
        <div className="flex flex-col items-center justify-center gap-10 py-16">
            <div className="grid grid-cols-3 gap-3 w-14 h-14">
                {dots.map((dot) => {
                    const isM = mPattern.includes(dot);
                    return (
                        <motion.div
                            key={dot}
                            className="bg-white rounded-full origin-center w-full h-full"
                            animate={{
                                opacity: isM ? [0.1, 1, 0.1] : [0.05, 0.15, 0.05],
                                scale: isM ? [0.5, 1, 0.5] : [0.4, 0.5, 0.4],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: dot * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </div>
            <motion.span 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="uppercase tracking-[0.4em] text-[10px] font-bold text-white/40"
            >
                Synthesizing MINE AI
            </motion.span>
        </div>
    );
};

const IntelligenceCore = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeScenario, setActiveScenario] = useState<keyof typeof SCENARIOS | null>(null);
    const [contextualHint, setContextualHint] = useState('Detecting viewport context...');
    
    const [isGenerating, setIsGenerating] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Contextual Spy (Tour Guide)
    useEffect(() => {
        if (!isOpen) return;
        const handleScrollSpy = () => {
            const scrollY = window.scrollY;
            const windowH = window.innerHeight;
            if (scrollY < windowH * 0.5) setContextualHint('You are viewing the Hero section. Want a quick 30-second summary?');
            else if (scrollY < windowH * 1.5) setContextualHint('Viewing the Professional Profile. Can I generate a custom PDF resume?');
            else if (scrollY < windowH * 3.5) setContextualHint('Analyzing Core Expertise. Would you like to read a deep-dive case study?');
            else setContextualHint('Browsing project history. Shall I filter projects by budget size?');
        };
        handleScrollSpy();
    }, [isOpen]);

    // Handle scroll lock safely with Lenis
    useEffect(() => {
        const lenis = (window as any).__lenis;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            setTimeout(() => {
                setSearchQuery('');
                setActiveScenario(null);
                setIsGenerating(false);
            }, 500);
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Trigger Generation Sequence
    const initiateGeneration = (scenarioId: keyof typeof SCENARIOS) => {
        setIsGenerating(true);
        setActiveScenario(scenarioId);
        
        // Let the "M" dot matrix animation play out for 2.5 seconds
        setTimeout(() => {
            setIsGenerating(false);
        }, 2500);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sq = searchQuery.toLowerCase();
        if (sq.includes('retail')) initiateGeneration('retail');
        else if (sq.includes('corporate') || sq.includes('office')) initiateGeneration('corporate');
        else if (sq.includes('fast')) initiateGeneration('fasttrack');
        else alert('No specific scenario matched this query. Try a Quick-Pitch tag below!');
    };

    return (
        <>
            {/* The Continuous Gyroscopic Trigger Button (Kept the same logic but refined classes) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-16 h-16 md:w-20 md:h-20 mix-blend-difference text-white flex items-center justify-center outline-none group hover:scale-110 transition-all duration-500 cursor-pointer"
                        aria-label="Open MINE AI Intelligence Core"
                    >
                        {/* Magnetic "Attract" pulsing rings behind the gyro */}
                        <motion.div 
                            className="absolute inset-[10%] rounded-full border border-white/60 pointer-events-none"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className="absolute inset-[10%] rounded-full border border-white/30 pointer-events-none"
                            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Gyroscopic Core Animation */}
                        <motion.div
                            animate={{ y: [-3, 3, -3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative flex items-center justify-center transform-gpu preserve-3d"
                        >
                             <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                {/* Core Solid Particle */}
                                <motion.div 
                                    className="absolute w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 1, 0.9] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                                {/* Gyroscopic Rings */}
                                <motion.div 
                                    className="absolute inset-0 border-[1.5px] border-white/90 rounded-full"
                                    animate={{ rotateX: [0, 360], rotateY: [0, 180] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                                <motion.div 
                                    className="absolute inset-[3px] border-[1px] border-white/70 rounded-full"
                                    animate={{ rotateY: [0, 360], rotateZ: [0, 180] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                                <motion.div 
                                    className="absolute -inset-[3px] border-[1px] border-white/50 rounded-full"
                                    animate={{ rotateX: [0, -360], rotateZ: [0, 360] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                             </div>
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* DARK MODE - The Intelligence Core Fullscreen Overlay */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-6 bg-[#121212] overflow-hidden"
                    >

                        {/* Close Button Top Right */}
                        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-50">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 cursor-pointer outline-none flex items-center gap-2"
                            >
                                Close <span className="text-white/30">✕</span>
                            </button>
                        </div>

                        {/* Top Left Branding */}
                        <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-50 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">MINE AI // Intelligence Core</span>
                        </div>

                        {/* Main Container */}
                        <div className="w-full max-w-4xl relative z-10 flex flex-col mt-12 bg-transparent pointer-events-auto">
                            <AnimatePresence mode="wait">
                                {!activeScenario && !isGenerating ? (
                                    /* ---------------- COMMAND CENTER MODE ---------------- */
                                    <motion.div
                                        key="command-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full flex flex-col gap-12"
                                    >
                                        {/* The Search Engine */}
                                        <div className="w-full relative group">
                                            <form onSubmit={handleSearchSubmit}>
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Query project data, e.g., 'Retail'..."
                                                    className="w-full text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-white placeholder:text-white/20 bg-transparent border-none pb-4 outline-none relative z-10"
                                                />
                                                {/* Premium Subtle Pulsing Underline */}
                                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden rounded-full">
                                                    <motion.div 
                                                        className="h-full bg-white/50"
                                                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    />
                                                </div>
                                            </form>
                                            
                                            {/* Contextual Tour Guide Injection */}
                                            <motion.div 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                                className="absolute -bottom-8 left-0 flex items-center gap-3"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                                                    System Status: <span className="text-white/80"><TypewriterText text={contextualHint} /></span>
                                                </span>
                                            </motion.div>
                                        </div>

                                        {/* The Blueprint Generator Chips */}
                                        <div className="flex flex-col gap-4 w-full pt-8">
                                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
                                                <TypewriterText text="Or generate an instant pitch deck:" delay={0.2} />
                                            </span>
                                            <div className="flex flex-wrap gap-4">
                                                {Object.values(SCENARIOS).map((scenario, idx) => (
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 + (idx * 0.1) }}
                                                        key={scenario.id}
                                                        onClick={() => initiateGeneration(scenario.id as keyof typeof SCENARIOS)}
                                                        className="px-6 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl shadow-sm transition-all duration-300 group flex items-center justify-between min-w-[240px]"
                                                    >
                                                        <span className="text-xs font-bold tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">{scenario.label}</span>
                                                        <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : isGenerating ? (
                                    /* ---------------- GENERATING M-DOT MODE ---------------- */
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full flex-1 flex items-center justify-center min-h-[400px]"
                                    >
                                        <MineThinkingSpinner />
                                    </motion.div>
                                ) : activeScenario && (
                                    /* ---------------- Blueprint Report MODE (DARK) ---------------- */
                                    <motion.div
                                        key="report-mode"
                                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
                                    >
                                        <div className="relative p-8 lg:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden min-h-[140px]">

                                            <div className="flex flex-col gap-2 relative z-10">
                                                <span className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                                                    <TypewriterText text={`AI Generated Report // ${SCENARIOS[activeScenario].id}`} delay={0.1} />
                                                </span>
                                                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                                                    <TypewriterText text={SCENARIOS[activeScenario].title} delay={0.3} />
                                                </h2>
                                            </div>
                                            <button
                                                onClick={() => { setActiveScenario(null); }}
                                                className="relative z-10 shrink-0 px-4 py-2 bg-transparent border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:border-white/50 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                ← Back to Search
                                            </button>
                                        </div>

                                        <div className="p-8 lg:p-12 flex flex-col lg:flex-row gap-12 lg:gap-20 bg-black/40">
                                            {/* Main Proposition */}
                                            <div className="flex-1 flex flex-col gap-6 lg:gap-8">
                                                <h3 className="text-xl lg:text-2xl font-bold leading-tight tracking-tight text-white">
                                                    <TypewriterText text={`"${SCENARIOS[activeScenario].assertion}"`} delay={0.6} className="text-white/90" />
                                                </h3>
                                                <motion.p 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1.5, duration: 0.8 }}
                                                    className="text-sm lg:text-base text-white/60 leading-relaxed font-medium"
                                                >
                                                    {SCENARIOS[activeScenario].body}
                                                </motion.p>
                                                
                                                <motion.button 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 2.2 }}
                                                    className="self-start mt-4 px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-white/90 md:hover:scale-105 transition-all duration-300"
                                                >
                                                    {SCENARIOS[activeScenario].action}
                                                </motion.button>
                                            </div>

                                            {/* The Metric Dashboard */}
                                            <div className="shrink-0 w-full lg:w-[40%] flex flex-col gap-6">
                                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 pb-2 border-b border-white/10 w-full">Verified Metrics</span>
                                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                                                    {SCENARIOS[activeScenario].metrics.map((metric, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 1 + (i * 0.2), duration: 0.6 }}
                                                            className="flex flex-col gap-1"
                                                        >
                                                            <span className="text-3xl lg:text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{metric.value}</span>
                                                            <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">{metric.label}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default IntelligenceCore;
