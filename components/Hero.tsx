
import React, { useEffect, useState, useRef } from 'react';

const Hero: React.FC = () => {
  const [showHero, setShowHero] = useState(false);
  const [videoState, setVideoState] = useState<'hidden' | 'playing' | 'paused'>('hidden');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reveal Hero content after faster IntroSequence (3s)
    const startTimer = setTimeout(() => {
      setShowHero(true);
      setVideoState('playing');
      if (videoRef.current) {
        videoRef.current.currentTime = 7;
        videoRef.current.play().catch(() => {});
      }
    }, 3400);

    const pauseTimer = setTimeout(() => {
      setVideoState('paused');
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 7500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(pauseTimer);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-neutral-100 dark:bg-[#05070A]">
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${videoState !== 'hidden' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full relative overflow-hidden bg-black dark:bg-black bg-neutral-100">
          <video
            ref={videoRef}
            muted
            playsInline
            disablePictureInPicture
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover brightness-[0.25] contrast-[1.2] transition-all duration-[2500ms] ease-out
              ${videoState === 'paused' ? 'scale-100 grayscale-[0.6] opacity-60' : 'scale-110 opacity-100'}`}
          >
            <source src="./assets/videos/video1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 dark:from-[#05070A] via-transparent to-neutral-100 dark:to-[#05070A]"></div>
        <div className="absolute inset-0 grid-lines opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-12 flex flex-col items-center text-center">
        {showHero && (
          <div className="space-y-12">
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-[1em] text-legal-gold animate-glitch-fade">
                Counsel Protocol
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-[7.5rem] font-black tracking-[-0.05em] text-legal-navy dark:text-white leading-[0.85] flex flex-col">
              <span className="animate-burst-snap">JURISPRUDENTIAL</span>
              <span className="text-legal-gold font-serif italic relative inline-block animate-burst-snap animate-delay-200">
                EQUITY.
              </span>
            </h1>

            <div className="max-w-2xl mx-auto space-y-12">
              <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed tracking-tight animate-fade-in-up animate-delay-500">
                Empowering advocates, magistrates, and litigants with high-fidelity cognitive analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animate-delay-1000">
                <button className="px-12 py-5 bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full hover:bg-legal-gold hover:text-white transition-all">
                  Initiate Counsel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default Hero;
