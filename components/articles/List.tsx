import Image from "next/image";
import Link from "next/link";

import { ellipsis, ArticleList, getAuthorsText, getArticleUrl } from "./common";
import { TEASER_ELLIPSIS_LENGTH } from "../../env";

// single article
const ListArticle = ( {article, imageHeight, ellipsisTeaser, className } : { article: ArticleList, imageHeight?: string, ellipsisTeaser?: boolean, className?: string }) => {
  imageHeight = imageHeight || "h-[250px]";

  return (
    <div className={className || ""}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center w-full">
        {/* Image */}
        <Link href={getArticleUrl(article)} className={`peer relative ${imageHeight} w-full md:col-span-1 col-span-2`}>
            <Image 
              src={article.image} 
              alt={article.title} 
              fill 
              className="object-cover" 
              sizes="430px"
            />
        </Link>
        {/* Title and teaser */}
        <div className="flex flex-col gap-4 peer-hover:text-sky-600">
          <Link href={getArticleUrl(article)}>
              <h1 className="text-2xl md:text-xl leading-[1.5rem] font-bold capitalize font-lora hover:text-sky-600">{article.title}</h1>
          </Link>
          {/* Authors */}
          {getAuthorsText(article, "text-lg md:text-sm text-gray-600 font-medium -my-1 leading-4")}
          {/* Teaser */}
          <Link href={getArticleUrl(article)}>
            <p className="text-lg md:text-sm font-light text-lightGray leading-6 md:leading-5 hover:text-sky-600">{ellipsisTeaser ? ellipsis(article.teaser, TEASER_ELLIPSIS_LENGTH) : article.teaser}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListArticle;