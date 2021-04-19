import React from 'react';
import PropTypes from 'prop-types';

import FilterChip from '../../components/FilterChip';
import moneyFormatter from '../../utils/moneyFormatter';

const FilterChipList = ({
  filters,
  removeFilter
}) => (
  <div className="filter-list">
    {Object.keys(filters).map((key) => {
      if (key === 'price' && filters[key].length) {
        const value = `${moneyFormatter.format(filters[key][0])} - ${moneyFormatter.format(filters[key][1])}`;
        return (
          <FilterChip
            title={value}
            onClick={() => removeFilter(value, key)}
          />
        );
      }
      if (key === 'is_new') {
        return filters[key].map((fil) => (
          <FilterChip
            title={fil ? 'New' : 'Used'}
            onClick={() => removeFilter(fil, key)}
          />
        ));
      }
      return filters[key]
        .map((fil) => (
          <FilterChip
            title={fil}
            onClick={() => removeFilter(fil, key)}
          />
        ));
    })}
  </div>
);

FilterChipList.propTypes = {
  filters: PropTypes.objectOf(PropTypes.array).isRequired,
  removeFilter: PropTypes.func
};

FilterChipList.defaultProps = {
  removeFilter: () => {}
};

export default FilterChipList;
