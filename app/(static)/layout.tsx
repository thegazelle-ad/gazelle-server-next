import React from 'react';

export default function ArticleLayout ({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-start justify-center min-h-screen max-w-[1000px] mx-auto'>
      <div className='flex flex-col items-start justify-center max-w-[529px] mx-auto py-2 md:py-8'>
        {/* Page */}
        {children}
      </div>
    </div>
  );
};