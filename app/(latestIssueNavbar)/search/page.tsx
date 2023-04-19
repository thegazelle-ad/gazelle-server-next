export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import { Suspense } from "react";

import { searchArticles } from "../../db";
import { ArticleList } from "../../components/articles";
import ListArticle from "../../components/articles/List";

const SearchResults = (async({ query }: { query: string }) => {
    let articles: ArticleList[] = [];
    if (query)
        articles = await searchArticles(query);

    return (
        <div className="flex flex-col">
            {
                articles.map((article, index) => (
                    <ListArticle key={index} article={article} />
                ))
            }
        </div>
    )
});

export default function Page({ searchParams }: { searchParams: URLSearchParams }) {
    //@ts-ignore
    const query = searchParams['q'];

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-[700px]">
                <Suspense fallback={"Loading search results..."}>
                    {/* @ts-ignore await bug (solved in the future) */}
                    <SearchResults query={query}/>
                </Suspense>
            </div>
        </div>
    )
}