import React from "react";
import Link from "next/link";

const StyledLink = ({ className, href, children, passHref }: { className?: string, href: string, children: React.ReactNode, passHref?: boolean }) => {

  return (
    <Link href={href} passHref={passHref} className={`${className} text-blue-700 underline visited:text-violet-900`}>
        {children}
    </Link>
  );
};

export default StyledLink;
