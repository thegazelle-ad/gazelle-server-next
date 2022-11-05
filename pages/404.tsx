import type { NextPage } from 'next'

const NotFound: NextPage = () => {
  return(
    <div className="not-found">
      <h2>404 page not found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
