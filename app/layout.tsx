import '../styles/globals.css'

import React from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';

// Static metadata
export const metadata = {
  title: 'title',
};

export default function RootLayout ({ children }: { children: React.ReactNode }) {  
  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-5 min-h-screen flex flex-col flex-nowrap max-w-screen-lg">
          <Navigation navigationData={{published_at: 1676210107, issueNumber: 100}}/>
          {/* Nav Bar */}
            {children}
        </div>
      </body>
    </html>
  );
};
