export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import { getCategoryArticles } from "../../../db/queries/articles";
import ListArticle from "../../../components/articles/List";

export default async function Page({ params: { categorySlug }}: { params: { categorySlug: string }}) {
    const articles = await getCategoryArticles(categorySlug);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-lora capitalize pb-2 pt-4 font-medium">{articles[0].categoryName}</h1>
            <div className="max-w-[700px]">
                <div className="flex flex-col gap-6 pt-6">
                    {
                        articles.map((article, index) => (
                            <ListArticle key={index} article={article} />
                        ))
                    }
                    {
                        articles.length === 0 && <p className="pt-4 pb-8">No articles for this issue!</p>
                    }
                </div>
            </div>
        </div>
    )
}