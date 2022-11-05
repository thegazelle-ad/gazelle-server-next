import Link from 'next/link';
import moment from 'moment';
import { ArticleData } from '../types';

interface ArchivesInterface {
  archivesData : ArticleData[];
}

const Archives = (props: ArchivesInterface) => {
  const renderIssueList =
    // Returns reversed array of issues
    props.archivesData
      .map(issue => (
        <div key={issue.issueNumber} className="archives__issue-item">
          <Link href={`/issue/${issue.issueNumber}`}>
            <h1 className="archives__issue-item__issue-name">
              {`${issue.name}`}
            </h1>
            <p className="archives__issue-item__publication-date">
              {moment(issue.published_at).format('MMM DD, YYYY')}
            </p>
          </Link>
        </div>
      ))
      .reverse();
  return <div className="archives">{renderIssueList}</div>;
}

export default Archives;
