// Returns a list of article previews from articles array prop
// Parents: HomePage, StaffMember
// Children: ArticlePreview
// Components

import ArticlePreview from './ArticlePreview';
import { ArticleData } from '../types';

// Todo - single article datatype (with prism)

interface ArticleInterface {
  articles: ArticleData[];
}

// TODO: create controller component to fetch list of articles in issue
const ArticleList = (props: ArticleInterface) => {
  // Returns list of <ArticlePreview/> components with their respective posts
  const renderArticlePreviews =
    // Render nothing if this.props.articles is empty
    props.articles.map(article => (
      <ArticlePreview key={article.slug} article={article} />
    ));

  return <div className="article-list">{renderArticlePreviews}</div>;
}

export default ArticleList;
