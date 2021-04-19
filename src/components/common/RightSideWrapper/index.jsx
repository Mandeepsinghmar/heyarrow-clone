import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import CustomIcon from '../CustomIcon';

const RightSideWrapper = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openBar = (open) => {
    setIsOpen(open);
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <>
      <div className="arrowsCon">
        <button type="button" className="arrowBtn right" onClick={() => openBar(true)}>
          <i className="fas fa-chevron-left" />
        </button>
      </div>
      <div className={`rightSidebar ${isOpen ? 'open' : ''}`}>
        <div className="crossSection">
          <IconButton size="small" onClick={() => openBar(false)}>
            <CustomIcon icon="Close" />
          </IconButton>
        </div>
        {children}
      </div>
    </>
  );
};

RightSideWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.number
  ]).isRequired,
};

export default RightSideWrapper;
