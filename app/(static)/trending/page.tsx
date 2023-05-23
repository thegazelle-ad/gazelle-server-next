export const revalidate = 43200;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { Metadata } from 'next';
import {
   getLatestTrendingArticles 
} from '../../../db/queries/articles';
import { ListOfArticles } from '../../../components/ListOfArticles';

export const metadata: Metadata = {
    title: 'Trending | The Gazelle',
    description: 'The latest trending articles from The Gazelle',
    openGraph: {
        title: 'Trending | The Gazelle',
        description: 'The latest trending articles from The Gazelle',
    }
};

export default async function Page() {
    const trendingArticles = await getLatestTrendingArticles();

    return (
        <>
            <ListOfArticles title="Trending" articles={trendingArticles} />
        </>
    )
}