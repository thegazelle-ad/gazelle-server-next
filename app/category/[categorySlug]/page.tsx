export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-static';

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