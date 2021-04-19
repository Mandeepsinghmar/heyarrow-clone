import React from 'react';
import PropTypes from 'prop-types';

function CustomIcon({
  icon,
  type = 'svg',
  className = '',
  ...props
}) {
  return (
    <>
      <img
        src={`/Icons/${icon}.${type}`}
        className={className}
        style={{ display: 'block' }}
        alt={icon}
        {...props}
      />
    </>
  );
}

CustomIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
};

CustomIcon.defaultProps = {
  type: 'svg',
  className: ''
};

export default CustomIcon;
