export const revalidate = 300;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-static';

import Link from "next/link";
import { format, parse } from "date-fns";
import { Metadata } from "next";

import { 
  getIssueArchive,
  IssueArchive 
} from '../../db/queries/issues';
import {
  DATABASE_DATE_FORMAT,
  ARTICLE_DATE_FORMAT,
  DEFAULT_ISSUE_DATE,
} from '../../env';

export const metadata: Metadata = {
  title: 'Archives',
  description: 'Archive of all past issues for The Gazelle.',
};

const IssueCard = ({ issue }: { issue: IssueArchive }) => {
  return (
    <div className="flex flex-col justify-center w-[300px] m-4 text-center group hover:text-sky-600">
      <Link href={`/issue/${issue.issueNumber}`}>
        <h1 className="font-normal text-2xl mt-1">
          {issue.issueName}
        </h1>
        <p className="text-gray-500 text-base mb-2">
          {format(
            parse(issue.publishedAt || DEFAULT_ISSUE_DATE, DATABASE_DATE_FORMAT, new Date()),
            ARTICLE_DATE_FORMAT)
          }
        </p>
      </Link>
    </div>
  );
}

export default async function Page() {    
  const issues = await getIssueArchive();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl py-4">Archives</h1>
      <div className='flex flex-wrap flex-row justify-center'>
        {issues.map((issue) => (
          <IssueCard key={issue.issueNumber} issue={issue}/>
        ))}
      </div>
    </div>
  );
}