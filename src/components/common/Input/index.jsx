import React from 'react';
import { TextField } from '@material-ui/core';

import './index.scss';

const CustomInput = (props) => <TextField variant="outlined" size="small" {...props} />;

export default CustomInput;
