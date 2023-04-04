import { cache } from 'react';
import Image from "next/image";
import ProfileArticle from '../../../components/articles/Profile'
import { getStaff } from "../../db2";
import { AuthorProfile } from "../../../components/articles";

// when we implement this actually, we will use fetch
// this works for now though to deduplicate requests
const getStaffCache = cache(getStaff);

export async function generateMetadata({ params: { slug }}: { params: { slug: string }}) {
  const staffProfile = await getStaffCache({ slug });
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
                    border-b border-lightestGray border-1">
      <Image src={person.image} height={300} width={300} className={"aspect-square max-h-[300px] max-w-[300px] object-cove pr-[1.5rem]"} alt="team-member-image" />
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
    <div className="flex flex-col max-w-[40%] min-w-[20%]">
      {staffProfile.articles.map((article) => (
        <ProfileArticle key={article.title} article={article} />
      ))}
    </div>
  );
}

export default async function Page({ params: { slug }}: { params: { slug: string } }) {
  const staffProfile = await getStaffCache({ slug });
  return (
    // main div containing the team member's profile
    <div className="block mx-auto my-0">
      <ProfileCard person={staffProfile} />
      <ArticleList staffProfile={staffProfile}/>
    </div>
  );
}
