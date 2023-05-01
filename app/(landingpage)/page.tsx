export const revalidate = 300;
export const runtime = 'experimental-edge';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { cache } from 'react';
import { Metadata } from 'next';
import { getLatestPublishedIssue, getIssueArticles } from '../../db';
import Issue from '../../components/Issue';

export const metadata: Metadata = {
  description: 'The latest issue from The Gazelle team at NYU Abu Dhabi',
};

const latestIssues = cache(getLatestPublishedIssue);

export default async function Page() {
  // Fetch latest article data
  const issue = await latestIssues();
  const issueArticles = await getIssueArticles(issue);

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}