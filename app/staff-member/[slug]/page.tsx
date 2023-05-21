export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { cache } from 'react';
import Image from "next/image";
import { getStaff } from "../../../db";
import { AuthorProfile } from "../../../components/articles";
import { UserContent } from './profile';

// when we implement this actually, we will use fetch
// this works for now though to deduplicate requests
const getStaffCache = cache(getStaff);

export async function generateMetadata({ params: { slug }}: { params: { slug: string }}) {
  const staffProfile = await getStaffCache(slug);
  return {
    title: `${staffProfile.name} | The Gazelle`,
    description: staffProfile.bio,
    openGraph: {
      title: `${staffProfile.name} | The Gazelle`,
      description: staffProfile.bio,
      images: staffProfile.image
    }
  };
}

// the profile of the team member
const ProfileCard = ({ person }: { person: AuthorProfile }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center pb-6 mb-6 border-b border-lightestGray border-1 gap-8 pt-8 md:pt-0">
      <div className="aspect-square h-[300px] w-[300px] relative">
        <Image 
          priority={true} 
          src={person.image} 
          alt={person.name} 
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>
      <div className="flex justify-center flex-col w-4/5 min-w-[300px] max-w-[300px] md:max-w-[500px] gap-4">
        <div>
          <h1 className="capitalize font-semibold text-4xl font-lora">{person.name}</h1>
          <h2 className="text-lg text-lightGray font-normal font-lora">{person.title}</h2>
        </div>
        <p className="leading-5 font-normal">{person.bio}</p>
      </div>
    </div>
  );
}

export default async function Page({ params: { slug }}: { params: { slug: string } }) {
  const staffProfile = await getStaffCache(slug);

  return (
    // main div containing the team member's profile
    <div className="">
      <ProfileCard person={staffProfile} />
      <UserContent staffProfile={staffProfile} />
    </div>
  );
}