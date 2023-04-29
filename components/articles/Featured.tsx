import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl, ellipsis } from './common';
import { TEASER_ELLIPSIS_LENGTH } from '../../env';

const Featured = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-4 w-full">
        {/* Image */}
        <Link href={getArticleUrl(article)} className="peer/featured relative min-h-[240px] sm:min-h-[350px] md:min-h-[350px] lg:min-h-[400px] h-auto w-full md:col-span-2">
          <Image 
            src={article.image}
            alt={article.title} 
            priority={true} 
            fill 
            className="object-cover object-right" 
            sizes="(max-width: 768px: 100vw), (max-width: 1024px) 66vw, 680px"
          />
        </Link>
        {/* Title and info */}
        <div className="flex flex-col justify-center gap-3 md:gap-2 w-full peer-hover/featured:text-sky-600">
          {/* Category (hides on mobile) */}
          <Link href={`/category/${article.category.slug}`} className="hidden md:block" >
            <p className="text-xl md:text-sm uppercase font-normal text-black hover:text-sky-600">{article.category.name}</p>
          </Link>
          {/* Title */}
          <Link href={getArticleUrl(article)}>
            <h1 className="text-2xl sm:text-3xl font-semibold capitalize font-lora hover:text-sky-600">{article.title}</h1>
          </Link>
          {/* Authors */}
          {getAuthorsText(article, "text-base md:text-sm text-gray-600 font-normal -my-1 py-1 leading-7 md:leading-6")}
          {/* Teaser */}
          <Link href={getArticleUrl(article)}>
            <p className="text-base md:text-sm font-light text-gray-600 hover:text-sky-600">{ellipsis(article.teaser, TEASER_ELLIPSIS_LENGTH)}</p>
          </Link>
        </div>
    </div>
);
}

export default Featured;
