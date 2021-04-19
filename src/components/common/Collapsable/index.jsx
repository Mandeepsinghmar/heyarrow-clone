import React, { useState } from 'react';
import { Collapse } from 'reactstrap';
import PropTypes from 'prop-types';

import './index.scss';

const Collapsable = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapsable">
      <h4 className="collapsable__title" onClick={toggle}>{title}</h4>
      <Collapse isOpen={isOpen}>
        {children}
      </Collapse>
    </div>
  );
};

Collapsable.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Collapsable;
