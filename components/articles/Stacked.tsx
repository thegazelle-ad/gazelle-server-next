import Link from 'next/link';
import { ArticlePreview, ArticleList, getAuthorsText, getArticleUrl } from './common';

const Stacked = ({ article, titleStyleAppend, authorStyle }: { article: ArticlePreview | ArticleList, titleStyleAppend?: string, authorStyle?: string }) => {
  const titleStyle = `text-2xl sm:text-3xl md:text-xl leading-9 md:leading-6 font-semibold font-lora capitalize hover:text-sky-600 ${titleStyleAppend || ""}`;
  authorStyle = authorStyle || "text-base md:text-sm text-gray-600 font-normal leading-7 md:leading-5";

  return (
    <div className="flex flex-col w-full pb-2">
        {/* Title */}
        <Link href={getArticleUrl(article)} className="pb-3 md:pb-1">
          <h1 className={titleStyle}>{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article, authorStyle)}
    </div>
);
}

export default Stacked;
