export const config = {
    runtime: 'edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

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