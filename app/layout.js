import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'InterviewGen.ai - Master Your Next Interview',
  description: 'Generate intelligent, position-specific interview questions in seconds with our AI-powered engine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
