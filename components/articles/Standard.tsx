import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl, ellipsis } from './common';
import { TEASER_ELLIPSIS_LENGTH } from '../../env';

const Standard = ({ article, maxWidth, minWidth, large, priorityImage, eagerImage }: { article: ArticlePreview, maxWidth: string, minWidth: string, large?: boolean, priorityImage?: boolean, eagerImage?: boolean }) => {
  const imageHeight = large ? "h-[240px] sm:h-[300px] md:h-[170px] lg:h-[300px]" : "h-[240px] sm:h-[350px] md:h-[170px]";
  const titleSize = large ? "text-2xl sm:text-3xl md:text-xl lg:text-2xl" : "text-2xl sm:text-3xl md:text-xl";
  const authorSize = large ? "text-base" : "text-base md:text-sm";
  const teaserSize = large ? "text-base" : "text-base md:text-sm";

  return (
    <div className={`flex flex-col flex-wrap w-full gap-3 md:gap-2 hover:cursor-pointer ${minWidth} ${maxWidth}`}>
        {/* Image */}
        <Link href={getArticleUrl(article)} className={`peer relative w-full md:w-auto mb-1 ${imageHeight}`}>
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 450px, 325px"
            priority={priorityImage}
            loading={eagerImage ? "eager" : "lazy"}
          />
        </Link>
        {/* Title */}
        <h1 className={`${titleSize} font-semibold capitalize font-lora peer-hover:text-sky-600 hover:text-sky-600 leading-snug ${large ? "md:leading-7" : "md:leading-6"}`}>{article.title}</h1>
        {/* Authors */}
        {getAuthorsText(article, `${authorSize} text-gray-600 font-normal -my-1 py-1 leading-9 md:leading-5`)}
        {/* Teaser */}
        <Link href={getArticleUrl(article)}>
          <p className={`${teaserSize} font-light text-gray-600 hover:text-sky-600`}>{ellipsis(article.teaser, TEASER_ELLIPSIS_LENGTH)}</p>
        </Link>
    </div>
);
}

export default Standard;
