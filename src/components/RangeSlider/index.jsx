import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import PropTypes from 'prop-types';
import moneyFormatter from '../../utils/moneyFormatter';

const RangeSlider = ({
  range,
  onChange,
  title,
  value
}) => {
  const getValue = () => {
    if (value.length) {
      return value;
    }
    return range;
  };

  const [displayValue, setValue] = useState(getValue());

  useEffect(() => {
    setValue(getValue(), value);
  }, [value]);

  return (
    <div className="price-slider">
      <div className="price-slider-title">
        <span>{title}</span>
        <span>{`${moneyFormatter.format(displayValue[0])} - ${moneyFormatter.format(displayValue[1])}`}</span>
      </div>
      <Slider
        orientation="horizontal"
        min={range[0]}
        max={range[1]}
        onChange={(e, _range) => { setValue(_range); onChange(_range); }}
        value={getValue()}
      />
    </div>
  );
};

RangeSlider.propTypes = {
  range: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])),
  onChange: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.number)
};

RangeSlider.defaultProps = {
  range: [0, 0],
  onChange: () => {},
  title: '',
  value: []
};

export default RangeSlider;
