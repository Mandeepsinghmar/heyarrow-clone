import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const VerticalTabs = ({
  tabs,
  value,
  onChange
}) => (
  <div className="vertical-tabs">
    {tabs.map((tab) => (
      <div
        key={tab.value}
        className={`vertical-tab-item ${value === tab.value ? 'active' : ''}`}
        onClick={() => !tab.isDisabled && onChange(tab.value)}
      >
        <span>{tab.label}</span>
        <span className="vertical-tab-item__subtitle">{tab.subtitle}</span>
      </div>
    ))}
  </div>
);

VerticalTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
};

VerticalTabs.defaultProps = {
  tabs: [],
  value: 'shared',
  onChange: () => {}
};

export default VerticalTabs;
