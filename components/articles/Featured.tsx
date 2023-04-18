import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Featured = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="flex flex-row flex-wrap px-3 md:px-8 pb-4 gap-4 md:gap-6">
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative h-[350px] w-full md:w-[65%]">
          <Image 
            src={article.image}
            alt={article.title} 
            priority={true} 
            fill 
            className="object-cover object-right" 
            sizes="(max-width: 1024px) 100vw, 620px"
          />
        </Link>
        {/* Title and info */}
        <div className="flex flex-col justify-center gap-4 md:gap-2 w-full md:w-[30%]">
          {/* Category */}
          <Link href={`/category/${article.category.slug}`} >
            <p className="text-base capitalize text-gray-600 font-semibold">{article.category.name}</p>
          </Link>
          {/* Title */}
          <Link href={getArticleUrl(article)}>
            <h1 className="text-3xl font-semibold uppercase">{article.title}</h1>
          </Link>
          {/* Authors */}
          {getAuthorsText(article, "text-lg md:text-sm text-gray-600 font-normal -my-1 leading-4")}
          {/* Teaser */}
          <Link href={getArticleUrl(article)}>
            <p className="text-lg md:text-sm font-light text-gray-600">{article.teaser}</p>
          </Link>
        </div>
    </div>
);
}

export default Featured;
