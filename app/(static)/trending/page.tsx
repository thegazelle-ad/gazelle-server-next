export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';

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