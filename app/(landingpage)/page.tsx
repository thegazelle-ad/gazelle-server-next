export const revalidate = 600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-static';

import { Metadata } from 'next';
import { getLatestPublishedIssue, getIssueArticles, wrapUpstash } from '../../db';
import Issue from '../../components/Issue';

export const metadata: Metadata = {
  description: 'The latest issue from The Gazelle team at NYU Abu Dhabi',
};

const getLatestIssueDetails = wrapUpstash(async () => {
  const issue = await getLatestPublishedIssue();
  const issueArticles = await getIssueArticles(issue);

  return {
    issue,
    issueArticles,
  };
}, 'getLatestIssueDetails');

export default async function Page() {
  // Fetch latest article data
  const { issueArticles } = await getLatestIssueDetails();

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}