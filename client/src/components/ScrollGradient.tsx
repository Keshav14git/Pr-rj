import { motion, useScroll, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

interface ScrollGradientProps {
    containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Scroll-Reactive Ambient Gradient — Background Layer
 * 
 * Petrol blue (#114257) themed gradient system.
 * Renders BEHIND all content (z-0, sections are z-[1]).
 */
const ScrollGradient = ({ containerRef }: ScrollGradientProps) => {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // ── PRIMARY ORB: S-curve, deep teal variations ──
    const primaryX = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ['75%', '55%', '20%', '10%', '40%', '70%']
    );
    const primaryY = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ['-15%', '15%', '35%', '55%', '70%', '90%']
    );
    const primaryBg = useTransform(
        scrollYProgress,
        [0, 0.35, 0.7, 1],
        ['#114257', '#1A5C78', '#0C3A4D', '#114257']
    );
    const primaryScale = useTransform(
        scrollYProgress, [0, 0.3, 0.6, 1], [1, 1.25, 1.15, 0.9]
    );
    const primaryOpacity = useTransform(
        scrollYProgress, [0, 0.15, 0.4, 0.7, 0.9, 1], [0.06, 0.12, 0.16, 0.13, 0.08, 0.04]
    );

    // ── SECONDARY ORB: Counter S-curve, lighter teal ──
    const secondaryX = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ['-15%', '15%', '65%', '75%', '45%', '10%']
    );
    const secondaryY = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ['95%', '70%', '50%', '30%', '15%', '-10%']
    );
    const secondaryBg = useTransform(
        scrollYProgress,
        [0, 0.35, 0.7, 1],
        ['#1A6B8A', '#0E4960', '#1F7FA3', '#1A6B8A']
    );
    const secondaryScale = useTransform(
        scrollYProgress, [0, 0.4, 0.8, 1], [0.8, 1.2, 1.1, 0.75]
    );
    const secondaryOpacity = useTransform(
        scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.04, 0.09, 0.13, 0.08, 0.03]
    );

    // ── LIGHT BEAM: Architectural spotlight sweep ──
    const beamX = useTransform(scrollYProgress, [0, 1], ['-50%', '120%']);
    const beamRotate = useTransform(scrollYProgress, [0, 1], [-60, -35]);
    const beamOpacity = useTransform(
        scrollYProgress, [0, 0.05, 0.2, 0.8, 0.95, 1], [0, 0.04, 0.08, 0.06, 0.02, 0]
    );

    return (
        <div className="sticky top-0 w-full h-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 w-screen h-screen overflow-hidden">

                {/* Primary Aurora */}
                <motion.div
                    className="absolute rounded-[50%] will-change-transform"
                    style={{
                        backgroundColor: primaryBg,
                        left: primaryX,
                        top: primaryY,
                        scale: primaryScale,
                        opacity: primaryOpacity,
                        width: '80vw',
                        height: '50vw',
                        filter: 'blur(100px)',
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                />

                {/* Secondary Counter */}
                <motion.div
                    className="absolute rounded-[50%] will-change-transform"
                    style={{
                        backgroundColor: secondaryBg,
                        left: secondaryX,
                        top: secondaryY,
                        scale: secondaryScale,
                        opacity: secondaryOpacity,
                        width: '60vw',
                        height: '40vw',
                        filter: 'blur(110px)',
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                />

                {/* Light Beam */}
                <motion.div
                    className="absolute will-change-transform"
                    style={{
                        left: beamX,
                        top: '50%',
                        rotate: beamRotate,
                        opacity: beamOpacity,
                        width: '200vw',
                        height: '8vh',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(17,66,87,0.15) 30%, rgba(255,255,255,0.05) 50%, rgba(17,66,87,0.15) 70%, transparent 100%)',
                        filter: 'blur(20px)',
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                />

                {/* Film Grain */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <filter id="scroll-grain">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#scroll-grain)" />
                </svg>
            </div>
        </div>
    );
};

export default ScrollGradient;
