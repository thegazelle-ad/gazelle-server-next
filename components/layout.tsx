// A page separator (used on the main page and teams page)
export const Divider = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-[1px] bg-bgGray"></div>
      <span className="text-[1.1rem] font-light text-lightGray whitespace-nowrap">{text}</span>
      <div className="grow h-[1px] bg-bgGray"></div>
    </div>
  )
};
