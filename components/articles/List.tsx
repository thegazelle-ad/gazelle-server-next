import Image from "next/image";
import Link from "next/link";

import { ArticleList, getAuthorsText, getArticleUrl } from "./common";

// single article
const ListArticle = ( {article, imageHeight } : { article: ArticleList, imageHeight?: string }) => {
  imageHeight = imageHeight || "h-[250px]";

  return (
    <div className="flex justify-center items-center max-w-[100%]
                    mb-[1.5rem] pb-[1.25rem] px-[0.75rem] flex-shrink border-b border-evenLighterGray border-1">
      {/* Image */}
      <Link href={getArticleUrl(article)} className={`relative ${imageHeight} w-full min-w-[50%]`}>
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover pb-[0.5rem]" 
            sizes="430px"
          />
      </Link>
      {/* Title and teaser */}
      <div className="flex flex-col pl-[1.3rem] gap-4">
        <Link href={getArticleUrl(article)}>
            <h1 className="text-xl leading-[1.5rem] font-bold capitalize font-lora">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article, "text-sm text-gray-600 font-medium -my-1 leading-4")}
        {/* Teaser */}
        <p className="text-sm font-light mb-[0.8rem] text-lightGray leading-5">{article.teaser}</p>
      </div>
    </div>
  );
}

export default ListArticle;