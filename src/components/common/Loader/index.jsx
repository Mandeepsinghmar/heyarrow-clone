import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default function Loader({
  secondary
}) {
  return (
    <div className={`loader ${secondary ? 'loader-secondary' : ''}`}>
      Loading...
    </div>
  );
}

Loader.propTypes = {
  secondary: PropTypes.bool
};

Loader.defaultProps = {
  secondary: false
};
