import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../common/CustomIcon';

const FilterChip = ({
  title,
  onClick,
}) => (
  <span className="filter-chip">
    {title}
    <CustomIcon
      icon="Close"
      onClick={onClick}
    />
  </span>
);

FilterChip.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

FilterChip.defaultProps = {
  onClick: () => {}
};

export default FilterChip;
