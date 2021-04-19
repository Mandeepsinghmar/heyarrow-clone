import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const TabWithContent = ({
  titles,
  children,
  onChangeTab
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const changeTab = (index) => {
    setCurrentIndex(index);
    onChangeTab(index);
  };

  return (
    <div className="tab-with-content">
      <div className="tab-with-content__header">
        {titles && titles.map((title, index) => (
          <span
            className={`tab-with-content__header-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => changeTab(index)}
            key={title}
          >
            {title}
          </span>
        ))}
      </div>
      <div className="tab-with-content__content">
        {children}
      </div>
    </div>
  );
};

TabWithContent.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
  onChangeTab: PropTypes.func.isRequired
};

export default TabWithContent;
