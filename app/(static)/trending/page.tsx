export const config = {
    runtime: 'edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import {
   getLatestTrendingArticles 
} from '../../../db/queries/articles';
import { ListOfArticles } from '../../../components/ListOfArticles';

export default async function Page() {
    const trendingArticles = await getLatestTrendingArticles();

    return (
        <>
            <ListOfArticles title="Trending" articles={trendingArticles} />
        </>
    )
}