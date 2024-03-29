export const revalidate = 43200;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { getLatestStaffRoster } from "../../db";
import { AuthorPreview } from "../../components/articles";
import { Divider } from "../../components/layout";

export const metadata: Metadata = {
  title: 'About | The Gazelle',
  description: 'The latest issue from The Gazelle team at NYU Abu Dhabi',
};

async function getTitle() {
    return { title: 'Our Team'};
}

const TeamMember = ({ staff }: { staff: AuthorPreview }) => {
    return (
      <>
        <Link href={`/staff-member/${staff.staffSlug}`} className="m-4 my-8 text-center w-[200px]">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={staff.staffImage}
                height={300}
                width={300}
                className={"aspect-square max-h-[200px] max-w-[200px] object-cover peer"}
                alt="team-member-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <h2 className="text-xl font-lora font-medium leading-tight peer-hover:text-sky-600 hover:text-sky-600 pt-4">{staff.staffName}</h2>
              <h3 className="text-base font-lora font-light text-gray-500 hover:text-sky-600 pt-1">{staff.staffTitle}</h3>
            </div>
        </Link>
      </>
    );
}


const TeamDepartment = ({ teamMembers }: { teamMembers: AuthorPreview[] }) => {
    return (
      <div className="">
        <div id={teamMembers[0].teamName}>
          <Divider text={teamMembers[0].teamName} href={`/team/#${teamMembers[0].teamName}`}/>
        </div>
        <div className="flex flex-row flex-wrap justify-center">
          {teamMembers.map((member: AuthorPreview) => (
            <TeamMember key={member.staffSlug} staff={member}/>
          ))}
        </div>
      </div>
    );
}

const Team = ({ roster } : { roster: AuthorPreview[][]}) => {
    return (
      <>
        {/* gets all the team members in each department and renders them (also skips over the default created by the JSON implementation) */}
        {roster.map((department) => (
          <div key={department[0].teamName} className="block">
            <TeamDepartment teamMembers={department} />
          </div>
        ))}
      </>
    );
}

export default async function Page() {
    const { title } = await getTitle();
    const roster = await getLatestStaffRoster();

    return (
        <div>
          <header className='flex flex-col m-w-4xl mx-auto'>
            <h1 className='text-center font-medium capitalize text-2xl font-lora my-2'>
              {title}
            </h1>
          </header>
          <main>
            <Team roster={roster}/>
          </main>
        </div>
    );
}