import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Standard = ({ article, maxWidth, minWidth }: { article: ArticlePreview, maxWidth: string, minWidth: string }) => {

  return (
    <div className={`flex flex-col flex-wrap w-full gap-2 ${minWidth} ${maxWidth}`}>
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative h-[300px] md:h-[170px] mb-1">
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 450px, 325px"
          />
        </Link>
        {/* Title and info */}
        {/* Category */}
        {/* <Link href={`/category/${article.category.slug}`} >
        <p className="text-sm font-light text-gray-600">{article.category.name}</p>
        </Link> */}
        {/* Title */}
        <Link href={getArticleUrl(article)}>
          <h1 className="text-3xl md:text-lg font-semibold uppercase leading-snug">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article)}
        {/* Teaser */}
        <Link href={getArticleUrl(article)}>
        <p className="text-base md:text-sm font-light text-gray-600">{article.teaser}</p>
        </Link>
    </div>
);
}

export default Standard;
