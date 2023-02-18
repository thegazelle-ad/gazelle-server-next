// import { PrismaClient } from '@prisma/client'


// const globalForPrisma = global as unknown as { prisma: PrismaClient }


// export const prisma: PrismaClient =

//   globalForPrisma.prisma ||

//   new PrismaClient({

//     log: ['query'],

//   })

// export async function latestIssueQuery() {
//   const latestIssue = await prisma.issues.findFirst({
//     orderBy: { issue_number: 'desc' },
//     where: { published_at: { not: null } },
//     select: { issue_number: true, id: true },
//   });
//   return latestIssue;
// }

// export async function getLatestIssue() {
//   const latestIssue = await prisma.issues.findFirst({
//     orderBy: { issue_number: 'desc' },
//     where: { published_at: { not: null } },
//     select: { 
//       issue_number: true, 
//       id: true,
//       issues_articles_order: {
//         select: {
//           articles: {
//             select: {
//               title: true,
//               slug: true,
//               teaser: true,
//               image_url: true,
//               markdown: true,
//             }
//           },
//         }
//       },
//     },
//   });

//   if (!latestIssue) 
//     throw new Error('No issue found');

//   return latestIssue;
// }

// export async function issueByNumber(issueId: number) {
//   const issue = await prisma.issues.findFirst({
//     where: { issue_number: issueId },
//     select: {
//       issue_number: true,
//       id: true,
//       issues_articles_order: {
//         select: {
//           articles: {
//             select: {
//               title: true,
//               slug: true,
//               teaser: true,
//               image_url: true,
//             }
//           },
//         }
//       },
//     },
//   });

//   return issue;
// }

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma