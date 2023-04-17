export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import { Metadata } from 'next';
import { getLatestPublishedIssue, getIssueArticles } from '../../db';
import Issue from '../../components/Issue';

export const metadata: Metadata = {
  description: 'The latest issue from The Gazelle team at NYU Abu Dhabi',
};

export default async function Page() {
  // Fetch latest article data
  const issue = await getLatestPublishedIssue();
  const issueArticles = await getIssueArticles(issue);

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}