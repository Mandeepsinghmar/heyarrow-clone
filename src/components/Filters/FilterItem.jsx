import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';

const FilterItem = ({
  label,
  value,
  onCheck,
  checked,
  subLabel
}) => (
  <li>
    <FormControlLabel
      control={<Checkbox name="gilad" color="primary" />}
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
