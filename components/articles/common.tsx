import Link from 'next/link';

type Category = {
    name: string;
    slug: string;
}

type Author = {
    name: string;
    slug: string;
}

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

export function getAuthorsText(article: ArticlePreview, style="text-sm font-light text-gray-600 inline") {
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

export function getArticleUrl(article: ArticlePreview) {
    return `/${article.issue}/${article.slug}`
}
