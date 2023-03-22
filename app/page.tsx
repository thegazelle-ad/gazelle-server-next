import { getLatestIssue } from './db'
import FeaturedArticle from '../components/articles/Featured';
import StandardArticle from '../components/articles/Standard';
import StackedArticle from '../components/articles/Stacked';
import { ArticlePreview } from '../components/articles';

export const revalidate = 60;

export default async function Page() {

  console.log(JSON.stringify(await getLatestIssue()));

  const testFeaturedArticle: ArticlePreview = {
    title: 'Test Article',
    slug: 'test-article',
    categoryName: 'Opinion',
    categorySlug: 'opnion',
    teaser: 'This is a test article',
    image: '/images/placeholder-img.jpg',
    authors: ['Corban', 'Maj', 'Naz'],
    issue: 100,
  }

  return (
    <div className="flex flex-col justify-center">
      {/* Featured Article */}
      <div>
        <FeaturedArticle article={testFeaturedArticle} />
      </div>

      {/* Editors picks (this layout is hardcoded for now) */}
      <div className="flex flex-row h-96">
        {/* editors picks */}
        <div>
          <h2 className="p-0 mb-[0.3rem] text-[1.1rem] font-[300] overflow-hidden text-left text-lightGray before:w-[30px] before:ml-0 before:right-[0.2rem] before:z-[-1] before:bg-bgGray before:inline-block before:h-[1px] before:relative before:align-middle after:w-[90%] after:mr-[-50%] after:left-[0.2rem] after:bg-bgGray after:inline-block after:h-[1px] after:relative after:align-middle">editor&apos;s picks</h2>
          <div className="flex flex-row flex-wrap gap-3 justify-center mr-4">
            <StandardArticle article={testFeaturedArticle} />
            <StandardArticle article={testFeaturedArticle} />
          </div>
        </div>
        {/* Trending */}
        <div>
          <h2 className="p-0 mb-[0.3rem] text-[1.1rem] font-[300] overflow-hidden text-left text-lightGray before:w-[30px] before:ml-0 before:right-[0.2rem] before:z-[-1] before:bg-bgGray before:inline-block before:h-[1px] before:relative before:align-middle after:w-[90%] after:mr-[-50%] after:left-[0.2rem] after:bg-bgGray after:inline-block after:h-[1px] after:relative after:align-middle">trending</h2>
          <div className="flex flex-col justify-start gap-1 w-64 border-l-[1.5px] border-bgGray pl-4">
            <StackedArticle article={testFeaturedArticle} />
            <StackedArticle article={testFeaturedArticle} />
            <StackedArticle article={testFeaturedArticle} />
            <StackedArticle article={testFeaturedArticle} />
            <StackedArticle article={testFeaturedArticle} />
          </div>
        </div>
      </div>

    </div>
  );
}