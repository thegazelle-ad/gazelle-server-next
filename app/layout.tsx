import '../styles/globals.css'

import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { Lora, Roboto } from 'next/font/google';

import {
  DEFAULT_SITE_TITLE,
} from '../env';

const lora = Lora({
  variable: '--font-lora',
  display: 'swap',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
});

// Static metadata
export const metadata = {
  title: DEFAULT_SITE_TITLE,
  robots: {
    index: true,
  }
};

export default function RootLayout ({ children }: { children: React.ReactNode }) {  
  return (
    <html lang="en" className={`${lora.variable} ${roboto.variable}`}>
      <body>
        <Navigation navigationData={{published_at: 1676210107, issueNumber: 100}}/>
        <div className="container mx-auto p-5 min-h-screen flex flex-col flex-nowrap max-w-screen-lg px-4 md:px-2 font-roboto">
          {/* Nav Bar */}
          {children}
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
};
