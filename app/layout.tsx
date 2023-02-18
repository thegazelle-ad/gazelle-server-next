import '../styles/globals.css'

import React from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';


interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <html lang="en">
      <div className="container mx-auto p-5 min-h-screen flex flex-col flex-nowrap max-w-screen-md">
        <Head>
          <title>My page title</title>
        </Head>
        <Navigation navigationData={{published_at: 1676210107, issueNumber: 100}}/>
        {/* Nav Bar */}
        {children}
      </div>
    </html>
  );
};

export default App;
