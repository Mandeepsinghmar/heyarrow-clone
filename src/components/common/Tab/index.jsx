import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Tab = ({
  tabs,
  activeTab = 0,
  className = '',
  onChange
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const changeTab = (tabIndex) => {
    setCurrentTab(tabIndex);
    if (typeof onChange !== 'function') {
      return;
    }
    onChange(tabIndex);
  };

  return (
    <ul className={`tabs flex ${className}`}>
      {tabs && tabs.map((tab, index) => (
        <li
          className={`tabs__item ${currentTab === index ? 'active' : ''}`}
          onClick={() => changeTab(index)}
          key={tab}
        >
          {tab}
        </li>
      ))}
    </ul>
  );
};

Tab.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

Tab.defaultProps = {
  activeTab: 0,
  className: '',
  onChange: () => {}
};

export default Tab;
