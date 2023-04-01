import { PrismaClient } from '@prisma/client'
import { ArticlePreview } from '../components/articles';
import { UNCATEGORIZED_CATEGORY_ID, UNCATEGORIZED_CATEGORY_NAME, UNCATEGORIZED_CATEGORY_SLUG, DEV } from './env';

// Boilerplate to ensure only one prisma instance exists
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Utility type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const prisma: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

export async function getLatestIssueNumber() {
  const latestIssue = await prisma.issues.findFirst({
    orderBy: { issue_number: 'desc' },
    where: { published_at: { not: null } },
    select: { issue_number: true, id: true },
  });
  return latestIssue;
}

function parseIssue(issue: UnwrapPromise<ReturnType<typeof getLatestIssueFromDB>>) {
    // parse the issue into a format that the frontend can use

    // sort categories
    issue.issues_categories_order.sort((a, b) => a.categories_order - b.categories_order);

    // map the id to the category name and slug
    const idToCategory: Record<number, { name: string; slug: string }> = {};
    idToCategory[UNCATEGORIZED_CATEGORY_ID] = { name: UNCATEGORIZED_CATEGORY_NAME, slug: UNCATEGORIZED_CATEGORY_SLUG };
    issue.issues_categories_order.forEach((category) => {
        const { id, name, slug } = category.categories;
        idToCategory[id] = { name, slug };
    });

    // create an object to hold the articles
    const articlesByCategory: Record<string, ArticlePreview[]> = {};
    issue.issues_categories_order.forEach((category) => {
        const { id } = category.categories;
        articlesByCategory[id] = [];
    });

    // todo - this is a bit of a hack, but it works
    issue.issues_articles_order.forEach((article) => {
        const { title, slug, teaser, image_url, category_id } = article.articles;

        // type checks - todo - these should be removed in production
        if (!title) throw new Error('Article missing title');
        if (!slug) throw new Error('Article missing slug');
        if (!teaser) throw new Error('Article missing teaser');
        if (!image_url) throw new Error('Article missing image_url');

        // collect author names
        const authors = article.articles.authors_articles.map((author) => {
            const { name, slug } = author.staff;
            return { name, slug };
        });

        // group articles by category
        articlesByCategory[category_id || UNCATEGORIZED_CATEGORY_ID].push({
            issue: issue.issue_number,
            title,
            slug,
            teaser,
            image: image_url,
            category: idToCategory[category_id || UNCATEGORIZED_CATEGORY_ID],
            authors,
            articleOrder: article.article_order,
        });
    });

    // Sort each article by article order
    Object.values(articlesByCategory).forEach((articles) => {
        articles.sort((a, b) => a.articleOrder - b.articleOrder);
    });

    // Turn the object into an array
    const articles: ArticlePreview[][] = [];
    issue.issues_categories_order.forEach((category) => {
        const { id } = category.categories;
        articles.push(articlesByCategory[id]);
    });

    return articles;
}

async function getLatestIssueFromDB() {
  const latestIssue = await prisma.issues.findFirst({
    orderBy: { issue_number: 'desc' },
    where: { published_at: { not: null } },
    select: { 
      issue_number: true, 
      id: true,
      issues_categories_order: {
        select: {
            categories_order: true,
            categories: {
                select: {
                    name: true,
                    slug: true,
                    id: true,
                }
            }
        }
      },
      issues_articles_order: {
        select: {
          type: true, // this may be removable
          article_order: true,
          articles: {
            select: {
              title: true,
              slug: true,
              teaser: true,
              image_url: true,
              markdown: false, // todo - figure this out
              category_id: true,
              authors_articles: {
                select: {
                    staff: {
                        select: {
                            name: true,
                            slug: true,
                        }
                    }
                }
              }
            }
          },
        }
      },
    },
  });

  if (!latestIssue) 
    throw new Error('No issue found');

  return latestIssue;
}

export async function getLatestIssue() {
  let issue;
  try {
    issue = await getLatestIssueFromDB();
  } catch (e) {

    if (!DEV)
      throw new Error('Error getting latest issue');

    // Allow the app to run without a database in dev mode
    console.error(`No database found, using local issue data`);
    issue = require('../dev/latestIssueDemo').default;
  }
  return parseIssue(issue);
}

export async function getIssueByNumber(issueId: number) {
  const issue = await prisma.issues.findFirst({
    where: { issue_number: issueId },
    select: {
      issue_number: true,
      id: true,
      issues_articles_order: {
        select: {
          articles: {
            select: {
              title: true,
              slug: true,
              teaser: true,
              image_url: true,
            }
          },
        }
      },
    },
  });

  return issue;
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma