import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, ArticleList, getAuthorsText, getArticleUrl } from './common';

const Stacked = ({ article, titleStyle, authorStyle }: { article: ArticlePreview | ArticleList, titleStyle?: string, authorStyle?: string }) => {
  titleStyle = titleStyle || "text-base leading-5 font-semibold uppercase";
  authorStyle = authorStyle || "text-xs text-gray-600 font-normal leading-3";

  return (
    <div className="flex flex-col max-w-full min-w-[18rem] min-h-fit">
        {/* Title */}
        <Link href={getArticleUrl(article)}>
          <h1 className={titleStyle}>{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article, authorStyle)}
    </div>
);
}

export default Stacked;
