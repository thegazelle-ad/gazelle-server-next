import Link from 'next/link';
import Image from 'next/image';
import { ArticlePreview } from './types';

const Featured = ({ article }: { article: ArticlePreview }) => {

  const articleUrl = `/${article.issue}/${article.slug}`

  const renderAuthors = article.authors.map((author, index) => {
    return (
      <div key={index}>
        <p>
          {/* Link to profile */}
          <Link href={`/staff/${author}`} className="text-sm font-light text-gray-600">
            {author}
          </Link>
          {/* Commas */}
          { index !== article.authors.length - 1 && <span className="text-sm font-light text-gray-600">, </span> }
          {/* And */}
          { index === article.authors.length - 1 && article.authors.length > 1 && <span className="text-sm font-light text-gray-600"> and </span>}
        </p>
      </div>
    );
  });

  return (
    <div className="flex flex-row gap-4">
        {/* Image */}
        <Link href={articleUrl} className="relative h-[30vh] w-1/2">
          <Image src={article.image} alt={article.title} fill className="object-contain" />
        </Link>
        {/* Title and info */}
        <div className="flex flex-col justify-start">
          {/* Category */}
          <Link href={`/category/${article.category}`} >
            <p className="text-sm font-light text-gray-600">{article.category}</p>
          </Link>
          {/* Title */}
          <Link href={articleUrl}>
            <h1 className="text-3xl font-semibold font-roboto uppercase">{article.title}</h1>
          </Link>
          {/* Authors */}
          {renderAuthors}
          {/* Teaser */}
          <Link href={articleUrl}>
            <p className="text-sm font-light text-gray-600">{article.teaser}</p>
          </Link>
        </div>
    </div>
);
}

export default Featured;
