export const revalidate = 300;
export const runtime = 'experimental-edge';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { Suspense } from "react";

import { searchArticles } from "../../db";
import { ArticleList } from "../../components/articles";
import ListArticle from "../../components/articles/List";

const SearchResults = (async({ query }: { query: string }) => {
    let articles: ArticleList[] = [];
    if (query)
        articles = await searchArticles(encodeURI(query));

    return (
        <div className="flex flex-col gap-6 pt-6">
            {
                articles.map((article, index) => (
                    <ListArticle key={index} article={article} />
                ))
            }
            {
                articles.length === 0 && <p className="pt-4 pb-8">No results found!</p>
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
                {/* @ts-ignore await bug (solved in the future) */}
                <SearchResults query={query}/>
            </div>
        </div>
    )
}