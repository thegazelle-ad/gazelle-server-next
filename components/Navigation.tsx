"use client"

import _ from 'lodash';
import Link from 'next/link';
import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';

// Icons
import Twitter from '../public/icons/twitter.svg';
import Facebook from '../public/icons/facebook-f.svg';
import Instagram from '../public/icons/instagram.svg';
import MagnifyingGlass from '../public/icons/magnifying-glass-solid.svg';


interface NavigationData {
  published_at: number;
  issueNumber: number;
}

const categories = [
  { name: 'news', slug: 'news' },
  { name: 'features', slug: 'features' },
  { name: 'opinion', slug: 'opinion' },
  { name: 'multimedia', slug: 'media' },
  { name: 'team', slug: 'team' },
];

const Navigation = ({ navigationData }: { navigationData: NavigationData }) => {
  const { published_at, issueNumber } = navigationData;

  // Whether to show the search bar 
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Render the categories
  const renderCategories = categories.map(category => {
    const { name, slug } = category;
    return (
      <li key={slug} className="px-1 font-light">
        <Link href={slug === 'team' ? '/team' : `/category/${slug}`}>
          {name}
        </Link>
      </li>
    );
  });

  return (
    <div className="mt-2 font-roboto pt-5">

      <div className="flex flex-row w-full justify-between px-4">
        {/* Search */}
        <div className="flex flex-row gap-2 items-center">
          <button className="w-4 h-5 relative cursor-pointer" onClick={() => setShowSearch(!showSearch)}>
            <Image src={MagnifyingGlass} alt="search" fill className="object-contain"/>
          </button>

          {/* Search Bar */}
          {showSearch && (
            <input
              type="text"
              className="min-w-[6rem] w-[20vw] max-w-[20rem] py-1 pl-5 pr-3 rounded-md bg-gray-100 border-2 border-gray-200 focus:outline-none focus:bg-white focus:border-purple-500"
              placeholder="Search..."
            />
          )}
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-row gap-2 m-2">
          <Link href="/" className="w-5 h-5 relative">
            <Image src={Facebook} alt="fb" fill className="object-contain"/>
          </Link>
          <Link href="/" className="w-5 h-5 relative">
            <Image src={Twitter} alt="twitter" fill className="object-contain"/>
          </Link>
          <Link href="/" className="w-5 h-5 relative">
            <Image src={Instagram} alt="insta" fill className="object-contain"/>
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-300"/>
      {/* Logo and Line */}
      {/* TODO - turn to navbar at small size */}
      <div className="relative">
        <div className="border-b border-gray-300 absolute inset-0 z-10"/>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] z-20 w-[5vw] h-[5vh]">
        <div className="absolute inset-0 bg-white z-10 w-1/2 left-1/2 transform -translate-x-1/2"/>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="z-10 object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-row justify-between items-center font-light text-sm uppercase px-4">
        <p>
          {moment(published_at).format('MMM DD, YYYY')}
        </p>
        <ul className="flex justify-center items-center m-4">{renderCategories}</ul>
        <Link href="/archives" className="">
          {`Issue ${issueNumber}`}
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
