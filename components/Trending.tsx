import ArticleList from './ArticleList';
import { ArticleData } from '../types';

interface TrendingInterface {
  articles: ArticleData[];
}

const Trending = (props: TrendingInterface) => {
  return (
    <div className="trending">
      <h2 className="section-header">
        <span>trending</span>
      </h2>
      <ArticleList articles={props.articles} />
    </div>
  );
}

export default Trending;
