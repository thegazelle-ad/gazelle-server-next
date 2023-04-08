import { getLatestPublishedIssue, getIssueArticles } from '../../db';
import Issue from '../../components/Issue';

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