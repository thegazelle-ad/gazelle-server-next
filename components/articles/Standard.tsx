import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Standard = ({ article, maxWidth, minWidth }: { article: ArticlePreview, maxWidth: string, minWidth: string }) => {

  return (
    <div className={`flex flex-col flex-wrap w-full gap-4 md:gap-2 ${minWidth} ${maxWidth}`}>
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative w-full md:w-auto h-[300px] md:h-[170px] mb-1">
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
        {getAuthorsText(article, "text-lg md:text-sm text-gray-600 font-normal -my-1 leading-4")}
        {/* Teaser */}
        <Link href={getArticleUrl(article)}>
        <p className="text-lg md:text-sm font-light text-gray-600">{article.teaser}</p>
        </Link>
    </div>
);
}

export default Standard;
