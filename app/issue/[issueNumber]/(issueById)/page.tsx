export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-static';

import { getIssue, getIssueArticles, wrapCache } from '../../../../db';
import Issue from '../../../../components/Issue';

const getIssueDetails = wrapCache(async (issueNumber: number) => {
  const issue = await getIssue(issueNumber);
  const issueArticles = await getIssueArticles(issue);

  return {
    issue,
    issueArticles,
  };
}, 'getIssueDetails');

export default async function IssuePage({ params: { issueNumber }}: { params: { issueNumber: number }}) {
  // Fetch latest article data
  const { issueArticles } = await getIssueDetails(issueNumber);

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}