export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import Image from "next/image";
import Link from "next/link";
import { getLatestStaffRoster } from "../../db";
import { AuthorPreview } from "../../components/articles";

async function getTitle() {
    return { title: 'Our Team'};
}

const TeamMember = ({ staff }: { staff: AuthorPreview }) => {
    return (
      <>
        <Link href={`/staff-member/${staff.staffSlug}`} className="m-4 text-center w-[200px]">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={staff.staffImage}
                height={300}
                width={300}
                className={"aspect-square max-h-[200px] max-w-[200px] object-cover"}
                alt="team-member-image"
              />
              <h2 className="text-[1.3rem] font-normal mr-[0.75rem] mt-[0.2rem] block leading-tight">{staff.staffName}</h2>
              <h3 className="text-[1rem] font-[300] text-lightestGray mr-[0.5rem] block">{staff.staffTitle}</h3>
            </div>
        </Link>
      </>
    );
}


const TeamDepartment = ({ teamMembers }: { teamMembers: AuthorPreview[] }) => {
    return (
      <div className="mt-4">
        <div>
          <h2 className="p-0 mb-[0.3rem] text-[1.1rem] font-[300] overflow-hidden text-left text-lightGray before:w-[30px] before:ml-0 before:right-[0.2rem] before:z-[-1] before:bg-bgGray before:content-[''] before:inline-block before:h-[1px] before:relative before:align-middle after:w-[90%] after:mr-[-50%] after:left-[0.2rem] after:bg-bgGray after:content-[''] after:inline-block after:h-[1px] after:relative after:align-middle">{teamMembers[0].teamName}</h2>
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
            <h1 className='text-center font-medium uppercase text-2xl'>
              {title}
            </h1>
          </header>
          <main>
            <Team roster={roster}/>
          </main>
        </div>
    );
}