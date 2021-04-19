import React from 'react';
import {
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  menu: {
    height: 350,
  }
}));

const CustomSelect = ({ children, MenuProps, ...props }) => {
  const classes = useStyles();
  return (
    <Select
      {...props}
      MenuProps={{
        MenuProps,
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',

          horizontal: 'left',
        },
        className: classes.menu
      }}
      variant="outlined"
    >
      {children}
    </Select>
  );
};

CustomSelect.propTypes = {
  children: PropTypes.node.isRequired,
  MenuProps: PropTypes.objectOf(PropTypes.object),
};

CustomSelect.defaultProps = {
  MenuProps: {}
};

export default CustomSelect;
