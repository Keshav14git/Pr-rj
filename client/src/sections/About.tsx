import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Shared Utilities ────────────────────────────────────────────

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const Typewriter = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
    return (
        <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
                visible: { transition: { staggerChildren: 0.015, delayChildren: delay } }
            }}
            className={className}
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// Animated rolling counter for the stat slides
const RollingCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [display, setDisplay] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const unsubscribe = rounded.on('change', (v) => setDisplay(v));
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const triggerAnimation = () => {
        if (hasAnimated) return;
        setHasAnimated(true);
        animate(count, target, { duration: 2, ease: EASE_EXPO });
    };

    return (
        <motion.span
            onViewportEnter={triggerAnimation}
            viewport={{ once: true, margin: "-20%" }}
        >
            {display}{suffix}
        </motion.span>
    );
};

// ─── MOBILE: Apple-Style Scroll Storytelling ─────────────────────

const MobileAbout = () => {
    return (
        <section id="about" className="relative w-full bg-white font-sans">

            {/* ── Slide 1: Years ── */}
            <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
                {/* Faint background watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[280px] font-black text-black/[0.02] leading-none tracking-tighter">11</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 1, ease: EASE_EXPO }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-bold mb-6">Profile // 01</span>
                    <p className="text-[120px] font-black text-black leading-none tracking-tighter">
                        <RollingCounter target={11} suffix="+" />
                    </p>
                    <motion.p
                        className="text-sm uppercase tracking-[0.25em] text-black/40 font-semibold mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5, ease: EASE_EXPO }}
                    >
                        Years in Construction
                    </motion.p>
                    <motion.div
                        className="w-12 h-px bg-black/20 mt-6"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    />
                </motion.div>
            </div>

            {/* ── Slide 2: Projects ── */}
            <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-[#1E1E1E]">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 1, ease: EASE_EXPO }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6">Profile // 02</span>
                    <p className="text-[120px] font-black text-white leading-none tracking-tighter">
                        <RollingCounter target={32} suffix="+" />
                    </p>
                    <motion.p
                        className="text-sm uppercase tracking-[0.25em] text-white/40 font-semibold mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5, ease: EASE_EXPO }}
                    >
                        Projects Delivered
                    </motion.p>
                    <motion.div
                        className="w-12 h-px bg-white/20 mt-6"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    />
                </motion.div>
            </div>

            {/* ── Slide 3: Portrait + Title ── */}
            <div className="min-h-[100dvh] flex flex-col items-center justify-end relative overflow-hidden">
                {/* Full bleed photo */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.15, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: EASE_EXPO }}
                >
                    <img
                        src="/rj.png"
                        alt="Rohit Jangra"
                        className="w-full h-full object-cover object-[center_15%]"
                    />
                    {/* Heavy gradient from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </motion.div>

                {/* Title overlay */}
                <motion.div
                    className="relative z-10 px-6 pb-16 w-full"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.3, ease: EASE_EXPO }}
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold block mb-3">Profile // 03</span>
                    <h2 className="text-4xl font-black text-white leading-[1.05] tracking-tight">
                        Rohit Jangra
                    </h2>
                    <p className="text-base font-medium text-white/50 mt-2 tracking-wide">
                        Project Manager — Interior Fit-Out & Turnkey
                    </p>
                    <div className="w-16 h-px bg-white/20 mt-5" />
                </motion.div>
            </div>

            {/* ── Slide 4: Bio + Education ── */}
            <div className="min-h-[100dvh] flex flex-col justify-center px-6 py-16 relative overflow-hidden bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: EASE_EXPO }}
                    className="flex flex-col gap-6"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-bold">Profile // 04</span>

                    {/* Authority Text */}
                    <p className="text-xl font-bold text-black leading-[1.5] tracking-tight">
                        I am a Project Manager specializing in interior fit-out and turnkey projects, with over 11 years of experience delivering retail, commercial, and institutional spaces.
                    </p>

                    {/* Execution Text */}
                    <p className="text-sm text-black/50 font-medium leading-relaxed">
                        My work involves managing project execution, coordinating with designers, contractors, and vendors, and ensuring every stage aligns with quality, budget, and schedule expectations.
                    </p>

                    {/* Divider */}
                    <div className="w-full h-px bg-black/10 my-2" />

                    {/* Education */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-black/30 font-bold">Academic Foundation</span>

                        <motion.div
                            className="flex flex-col gap-3"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-10%" }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                            }}
                        >
                            {[
                                { title: 'Diploma in Civil Engineering', sub: 'N.I.M.S., New Delhi (2014)', filled: true },
                                { title: 'Senior Secondary (10+2)', sub: 'Board of Education, Delhi (2010)', filled: false },
                                { title: 'High School (10th)', sub: 'Board of Education, Haryana (2008)', filled: false },
                            ].map((edu) => (
                                <motion.div
                                    key={edu.title}
                                    className="flex items-start gap-3 text-sm text-black/60"
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    transition={{ duration: 0.6, ease: EASE_EXPO }}
                                >
                                    <span className={`w-2 h-2 mt-1.5 shrink-0 rounded-none ${edu.filled ? 'bg-black' : 'border border-black/30'}`} />
                                    <span><strong className="text-black">{edu.title}</strong> — {edu.sub}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ─── DESKTOP: Original Layout (Preserved) ────────────────────────

const DesktopAbout = () => {
    return (
        <section id="about" className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-white">

            {/* Blended Portrait Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ x: 150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "0%" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 right-0 w-full h-full lg:w-[40%]"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 40%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
                    }}
                >
                    <img
                        src="/rj.png"
                        alt="Rohit Jangra Profile"
                        className="w-full h-full object-cover object-[center_15%] opacity-90"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[15%] bg-gradient-to-t from-white to-transparent" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-50% to-transparent w-[60%]" />
            </div>

            {/* Top Heading */}
            <div className="absolute top-16 left-0 right-0 z-20 pointer-events-none flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-center tracking-[0.2em] font-bold text-2xl lg:text-3xl text-black uppercase">
                        Profile
                    </h2>
                    <div className="w-24 h-px bg-black mx-auto mt-6 opacity-30" />
                </motion.div>
            </div>

            {/* Split Screen Layout Container */}
            <div className="relative z-10 flex flex-row w-full h-full pt-24">

                {/* Massive "11" Watermark Overlay */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-[100vh] text-black/[0.03] leading-none tracking-tighter pointer-events-none select-none z-0 overflow-hidden">
                    11
                </div>

                {/* Left Side: The Narrative */}
                <div className="w-1/2 h-full flex flex-col justify-center px-24 xl:px-32 relative z-10">

                    {/* Centered Separator Line */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[60%] bg-black/10 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-8 max-w-2xl py-4"
                    >
                        {/* Header */}
                        <div className="font-mono text-xs uppercase tracking-[0.3em] text-black/50 font-bold">
                            OPERATIONAL PROFILE // RJ-11
                        </div>

                        {/* Content Blocks */}
                        <div className="flex flex-col gap-6">
                            <p className="text-2xl text-black font-bold leading-[1.4] tracking-tight">
                                <Typewriter delay={0.2} text="I am a Project Manager specializing in interior fit-out and turnkey projects, with over 11 years of experience delivering retail, commercial, and institutional spaces." />
                            </p>

                            <p className="text-lg text-black/50 font-medium leading-relaxed max-w-xl">
                                <Typewriter delay={2.5} text="My work involves managing project execution, coordinating with designers, contractors, and vendors, and ensuring every stage aligns with quality, budget, and schedule expectations." />
                            </p>

                            {/* Academic Foundation */}
                            <div className="flex flex-col gap-2 pt-5 border-t border-black/10 mt-1">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-2">Academic Foundation</div>

                                <div className="flex items-start gap-3 text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 bg-black rounded-none" />
                                    <span><strong className="text-black">Diploma in Civil Engineering</strong> — N.I.M.S., New Delhi (2014)</span>
                                </div>

                                <div className="flex items-start gap-3 text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 border border-black/40 rounded-none" />
                                    <span><strong className="text-black">Senior Secondary (10+2)</strong> — Board of Education, Delhi (2010)</span>
                                </div>

                                <div className="flex items-start gap-3 text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 border border-black/20 rounded-none" />
                                    <span><strong className="text-black">High School (10th)</strong> — Board of Education, Haryana (2008)</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ─── Root Component: Switches Based on Screen Width ──────────────

const About = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return isMobile ? <MobileAbout /> : <DesktopAbout />;
};

export default About;
