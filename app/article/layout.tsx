import React from 'react';

export default function ArticleLayout ({ children }: { children: React.ReactNode }) {
  return (
    <div>
        {/* The article content will be passed in here */}
        {/* You're welcome to place filler (lorem ipsum) for now though */}
        <p>
            This is article text
        </p>
        {children}
    </div>
  );
};


