import '../../../../styles/globals.css';

import React from 'react';
import { cache } from 'react';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { getIssue } from '../../../../db';

import { Lora, Roboto } from 'next/font/google';

import {
  DEFAULT_SITE_TITLE,
} from '../../../../env';

const getIssueCache = cache(getIssue);

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

export default async function RootLayout ({ children, params }: { children: React.ReactNode, params: { issueNumber: number }}) {  
  const { categories, publishedAt } = await getIssueCache(params.issueNumber);

  return (
    <html lang="en" className={`${lora.variable} ${roboto.variable}`}>
      <body>
        {/* @ts-ignore */}
        <Navigation issueNumber={params.issueNumber} categories={categories} publishedAt={publishedAt}/>
        <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col flex-nowrap font-roboto scrollbar-hide my-2">
          {/* Nav Bar */}
          {children}
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
};
