// import { PrismaClient } from '@prisma/client'
// import { prisma, latestIssueQuery, getLatestIssue } from './db'

export default async function Page() {
  
  // const users = await prisma.articles.findMany();
  // const users = await getArticlesForIssue(await latestIssueQuery());
  // const { issueId } = await latestIssueQuery();
  // const articles = await getArticlesForIssueId(issueId);
  // const latest = await getLatestIssue();
  // console.log(JSON.stringify(latest));
  // const latest = await getLatestIssue();
  
  let words = 0;
  // for (const article of latest.issues_articles_order) {

  //   // count number of words in articles.markdown
  //   if (article.articles.markdown)
  //     words += article.articles.markdown.split(' ').length;
  //   console.log(`Article ${article.articles.title} has ${words} words`);
  // }

  return <h1>Hello, Next.js!</h1>;
}