import { eq, ne, desc, inArray, gte, like } from 'drizzle-orm/expressions';
import { db } from '../../db/common';
import { 
    articleIllustrations as ArticleIllustrations,
    staff as Staff,
    articles as Articles,
} from '../../db/schema';

async function addStaffIllustrationsBySlug(slug: string, stringSearch: string) {
    const staffId = await db.select({
        id: Staff.id,
    })
        .from(Staff)
        .where(eq(Staff.slug, slug))
        .limit(1);

    if (!staffId)
        throw new Error(`Staff with slug ${slug} not found`);
    if (!staffId[0])
        throw new Error(`Staff with slug ${slug} not found`);

    const staff = staffId[0];
    
    console.log("Found staff id: ", staff);

    const staffIllustrations = await db.select({
        id: Articles.id,
    })
        .from(Articles)
        .where(like(Articles.markdown, `%${stringSearch}%`));

    const additions = staffIllustrations.map((staffIllustration) => ({
        articleId: staffIllustration.id,
        staffId: staff.id,
    }));

    // insert these in article_illustrations
    await db.insert(ArticleIllustrations).values(additions);
    console.log("Made additions: ", additions.length);
}

addStaffIllustrationsBySlug('ahmed-bilal', 'Illustration by Ahmed Bilal');
