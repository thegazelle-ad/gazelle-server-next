export const revalidate = 300;
export const runtime = 'experimental-edge';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { getIssue, getIssueArticles } from '../../../../db';
import Issue from '../../../../components/Issue';

export default async function IssuePage({ params: { issueNumber }}: { params: { issueNumber: number }}) {
  // Fetch latest article data
  const issue = await getIssue(issueNumber);
  const issueArticles = await getIssueArticles(issue);

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}