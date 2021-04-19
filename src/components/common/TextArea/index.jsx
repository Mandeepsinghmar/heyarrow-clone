import React from 'react';
import {
  TextField
} from '@material-ui/core';

import './index.scss';

const CustomTextarea = (props) => (
  <TextField
    multiline
    variant="outlined"
    {...props}
  />
);

export default CustomTextarea;
