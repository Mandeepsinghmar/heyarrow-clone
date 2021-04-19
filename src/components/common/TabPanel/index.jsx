import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({
  children,
  index,
  value,
  className
}) => <div className={className} hidden={index !== value}>{children}</div>;

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string
};

TabPanel.defaultProps = {
  className: '',
};

export default TabPanel;
