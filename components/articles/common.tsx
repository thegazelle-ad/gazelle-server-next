import Link from 'next/link';

export type Category = {
    id: number;
    name: string;
    slug: string;
}

type Author = {
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
}

export function getAuthorsText(article: ArticlePreview, style="text-sm text-gray-600 inline font-normal") {
  return (
    <div>
      <ul>
        {article.authors.map((author, index) => {
          const isLastAuthor = index === article.authors.length - 1;
          const showAnd = isLastAuthor && article.authors.length > 1;
          const showComma = !isLastAuthor;

          return (
            <li key={index} className={style}>
              {/* And before last author */}
              {showAnd && <span> and </span>}
              <Link href={`/staff/${author.slug}`}>
                  {author.name}
              </Link>
              {/* Comma after authors */}
              {showComma && <span>, </span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function getArticleUrl(article: ArticlePreview | AuthorArticle) {
    return `/${article.issue}/${article.slug}`
}
