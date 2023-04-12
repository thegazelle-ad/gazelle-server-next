import { getIssue, getIssueArticles } from '../../../../db';
import Issue from '../../../../components/Issue';

export default async function IssuePage({ params: { issueNumber }}: { params: { issueNumber: number }}) {
  // Fetch latest article data
  console.log(issueNumber);
  const issue = await getIssue(issueNumber);
  const issueArticles = await getIssueArticles(issue);

  // Render the page
  return (
    <div>
      <Issue issue={issueArticles} />
    </div>
  )
}