import ArticlePreview from './ArticlePreview';
import { ArticleData } from '../types';

interface FeaturedArticleInterface {
  article: ArticleData;
}

const FeaturedArticle = (props: FeaturedArticleInterface) => {
  return (
    <div className="featured-article">
      <ArticlePreview article={props.article} />
    </div>
  );
}
