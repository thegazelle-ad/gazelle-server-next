export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import { cache } from 'react';
import Image from "next/image";
import ProfileArticle from '../../../../components/articles/List'
import { getStaff } from "../../../../db";
import { AuthorProfile } from "../../../../components/articles";

// when we implement this actually, we will use fetch
// this works for now though to deduplicate requests
const getStaffCache = cache(getStaff);

export async function generateMetadata({ params: { slug }}: { params: { slug: string }}) {
  const staffProfile = await getStaffCache(slug);
  return {
    title: `${staffProfile.name} | The Gazelle`,
    robots: {
      index: true,
    }
  };
}

// the profile of the team member
const ProfileCard = ({ person }: { person: AuthorProfile }) => {
  return (
    <div className="flex justify-center pb-[1.5rem] mb-[1.5rem] 
                    border-b border-lightestGray border-1 gap-8">
      <div className="aspect-square h-[300px] w-[300px] pr-[1.5rem] relative">
        <Image 
          priority={true} 
          src={person.image} 
          alt={person.name} 
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>
      <div className="flex justify-center flex-col max-w-[50%]">
        <h1 className="uppercase font-bold text-[2em] leading-[1.2em]
                      block m-0">{person.name}</h1>
        <h2 className="m-0 block text-[1rem] text-lightGray font-bold leading-[1em]">{person.title}</h2>
        <p className="block mt-[0.5rem] leading-5 font-normal">{person.bio}</p>
      </div>
    </div>
  );
}


// list of articles
const ArticleList = ({ staffProfile }: { staffProfile: AuthorProfile }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center max-w-[70%] min-w-[20%]">
        {staffProfile.articles.map((article) => (
          <ProfileArticle key={article.title} article={article} />
        ))}
      </div>
    </div>
  );
}

export default async function Page({ params: { slug }}: { params: { slug: string } }) {
  const staffProfile = await getStaffCache(slug);
  return (
    // main div containing the team member's profile
    <div className="block mx-auto my-0">
      <ProfileCard person={staffProfile} />
      <ArticleList staffProfile={staffProfile}/>
    </div>
  );
}