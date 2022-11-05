import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import _ from 'lodash';
import { ArticleData } from '../types';

// Components
import AuthorList from './AuthorList';
import SharingButtons from './SharingButtons';

const ArticleBody = (props: ArticleData) => {
  return (
    <div>
      <div className="article__header">
        <h1 className="article__header__title">{props.title}</h1>
        <div className="article__header__teaser">{props.teaser}</div>
        <div className="article__header__subtitle article__header__subtitle__authors">
          <AuthorList
            authors={_.toArray(props.authors)}
          />
          <p className="article__header__subtitle__publication-date">
            {moment(props.published_at).format('MMM DD, YYYY')}
          </p>
          <SharingButtons
            title={props.title}
            url={props.url}
            teaser={props.teaser}
          />
        </div>
      </div>
      <div
        className="article__body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: props.html }}
      />
      <div className="article__body__end-mark">
        <Link href="/">
          <Image
            src="https://cdn.thegazelle.org/gazelle/2016/02/header-logo.png"
            alt="Gazelle Logo"
          />
        </Link>
      </div>
    </div>
  );
}

export default ArticleBody;
