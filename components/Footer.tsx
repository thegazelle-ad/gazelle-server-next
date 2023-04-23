import Link from 'next/link';

const Footer = () => {
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300"/>

      <ul className="flex flex-row gap-x-8 items-center my-3 justify-center uppercase text-black font-normal text-sm">
        <li className="w-40 text-right">
          <Link href="/about" className="hover:text-sky-600">About</Link>
        </li>
        <li className="w-40 text-center">
          <Link href="/ethics" className="hover:text-sky-600" >Code of Ethics</Link>
        </li>
        <li className="w-40 text-left">
          <Link href="/archives" className="hover:text-sky-600">Previous Issues</Link>
        </li>
      </ul>

    </div>
  );
}

export default Footer;
