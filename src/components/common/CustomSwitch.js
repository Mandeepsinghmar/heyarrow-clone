/* eslint-disable */
import React from 'react';

function CustomSwitch(props) {
  return (
    <>
      <label className="switch">
        <input type="checkbox" {...props} />
        <span className="slider round" />
      </label>
    </>
  );
}

export default CustomSwitch;
