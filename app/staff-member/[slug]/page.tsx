import Image from "next/image";
import Link from "next/link";
import * as StaffJSON from "./team-profile.json";

// this implementation is not ideal, as it queries the JSON file twice to get the person and their articles seperately

function getPerson({name}: {name: string}) {
  let all_team = StaffJSON["profiles"];
  let person = all_team.find((person: any) => person.name.toLowerCase() === name.toLowerCase());

  // if the name does not exist, we get the first person in the list
  person = person ? person : all_team[0];

  return { person };
}

// Static metadata
export const metadata = {
  // need to be dynamically added
    title: 'Githmi Rabel | The Gzelle',
    robots: {
        index: true,
    }
};

// the profile of the team member
const ProfileCard = ({ name }: { name: string }) => {
  const { person } = getPerson({ name });
  return (
    <div className="flex justify-center pb-[1.5rem] mb-[1.5rem] 
                    border-b border-lightestGray border-1">
      <Image src={person.image} height={300} width={300} className={"aspect-square max-h-[300px] max-w-[300px] object-cove pr-[1.5rem]"} alt="team-member-image" />
      <div className="flex justify-center flex-col max-w-[50%]">
        <h1 className="uppercase font-bold text-[2em] leading-[1.2em]
                      block m-0">{person.name}</h1>
        <h2 className="m-0 block text-[1rem] text-lightGray font-bold leading-[1em]">{person.role}</h2>
        <p className="block mt-[0.5rem] leading-5 font-normal">{person.biography}</p>
      </div>
    </div>
  );
}

// single article
const Article = ( {article} : {article: any} ) => {
  return (
    <div className="flex justify-center items-center flex-grow max-w-[100%] min-w-[220px]
                    mb-[1.5rem] pb-[1.25rem] px-[0.75rem] flex-shrink border-b border-evenLighterGray border-1">
      <Link href={article.link}>
        <Image src={article.image} height={500} width={500} className={"aspect-square max-h-[250px] max-w-[450px] object-cover pb-[0.5rem]"} alt="team-member-image" />
      </Link>
      <div className="max-w-[20%] min-w-[250px] pl-[1.3rem]">
        <Link href={article.link}>
          <h1 className="uppercase text-[1.2rem] leading-[1.5rem] font-bold">{article.title}</h1>
        </Link>

        {/* need to seperate authors with a comma */}
        <div className="uppercase text-[0.8rem] font-medium text-lightGray
                        list-none mb-[0.3rem]
                        flex flex-wrap items-start">
          {article.authors.map((author: any) => (
            <li>{author}</li>
          ))}
        </div>
        <p className="text-[0.8rem] font-light mb-[0.8rem] text-lightGray leading-[0.9rem]">{article.teaser}</p>

        <Link href={article.link}>
          {/* // this is supposed to be link to social media */}
          <p className="text-[0.8rem] font-medium text-lightGray">{"Read More"}</p>
        </Link>
      </div>
    </div>
  );
}

// list of articles
const ArticleList = ({ name }: { name: string }) => {
  const { person } = getPerson({ name });
  const articles = person.articles;

  return (
    <>
      {articles.map((article: any) => (
        <Article article = {article}/>
      ))}
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  let name = params.slug.replace('-', ' ').toLowerCase();
  return (
    // main div containing the team member's profile
    <div className="block mx-auto my-0">
      <ProfileCard name={name} />
      <ArticleList name={name} />
    </div>
  );
}