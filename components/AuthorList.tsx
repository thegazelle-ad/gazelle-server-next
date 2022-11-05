import Link from 'next/link';
import { Author } from '../types';

interface AuthorListInterface {
  authors: Author[];
}

// todo - maybe fix if author is not set (set to empty array?)

const AuthorList = (props: AuthorListInterface) => {
  // Render all authors
  const renderAuthors =
    // Render nothing if props.authors is empty
    props.authors.map(author => (
      <li key={author.slug} className="author-list__author">
        <Link href={`/staff-member/${author.slug}`}>{author.name}</Link>
      </li>
    ));

  return <div className="author-list">{renderAuthors}</div>;
}

export default AuthorList;
