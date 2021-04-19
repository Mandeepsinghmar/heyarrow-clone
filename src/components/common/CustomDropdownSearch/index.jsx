import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import './index.scss';

const CustomDropDownSearch = ({
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
    setvalue({ ..._value, value: newValue });
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  return (
    <UncontrolledDropdown className={`custom-dropdown ${className}`}>
      <DropdownToggle disabled={disabled}>
        {getDisplayLabel()}
      </DropdownToggle>
      <DropdownMenu className="drop-shadow-menu" style={{ maxHeight: '500px', minWidth: '200px', overflowY: 'scroll' }}>
        <div className="searchTabs">
          <i className="fa fa-search" />
          <input
            className="form-control"
            autoComplete="false"
            autoCapitalize="off"
            placeholder="Search"
            type="text"
          />
        </div>
        {data?.map((dataItem) => (
          <div className="drop-check-item" key={dataItem.value}>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={() => onChangeHandler(dataItem.value)} />
                <span className="geekmark" />
                {dataItem.label}
              </Label>
            </FormGroup>
          </div>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

CustomDropDownSearch.propTypes = {
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

CustomDropDownSearch.defaultProps = {
  onChange: () => {},
  disabled: false,
  value: '',
  placeholder: '',
  className: ''
};

export default CustomDropDownSearch;
