import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Standard = ({ article, maxWidth, minWidth }: { article: ArticlePreview, maxWidth?: string, minWidth?: string }) => {

  return (
    <div className={`flex flex-col gap-2 ${minWidth ? minWidth : 'min-w-[27%]'} ${maxWidth ? maxWidth : 'max-w-[32.5%]'}`}>
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative h-[170px] mb-1">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </Link>
        {/* Title and info */}
        {/* Category */}
        {/* <Link href={`/category/${article.category.slug}`} >
        <p className="text-sm font-light text-gray-600">{article.category.name}</p>
        </Link> */}
        {/* Title */}
        <Link href={getArticleUrl(article)}>
          <h1 className="text-lg font-semibold uppercase leading-snug">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article)}
        {/* Teaser */}
        <Link href={getArticleUrl(article)}>
        <p className="text-sm font-light text-gray-600">{article.teaser}</p>
        </Link>
    </div>
);
}

export default Standard;
