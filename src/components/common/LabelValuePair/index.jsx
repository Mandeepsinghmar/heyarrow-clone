import React from 'react';
import PropTypes from 'prop-types';

function LabelValuePair({ label, value, valueComp }) {
  return (
    <div className="quote-detail-item">
      <span>{label}</span>
      { valueComp || <span>{value}</span> }
    </div>
  );
}

LabelValuePair.defaultProps = {
  value: '-',
  valueComp: null
};

LabelValuePair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  valueComp: PropTypes.element
};

export default LabelValuePair;
