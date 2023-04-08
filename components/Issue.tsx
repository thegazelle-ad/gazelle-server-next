import FeaturedArticle from './articles/Featured';
import StandardArticle from './articles/Standard';
import StackedArticle from './articles/Stacked';
import { Divider } from './layout';
import { IssueArticles } from './articles';

export const revalidate = 0;

export default function Issue({ issue }: { issue: IssueArticles}) {
  const { allCategories, featured, trending, editorsPicks } = issue;

  return (
    <div className="flex flex-col justify-center">
      {/* Featured Article */}
      <div>
        <FeaturedArticle article={featured} />
      </div>

      {/* Editors picks (this layout is hardcoded for now) */}
      <div className="flex flex-row">
        {/* editors picks */}
        <div className="">
          <Divider text="editor's picks"/>
          {/* Editors Picks div */}
          <div className="shrink flex flex-row flex-wrap gap-3 justify-center mr-4 pl-6">
            {editorsPicks.map((article) => {
              return (
                <StandardArticle key={article.slug} article={article} minWidth='min-w-[20%]' maxWidth='max-w-[48%]'/>
              );
            })}
          </div>
        </div>
        {/* Trending */}
        <div>
          <Divider text="trending" />
          <div className="flex flex-col justify-start gap-2 w-1/3 border-l-[1.5px] border-bgGray pl-4">
            {trending.map((article) => {
              return (
                <StackedArticle key={article.slug} article={article} />
              );
            })}
          </div>
        </div>
      </div>
      {/* All other articles */}
      {
        allCategories.map((section) => {
          return (
            <div key={section[0].category.name}>
              <Divider text={section[0].category.name} />
              <div className="flex justify-center w-full px-6">
                <div className="flex flex-row flex-wrap gap-3 justify-start flex-grow align-center">
                  {
                    section.map((article) => {
                      return (
                        <StandardArticle key={article.slug} article={article} />
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}
