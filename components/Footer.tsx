import Link from 'next/link';

const Footer = () => {
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300"/>

      <ul className="flex flex-row gap-x-8 items-center my-3 justify-center uppercase text-gray-500 font-thin">
        <li className="w-40 text-right">
          <Link href="/about">About</Link>
        </li>
        <li className="w-40 text-center">
          <Link href="/ethics">Code of Ethics</Link>
        </li>
        <li className="w-40 text-left">
          <Link href="/archives">Previous Issues</Link>
        </li>
      </ul>

    </div>
  );
}

export default Footer;
