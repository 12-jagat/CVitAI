import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        slate: {
          50: 'hsl(var(--color-slate-50))',
          100: 'hsl(var(--color-slate-100))',
          200: 'hsl(var(--color-slate-200))',
          300: 'hsl(var(--color-slate-300))',
          350: 'hsl(var(--color-slate-350))',
          400: 'hsl(var(--color-slate-400))',
          450: 'hsl(var(--color-slate-450))',
          500: 'hsl(var(--color-slate-500))',
          650: 'hsl(var(--color-slate-650))',
          600: 'hsl(var(--color-slate-600))',
          700: 'hsl(var(--color-slate-700))',
          800: 'hsl(var(--color-slate-800))',
          850: 'hsl(var(--color-slate-850))',
          900: 'hsl(var(--color-slate-900))',
          950: 'hsl(var(--color-slate-950))',
        },
        indigo: {
          50: 'hsl(var(--color-indigo-50))',
          100: 'hsl(var(--color-indigo-100))',
          200: 'hsl(var(--color-indigo-200))',
          250: 'hsl(var(--color-indigo-250))',
          300: 'hsl(var(--color-indigo-300))',
          400: 'hsl(var(--color-indigo-400))',
          500: 'hsl(var(--color-indigo-500))',
          600: 'hsl(var(--color-indigo-600))',
          700: 'hsl(var(--color-indigo-700))',
          800: 'hsl(var(--color-indigo-800))',
          900: 'hsl(var(--color-indigo-900))',
          950: 'hsl(var(--color-indigo-950))',
        },
        blue: {
          400: 'hsl(var(--color-indigo-400))',
          500: 'hsl(var(--color-indigo-500))',
          600: 'hsl(var(--color-indigo-600))',
          900: 'hsl(var(--color-indigo-900))',
        },
        violet: {
          900: 'hsl(var(--color-indigo-900))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
