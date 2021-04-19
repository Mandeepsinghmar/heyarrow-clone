import React from 'react';
import PropTypes from 'prop-types';

const Popup = ({
  children,
  showMe
}) => {
  let detailsPopup = (
    <div>
      <div>{children}</div>
    </div>
  );
  if (!showMe) {
    detailsPopup = null;
  }
  return <div>{detailsPopup}</div>;
};

Popup.defaultProps = {
  children: '',
  showMe: '',
};
Popup.propTypes = {
  children: PropTypes.node,
  showMe: PropTypes.bool,
};

export default Popup;
