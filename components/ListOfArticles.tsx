import {
    ArticleList,
} from './articles';
import ListArticle from './articles/List';

export function ListOfArticles({ title, articles }: { title: string, articles: ArticleList[] }) {
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-lora capitalize pb-2 pt-4 font-medium">{title}</h1>
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
        </>
    )
}
