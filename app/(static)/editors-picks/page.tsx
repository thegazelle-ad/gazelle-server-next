export const revalidate = 300;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import {
   getEditorsPicksArticles 
} from '../../../db/queries/articles';
import { ListOfArticles } from '../../../components/ListOfArticles';

export default async function Page() {
    const editorsPicks = await getEditorsPicksArticles();

    return (
        <>
            <ListOfArticles title="Editor's Picks" articles={editorsPicks} />
        </>
    )
}