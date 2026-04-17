import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showBadge, setShowBadge] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLinkedInEnter = () => {
        if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
        setShowBadge(true);
    };

    const handleLinkedInLeave = () => {
        badgeTimerRef.current = setTimeout(() => setShowBadge(false), 400);
    };

    return (
        <footer className="relative bg-black overflow-x-hidden">
            {/* The footer slides up into the contact section's bottom padding via negative margin in App.tsx */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">

                {/* Main Footer Content — slides from left */}
                <motion.div
                    initial={{ opacity: 0, x: -120 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                >
                    {/* Architectural Divider */}
                    <div className="w-full h-px bg-white/[0.08] mb-6 md:mb-10 lg:mb-14 relative overflow-hidden">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 bg-white/20 origin-left"
                        />
                    </div>

                    {/* Three-Column Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-16 pb-8 md:pb-10 lg:pb-14">

                        {/* Column 1: Monogram + Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="md:col-span-4 flex flex-col gap-5"
                        >
                            {/* Large Monogram */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                                    RJ
                                </span>
                                <span className="w-2 h-2 bg-white rounded-full mb-1" />
                            </div>

                            <p className="text-white/30 text-xs lg:text-sm leading-relaxed max-w-xs font-medium">
                                Project Manager specializing in interior fit-out & turnkey execution across retail, commercial, and institutional spaces.
                            </p>

                            {/* Location Tag */}
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                                <span className="text-[10px] lg:text-xs uppercase tracking-[0.25em] text-white/25 font-bold">
                                    Based in India
                                </span>
                            </div>
                        </motion.div>

                        {/* Column 2: Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="md:col-span-4 flex flex-col gap-3 md:gap-4"
                        >
                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-1 md:mb-2">
                                Navigation
                            </h4>
                            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-y-3 gap-x-4">
                                {['About', 'Expertise', 'Experience', 'Achievements', 'Skills', 'Contact'].map((label, i) => (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            const sectionIds = ['about', 'core-expertise', 'experience-projects', 'key-achievements', 'skills', 'contact'];
                                            const el = document.getElementById(sectionIds[i]);
                                            const lenis = (window as any).__lenis;
                                            if (el && lenis) {
                                                lenis.scrollTo(el, { offset: 0, duration: 1.6 });
                                            } else if (el) {
                                                el.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="group flex items-center gap-2 md:gap-3 text-left cursor-pointer w-fit"
                                    >
                                        <span className="w-0 group-hover:w-3 md:group-hover:w-4 h-px bg-white transition-all duration-300" />
                                        <span className="text-xs lg:text-sm text-white/35 group-hover:text-white font-medium uppercase tracking-[0.15em] transition-all duration-300 group-hover:translate-x-1">
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Column 3: Connect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="md:col-span-4 flex flex-col gap-4"
                        >
                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-2">
                                Connect
                            </h4>

                            {/* Email with Hover Card */}
                            <div
                                className="relative"
                                onMouseEnter={() => { if (emailTimerRef.current) clearTimeout(emailTimerRef.current); setShowEmail(true); }}
                                onMouseLeave={() => { emailTimerRef.current = setTimeout(() => setShowEmail(false), 400); }}
                            >
                                <a href="mailto:rohitjangra1993@gmail.com" className="group flex items-center gap-4 w-fit">
                                    <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/40 group-hover:bg-white/5 flex items-center justify-center transition-all duration-300 text-white/30 group-hover:text-white text-xs">
                                        ✉
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-[0.15em] transition-colors duration-300">Email</span>
                                        <span className="text-[10px] text-white/15 group-hover:text-white/40 tracking-wide transition-colors duration-300">rohitjangra1993@gmail.com</span>
                                    </div>
                                </a>

                                {/* Email Badge Card — same style as LinkedIn */}
                                <div
                                    className={`absolute top-full left-0 mt-3 z-50 transition-all duration-300 ease-out ${
                                        showEmail
                                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                                            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                                    }`}
                                    onMouseEnter={() => { if (emailTimerRef.current) clearTimeout(emailTimerRef.current); setShowEmail(true); }}
                                    onMouseLeave={() => { emailTimerRef.current = setTimeout(() => setShowEmail(false), 400); }}
                                >
                                    {/* Arrow */}
                                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#1B1F23] border-l border-t border-white/10 rotate-45" />
                                    <div className="w-[280px] bg-[#1B1F23] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                                        {/* Gmail Logo */}
                                        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28">
                                                <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/>
                                                <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/>
                                                <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
                                                <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"/>
                                                <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"/>
                                            </svg>
                                            <span className="text-white text-[15px] font-bold tracking-tight">Gmail</span>
                                        </div>

                                        {/* Profile Content */}
                                        <div className="px-5 pb-5 flex flex-col items-start">
                                            {/* Profile Photo */}
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 mb-3 bg-[#2A2D31]">
                                                <img 
                                                    src="/rj.png" 
                                                    alt="Rohit Jangra" 
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            </div>

                                            {/* Name */}
                                            <h5 className="text-white text-[15px] font-semibold leading-tight mb-1">
                                                Rohit Jangra
                                            </h5>

                                            {/* Email */}
                                            <p className="text-white/50 text-[13px] leading-snug mb-4">
                                                rohitjangra1993@gmail.com
                                            </p>

                                            {/* Send Email Button */}
                                            <a
                                                href="mailto:rohitjangra1993@gmail.com"
                                                className="inline-flex items-center px-5 py-1.5 rounded-full border border-white/30 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors duration-200"
                                            >
                                                Send email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn with Badge Popup */}
                            <div
                                className="relative"
                                onMouseEnter={handleLinkedInEnter}
                                onMouseLeave={handleLinkedInLeave}
                            >
                                <a href="https://www.linkedin.com/in/rohitjangra01/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 w-fit">
                                    <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/40 group-hover:bg-white/5 flex items-center justify-center transition-all duration-300 text-white/30 group-hover:text-white text-xs">
                                        in
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-[0.15em] transition-colors duration-300">LinkedIn</span>
                                        <span className="text-[10px] text-white/15 group-hover:text-white/40 tracking-wide transition-colors duration-300">linkedin.com/in/rohitjangra01</span>
                                    </div>
                                </a>

                                {/* Custom LinkedIn Badge Card — opens downward */}
                                <div
                                    className={`absolute top-full left-0 mt-3 z-50 transition-all duration-300 ease-out ${
                                        showBadge
                                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                                            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                                    }`}
                                    onMouseEnter={handleLinkedInEnter}
                                    onMouseLeave={handleLinkedInLeave}
                                >
                                    {/* Arrow (top) */}
                                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#1B1F23] border-l border-t border-white/10 rotate-45" />
                                    <div className="w-[280px] bg-[#1B1F23] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                                        {/* LinkedIn Logo */}
                                        <div className="px-5 pt-4 pb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 21" width="84" height="21" fill="none">
                                                <text x="0" y="17" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="700" fill="#ffffff">
                                                    Linked
                                                </text>
                                                <rect x="60" y="2" width="18" height="18" rx="3" fill="#0A66C2"/>
                                                <text x="64" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="700" fill="#ffffff">
                                                    in
                                                </text>
                                            </svg>
                                        </div>

                                        {/* Profile Content */}
                                        <div className="px-5 pb-5 flex flex-col items-start">
                                            {/* Profile Photo */}
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 mb-3 bg-[#2A2D31]">
                                                <img 
                                                    src="/rj.png" 
                                                    alt="Rohit Jangra" 
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            </div>

                                            {/* Name */}
                                            <h5 className="text-white text-[15px] font-semibold leading-tight mb-1">
                                                Rohit Jangra
                                            </h5>

                                            {/* Title */}
                                            <p className="text-white/50 text-[13px] leading-snug mb-4">
                                                Project Manager — Interior Fit-Out & Turnkey Execution
                                            </p>

                                            {/* View Profile Button */}
                                            <a
                                                href="https://www.linkedin.com/in/rohitjangra01/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-5 py-1.5 rounded-full border border-white/30 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors duration-200"
                                            >
                                                View profile
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Bar — Copyright & Back to Top */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="border-t border-white/[0.06] py-4 md:py-6 lg:py-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4"
                >
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] lg:text-xs text-white/20 tracking-[0.15em] uppercase font-medium">
                            © {currentYear} Rohit Jangra
                        </span>
                        <span className="hidden md:inline text-white/10">|</span>
                        <span className="hidden md:inline text-[10px] text-white/10 tracking-[0.15em] uppercase">
                            All Rights Reserved
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            const lenis = (window as any).__lenis;
                            if (lenis) lenis.scrollTo(0, { duration: 2 });
                            else window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group flex items-center gap-3 cursor-pointer"
                    >
                        <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-white/20 group-hover:text-white/60 transition-colors duration-300">
                            Back to top
                        </span>
                        <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 group-hover:text-white transition-colors">
                                <line x1="6" y1="10" x2="6" y2="2" />
                                <polyline points="2 5 6 2 10 5" />
                            </svg>
                        </span>
                    </button>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
