/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_MARKETING } from '../../constants';
import Tabs from '../common/Tab';
import Loader from '../common/Loader';
import TabPanel from '../common/TabPanel';
import FilterItem from './FilterItem';

const tabList = ['State', 'City', 'Assigned to', 'Tagged Products'];

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
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const [States, setStates] = useState([]);
  const [Cities, setCities] = useState([]);
  const [Assignees, setAsignees] = useState([]);
  const [TagProducts, setTagProducts] = useState([]);

  const getStates = () => {
    axios
      .get(`${API_MARKETING}/states?limit=500&page=1&searchText=`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        toast.info(error);
      });
  };

  const getCities = () => {
    let stateId = '';    
    if(selectedFilters['state']){
      selectedFilters['state'].map((item) => {
        stateId += item + ',';
     });
    }
    stateId = stateId.substring(0, stateId.length - 1);
    console.log(stateId);
    axios
      .get(`${API_MARKETING}/cities?page=1&limit=500&searchText=&stateId=`+stateId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        toast.info(error);
      });
  };

  const getAssignees = () => {
    axios
      .get(`${API_MARKETING}/sales-rep?limit=500&page=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => {
        setAsignees(response.data);
      })
      .catch((error) => {
        toast.info(error);
      });
  };

  const getTagProducts = () => {
    axios
      .get(`${API_MARKETING}/product-tags?limit=500&page=1&searchText=`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => {
        setTagProducts(response.data);
      })
      .catch((error) => {
        toast.info(error);
      });
  };

  useEffect(() => {
    getStates();    
    getAssignees();
    getTagProducts();
    setFilterOptions([]);
  }, []);
  
  const isFilterSelected = (value,
    key) => {
    let innerValue = value;
    if (key === 'state') {
      innerValue = value;
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
      States: [],
      Cities: [],
      Assignees: [],
      TagProducts: []
    };
    setSelectedFilters(fil);
    onApplyFilters(fil);
  };
  const OnChangeTablist = (tab) => {
    setCurrentTab(tab);
    if(tab === 1){
     getCities();
    }
  };
  return (
    <div className="filterSection new-sub-account-list">
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
        <div className="filterAccountSectiontabs">
          <Tabs tabs={tabList} onChange={(tab) => OnChangeTablist(tab)} />
        </div>
        {/* States */}
        <TabPanel index={0} value={currentTab}>
          <ul className="filtersItems year">
            {States
              && States.states ? (
              States && States.states && States.states.length > 0 && States.states.map((item) => (
                <FilterItem
                  label={item.name}
                  value={item.id}
                  //subLabel={filterOptions.States.states.data[item.name]}
                  onCheck={(value) => onChangeCheck(value, 'state')}
                  checked={isFilterSelected(item.id, 'state')}
                />))) : (<Loader secondary />
            )}
          </ul>
        </TabPanel>
        {/* City  */}
        <TabPanel index={1} value={currentTab}>
          <ul className="filtersItems year">
            {Cities
              && Cities.cities ? (
              Cities && Cities.cities && Cities.cities.length > 0 && Cities.cities.map((item) => (
                <FilterItem
                  label={item.name}
                  value={item.id}
                  //subLabel={filterOptions.States.states.data[item.name]}
                  onCheck={(value) => onChangeCheck(value, 'city')}
                  checked={isFilterSelected(item.id, 'city')}
                />))) : (<Loader secondary />
            )}
          </ul>
        </TabPanel>
        {/* Assignee */}
        <TabPanel index={2} value={currentTab}>
          <ul className="filtersItems year">
            {Assignees
              && Assignees.salesRep ? (
              Assignees && Assignees.salesRep && Assignees.salesRep.length > 0 && Assignees.salesRep.map((item) => (
                <FilterItem
                  label={`${item.firstName} ${item.lastName}`}
                  value={item.salesRepId}
                  //subLabel={filterOptions.States.states.data[item.name]}
                  onCheck={(value) => onChangeCheck(value, 'assignee')}
                  checked={isFilterSelected(item.salesRepId, 'assignee')}
                />))) : (<Loader secondary />
            )}
          </ul>
        </TabPanel>
        {/* Tag Products */}
        <TabPanel index={3} value={currentTab}>
          <ul className="filtersItems year">
            {TagProducts
              && TagProducts.productTags ? (
              TagProducts && TagProducts.productTags && TagProducts.productTags.length > 0 && TagProducts.productTags.map((item) => (
                <FilterItem
                  label={item.tag_name}
                  value={item.id}
                  //subLabel={filterOptions.States.states.data[item.name]}
                  onCheck={(value) => onChangeCheck(value, 'tagproducts')}
                  checked={isFilterSelected(item.id, 'tagproducts')}
                />))) : (<Loader secondary />
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
