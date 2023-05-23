export const revalidate = 43200;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { getLatestPublishedIssue, getIssueArticles, wrapCache } from '../../db';
import Issue from '../../components/Issue';

export const generateMetadata = async () => {
  const issue = await getLatestPublishedIssue();
  const issueArticles = await getIssueArticles(issue);
  const images = [issueArticles.featured.image, ...issueArticles.editorsPicks.map(article => article.image)]
  
  return {
    title: `Issue ${issue.issueNumber} | The Gazelle`,
    description: `The latest issue from The Gazelle team at NYU Abu Dhabi`,
    openGraph: {
      title: `Issue ${issue.issueNumber} | The Gazelle`,
      description: `The latest issue from The Gazelle team at NYU Abu Dhabi`,
      images: images
    }
  }
}

const getLatestIssueDetails = wrapCache(async () => {
  const issue = await getLatestPublishedIssue();
  const issueArticles = await getIssueArticles(issue);

  return {
    issue,
    issueArticles,
  };
});

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