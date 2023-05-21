export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { Metadata } from 'next';
import {
   getEditorsPicksArticles 
} from '../../../db/queries/articles';
import { ListOfArticles } from '../../../components/ListOfArticles';

export const metadata: Metadata = {
    title: "Editor's Picks | The Gazelle",
    description: 'The latest editor picks from The Gazelle',
};

export default async function Page() {
    const editorsPicks = await getEditorsPicksArticles();

    return (
        <>
            <ListOfArticles title="Editor's Picks" articles={editorsPicks} />
        </>
    )
}