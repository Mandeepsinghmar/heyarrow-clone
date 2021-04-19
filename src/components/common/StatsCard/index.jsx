import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import nFormatter from '../../../utils/nFormatter';

const StatsCard = ({
  label,
  value,
  type
}) => {
  const formatValue = () => {
    switch (type) {
    case 'currency':
      return `$${nFormatter(value)}`;
    case 'day':
      return `${value}D`;
    default:
      return value;
    }
  };

  return (
    <div className="cardBox">
      <div className="innerCardCon gray">
        <h4>{label}</h4>
        <h3>
          {formatValue()}
        </h3>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
};

StatsCard.defaultProps = {
  type: ''
};

export default StatsCard;
