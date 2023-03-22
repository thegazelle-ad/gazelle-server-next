import { PrismaClient } from '@prisma/client'
import { ArticlePreview } from '../components/articles';

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

function parseLatestIssue(issue: UnwrapPromise<ReturnType<typeof getLatestIssue>>) {
    // parse the issue into a format that the frontend can use

    // map the id to the category name and slug
    const idToCategory: Record<number, { name: string; slug: string }> = {};
    issue.issues_categories_order.forEach((category) => {
        const { id, name, slug } = category.categories;
        idToCategory[id] = { name, slug };
    });

    // 

}

export async function getLatestIssue() {
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