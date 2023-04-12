import Image from "next/image";
import Link from "next/link";

import { AuthorArticle, getAuthorsText, getArticleUrl } from "./common";

// single article
const ProfileArticle = ( {article} : { article: AuthorArticle }) => {
  return (
    <div className="flex justify-center items-center flex-grow max-w-[100%] min-w-[220px]
                    mb-[1.5rem] pb-[1.25rem] px-[0.75rem] flex-shrink border-b border-evenLighterGray border-1">
      {/* Image */}
      <Link href={getArticleUrl(article)} className="relative h-[250px] w-full">
          <Image src={article.image} alt={article.title} fill className="object-cover pb-[0.5rem]" />
      </Link>
      {/* Title and teaser */}
      <div className="flex flex-col max-w-[20%] min-w-[250px] pl-[1.3rem] gap-2">
        <Link href={getArticleUrl(article)}>
            <h1 className="text-[1.2rem] leading-[1.5rem] font-bold">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article, "text-sm text-gray-600 font-medium -my-1 leading-4")}
        {/* Teaser */}
        <p className="text-[0.8rem] font-light mb-[0.8rem] text-lightGray leading-[0.9rem]">{article.teaser}</p>
      </div>
    </div>
  );
}

export default ProfileArticle;