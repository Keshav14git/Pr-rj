import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

// ─── MOBILE ABOUT: Clean text only, no watermark ─────────────────

const MobileAbout = () => {
    return (
        <section id="about" className="relative w-full bg-white px-6 py-16">

            {/* Centered Section Heading — matches Expertise, Contact, etc. */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center mb-10"
            >
                <h2 className="text-center tracking-[0.2em] font-bold text-xl text-black uppercase">
                    Profile
                </h2>
                <div className="w-16 h-px bg-black mx-auto mt-4 opacity-30" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: EASE_EXPO }}
                className="flex flex-col gap-5"
            >
                {/* Main Bio */}
                <p className="text-xl font-bold text-black leading-[1.45] tracking-tight">
                    I am a Project Manager specializing in interior fit-out and turnkey projects, with over 11 years of experience delivering retail, commercial, and institutional spaces.
                </p>

                {/* Supporting Text */}
                <p className="text-sm text-black/50 font-medium leading-relaxed">
                    My work involves managing project execution, coordinating with designers, contractors, and vendors, and ensuring every stage aligns with quality, budget, and schedule expectations.
                </p>

                {/* Education — pushed down with extra top margin */}
                <div className="flex flex-col gap-3 mt-6 pt-5 border-t border-black/10">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/30 font-bold">Academic Foundation</span>

                    <motion.div
                        className="flex flex-col gap-2.5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
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
                                    hidden: { opacity: 0, x: -16 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                transition={{ duration: 0.5, ease: EASE_EXPO }}
                            >
                                <span className={`w-1.5 h-1.5 mt-1.5 shrink-0 rounded-none ${edu.filled ? 'bg-black' : 'border border-black/30'}`} />
                                <span><strong className="text-black">{edu.title}</strong> — {edu.sub}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

// ─── DESKTOP ABOUT: Original layout (preserved) ─────────────────

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

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[60%] bg-black/10 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-8 max-w-2xl py-4"
                    >
                        <div className="font-mono text-xs uppercase tracking-[0.3em] text-black/50 font-bold">
                            OPERATIONAL PROFILE // RJ-11
                        </div>

                        <div className="flex flex-col gap-6">
                            <p className="text-2xl text-black font-bold leading-[1.4] tracking-tight">
                                <Typewriter delay={0.2} text="I am a Project Manager specializing in interior fit-out and turnkey projects, with over 11 years of experience delivering retail, commercial, and institutional spaces." />
                            </p>

                            <p className="text-lg text-black/50 font-medium leading-relaxed max-w-xl">
                                <Typewriter delay={2.5} text="My work involves managing project execution, coordinating with designers, contractors, and vendors, and ensuring every stage aligns with quality, budget, and schedule expectations." />
                            </p>

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

// ─── Root: Switch based on screen width ──────────────────────────

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
