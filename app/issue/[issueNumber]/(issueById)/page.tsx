export const revalidate = 43200;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { getIssue, getIssueArticles, wrapCache } from '../../../../db';
import Issue from '../../../../components/Issue';

const getIssueDetails = wrapCache(async (issueNumber: number) => {
  const issue = await getIssue(issueNumber);
  const issueArticles = await getIssueArticles(issue);

  return {
    issue,
    issueArticles,
  };
});

export async function generateMetadata({ params: { issueNumber }}: { params: { issueNumber: number }}) {
  const { issue, issueArticles } = await getIssueDetails(issueNumber);
  const images = [issueArticles.featured.image, ...issueArticles.editorsPicks.map(article => article.image)]

  return {
    title: `Issue ${issue.issueNumber} | The Gazelle`,
    description: `Issue ${issue.issueNumber} from The Gazelle team at NYU Abu Dhabi`,
    openGraph: {
      title: `Issue ${issue.issueNumber} | The Gazelle`,
      description: `Issue ${issue.issueNumber} from The Gazelle team at NYU Abu Dhabi`,
      images: images
    }
  }
}

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