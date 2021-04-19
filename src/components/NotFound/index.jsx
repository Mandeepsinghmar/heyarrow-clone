import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const NotFound = () => {
  const history = useHistory();
  return (
    <div className="not-found">
      <img src="/images/not_found.svg" alt="not-founc" />
      <Link onClick={history.goBack}>Go back</Link>
    </div>
  );
};

export default NotFound;
