export const config = {
    runtime: 'edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import { getInfoPage } from "../../../db/queries/infopages";

export default async function Page() {
    const page = await getInfoPage('about');

    return (
        <>
            <h1 className="text-3xl font-lora capitalize pb-2 pt-4 font-medium">{page.title}</h1>
            <div className="flex flex-col gap-4 text-lg font-lora" dangerouslySetInnerHTML={{ __html: page.html }} />
        </>
    )
}