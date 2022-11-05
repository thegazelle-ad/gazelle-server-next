import ArticleList from './ArticleList';
import { ArticleData } from '../types';

interface EditorsPicksInterface {
  articles: ArticleData[];
}

const EditorsPicks = (props: EditorsPicksInterface) => {
  return (
    <div className="editors-picks">
      <h2 className="section-header">
        <span>editor{"'"}s picks</span>
      </h2>
      <ArticleList articles={props.articles} />
    </div>
  );
}

export default EditorsPicks;
