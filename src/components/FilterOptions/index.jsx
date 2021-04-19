import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CustomDropDown from '../common/CustomDropdown';
import {
  DURATION_TYPES,
  STATUSES,
  TYPES,
  DURATION_OPTIONS
} from '../../constants';
import './index.scss';

const FilterOptions = ({
  filterHandler,
  filters
}) => {
  const [durationType, setDurationType] = useState(filters.durationType);
  const [duration, setDuration] = useState(DURATION_OPTIONS[DURATION_TYPES
    .findIndex((dr) => dr.value === durationType)]);

  useEffect(() => {
    const newDuration = DURATION_OPTIONS[DURATION_TYPES
      .findIndex((dr) => dr.value === durationType)];
    setDuration(newDuration);
  }, [durationType]);

  useEffect(() => {
    if (durationType !== 'yearly') {
      filterHandler('duration', '1');
    } else {
      filterHandler('duration', 'all');
    }
  }, [durationType]);

  const durationTypeHandler = (value) => {
    setDurationType(value);
    filterHandler('durationType', value);
  };

  return (
    <div className="filter-options">
      <div className="flex filter-group justify-between">
        <CustomDropDown
          data={STATUSES}
          onChange={(value) => filterHandler('status', value)}
          value={filters.status}
          placeholder="status"
          className="filter-item"
        />
        <CustomDropDown
          data={TYPES}
          onChange={(value) => filterHandler('type', value)}
          placeholder="type"
          value={filters.type}
          className="filter-item"
        />
      </div>
      <div className="flex filter-group justify-between">
        <CustomDropDown
          data={DURATION_TYPES}
          onChange={(value) => durationTypeHandler(value)}
          value={durationType}
          placeholder="Duration type"
          className="filter-item"
        />
        <CustomDropDown
          data={duration?.data}
          onChange={(value) => filterHandler('duration', value)}
          value={filters?.duration?.toString()}
          placeholder={duration?.placeholder}
          className="filter-item"
        />
      </div>
    </div>
  );
};

FilterOptions.propTypes = {
  filterHandler: PropTypes.func,
  filters: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])),
};

FilterOptions.defaultProps = {
  filterHandler: () => {},
  filters: {},
};

export default FilterOptions;
