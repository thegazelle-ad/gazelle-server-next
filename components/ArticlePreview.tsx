import React from 'react';
import SharingButtons from './SharingButtons';
import Link from 'next/Link'
import _ from 'lodash';

// Components
import AuthorList from './AuthorList';
import { ArticleData } from '../types';

interface ArticlePreviewInterface {
  article: ArticleData;
}

const ArticlePreview = (props: ArticlePreviewInterface) => {
  const { article } = props;
  let url;
  if (article.issueNumber) {
    url = `/issue/${article.issueNumber.toString()}/${
      article.category.slug
    }/${article.slug}`;
  } else {
    return null;
  }
  if (article.is_interactive) {
    // We don't use standard url for interactive articles
    url = `/interactive/${article.slug}`;
  }
  if (!article.image_url) {
    // Article image default
    article.image_url =
      'https://cdn.thegazelle.org/gazelle/2016/02/saadiyat-reflection.jpg';
  }
  return (
    <div className="article-preview">
      <Link href={url}>
        <img
          className="article-preview__featured-image"
          src={article.image_url}
          alt="featured"
        />
      </Link>
      {/* Article title with link to article */}
      <div className="article-preview__content">
        <Link href={`/category/${article.category.slug}`}>
          <p className="article-preview__content__category-header">
            {article.category.slug.replace('-', ' ')}
          </p>
        </Link>

        <Link href={url}>
          <h3 className="article-preview__content__title">{article.title}</h3>
        </Link>
        {/* Author(s) */}
        <div className="article-preview__content__authors">
          <AuthorList authors={_.toArray(article.authors)} />
        </div>

        {/* Article teaser */}
        <p className="article-preview__content__teaser">{article.teaser}</p>
        <SharingButtons
          title={article.title}
          url={`thegazelle.org${url}`}
          teaser={article.teaser}
        />
      </div>
    </div>
  );
}

export default ArticlePreview;
