import _ from 'lodash';
import Link from 'next/link';
import moment from 'moment';
import Image from 'next/image';


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
  const renderCategories = categories.map(category => {
    const { name, slug } = category;
    return (
      <li key={slug} className="px-1">
        <Link
          href={slug === 'team' ? '/team' : `/category/${slug}`}
          className=""
        >
          {name}
        </Link>
      </li>
    );
  });

  return (
    <div className="mt-2 font-roboto px-4 md:px-2 h-10">
      <div className="border-b border-gray-300"/>
      <Image src="/logo.png" alt="logo" width="20" height="20"/>

      <div className="flex flex-row flex justify-between items-center font-light text-sm uppercase px-4">
        <p className="">
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
