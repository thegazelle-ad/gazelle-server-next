import Link from 'next/link';

import {
  ARTICLE_TYPES,
} from '../../env';

export type Category = {
    id: number;
    name: string;
    slug: string;
}

export type Author = {
    name: string;
    slug: string;
}

// Used on teams page
export type AuthorPreview = {
    teamName: string;
    staffName: string;
    staffSlug: string;
    staffTitle: string;
    staffImage: string;
    staffOrder: number;
}

// Used on a profile page
export type AuthorProfile = {
    name: string;
    slug: string;
    title: string;
    image: string;
    bio: string;
    articles: AuthorArticle[];
}

// Used on a profile page
export type AuthorArticle = {
    issue: number;
    title: string;
    slug: string;
    image: string;
    teaser: string;
}

// Used on main page
export type ArticlePreview = {
    issue: number;
    title: string;
    slug: string;
    image: string;
    teaser: string;
    authors: Author[];
    category: Category;
    articleOrder: number;
    type: ARTICLE_TYPES;
    views: number;
}

export type ArticlePage = {
    title: string;
    image: string;
    teaser: string;
    authors: Author[];
    markdown: string;
    publishedAt: string;
}

export type IssueArticles = {
    allCategories: ArticlePreview[][];
    featured: ArticlePreview;
    trending: ArticlePreview[];
    editorsPicks: ArticlePreview[];
}

export function getAuthorsText(article: ArticlePreview, style="text-sm text-gray-600 font-normal -my-1 leading-4") {
  return (
    <div>
      <ul className={style}>
        {article.authors.map((author, index) => {
          const isLastAuthor = index === article.authors.length - 1;
          const showAnd = isLastAuthor && article.authors.length > 1;
          const showComma = !isLastAuthor;

          return (
            <li key={index} className="inline-flex">
              {/* And before last author */}
              {showAnd && <span className='mr-1'> and </span>}
              <Link href={`/staff/${author.slug}`}>
                  <p>{author.name}</p>
              </Link>
              {/* Comma after authors */}
              {showComma && <span className='mr-1'>, </span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function getArticleUrl(article: ArticlePreview | AuthorArticle) {
    return `/issue/${article.issue}/${article.slug}`
}
