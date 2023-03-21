import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Standard = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="flex flex-col w-64 h-64">
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative h-full mb-1">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </Link>
        {/* Title and info */}
        {/* Category */}
        <Link href={`/category/${article.category}`} >
        <p className="text-sm font-light text-gray-600">{article.category}</p>
        </Link>
        {/* Title */}
        <Link href={getArticleUrl(article)}>
        <h1 className="text-2xl font-semibold font-roboto uppercase">{article.title}</h1>
        </Link>
        {/* Authors */}
        {getAuthorsText(article)}
        {/* Teaser */}
        <Link href={getArticleUrl(article)}>
        <p className="text-sm font-light text-gray-600">{article.teaser}</p>
        </Link>
    </div>
);
}

export default Standard;
