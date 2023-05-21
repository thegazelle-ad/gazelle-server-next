import '../styles/globals.css'

import React from 'react';
// import { Analytics } from '@vercel/analytics/react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { Lora, Roboto } from 'next/font/google';
import Script from 'next/script'

import { getLatestPublishedIssue } from '../db';

import {
  DEFAULT_SITE_TITLE,
  GA_MEASUREMENT_ID,
  OPENGRAPH_DEFAULT_IMAGE,
  OPENGRAPH_SITE_NAME,
} from '../env';
import { Metadata } from 'next';

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
export const metadata: Metadata = {
  title: DEFAULT_SITE_TITLE,
  robots: {
    index: true,
  },
  openGraph: {
    siteName: OPENGRAPH_SITE_NAME,
    images: OPENGRAPH_DEFAULT_IMAGE,
  }
};

export default async function RootLayout ({ children }: { children: React.ReactNode }) {  
  const { categories, publishedAt, issueNumber } = await getLatestPublishedIssue();

  // Borders
  const containerClass = "px-5 md:px-4 lg:px-2";

  //@ts-ignore
  return (
    <html lang="en" className={`${lora.variable} ${roboto.variable}`}>
      <body>
        {/* @ts-ignore */}
        <Navigation issueNumber={issueNumber} categories={categories} publishedAt={publishedAt} className={containerClass}/>
        {/* Main content */}
        <div className={`container max-w-screen-lg min-h-screen mx-auto flex flex-col flex-nowrap font-roboto scrollbar-hide md:my-2 ${containerClass}`}>
          {/* Nav Bar */}
          {children}
          {/* Footer */}
          <Footer />
        </div>
      </body>
      {/* Vercel Analytics */}
      {/* <Analytics/> */}
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && 
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      }
    </html>
  );
};
