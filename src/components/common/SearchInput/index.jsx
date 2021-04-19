import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../CustomIcon';

const SearchInput = ({
  value,
  onChange,
  onClear,
  bgGray,
  ...props
}) => {
  const [innerValue, setValue] = useState(value);
  useEffect(() => {
    setValue(value);
  }, [value]);

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  const onClearHandler = () => {
    onClear();
    setValue('');
  };

  return (
    <div className={`search-field flex w-100 align-center justify-center ${bgGray && 'search-input_bg-gray'}`}>
      <input
        className="flex-1 search-field__input w-100"
        value={innerValue}
        type="text"
        placeholder="Search"
        {...props}
        onChange={onChangeHandler}
      />
      {innerValue
        ? (
          <CustomIcon
            className="search-field__icon cursor-pointer"
            icon="clear"
            onClick={onClearHandler}
          />
        ) : (
          <CustomIcon
            className="search-field__icon"
            icon="Search"
          />
        ) }
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  bgGray: PropTypes.bool
};

SearchInput.defaultProps = {
  value: '',
  onChange: () => {},
  onClear: () => {},
  bgGray: false
};

export default SearchInput;
