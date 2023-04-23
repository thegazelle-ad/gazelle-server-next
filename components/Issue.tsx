import FeaturedArticle from './articles/Featured';
import StandardArticle from './articles/Standard';
import StackedArticle from './articles/Stacked';
import { Divider } from './layout';
import { IssueArticles } from './articles';

export const revalidate = 0;

export default function Issue({ issue }: { issue: IssueArticles }) {
  const { allCategories, featured, trending, editorsPicks } = issue;

  return (
    <div className="flex flex-col justify-center gap-2 md:gap-0">
      {/* Featured Article */}
      <div>
        <FeaturedArticle article={featured} />
      </div>

      {/* Editors picks (this layout is hardcoded for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 w-full gap-x-4">
        
        <Divider text="editor's picks" href={"/editors-picks"} className="py-2 col-span-2"/>
        <Divider text="trending" href={"/trending"} className="py-2 col-span-1" />
        {/* editors picks */}
        <div className="grid col-span-2">
          {/* Editors Picks div */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorsPicks.map((article) => {
              return (
                <div key={article.slug}>
                  <StandardArticle article={article} minWidth="w-full" maxWidth="m-w-full" />
                </div>
              );
            })}
          </div>
        </div>
        {/* Trending */}
        <div className="">
          <div className="grid grid-cols-1 gap-4">
            {trending.map((article) => {
              return (
                <div key={article.slug}>
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
          const numColumns = section.length > 2 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
          const large = section.length <= 2;

          return (
            <div key={section[0].category.name}>
              <Divider text={section[0].category.name} href={`/category/${section[0].category.name}`} className="py-2" />
              <div className={`grid ${numColumns} auto-rows-auto gap-4`}>
                {section.map((article) => {
                  return (
                    <div key={article.slug}>
                      <StandardArticle article={article} minWidth="w-full" maxWidth="w-full" large={large} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

