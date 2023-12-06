"use client"

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format, parse } from 'date-fns';
import Image from 'next/image';
import { useEffect, useRef, useState, FormEvent, ChangeEvent, MouseEventHandler } from 'react';

// Icons
import Twitter from '../public/icons/twitter.svg';
import Facebook from '../public/icons/facebook-f.svg';
import Instagram from '../public/icons/instagram.svg';
import MagnifyingGlass from '../public/icons/magnifying-glass-solid.svg';
import Hamburger from '../public/icons/hamburger.svg';
import Lightbulb from '../public/icons/lightbulb.svg';
import Mail from '../public/icons/mail.svg';

import {
  DATABASE_DATE_FORMAT,
  DEFAULT_ISSUE_DATE,
  ARTICLE_DATE_FORMAT,
  SUBMIT_A_TIP_URL,
  MAILING_LIST,
} from '../env';

import {
  Category
} from './articles';

type MenuCategory = {
  name: string,
  slug: string,
}

const Categories = ({ categories, publishedAt, issueNumber }: { categories: MenuCategory[], publishedAt: string, issueNumber: number }) => {
  const params = useParams();
  const [displayIssueNumber, setDisplayIssueNumber] = useState<number | string>(issueNumber);
  const [displayDate, setDisplayDate] = useState<string>(format(parse(publishedAt || DEFAULT_ISSUE_DATE, DATABASE_DATE_FORMAT, new Date()), ARTICLE_DATE_FORMAT));

  useEffect(() => {
    if (params.issueNumber) {
      const issueNumber = Array.isArray(params.issueNumber) ? params.issueNumber[0] : params.issueNumber;
      setDisplayIssueNumber(issueNumber);

      // Maybe not the best way to fetch the date, but it works for now
      try {
        fetch('/api/getIssuePublishedDate/' + issueNumber).then(res => res.json()).then(date => {
          setDisplayDate(format(parse(date.publishedAt, DATABASE_DATE_FORMAT, new Date()), ARTICLE_DATE_FORMAT));
        });
      } catch(e) {
        console.log("Couldn't fetch issue date");
      };
    } else {
      // default to the latest issue if no issue number is in the url
      setDisplayIssueNumber(issueNumber);
      setDisplayDate(format(parse(publishedAt || DEFAULT_ISSUE_DATE, DATABASE_DATE_FORMAT, new Date()), ARTICLE_DATE_FORMAT));
    }
  }, [params.issueNumber, issueNumber, publishedAt]);

  // Render the categories
  return (
    <div className="hidden md:block font-normal text-sm uppercase">
      <div className="flex flex-row justify-between items-center">
        <p>
          {displayDate}
        </p>
        <ul className="flex justify-center items-center m-2">
          {
            categories.map(category => {
              // Trim leading /
              category.slug = category.slug[0] === '/' ? category.slug.slice(1) : category.slug;
              return (
                <li key={category.slug} className="px-2">
                  <Link href={`/${category.slug}`} className="hover:text-sky-600">
                    {category.name}
                  </Link>
                </li>
              )
            })
          }
        </ul>
        <Link href="/archives" className="hover:text-sky-600">
          {`Issue ${displayIssueNumber}`}
        </Link>
      </div>
  </div>
  )
}

// Menu component
const MobileMenu = ({ show, mobileDropdown, closeMenu, showSearch }: { show: boolean, mobileDropdown: MenuCategory[], closeMenu: MouseEventHandler, showSearch: MouseEventHandler }) => {
  return (
    <div className={`${show ? 'block' : 'hidden'}`}>
      {/* Menu */}
      <div className="bg-white absolute top-full left-0 w-full pt-4" onClick={(e) => e.stopPropagation()}>
        <ul className="pl-4 space-y-6 text-2xl">
          <div>
            <li className="font-light capitalize" onClick={(e) => { closeMenu(e); showSearch(e); }}>Search</li>
          </div>
          {
            mobileDropdown.map(category => 
              <div key={category.slug}>
                <Link href={category.slug}>
                  <li className="font-light capitalize" onClick={(e) => { closeMenu(e); }}>{category.name}</li>
                </Link>
              </div>
            )
          }
          <li className="font-light capitalize"><Link href={SUBMIT_A_TIP_URL}>Submit a tip</Link></li>
          <li className="font-light capitalize"><Link href={MAILING_LIST}>Mailing list</Link></li>
        </ul>
        {/* Border */}
        <div className="pt-4 border-b border-gray-500"/>
      </div>
      {/* White Background */}
      <div
        className="fixed inset-0 -z-10 opacity-75 bg-white h-screen"
        onClick={closeMenu}
      />
    </div>
  );
}

const SocialMedia = () => {
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
}

