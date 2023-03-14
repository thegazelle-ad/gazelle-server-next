// import { PrismaClient } from '@prisma/client'
// import { prisma, latestIssueQuery, getLatestIssue } from './db'
import FeaturedArticle from '../components/articles/Featured';

export default async function Page() {

  const testFeaturedArticle = {
    title: 'Test Article',
    slug: 'test-article',
    category: 'Opinion',
    teaser: 'This is a test article',
    image: '/images/placeholder-img.jpg',
    authors: ['Corban', 'Maj', 'Naz'],
  }

  return (
    <div>
      <FeaturedArticle article={testFeaturedArticle} />
    </div>
  );
}