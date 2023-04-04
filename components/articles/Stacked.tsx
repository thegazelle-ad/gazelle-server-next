import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Stacked = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="flex flex-col w-64 min-h-fit">
        {/* Title */}
        <Link href={getArticleUrl(article)}>
        <h1 className="text-2xl font-semibold uppercase">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article)}
    </div>
);
}

export default Stacked;
