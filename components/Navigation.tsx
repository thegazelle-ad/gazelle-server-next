import _ from 'lodash';
import Link from 'next/link';
import moment from 'moment';

interface NavigationInterface {
  navigationData: NavigationData; 
}

interface NavigationData {
  published_at: number;
  issueNumber: number;
  categories: object;
}

const Navigation = (props: NavigationInterface) => {
  const categories = [
    {
      name: 'news',
      slug: 'news',
    },
    {
      name: 'features',
      slug: 'features',
    },
    {
      name: 'opinion',
      slug: 'opinion',
    },
    {
      name: 'multimedia',
      slug: 'media',
    },
    {
      name: 'team',
      slug: 'team',
    },
  ];
  // TODO - fix this, won't happen w server side rendering
  if (props.navigationData != null) {
    // Wait for navigation data to come in asynchronously
    const data = props.navigationData;

    const renderCategories = _.map(categories || [], category => {
      if (category.slug === 'team') {
        return (
          <li key={category.slug} className="navigation__categories__item">
            <Link
              href="/team"
              className="navigation__categories__item--active"
            >
              {category.name}
            </Link>
          </li>
        );
      }
      // TODO - fix active / nonactive links
      return (
        <li key={category.slug} className="navigation__categories__item">
          <Link
            href={`/category/${category.slug}`}
            className="navigation__categories__item--active"
          >
            {category.name}
          </Link>
        </li>
      );
    });

    return (
      <div>
        <div className="navigation">
          <p className="navigation__publication-date">
            {moment(data.published_at).format('MMM DD, YYYY')}
          </p>
          <nav>
            <ul className="navigation__categories">{renderCategories}</ul>
          </nav>
          {/* TODO: change link to archives list */}
          <Link href="/archives" className="navigation__issueNumber">
            {`Issue ${data.issueNumber}`}
          </Link>
        </div>
      </div>
    );
  }
  return <div/>;
}

export default Navigation;
