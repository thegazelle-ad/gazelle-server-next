export const revalidate = 300;
export const runtime = 'experimental-edge';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

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