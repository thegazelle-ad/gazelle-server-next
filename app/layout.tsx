import '../styles/globals.css'

import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { Lora, Roboto } from 'next/font/google';

const lora = Lora({
  variable: '--font-lora',
  display: 'swap',
});

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400', '500'],
  style: ['normal'],
  display: 'swap',
});

// Static metadata
export const metadata = {
  title: 'title',
  robots: {
    index: true,
  }
};

export default function RootLayout ({ children }: { children: React.ReactNode }) {  
  return (
    <html lang="en" className={`${lora.variable} ${roboto.variable}`}>
      <body>
        <div className="container mx-auto p-5 min-h-screen flex flex-col flex-nowrap max-w-screen-lg px-4 md:px-2 font-roboto">
          <Navigation navigationData={{published_at: 1676210107, issueNumber: 100}}/>
          {/* Nav Bar */}
          {children}
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
};
