import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({
  children,
  index,
  value
}) => <div hidden={index !== value}>{children}</div>;

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default TabPanel;
