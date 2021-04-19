import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const FilterItem = ({
  label,
  value,
  onCheck,
  checked,
  subLabel
}) => (
  <li>
    <FormControlLabel
      control={<GreenCheckbox name="gilad" />}
      label={label}
      onChange={() => onCheck(value)}
      checked={checked}
    />
    <span>{subLabel}</span>
  </li>
);

FilterItem.propTypes = {
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onCheck: PropTypes.func,
  checked: PropTypes.bool
};

FilterItem.defaultProps = {
  onCheck: () => {},
  checked: false
};

export default FilterItem;
