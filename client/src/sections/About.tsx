import { motion } from 'framer-motion';

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

const About = () => {
    return (
        <section id="about" className="relative min-h-[100dvh] lg:h-[100dvh] w-full overflow-hidden flex flex-col pt-16 lg:pt-0 bg-white">

            {/* Blended Portrait Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ x: 150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "0%" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 right-0 w-full h-full lg:w-[40%] hidden md:block"
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
                    {/* Bottom gradient to blend */}
                    <div className="absolute bottom-0 left-0 w-full h-[15%] bg-gradient-to-t from-white to-transparent" />
                </motion.div>
                {/* Sweep from left to protect text */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-70% to-transparent w-full lg:via-white/90 lg:via-50% lg:w-[60%]" />
            </div>

            {/* Top Heading */}
            <div className="absolute top-8 lg:top-16 left-0 right-0 z-20 pointer-events-none flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase">
                        Profile
                    </h2>
                    <div className="w-16 md:w-24 h-px bg-black mx-auto mt-4 md:mt-6 opacity-30" />
                </motion.div>
            </div>

            {/* Split Screen Layout Container */}
            <div className="relative z-10 flex flex-col lg:flex-row w-full h-full pt-8 md:pt-12 lg:pt-24">

                {/* Massive "11" Watermark Overlay */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-[50vh] lg:text-[100vh] text-black/[0.03] leading-none tracking-tighter pointer-events-none select-none z-0">
                    11
                </div>

                {/* Left Side: The Narrative */}
                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-5 md:px-6 lg:px-24 xl:px-32 relative z-10 border-b lg:border-b-0 border-black/10">

                    {/* Centered Separator Line */}
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[60%] bg-black/10 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4 md:gap-6 lg:gap-8 max-w-2xl py-3 md:py-4"
                    >
                        {/* Header */}
                        <div className="font-mono text-[10px] lg:text-xs uppercase tracking-[0.3em] text-black/50 font-bold">
                            OPERATIONAL PROFILE // RJ-11
                        </div>

                        {/* Content Blocks */}
                        <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
                            {/* Block 01 (The Authority) */}
                            <p className="text-lg md:text-xl lg:text-2xl text-black font-bold leading-[1.4] tracking-tight">
                                <Typewriter delay={0.2} text="I am a Project Manager specializing in interior fit-out and turnkey projects, with over 11 years of experience delivering retail, commercial, and institutional spaces." />
                            </p>

                            {/* Block 02 (The Execution) */}
                            <p className="text-sm md:text-base lg:text-lg text-black/50 font-medium leading-relaxed max-w-xl">
                                <Typewriter delay={2.5} text="My work involves managing project execution, coordinating with designers, contractors, and vendors, and ensuring every stage aligns with quality, budget, and schedule expectations." />
                            </p>

                            {/* Block 03 (Academic Foundation) */}
                            <div className="flex flex-col gap-1.5 md:gap-2 pt-3 md:pt-4 lg:pt-5 border-t border-black/10 mt-1">
                                <div className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-black/30 mb-1 lg:mb-2">Academic Foundation</div>

                                <div className="flex items-start gap-2 md:gap-3 text-xs lg:text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 bg-black rounded-none"></span>
                                    <span><strong className="text-black">Diploma in Civil Engineering</strong> — N.I.M.S., New Delhi (2014)</span>
                                </div>

                                <div className="flex items-start gap-2 md:gap-3 text-xs lg:text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 border border-black/40 rounded-none"></span>
                                    <span><strong className="text-black">Senior Secondary (10+2)</strong> — Board of Education, Delhi (2010)</span>
                                </div>

                                <div className="flex items-start gap-2 md:gap-3 text-xs lg:text-sm text-black/60">
                                    <span className="w-1.5 h-1.5 mt-1.5 shrink-0 border border-black/20 rounded-none"></span>
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

export default About;
