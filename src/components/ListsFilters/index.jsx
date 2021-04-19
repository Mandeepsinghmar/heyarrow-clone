import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import './index.scss';
import Tabs from '../common/Tab';
import { getAvailableProductsFiters, getSoldProductsFilters } from '../../api';
import Loader from '../common/Loader';
import TabPanel from '../common/TabPanel';
import FilterItem from './FilterItem';

// const tabList = ['Category', 'New/Used', 'Year', 'Price', 'Model', 'Make'];
const tabList = ['Make', 'Year', 'Purchase Date', 'Category'];

const Filters = ({
  activeFilterTab = 0,
  onApplyFilters,
  defaultFilters,
  onFilterCancel,
  applied,
  activeTab,
}) => {
  const [filterOptions, setFilterOptions] = useState({});
  const [currentTab, setCurrentTab] = useState(activeFilterTab);
  const dispatch = useDispatch();
  const {
    availableFilters,
    soldFilters
  } = useSelector((state) => state.products);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);

  useEffect(() => {
    if (activeTab === 0) {
      if (availableFilters.data && availableFilters.data.data) {
        let temp = {};
        availableFilters.data.data.forEach((o) => {
          temp = {
            ...temp,
            ...o,
          };
        });
        temp.priceRange = availableFilters.data.priceRange;
        temp.machineTotal = availableFilters.data.machineTotal.total;
        setFilterOptions(temp);
      }
    } else if (soldFilters.data && soldFilters.data.data) {
      let temp = {};
      soldFilters.data.data.forEach((o) => {
        temp = {
          ...temp,
          ...o,
        };
      });
      temp.priceRange = soldFilters.data.priceRange;
      temp.machineTotal = soldFilters.data.machineTotal.total;
      setFilterOptions(temp);
    }
  }, [availableFilters, soldFilters]);

  useEffect(() => {
    if (activeTab === 0 && !availableFilters.data.machineTotal) {
      dispatch(getAvailableProductsFiters());
    } else if (!soldFilters.data.machineTotal) {
      dispatch(getSoldProductsFilters());
    }
  }, []);

  const isFilterSelected = (value,
    key) => {
    let innerValue = value;
    if (key === 'is_new') {
      innerValue = value === 'New';
    }
    return !!selectedFilters[key].find((ft) => ft === innerValue);
  };

  const onChangeCheck = (value, key) => {
    if (isFilterSelected(value, key)) {
      setSelectedFilters({
        ...selectedFilters,
        [key]: selectedFilters[key].filter((fl) => fl !== value),
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [key]: [...selectedFilters[key], value],
      });
    }
  };

  const resetFilters = () => {
    const fil = {
      manufacturer: [],
      modelYear: [],
      price: [],
      category: [],
    };
    setSelectedFilters(fil);
    onApplyFilters(fil);
  };

  return (
    <div className="filterSection new-sub-list">
      { applied ? (
        <h3>
          Filter
          <span>
            {filterOptions && filterOptions.machineTotal}
            {' '}
            Machines
          </span>
        </h3>
      ) : null}
      <div>
        <div className="filterSectiontabs">
          <Tabs tabs={tabList} onChange={(tab) => setCurrentTab(tab)} />
        </div>
        {/* Make */}
        <TabPanel index={0} value={currentTab}>
          <ul className="filtersItems make">
            {!availableFilters.loading
              && !soldFilters.loading
              && filterOptions
              && filterOptions.manufacturer ? (
                Object.keys(filterOptions.manufacturer.data).map((make) => (
                  <FilterItem
                    label={make}
                    value={make}
                    subLabel={filterOptions.manufacturer.data[make]}
                    onCheck={(value) => onChangeCheck(value, 'manufacturer')}
                    checked={isFilterSelected(make, 'manufacturer')}
                  />
                ))
              ) : (
                <Loader secondary />
              )}
          </ul>
        </TabPanel>
        {/* Year  */}
        <TabPanel index={1} value={currentTab}>
          <ul className="filtersItems year">
            {!availableFilters.loading
              && !soldFilters.loading
              && filterOptions
              && filterOptions.modelYear ? (
                Object.keys(filterOptions.modelYear.data).map((year) => (
                  <FilterItem
                    label={year}
                    value={year}
                    subLabel={filterOptions.modelYear.data[year]}
                    onCheck={(value) => onChangeCheck(value, 'modelYear')}
                    checked={isFilterSelected(year, 'modelYear')}
                  />
                ))
              ) : (
                <Loader secondary />
              )}
          </ul>
        </TabPanel>
        {/* Year  */}
        <TabPanel index={2} value={currentTab}>
          <ul className="filtersItems year">
            {!availableFilters.loading
              && !soldFilters.loading
              && filterOptions
              && filterOptions.modelYear ? (
                Object.keys(filterOptions.modelYear.data).map((year) => (
                  <FilterItem
                    label={year}
                    value={year}
                    subLabel={filterOptions.modelYear.data[year]}
                    onCheck={(value) => onChangeCheck(value, 'modelYear')}
                    checked={isFilterSelected(year, 'modelYear')}
                  />
                ))
              ) : (
                <Loader secondary />
              )}
          </ul>
        </TabPanel>
        {/* Category */}
        <TabPanel index={3} value={currentTab}>
          <ul className="filtersItems year">
            {!availableFilters.loading
              && !soldFilters.loading
              && filterOptions
              && filterOptions.category ? (
                Object.keys(filterOptions.category.data).map((category) => (
                  <FilterItem
                    label={category}
                    value={category}
                    subLabel={filterOptions.category.data[category]}
                    onCheck={(value) => onChangeCheck(value, 'category')}
                    checked={isFilterSelected(category, 'category')}
                  />
                ))
              ) : (
                <Loader secondary />
              )}
          </ul>
        </TabPanel>
        <div className="modalFooter modal-footer">
          <Button
            className="resetBtn"
            onClick={resetFilters}
            disabled={!applied}
          >
            Reset All
          </Button>
          <Button
            style={{
              borderRadius: 2,
              backgroundColor: '#000',
              fontSize: '14px',
              fontFamily: 'Inter',
              color: 'white'
            }}
            onClick={() => onApplyFilters(selectedFilters)}
          >
            Apply
          </Button>
          <Button color="secondary" onClick={onFilterCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

Filters.propTypes = {
  activeFilterTab: PropTypes.number,
  onApplyFilters: PropTypes.func,
  defaultFilters: PropTypes.objectOf(PropTypes.array),
  onFilterCancel: PropTypes.func,
  applied: PropTypes.bool,
  activeTab: PropTypes.number,
};

Filters.defaultProps = {
  activeFilterTab: 0,
  onApplyFilters: () => { },
  defaultFilters: {},
  onFilterCancel: () => { },
  applied: false,
  activeTab: 0,
};

export default Filters;
