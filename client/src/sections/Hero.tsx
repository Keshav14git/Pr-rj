import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import NavigationMenu from '../components/NavigationMenu';

interface HeroProps {
    onNavigate: (sectionId: string) => void;
    initialMenuOpen?: boolean;
}

// Premium easing curves — the signature of Awwwards-level sites
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_SMOOTH = [0.22, 0.68, 0, 1] as const;

// Split-line text reveal component — the #1 Awwwards motion pattern
const LineReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
    <div className="overflow-hidden pb-[0.15em]">
        <motion.div
            initial={{ y: '110%', rotateX: -12 }}
            animate={{ y: '0%', rotateX: 0 }}
            transition={{ duration: 1.1, delay, ease: EASE_EXPO }}
            style={{ transformOrigin: 'bottom center' }}
            className={className}
        >
            {children}
        </motion.div>
    </div>
);

// Animated counter for stats
const AnimatedCounter = ({ target, suffix = '', delay = 0 }: { target: number; suffix?: string; delay?: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        // Subscribe to value changes
        const unsubscribe = rounded.on('change', (v) => setDisplay(v));

        // Delay then animate
        const timeout = setTimeout(() => {
            animate(count, target, {
                duration: 1.8,
                ease: [0.16, 1, 0.3, 1],
            });
        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{display}{suffix}</>;
};


const Hero = ({ onNavigate }: HeroProps) => {
    return (
        <section className="h-[100dvh] w-full overflow-hidden bg-white text-black flex flex-col p-3 md:p-6 lg:p-8 relative">

            {/* The Global Navigation Component */}
            <NavigationMenu onNavigate={onNavigate} />

            {/* Subtle full-screen fade from slightly warm white */}
            <motion.div
                className="absolute inset-0 bg-[#fafaf8] z-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
            />

            {/* Gallery Content */}
            <div className="flex-1 w-full min-h-0 relative flex flex-col overflow-hidden z-10">

                {/* Top Section: Logo / Navigation Area */}
                <header className="shrink-0 flex justify-between items-center p-1 md:p-6 lg:p-8">
                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration: 0.9, delay: 0.1, ease: EASE_EXPO }}
                            className="text-sm md:text-base tracking-[0.2em] font-medium uppercase text-black leading-none"
                        >
                            Rohit Jangra
                        </motion.div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 min-h-0 flex flex-col justify-end md:justify-center px-4 md:px-6 lg:px-12 pb-6 md:py-6 lg:py-8 w-full">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-16 lg:gap-16 w-full max-w-7xl mx-auto lg:items-center">

                        {/* Power Headline Area */}
                        <div className="lg:col-span-8 flex flex-col justify-center">
                            <h1 className="text-[3.25rem] sm:text-6xl lg:text-[clamp(4.5rem,6.5vw,6.5rem)] font-black text-black leading-[0.95] tracking-tighter">
                                <LineReveal delay={0.35}>
                                    Project Manager:
                                </LineReveal>
                                <LineReveal delay={0.5}>
                                    <span>Interior fit-out </span>
                                    <motion.span
                                        className="text-black/30 inline-block"
                                        initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: 1.0, ease: EASE_SMOOTH }}
                                    >
                                        &amp;
                                    </motion.span>
                                </LineReveal>
                                <LineReveal delay={0.65}>
                                    turnkey execution.
                                </LineReveal>
                            </h1>
                        </div>

                        {/* Technical / Authority Info */}
                        <div className="lg:col-span-4 flex flex-col lg:justify-between lg:h-[80%] pt-0 lg:pt-0 lg:pl-12 gap-4 md:gap-8">
                            <div className="flex flex-col justify-center flex-1 text-sm md:text-base lg:text-lg min-h-0">
                                {/* Animated horizontal rule */}
                                <h2 className="text-[10px] lg:text-xs uppercase tracking-widest text-black/40 font-semibold mb-3 lg:mb-5 flex items-center gap-4">
                                    <motion.span
                                        className="h-[1px] bg-black/20 block"
                                        initial={{ width: 0 }}
                                        animate={{ width: 32 }}
                                        transition={{ duration: 0.8, delay: 1.1, ease: EASE_EXPO }}
                                    />
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 1.25, ease: EASE_EXPO }}
                                    >
                                        Authority Statement
                                    </motion.span>
                                </h2>
                                <motion.p
                                    className="text-black/70 leading-relaxed md:max-w-sm"
                                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1, delay: 1.4, ease: EASE_SMOOTH }}
                                >
                                    <strong className="text-black">11+ years</strong> delivering retail and commercial fit-out projects. Leading multi-site execution and cross-functional teams with surgical precision.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 lg:gap-8 pt-2 md:pt-4 shrink-0">
                                {/* Stat 1 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.6, ease: EASE_EXPO }}
                                >
                                    <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-black tracking-tighter mb-1 leading-none">
                                        <AnimatedCounter target={11} delay={1.7} />
                                        <motion.span
                                            className="text-black/30"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 2.8 }}
                                        >+</motion.span>
                                    </p>
                                    <motion.p
                                        className="text-[9px] lg:text-[10px] uppercase tracking-widest text-black/40 leading-tight mt-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 2.0 }}
                                    >
                                        Years Active
                                    </motion.p>
                                </motion.div>

                                {/* Stat 2 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.8, ease: EASE_EXPO }}
                                >
                                    <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-black tracking-tighter mb-1 leading-none">
                                        <AnimatedCounter target={32} delay={1.9} />
                                        <motion.span
                                            className="text-black/30"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 3.2 }}
                                        >+</motion.span>
                                    </p>
                                    <motion.p
                                        className="text-[9px] lg:text-[10px] uppercase tracking-widest text-black/40 leading-tight mt-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 2.2 }}
                                    >
                                        Projects Done
                                    </motion.p>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

        </section>
    );
};

export default Hero;
