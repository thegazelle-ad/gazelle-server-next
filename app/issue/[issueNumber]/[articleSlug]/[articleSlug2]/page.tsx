export const revalidate = 900;
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'error';

import { cache } from 'react';
import ArticleLayout from '../../../../../components/ArticleLayout';
import { getArticle } from '../../../../../db';
import { capitalizeSentence } from '../../../../../components/articles';

const cacheGetArticle = cache(getArticle);

// Wrapper component - this is so we can have both /issue/[issueNumber]/[articleSlug] and /issue/[issueNumber]/[category][articleSlug] work
// https://github.com/vercel/next.js/issues/48162

export async function generateMetadata({ params: { articleSlug2 }}: { params: { articleSlug2: string }}) {
  const issue = await cacheGetArticle(articleSlug2);
  return {
    title: capitalizeSentence(issue.title),
    description: issue.teaser,
  };
}

export default async function Page({ params: { issueNumber, articleSlug, articleSlug2 }}: { params: { issueNumber: string, articleSlug: string, articleSlug2: string }}) {
    const article = await cacheGetArticle(articleSlug2);

    return (
        //@ts-ignore
        <ArticleLayout article={article} slug={articleSlug2} />
    );
}
