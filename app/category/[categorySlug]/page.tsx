export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

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