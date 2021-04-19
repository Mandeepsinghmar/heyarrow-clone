/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tabs from '../common/Tab';
import Loader from '../common/Loader';
import TabPanel from '../common/TabPanel';
import FilterItem from './FilterItem';
import CustomDropdown from '../common/CustomDropdown';
import { LISTTYPE, API_MARKETING } from '../../constants';

const tabList = ['Date Created', 'State', 'City', 'Assigned to'];

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

  const getStates = () => {
    axios
      .get(`${API_MARKETING}/states?limit=10&page=1&searchText=`, {
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
    axios
      .get(`${API_MARKETING}/cities?page=1&limit=10&searchText=&stateId=1`, {
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
      .get(`${API_MARKETING}/sales-rep?limit=10&page=1`, {
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

  useEffect(() => {
      getStates();
      getCities();
      getAssignees();
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
    };
    setSelectedFilters(fil);
    onApplyFilters(fil);
  };

  return (
    <div className="filterSection new-sub-lead-list">
      <div>
        <div className="filterLeadSectiontabs">
          <Tabs tabs={tabList} onChange={(tab) => setCurrentTab(tab)} />
        </div>
        {/* Category */}
        <TabPanel index={0} value={currentTab}>
          <ul className="filtersItems year">
            <div className="flex column w-100 h-100" style={{ margin: 10 }}>
              <Box display="flex" alignItems="center" m={1} p={1} css={{ height: 50 }}>
                <div className="list-header-text">Lead created in the last</div>
                <CustomDropdown
                  className="filter-dropdown"
                  data={LISTTYPE}
                  value="All"
                  placeholder="7 Days"
                />
              </Box>
              <Box display="flex" alignItems="center" m={1} p={1} css={{ height: 50 }}>
                <div className="list-header-text">Last contact</div>
                <CustomDropdown
                  className="filter-dropdown"
                  data={LISTTYPE}
                  value="All"
                  placeholder="7 Days"
                />
                <div className="list-header-text">ago</div>
              </Box>
            </div>
          </ul>
        </TabPanel>
        {/* States */}
        <TabPanel index={1} value={currentTab}>
          <ul className="filtersItems name">
          {States
              && States.states ? ( 
          States && States.states && States.states.length > 0 && States.states.map((item) => (
              <FilterItem
              label={item.name}
              value={item.name}
              //subLabel={filterOptions.States.states.data[item.name]}
              onCheck={(value) => onChangeCheck(value, 'state')}
              checked={isFilterSelected(item.name, 'state')}
            /> ))) : (<Loader secondary />
                  )}             
          </ul>
        </TabPanel>
        {/* Year  */}
        <TabPanel index={2} value={currentTab}>
          <ul className="filtersItems year">
          {Cities
              && Cities.cities ? ( 
                Cities && Cities.cities && Cities.cities.length > 0 && Cities.cities.map((item) => (
              <FilterItem
              label={item.name}
              value={item.name}
              //subLabel={filterOptions.States.states.data[item.name]}
              onCheck={(value) => onChangeCheck(value, 'city')}
              checked={isFilterSelected(item.name, 'city')}
            /> ))) : (<Loader secondary />
                  )} 
          </ul>
        </TabPanel>
        {/* Price range */}
        <TabPanel index={3} value={currentTab}>
        <ul className="filtersItems year">
        {Assignees
              && Assignees.salesRep ? ( 
                Assignees && Assignees.salesRep && Assignees.salesRep.length > 0 && Assignees.salesRep.map((item) => (
              <FilterItem
              label={`${item.firstName} ${item.lastName}`}
              value={`${item.firstName} ${item.lastName}`}
              //subLabel={filterOptions.States.states.data[item.name]}
              onCheck={(value) => onChangeCheck(value, 'assignee')}
              checked={isFilterSelected(item.firstName+' '+item.lastName, 'assignee')}
            /> ))) : (<Loader secondary />
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
