import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview, getAuthorsText, getArticleUrl } from './common';

const Featured = ({ article }: { article: ArticlePreview }) => {

  return (
    <div className="flex flex-row gap-4">
        {/* Image */}
        <Link href={getArticleUrl(article)} className="relative h-[30vh] w-1/2">
          <Image src={article.image} alt={article.title} fill className="object-contain object-right" />
        </Link>
        {/* Title and info */}
        <div className="flex flex-col justify-start w-1/2">
          {/* Category */}
          <Link href={`/category/${article.category.slug}`} >
            <p className="text-sm font-light text-gray-600">{article.category.name}</p>
          </Link>
          {/* Title */}
          <Link href={getArticleUrl(article)}>
            <h1 className="text-3xl font-semibold font-roboto uppercase">{article.title}</h1>
          </Link>
          {/* Authors */}
          {getAuthorsText(article)}
          {/* Teaser */}
          <Link href={getArticleUrl(article)}>
            <p className="text-sm font-light text-gray-600">{article.teaser}</p>
          </Link>
        </div>
    </div>
);
}

export default Featured;