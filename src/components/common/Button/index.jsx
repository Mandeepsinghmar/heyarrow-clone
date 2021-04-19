import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import './index.scss';

const CustomButton = ({
  children,
  color = 'primary',
  ...props
}) => (
  <Button color={color} {...props}>
    {children}
  </Button>
);

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string
};

CustomButton.defaultProps = {
  color: 'primary'
};

export default CustomButton;
