import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const [mpin, setMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [mpinSuccess, setMpinSuccess] = useState(false);

  const verifyMpin = async () => {
      try {
         const res = await fetch('https://pr-rj.onrender.com/api/auth/verify-mpin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mpin })
         });
         const data = await res.json();
         if (data.success) {
            setMpinSuccess(true);
            setMpinError('');
            localStorage.setItem('adminToken', data.token);
            setTimeout(() => {
                navigate('/admin');
            }, 1000);
         } else {
            setMpinError('INVALID SEQUENCE');
         }
      } catch (err) {
         setMpinError('UPLINK FAILED');
      }
  };

  const [submitError, setSubmitError] = useState('');

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      setIsAttemptingLogin(true);
      setSubmitError('');
      try {
        const response = await fetch('https://pr-rj.onrender.com/api/auth/contact', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (data.authTriggered) {
           setStep(5);
        } else if (data.success) {
           setStep(4);
        } else {
           setSubmitError('Failed to send. Please try again.');
        }
      } catch (err) {
        console.error("Submission failed", err);
        setSubmitError('Could not reach server. Is the backend running?');
      } finally {
        setIsAttemptingLogin(false);
      }
    } else if (step === 5) {
      await verifyMpin();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <section className="relative w-full flex flex-col font-sans bg-black z-10 overflow-hidden pt-16 lg:pt-24 pb-8">

      {/* Section Heading */}
      <div className="relative z-10 shrink-0 pb-12 lg:pb-16 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase">
            Let's Connect
          </h2>
          <div className="w-16 md:w-24 h-[1px] bg-white/30 mx-auto mt-4 md:mt-6" />
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col justify-center px-6 md:px-12 lg:px-24 pb-16 lg:pb-32">

        {/* Top Split Area */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 w-full h-full align-bottom">

          {/* Left Side: Massive Typography */}
          <div className="flex-1 flex flex-col justify-end pb-6 lg:pb-8">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[3rem] md:text-[5rem] lg:text-[7rem] font-black leading-[0.85] tracking-tighter text-white uppercase"
            >
              Engineer<br />
              <span className="text-white/[0.12]">Your Vision.</span>
            </motion.h3>
          </div>

          {/* Right Side: Step-Based Form */}
          <div className="w-full lg:w-[45%] flex flex-col justify-end pb-6 lg:pb-8">
            <div className="relative h-[120px] md:h-[150px] w-full">
              <AnimatePresence mode="popLayout">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, position: 'absolute' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-end h-full w-full"
                  >
                    <label className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3 md:mb-5 block">
                      01 / Your Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent border-none outline-none text-2xl md:text-4xl lg:text-5xl text-white placeholder:text-white/10 font-bold tracking-tight pb-2"
                      placeholder="John Doe"
                      autoFocus
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, position: 'absolute' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-end h-full w-full"
                  >
                    <label className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3 md:mb-5 block">
                      02 / Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent border-none outline-none text-2xl md:text-4xl lg:text-5xl text-white placeholder:text-white/10 font-bold tracking-tight pb-2"
                      placeholder="hello@company.com"
                      autoFocus
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, position: 'absolute' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-end h-full w-full"
                  >
                    <label className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3 block">
                      03 / Your Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); nextStep(); }
                      }}
                      className="w-full h-full min-h-[80px] bg-transparent border-none outline-none text-xl md:text-3xl lg:text-4xl text-white placeholder:text-white/10 font-bold tracking-tight resize-none leading-tight pb-4 pr-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:cursor-grab active:[&::-webkit-scrollbar-thumb]:cursor-grabbing transition-colors"
                      placeholder="Write your message here..."
                      rows={2}
                      autoFocus
                    />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col justify-end h-full w-full"
                  >
                    <div className="flex items-end gap-6 pb-2">
                      <div className="w-12 h-12 shrink-0 rounded-full border border-white/30 flex items-center justify-center text-white font-bold text-xl">
                        ✓
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-2xl md:text-3xl text-white font-bold tracking-tight leading-none mb-2">Message Sent</h4>
                        <p className="text-white/40 text-[10px] md:text-sm tracking-[0.1em] uppercase">I will review and connect shortly.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, position: 'absolute' }}
                    className="flex flex-col justify-end h-full w-full"
                  >
                    <label className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3 md:mb-5 block">
                      SYSTEM OVERRIDE // ENTER MPIN
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={mpin}
                      onChange={(e) => {
                         setMpin(e.target.value.replace(/[^0-9]/g, ''));
                         setMpinError('');
                      }}
                      onKeyDown={async (e) => {
                         if (e.key === 'Enter') {
                            e.preventDefault();
                            await verifyMpin();
                         }
                      }}
                      className={`w-full bg-transparent border-none outline-none text-2xl md:text-4xl lg:text-5xl tracking-[1em] pb-2 ${mpinError ? 'text-red-500' : mpinSuccess ? 'text-green-500' : 'text-white'} font-bold`}
                      placeholder="••••"
                      autoFocus
                    />
                    {mpinError && <p className="text-red-500 text-xs tracking-widest uppercase mt-2">{mpinError}</p>}
                    {mpinSuccess && <p className="text-green-500 text-[10px] md:text-xs tracking-[0.2em] uppercase mt-2 font-bold">ACCESS GRANTED. REDIRECTING...</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="w-full flex justify-center items-center border-t-[2px] border-white/10 pt-6 lg:pt-8 relative z-20">

          {/* Form Controls */}
          <div className="flex justify-center">
            <AnimatePresence mode="popLayout">
              {step < 4 || step === 5 ? (
                <motion.button
                  key="nextbtn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, position: 'absolute' }}
                  onClick={nextStep}
                  disabled={isAttemptingLogin || mpinSuccess}
                  className="group flex flex-col items-center gap-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-5">
                    <span>
                      {step === 3 ? (isAttemptingLogin ? 'Authenticating...' : 'Send Message') : step === 5 ? 'Verify' : 'Next Step'}
                    </span>
                    <span className="w-10 h-10 rounded-full border border-white/20 group-hover:border-white group-hover:bg-white/10 flex items-center justify-center transition-colors">
                      →
                    </span>
                  </div>
                  {submitError && <span className="text-red-500 text-[10px] tracking-widest normal-case">{submitError}</span>}
                </motion.button>
              ) : (
                <motion.button
                  key="backbtn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    const lenis = (window as any).__lenis;
                    if (lenis) lenis.scrollTo(0, { duration: 1.5 });
                    else window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  Back To Top ↑
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
