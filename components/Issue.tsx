import FeaturedArticle from './articles/Featured';
import StandardArticle from './articles/Standard';
import StackedArticle from './articles/Stacked';
import { Divider } from './layout';
import { IssueArticles } from './articles';

export const revalidate = 0;

export default function Issue({ issue }: { issue: IssueArticles}) {
  const { allCategories, featured, trending, editorsPicks } = issue;

  return (
    <div className="flex flex-col justify-center gap-2 md:gap-0">
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
          <div className="shrink flex flex-row flex-wrap gap-1 justify-between mr-4 pl-6">
            {editorsPicks.map((article) => {
              return (
                <StandardArticle key={article.slug} article={article} minWidth='md:min-w-[20%]' maxWidth='md:max-w-[49%]'/>
              );
            })}
          </div>
        </div>
        {/* Trending */}
        <div className="hidden md:block">
          <Divider text="trending" />
          <div className="flex flex-col justify-start gap-2 w-1/3 border-l-[1.5px] border-bgGray pl-4">
            {trending.map((article) => {
              return (
                <div key={article.slug} className="my-2 md:my-0">
                  <StackedArticle article={article} />
                </div>
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
                        <div key={article.slug} className="my-2 md:my-0 w-full md:min-w-[44%] md:max-w-[48%] lg:min-w-[27%] lg:max-w-[32.5%]">
                          <StandardArticle article={article} minWidth="w-full" maxWidth="max-w-full"/>
                        </div>
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
