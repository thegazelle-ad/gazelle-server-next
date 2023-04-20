// A page separator (used on the main page and teams page)
export const Divider = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-[1.1rem] font-medium capitalize tracking-wide text-black whitespace-nowrap">{text}</span>
      <div className="grow h-[1px] bg-gray-500"></div>
    </div>
  )
};
