import { eq } from 'drizzle-orm/expressions';
import { 
    db,
    InfoPages,
    wrapCache,
} from "../common";

export const getInfoPage = wrapCache(async (slug: string) => {
    const infoPage = await db.select({
        title: InfoPages.title,
        html: InfoPages.html,
    })
        .from(InfoPages)
        .where(eq(InfoPages.slug, slug));

    if (infoPage.length !== 1)
        throw new Error(`Expected 1 info page with slug ${slug}, found ${infoPage.length} matches!`);

    return infoPage[0];
});
