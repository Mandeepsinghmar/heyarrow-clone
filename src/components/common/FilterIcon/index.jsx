import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const FilterIcon = ({
  enabled
}) => (
  <span className="filter-icon">
    {enabled && (
      <img
        src="./Icons/FilterTick.svg"
        alt="filter"
        className="filter-tick"
      />
    )}
    <img src="./Icons/Filter.svg" alt="filter" />
  </span>
);

FilterIcon.propTypes = {
  enabled: PropTypes.bool,
};

FilterIcon.defaultProps = {
  enabled: false
};

export default FilterIcon;
