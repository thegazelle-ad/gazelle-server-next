import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Stacked = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="flex flex-col max-w-full min-w-[18rem] min-h-fit">
        {/* Title */}
        <Link href={getArticleUrl(article)}>
          <h1 className="text-base leading-5 font-semibold uppercase">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article, "text-xs text-gray-600 font-normal leading-3")}
    </div>
);
}

export default Stacked;
