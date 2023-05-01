export const runtime = 'experimental-edge';
export const revalidate = 300;

import { getCategoryArticles } from "../../../db/queries/articles";
import { ListOfArticles } from "../../../components/ListOfArticles";

export default async function Page({ params: { categorySlug }}: { params: { categorySlug: string }}) {
    const articles = await getCategoryArticles(categorySlug);

    return (
        <>
            <ListOfArticles title={articles[0].categoryName} articles={articles} />
        </>
    )
}