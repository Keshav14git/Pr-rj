import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationMenuProps {
    onNavigate: (sectionId: string) => void;
}

const levelData = [
    { id: '01', title: 'About', sectionId: 'about' },
    { id: '02', title: 'Expertise', sectionId: 'core-expertise' },
    { id: '03', title: 'Experience', sectionId: 'experience-projects' },
    { id: '04', title: 'Achievements', sectionId: 'key-achievements' },
    { id: '05', title: 'Skills', sectionId: 'skills' }
];

const NavigationMenu = ({ onNavigate }: NavigationMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hideButton, setHideButton] = useState(false);
    const [showMessageForm, setShowMessageForm] = useState(false);

    // Hide menu button when Contact section is in view
    useEffect(() => {
        const checkContactVisibility = () => {
            const contactEl = document.getElementById('contact');
            if (contactEl) {
                const rect = contactEl.getBoundingClientRect();
                // Hide when top of contact section reaches middle of viewport
                setHideButton(rect.top < window.innerHeight * 0.5);
            }
        };

        window.addEventListener('scroll', checkContactVisibility, { passive: true });
        checkContactVisibility(); // initial check
        return () => window.removeEventListener('scroll', checkContactVisibility);
    }, []);

    // Handle Scroll Lock and ESC Key
    useEffect(() => {
        const lenis = (window as any).__lenis;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleLinkClick = (id: string) => {
        setIsOpen(false);
        setTimeout(() => setShowMessageForm(false), 500); // reset state after close animation
        
        // Wait briefly for the menu closing state to update and Lenis to restart
        setTimeout(() => {
            onNavigate(id);
        }, 100);
    };

    return (
        <>
            {/* 9-Dot Floating Menu Toggle Button */}
            <AnimatePresence>
                {!isOpen && !hideButton && (
                    <>
                        {/* The Text - Independent element to allow mix-blend-difference on body */}
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 0.8, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsOpen(true)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="hidden md:block fixed top-[36px] lg:top-[44px] right-[88px] lg:right-[108px] z-[100] text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase mix-blend-difference text-white hover:opacity-100 transition-opacity duration-300 cursor-pointer pointer-events-auto"
                        >
                            Menu
                        </motion.span>

                        {/* The Icon Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsOpen(true)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="fixed top-6 right-6 lg:top-8 lg:right-8 z-[100] w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/15 bg-white/80 backdrop-blur-md flex justify-center items-center hover:border-black transition-all duration-300 shadow-sm pointer-events-auto outline-none"
                        >
                            <div className="grid grid-cols-3 gap-[3px] w-4 h-4 md:w-5 md:h-5 place-items-center">
                                {[...Array(9)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            scale: isHovered ? [1, 0.5, 1.2, 1] : 1,
                                            backgroundColor: isHovered ? '#000000' : '#0A0A0A'
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            delay: isHovered ? i * 0.05 : 0,
                                            ease: "easeInOut"
                                        }}
                                        className="w-[3px] h-[3px] md:w-[4px] md:h-[4px] rounded-full bg-black"
                                    />
                                ))}
                            </div>
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Navigation Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex justify-end">

                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer pointer-events-auto"
                        />

                        {/* Right-Side Panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: '0%', opacity: 1 }}
                            exit={{ x: '100%', opacity: 0.5 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full md:w-[35vw] md:min-w-[400px] h-[100dvh] md:h-[calc(100dvh-2rem)] md:my-4 md:mr-4 bg-white/95 backdrop-blur-2xl md:border border-black/10 md:rounded-[2rem] shadow-2xl flex flex-col p-6 lg:p-10 z-[120] pointer-events-auto overflow-hidden"
                        >
                            {/* Top Bar: Close / Back */}
                            <div className="flex justify-between items-center shrink-0 mb-6 lg:mb-8 text-[10px] uppercase font-bold tracking-[0.2em]">
                                <span className="text-black/30 truncate">
                                    {showMessageForm ? 'Direct Message' : 'Navigation'}
                                </span>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setTimeout(() => setShowMessageForm(false), 500);
                                    }}
                                    className="text-black hover:text-black/60 transition-colors duration-300 cursor-pointer outline-none group flex items-center gap-2"
                                >
                                    Close
                                    <span className="text-black/40 group-hover:text-black transition-colors">✕</span>
                                </button>
                            </div>

                            {/* Dynamic Content Area: Links or Form */}
                            <div className="flex-1 flex flex-col justify-start py-2 lg:py-4 min-h-0 relative z-10 w-full overflow-y-auto no-scrollbar overflow-x-hidden">
                                <AnimatePresence mode="wait">
                                    {!showMessageForm ? (
                                        <motion.div
                                            key="links"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex flex-col w-full h-full justify-center"
                                        >
                                            {levelData.map((item, i) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: 40 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.06 }}
                                                    className="w-full flex"
                                                >
                                                    <button
                                                        onClick={() => handleLinkClick(item.sectionId)}
                                                        className="group flex flex-col text-left outline-none w-full border-b border-black/5 py-4 lg:py-5 hover:border-black/20 transition-colors duration-500 first:pt-0"
                                                    >
                                                        <div className="flex items-baseline gap-4 w-full">
                                                            <span className="text-[10px] lg:text-xs font-mono tracking-widest text-black/30 group-hover:text-black transition-colors duration-500 shrink-0">
                                                                {item.id}
                                                            </span>
                                                            <h2 className="text-4xl lg:text-5xl xl:text-[3.25rem] font-medium tracking-tight text-black/40 group-hover:text-black group-hover:translate-x-3 transition-all duration-500 truncate">
                                                                {item.title}
                                                            </h2>
                                                        </div>
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="contact-form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex flex-col w-full h-full justify-center lg:px-4"
                                        >
                                            <div className="mb-8 lg:mb-12">
                                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight text-black mb-2">Get in touch</h3>
                                                <p className="text-black/50 text-sm font-medium">Have a project? Send a quick message below.</p>
                                            </div>

                                            <div className="flex flex-col gap-6 lg:gap-8 w-full">
                                                <div className="flex flex-col gap-2 relative group/input">
                                                    <label className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">Your Name</label>
                                                    <input type="text" className="w-full bg-transparent border-b border-black/10 py-2 lg:py-3 focus:border-black outline-none transition-colors text-black text-sm md:text-base placeholder:text-black/10 font-medium" placeholder="John Doe" />
                                                </div>
                                                <div className="flex flex-col gap-2 relative group/input">
                                                    <label className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                                                    <input type="email" className="w-full bg-transparent border-b border-black/10 py-2 lg:py-3 focus:border-black outline-none transition-colors text-black text-sm md:text-base placeholder:text-black/10 font-medium" placeholder="john@example.com" />
                                                </div>
                                                <div className="flex flex-col gap-2 relative group/input flex-1">
                                                    <label className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">Message</label>
                                                    <textarea className="w-full bg-transparent border-b border-black/10 py-2 lg:py-3 focus:border-black outline-none transition-colors text-black text-sm md:text-base placeholder:text-black/10 min-h-[100px] lg:min-h-[120px] resize-none font-medium" placeholder="Tell us about your project..." />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Area */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="shrink-0 flex items-center justify-between pt-6 lg:pt-8 mt-auto"
                            >
                                {/* Mail Icon Link */}
                                <a 
                                    href="mailto:hello@example.com" 
                                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:border-black transition-colors duration-300 group"
                                    aria-label="Send Email"
                                >
                                    <svg className="w-4 h-4 text-black/40 group-hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </a>

                                {/* Bottom Right Action Button */}
                                <div className="flex items-center gap-4">
                                    <AnimatePresence mode="wait">
                                        {showMessageForm && (
                                            <motion.button
                                                key="back-btn"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                onClick={() => setShowMessageForm(false)}
                                                className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 hover:text-black transition-colors"
                                            >
                                                Back
                                            </motion.button>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        onClick={() => showMessageForm ? alert('Message sent functionality pending integration!') : setShowMessageForm(true)}
                                        className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-black/80 md:hover:scale-105 transition-all duration-300"
                                    >
                                        {showMessageForm ? 'Send Message' : 'Message'}
                                    </button>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavigationMenu;
