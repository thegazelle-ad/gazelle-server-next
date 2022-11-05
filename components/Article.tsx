// Components
import ArticleList from './ArticleList';
import Trending from './Trending';
import ArticleBody from './ArticleBody';
import { ArticleData, Related } from '../types';

interface ArticleAndOthers extends ArticleData, Related {}

const Article = (props: ArticleAndOthers) => {
  return (
    <div className="article">
      <ArticleBody {...props} />
      <div className="article__footer">
        <div className="article__footer__related-articles">
          <div className="article__footer__related-articles__header">
            related
          </div>
          <ArticleList articles={props.relatedArticles} />
        </div>
        <div className="article__footer__trending">
          <Trending articles={props.trending} />
        </div>
      </div>
    </div>
  );
}

export default Article;
