export const revalidate = 300;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { getInfoPage } from "../../../db/queries/infopages";

export default async function Page() {
    const page = await getInfoPage('ethics');

    return (
        <>
            <h1 className="text-3xl font-lora capitalize pb-2 pt-4 font-medium">{page.title}</h1>
            <div className="flex flex-col gap-4 text-lg font-lora" dangerouslySetInnerHTML={{ __html: page.html }} />
        </>
    )
}