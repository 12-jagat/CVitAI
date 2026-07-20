import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../components/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CVItAI - Premium AI Resume Builder & ATS Reviewer',
  description: 'Design ATS-friendly, professional resumes, get instant recruiter reviews, optimize bullet points with Google Gemini, and match job descriptions seamlessly.',
  keywords: 'Resume builder, CV maker, ATS review, AI resume analyzer, career optimization, Gemini resume editor, CVItAI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (_) {}
        `}} />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white`}>
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}