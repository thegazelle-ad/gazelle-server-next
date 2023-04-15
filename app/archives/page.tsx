export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import Image from "next/image";

const IssueCard = ({ issue }: { issue: IssueArchive }) => {
  return (
    <div className="flex flex-col justify-center
                    w-[300px] m-[1rem]
                    text-center">
      <Link href={`/issue/${issue.issueNumber}`}>
        <h1 className="font-normal text-[2rem] mt-[0.2rem]">
          {issue.issueName}
        </h1>
        <p className="text-lightestGray text-[1rem] mb-[0.5rem]">{issue.publishedAt}</p>
      </Link>
    </div>
  );
}

export default async function Page() {    
  const issues = await getIssueArchive();

  return (
    <div id = "archives-container" className='flex max-w-[1000px] flex-wrap flex-row justify-center
              my-0 mx-auto'>
      {issues.map((issue) => (
        <IssueCard issue={issue}/>
      ))}
    </div>
  );
}