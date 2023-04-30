import { eq, ne, desc, inArray, and } from 'drizzle-orm/expressions';
import { 
    AuthorProfile,
    AuthorPreview,
    ArticleList,
} from '../../components/articles';
import { 
    Issues,
    Articles,
    AuthorsArticles,
    ArticleIllustrations,
    IssuesArticlesOrder,
    Teams,
    TeamsStaff,
    Staff,
    Semesters,
    db,
} from '../common';
import {
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_TEASER,
    DEFAULT_STAFF_BIO,
    DEFAULT_STAFF_IMAGE,
    DEFAULT_STAFF_ORDER,
    DEFAULT_STAFF_TITLE,
} from '../../env';
import {
    addAuthorsToArticles,
} from './articles';

export async function getStaffArticles(slug: string): Promise<AuthorProfile> {
    // This is an expensive query, so we will cache the result for at least 1 hour
    const staff = await db.select({
        id: Staff.id,
        name: Staff.name,
        slug: Staff.slug,
        title: Staff.jobTitle,
        image: Staff.imageUrl,
        bio: Staff.biography,
    })
        .from(Staff)
        .where(eq(Staff.slug, slug))
        .limit(1);

    // error if no staff member found
    if (!staff.length) {
        throw new Error('Staff member not found');
    };

    // fetch all the articles they have written
    const staffArticles = await db.select({
        issue: Issues.issueNumber,
        id: Articles.id,
        title: Articles.title,
        slug: Articles.slug,
        teaser: Articles.teaser,
        image: Articles.imageUrl,
    })
        .from(AuthorsArticles)
        .where(eq(AuthorsArticles.authorId, staff[0].id))
        .innerJoin(Articles, eq(AuthorsArticles.articleId, Articles.id))
        .innerJoin(IssuesArticlesOrder, eq(AuthorsArticles.articleId, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.id)); // most recent articles first

    const staffArticlesWithAuthors = await addAuthorsToArticles(staffArticles);
    // Fill in default article image
    staffArticlesWithAuthors.forEach((article) => {
        article.image = article.image || ARTICLE_DEFAULT_IMAGE;
        article.teaser = article.teaser || ARTICLE_DEFAULT_TEASER;
    });

    // fetch all the articles they have written
    const staffIllustrations = await db.select({
        issue: Issues.issueNumber,
        id: Articles.id,
        title: Articles.title,
        slug: Articles.slug,
        teaser: Articles.teaser,
        image: Articles.imageUrl,
    })
        .from(ArticleIllustrations)
        .where(eq(ArticleIllustrations.staffId, staff[0].id))
        .innerJoin(Articles, eq(ArticleIllustrations.articleId, Articles.id))
        .innerJoin(IssuesArticlesOrder, eq(ArticleIllustrations.articleId, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.id));

    const staffIllustrationsWithAuthors = await addAuthorsToArticles(staffIllustrations);
    // Fill in default article image
    staffIllustrationsWithAuthors.forEach((article) => {
        article.image = article.image || ARTICLE_DEFAULT_IMAGE;
        article.teaser = article.teaser || ARTICLE_DEFAULT_TEASER;
    });    

    return {
        name: staff[0].name,
        slug: staff[0].slug,
        title: staff[0].title || DEFAULT_STAFF_TITLE,
        image: staff[0].image || DEFAULT_STAFF_IMAGE,
        bio: staff[0].bio || DEFAULT_STAFF_BIO,
        articles: staffArticlesWithAuthors as ArticleList[],
        illustrations: staffIllustrationsWithAuthors as ArticleList[],
    } as const;
};

export async function getLatestStaffRoster(): Promise<AuthorPreview[][]> {
    // get the latest semester
    const latestSemester = db.select({
        id: Semesters.id,
    })
        .from(Semesters)
        .orderBy(desc(Semesters.id))
        .limit(1);

    // use as subquery to get all team members
    const staffRoster = await db.select({
        teamName: Teams.name,
        staffName: Staff.name,
        staffSlug: Staff.slug,
        staffTitle: Staff.jobTitle,
        staffImage: Staff.imageUrl,
        staffOrder: TeamsStaff.staffOrder || 0,
    })
        .from(TeamsStaff)
        .where(eq(TeamsStaff.semesterId, latestSemester))
        .innerJoin(Teams, eq(Teams.id, TeamsStaff.teamId))
        .innerJoin(Staff, eq(Staff.id, TeamsStaff.staffId))
        .orderBy(TeamsStaff.teamOrder);

    // create a mapping
    const teamToStaff: Map<string, AuthorPreview[]> = new Map();
    staffRoster.forEach((staff) => {
        const currentTeam = teamToStaff.get(staff.teamName) || [];
        currentTeam.push({
            teamName: staff.teamName,
            staffName: staff.staffName,
            staffSlug: staff.staffSlug,
            staffTitle: staff.staffTitle || DEFAULT_STAFF_TITLE,
            staffImage: staff.staffImage || DEFAULT_STAFF_IMAGE,
            staffOrder: staff.staffOrder || DEFAULT_STAFF_ORDER,
        });
        teamToStaff.set(staff.teamName, currentTeam);
    });

    // sort staff by order
    teamToStaff.forEach((staffList) => {
        staffList.sort((a, b) => a.staffOrder - b.staffOrder);
    });

    return Array.from(teamToStaff.values());
}
