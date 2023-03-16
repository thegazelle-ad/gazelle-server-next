import Image from "next/image";
import Link from "next/link";
import * as TeamJSON from "./team.json";

async function getTitle() {
    return { title: 'Our Team'};
}

const TeamMember = ({ name, position, image }: { name: string, position: string, image: string }) => {
    return (
      <>
        <Link href="/" className="m-4 text-center w-[200px]">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={image}
                height={300}
                width={300}
                className={"aspect-square max-h-[200px] max-w-[200px] object-cover"}
                alt="team-member-image"
              />
              <h2 className="text-[1.3rem] font-normal mr-[0.75rem] mt-[0.2rem] block leading-tight">{name}</h2>
              <h3 className="text-[1rem] font-[300] text-lightestGray mr-[0.5rem] block">{position}</h3>
            </div>
        </Link>
      </>
    );
}


const TeamDepartment = ({ department }: { department: string }) => {
  const teamMembers = Array.isArray(TeamJSON[department]) ? TeamJSON[department] : [];
    return (
      <div className="mt-4">
        <div>
          <h2 className="p-0 mb-[0.3rem] text-[1.1rem] font-[300] overflow-hidden text-left text-lightGray before:w-[30px] before:ml-0 before:right-[0.2rem] before:z-[-1] before:bg-bgGray before:content-[''] before:inline-block before:h-[1px] before:relative before:align-middle after:w-[90%] after:mr-[-50%] after:left-[0.2rem] after:bg-bgGray after:content-[''] after:inline-block after:h-[1px] after:relative after:align-middle">{department}</h2>
        </div>
        <div className="flex flex-row flex-wrap justify-center">
          {teamMembers.map((member: any) => (
            <TeamMember key={member.name} name={member.name} position={member.position} image={member.image} />
          ))}
        </div>
      </div>
    );
}

const Team = () => {
    return (
      <>
        {/* gets all the team members in each department and renders them (also skips over the default created by the JSON implementation) */}
        {Object.keys(TeamJSON).map((department) => department === 'default' ? null : (
          <div key={department} className="block">
            <TeamDepartment department={department} />
          </div>
        ))}
      </>
    );
}

export default async function Page() {    
    const { title } = await getTitle();

    return (
        <div>
          <header className='flex flex-col m-w-4xl mx-auto'>
            <h1 className='text-center font-medium font-roboto uppercase text-2xl'>
              {title}
            </h1>
          </header>
          <main>
            <Team />
          </main>
        </div>
    );
}