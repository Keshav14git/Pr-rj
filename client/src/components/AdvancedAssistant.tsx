import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: 'Hello. I am the MINE AI system. How can I assist you with Rohit Jangra’s intelligence and project operational data?' }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll chat to bottom when new messages appear
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isOpen]);

    // Handle scroll lock safely with Lenis
    useEffect(() => {
        const lenis = (window as any).__lenis;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
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

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userText = message.trim();
        setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
        setMessage('');

        // Simulate AI thinking and responding
        setTimeout(() => {
            setChatHistory(prev => [
                ...prev,
                { role: 'assistant', text: 'System offline for processing. Please reach out via the Message portal for immediate human-in-the-loop assistance.' }
            ]);
        }, 1200);
    };

    return (
        <>
            {/* The 3D Floating Trigger Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-xl border border-black/10 shadow-2xl flex items-center justify-center outline-none group hover:scale-105 hover:bg-white transition-all duration-500 cursor-pointer overflow-hidden"
                        aria-label="Open AI Assistant"
                    >
                        {/* Shimmer sweep effect on hover */}
                        <motion.div 
                           className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/[0.05] to-transparent w-[200%] opacity-0 group-hover:opacity-100"
                           animate={{ x: ['-100%', '50%'] }}
                           transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* The continuous 3D floating gyroscope */}
                        <motion.div
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative flex items-center justify-center transform-gpu preserve-3d group-hover:scale-110 transition-transform duration-500"
                        >
                             <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                                {/* Core Solid Particle */}
                                <motion.div 
                                    className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                {/* Gyroscopic Rings */}
                                <motion.div 
                                    className="absolute inset-0 border-[1px] border-black/40 rounded-full"
                                    animate={{ rotateX: [0, 360], rotateY: [0, 180] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                                <motion.div 
                                    className="absolute inset-[2px] border-[1px] border-black/30 rounded-full"
                                    animate={{ rotateY: [0, 360], rotateZ: [0, 180] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                                <motion.div 
                                    className="absolute -inset-[2px] border-[1px] border-black/15 rounded-full"
                                    animate={{ rotateX: [0, -360], rotateZ: [0, 360] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />
                             </div>
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* The Advanced AI Chat Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-6 pointer-events-none">
                        
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/5 sm:bg-black/10 backdrop-blur-[2px] pointer-events-auto cursor-pointer"
                        />

                        {/* Modal Panel container */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full h-[85dvh] sm:h-auto sm:max-h-[85vh] sm:w-[450px] lg:w-[500px] bg-white/95 backdrop-blur-2xl sm:border border-black/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden sm:mr-4 sm:mb-4 lg:mr-8 lg:mb-8 absolute bottom-0 right-0 sm:static"
                        >
                            {/* Top Bar */}
                            <div className="shrink-0 flex justify-between items-center p-6 border-b border-black/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black focus:outline-none">MINE AI // SYSTEM</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors duration-300 cursor-pointer outline-none flex items-center gap-2"
                                >
                                    Close ✕
                                </button>
                            </div>

                            {/* Chat Scroll Area */}
                            <div className="flex-1 overflow-y-auto w-full p-6 flex flex-col gap-6 scroll-smooth scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
                                {chatHistory.map((msg, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                                    >
                                        <span className={`text-[9px] uppercase tracking-widest font-bold mb-1.5 ${msg.role === 'user' ? 'text-black/30' : 'text-black/50'}`}>
                                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                        </span>
                                        <div className={`text-sm tracking-tight leading-relaxed p-4 rounded-2xl ${msg.role === 'user' ? 'bg-black text-white rounded-tr-sm' : 'bg-black/5 text-black rounded-tl-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Dummy div to keep scroll at bottom */}
                                <div ref={chatEndRef} className="h-1 shrink-0" />
                            </div>

                            {/* Input Area */}
                            <div className="shrink-0 p-4 lg:p-6 bg-white border-t border-black/5 z-20">
                                <form onSubmit={handleSendMessage} className="relative flex items-center w-full bg-black/[0.03] border border-black/5 rounded-full px-2 py-2 focus-within:bg-white focus-within:border-black/20 focus-within:shadow-sm transition-all duration-300">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Ask about project data..."
                                        className="flex-1 bg-transparent px-4 text-sm outline-none text-black placeholder:text-black/30"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </form>
                                <div className="text-center mt-3">
                                    <span className="text-[8px] uppercase tracking-[0.2em] font-medium text-black/20">System running on read-only simulation</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdvancedAssistant;
