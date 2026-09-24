/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cib: {
          green: {
            DEFAULT: '#0A5C36',
            50: '#F0F9F4',
            100: '#DCF0E5',
            200: '#B9E1CB',
            300: '#86CCAA',
            400: '#4EB284',
            500: '#239663',
            600: '#0E7A48',
            700: '#0A5C36',
            800: '#07482A',
            900: '#053922',
            950: '#021F12',
          },
          red: {
            DEFAULT: '#C41230',
            50: '#FEF2F3',
            100: '#FDE8E9',
            200: '#FBD0D4',
            500: '#E02447',
            600: '#C41230',
            700: '#A10E27',
            800: '#7F0C1F',
          },
          gold: {
            DEFAULT: '#D4AF37',
            50: '#FEFCF4',
            100: '#FDF7E2',
            200: '#FAEFC3',
            300: '#F6E39D',
            400: '#EFCF65',
            500: '#D4AF37',
            600: '#B89222',
            700: '#8E6F16',
          },
          charcoal: {
            DEFAULT: '#0F172A',
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#070B14',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 92, 54, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 35px -5px rgba(10, 92, 54, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
        'elevated': '0 25px 50px -12px rgba(10, 92, 54, 0.18)',
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.35)',
        'glow-green': '0 0 25px rgba(10, 92, 54, 0.35)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
