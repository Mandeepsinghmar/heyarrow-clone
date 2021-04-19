/* eslint-disable */
import React from 'react';
import { Tooltip } from '@material-ui/core';

const TableSendButton = ({
  title,
  className,
  placement,
  icon = 'Send',
  ...props
}) => (
  <Tooltip
    title={props.disabled ? '' : title}
    placement={placement}
  >
    <button {...props} className={`sendBtn ${className}`}>
      <i className="fa fa-save" />
    </button>
  </Tooltip>
);

export default TableSendButton;
