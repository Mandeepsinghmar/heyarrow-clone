import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import './index.scss';

const CustomDropDown = ({
  data,
  onChange,
  disabled = false,
  value,
  placeholder,
  className,
}) => {
  const [_value, setvalue] = useState(value);
  const getDisplayLabel = () => {
    const label = data?.find((dataItem) => dataItem.value === _value)?.label;
    return label || placeholder;
  };
  const onChangeHandler = (newValue) => {
    setvalue(newValue);
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  return (
    <UncontrolledDropdown className={`custom-dropdown-pinned ${className}`} renderAccessory={() => null}>
      <DropdownToggle disabled={disabled}>
        {getDisplayLabel()}
      </DropdownToggle>
      <DropdownMenu style={{ maxHeight: '200px', overflowY: 'scroll' }}>
        {data?.map((dataItem) => (
          <DropdownItem
            disabled={_value === dataItem.value}
            onClick={() => onChangeHandler(dataItem.value)}
            key={dataItem.value}
          >
            {dataItem.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
CustomDropDown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

CustomDropDown.defaultProps = {
  onChange: () => {},
  disabled: false,
  value: '',
  placeholder: '',
  className: ''
};

export default CustomDropDown;
