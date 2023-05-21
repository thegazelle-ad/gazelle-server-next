export const revalidate = 3600;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { Metadata } from "next";
import { getInfoPage } from "../../../db/queries/infopages";

export const metadata: Metadata = {
    title: 'Ethics | The Gazelle',
    description: 'Ethics of The Gazelle team at NYU Abu Dhabi',
};

export default async function Page() {
    const page = await getInfoPage('ethics');

    return (
        <>
            <h1 className="text-3xl font-lora capitalize pb-2 pt-4 font-medium">{page.title}</h1>
            <div className="flex flex-col gap-4 text-lg font-lora" dangerouslySetInnerHTML={{ __html: page.html }} />
        </>
    )
}