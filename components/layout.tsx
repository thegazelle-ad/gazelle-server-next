import Link from "next/link";

// A page separator (used on the main page and teams page)
export const Divider = ({ text, className, href, capitalize }: { text: string, className?: string, href?: string, capitalize?: boolean }) => {
  const wrapLink = (href: string, children: React.ReactNode) => {
    return (
      <Link href={href}>
        {children}
      </Link>
    )
  }

  const textComponent = (<span className={`text-base md:text-sm font-normal ${capitalize ? "capitalize" : "uppercase"} tracking-wide text-black whitespace-nowrap ${href && "hover:text-sky-600"}`}>{text}</span>);

  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
        {href ? wrapLink(href, textComponent) : textComponent}
        <div className="grow h-[1px] bg-gray-500"/>
    </div>
  )
};