// Search component
const Search = ({ show, closeSearch }: { show: boolean, closeSearch: MouseEventHandler }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [placeHolderText, setPlaceHolderText] = useState<string>('Search...');

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  // const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }

  //   if (windowSize.current[0] > 400) {
  //     setPlaceHolderText('Search articles and authors...');
  //   }
  }, [show]);



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

    //@ts-ignore
    closeSearch();

    // clear the search text
    setSearchText('');

    router.push(`/search?q=${searchText}`);
  }

  return (
    <div className={`${show ? 'block' : 'hidden'}`}>
      {/* Search box */}
      <div className="absolute top-[20vh] left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-[60] placeholder-gray-500 w-4/5 md:w-[700px]">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center w-full px-4">
            <form onSubmit={handleSearch} className="w-full">
            {/* Full "Search articles and authors..." */}
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={handleInputChange}
              className="w-full text-2xl bg-transparent focus:outline-none border-gray-300 shadow-sm p-4 font-light"
              placeholder={placeHolderText}
            />
          </form>
          <button onClick={(e) => { callSearch()}} type="submit" className="bg-gray-700 text-white text-lg font-semibold h-12 px-6 ml-4">Go</button>
          </div> 
          <div className="flex items-center border-b-2 border-gray-800 w-full"/>
        </div>
      </div>
      {/* White Background */}
      <div
        className={`${show ? 'block' : 'hidden'} fixed inset-0 opacity-95 bg-white h-screen`}
        onClick={closeSearch}
      />
    </div>
  );
}

const Navigation = ({ issueNumber, categories, publishedAt, className }: { issueNumber: number, categories: Category[], publishedAt: string, className: string }) => {
  const menuCategories = [
    ...categories.map(category => ({ name: category.name, slug: `/category/${category.slug}` })),
    { name: 'team', slug: 'team' },
  ]

  const mobileDropdown = [
    ...categories.map(category => ({ name: category.name, slug: `/category/${category.slug}` })),
    { name: 'team', slug: 'team' },
    { name: 'archives', slug: 'archives' },
  ]

  // Whether to show the search bar 
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <nav className="pt-2 md:pt-5 sticky top-0 z-50 bg-white flex justify-center font-roboto drop-shadow-sm md:drop-shadow-none">
      <div className="container max-w-screen-lg">

        <div className={className}>

          {/* Search and Social */}
          <div className="flex flex-row w-full justify-between items-center px-2 mb-2 md:mb-4">

            {/* Title / Logo */}
            <div className="">
              <Link href="/" onClick={() => setShowMenu(false)} >
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative w-[40px] h-[40px]">
                    <Image
                      src="/gazelle.svg"
                      alt="logo"
                      fill
                      unoptimized
                    />
                  </div>
                  <p className="text-3xl font-medium font-lora tracking-tight">The Gazelle</p>
                </div>
              </Link>
            </div>

            {/* Search */}
            <div className="hidden md:block">
              <div className="flex flex-row gap-4 items-center">
                <Link href={SUBMIT_A_TIP_URL}>
                  <Image src={Lightbulb} alt="submit a tip" unoptimized height={14} width={14} className="object-contain" sizes="16px"/>
                </Link>
                <Link href={MAILING_LIST}>
                  <Image src={Mail} alt="mailing list" unoptimized height={20} width={20} className="object-contain" sizes="16px"/>
                </Link>
                <button className="cursor-pointer" onClick={(e) => {e.stopPropagation(); setShowSearch(!showSearch)}}>
                  <Image src={MagnifyingGlass} alt="search" unoptimized height={18} width={18} className="object-contain" sizes="16px"/>
                </button>
              </div>
            </div>

            {/* Hamburger Menu (mobile only) */}
            <div className="block md:hidden" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu)}}>
                <div className="relative w-7 h-7 mt-1 mr-2">
                  <Image src={Hamburger} alt="menu" fill unoptimized className="object-contain" sizes="20px" />
                </div>
            </div>

          </div>

          {/* Line */}
          {/* Placed in /layout.app for mobile, so spans full width */}
          <div className="border-b border-gray-500 hidden md:block"/>

          {/* Categories */}
          <Categories issueNumber={issueNumber} categories={menuCategories} publishedAt={publishedAt}/>

          {/* Mobile Menu */}
          <MobileMenu show={showMenu} mobileDropdown={mobileDropdown} closeMenu={() => setShowMenu(false)} showSearch={() => setShowSearch(!showSearch)}/>

          {/* Search */}
          <Search show={showSearch} closeSearch={() => setShowSearch(false)} />

        </div>

        {/* Mobile line */}
        <div className="border-b border-gray-500 z-50 md:hidden"/>

      </div>
    </nav>
  );
};

export default Navigation;
