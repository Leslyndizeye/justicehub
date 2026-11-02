export default {
        content: { relative: true, files: ['./*.{html,js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}', '../shared/**/*.js'] },
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              legal: {
                navy: '#0A0C14',
                gold: '#C5A059',
                charcoal: '#1A1D23',
                slate: '#1E293B',
                blue: '#3B82F6',
              }
            },
            fontFamily: {
              serif: ['Playfair Display', 'serif'],
              sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            animation: {
              'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'scroll': 'scroll 40s linear infinite',
              'burst-snap': 'burstSnap 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
              'glitch-fade': 'glitchFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
              'fade-in-up': 'fadeInUp 1s ease-out forwards',
              'scanline': 'scanline 8s linear infinite',
              'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
              scroll: {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
              burstSnap: {
                '0%': { opacity: '0', transform: 'scale(1.3) translateY(20px)', filter: 'blur(50px)' },
                '60%': { opacity: '1', transform: 'scale(0.95)', filter: 'blur(0)' },
                '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' }
              },
              glitchFade: {
                '0%': { opacity: '0', transform: 'translateY(10px)', filter: 'blur(10px)' },
                '20%': { opacity: '0.8', transform: 'translateY(-2px) skewX(5deg)' },
                '40%': { opacity: '0.5', transform: 'translateY(2px) skewX(-5deg)' },
                '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' }
              },
              fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' }
              },
              scanline: {
                '0%': { top: '-10%' },
                '100%': { top: '110%' }
              }
            }
          }
        }
      }
