"use client"

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState, FormEvent, ChangeEvent, MouseEventHandler } from 'react';

// Icons
import Twitter from '../public/icons/twitter.svg';
import Facebook from '../public/icons/facebook-f.svg';
import Instagram from '../public/icons/instagram.svg';
import MagnifyingGlass from '../public/icons/magnifying-glass-solid.svg';
import Hamburger from '../public/icons/hamburger.svg';

import {
  ARTICLE_DATE_FORMAT,
} from '../env';

type NavigationData = {
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

const mobileDropdown = [
  ...categories,
  { name: 'archives', slug: 'archives' },
]

// Menu component
const Menu = ({ show, closeMenu }: { show: boolean, closeMenu: MouseEventHandler }) => {
  return (
    <div className={`${show ? 'block' : 'hidden'}`}>
      {/* Menu */}
      <div className="bg-white p-4 absolute top-full left-0 w-full" onClick={(e) => e.stopPropagation()}>
        <ul className="pl-4 space-y-6 text-2xl">
          {
            mobileDropdown.map(category => 
              <div key={category.slug}>
                <Link href={`/${category.slug}`}>
                  <li className="font-light capitalize">{category.name}</li>
                </Link>
              </div>
            )
          }
        </ul>
        {/* Border */}
        <div className="pt-4 border-b border-gray-300"/>
      </div>
      {/* White Background */}
      <div
        className="fixed inset-0 -z-10 opacity-75 bg-white"
        onClick={closeMenu}
      />
    </div>
);
}

const Navigation = ({ navigationData }: { navigationData: NavigationData }) => {
const { published_at, issueNumber } = navigationData;
const router = useRouter();

  // Whether to show the search bar 
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [showMenu, setShowMenu] = useState<boolean>(false);

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform the search
    callSearch();
  };

  const callSearch = () => {
    if (searchText === '')
      return;
    router.push(`/search?q=${searchText}`);
  }

  return (
    <nav className="mt-2 pt-5 sticky top-0 z-50 bg-white flex justify-center">
      <div className="container max-w-screen-lg">

        {/* Search and Social */}
         <div className="flex flex-row w-full justify-between px-4">

          {/* Search */}
          <div className="hidden md:block">
            <div className="flex flex-row gap-2 items-center">
              <button className="w-4 h-5 relative cursor-pointer" onClick={() => { setShowSearch(!showSearch); callSearch()}}>
                <Image src={MagnifyingGlass} alt="search" fill unoptimized className="object-contain" sizes="16px"/>
              </button>

              {/* Search Bar */}
              {showSearch && (
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchText}
                    onChange={handleInputChange}
                    className="min-w-[6rem] w-[20vw] max-w-[20rem] py-1 pl-5 pr-3 bg-transparent focus:outline-none focus:border-gray-700 placeholder-gray-500"
                    placeholder="Search..."
                  />
                </form>
              )}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="hidden md:block">
            <div className="flex flex-row gap-2 m-2">
              <Link href="/" className="w-5 h-5 relative">
                <Image src={Facebook} alt="fb" fill unoptimized className="object-contain" sizes="20px"/>
              </Link>
              <Link href="/" className="w-5 h-5 relative">
                <Image src={Twitter} alt="twitter" fill unoptimized className="object-contain" sizes="20px"/>
              </Link>
              <Link href="/" className="w-5 h-5 relative">
                <Image src={Instagram} alt="insta" fill unoptimized className="object-contain" sizes="20px"/>
              </Link>
            </div>
          </div>

          {/* Mobile Title (to be switched for regular title soon) */}
          <div className="block md:hidden">
            <Link href="/">
              <div className="flex flex-row gap-4 items-center mb-4">
                <Image
                  src="/gazelle.svg"
                  alt="logo"
                  height="40"
                  width="40"
                />
                <p className="text-3xl font-normal font-lora tracking-wide">The Gazelle</p>
              </div>
            </Link>
          </div>

          {/* Hamburger Menu (mobile only) */}
          <div className="block md:hidden" onClick={() => setShowMenu(!showMenu)}>
              <div className="relative w-7 h-7 mt-1 mr-2 mb-4">
                <Image src={Hamburger} alt="menu" fill unoptimized className="object-contain" sizes="20px" />
              </div>
          </div>

        </div>

        <div className="border-b border-gray-300"/>
        {/* Logo and Line */}
        <div className="relative hidden md:block">
          <div className="border-b-[0px] border-gray-300 absolute inset-0 z-10"/>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] z-20 w-[4rem] h-[4rem]">
            <div className="absolute inset-0 bg-white z-10 w-1/2 left-1/2 transform -translate-x-1/2"/>
            <Link href="/">
              <Image
                src="/gazelle.svg"
                alt="logo"
                fill
                unoptimized
                className="z-10 object-contain"
                sizes="64px"
              />
            </Link>
          </div>
        </div> 

        {/* Categories */}
        <div className="hidden md:block">
          <div className="flex flex-row justify-between items-center font-light text-sm uppercase px-4">
            <p>
              {format(new Date(), ARTICLE_DATE_FORMAT)}
            </p>
            <ul className="flex justify-center items-center m-4">{renderCategories}</ul>
            <Link href="/archives" className="">
              {`Issue ${issueNumber}`}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <Menu show={showMenu} closeMenu={() => setShowMenu(false)} />

      </div>
    </nav>
  );
};

export default Navigation;
