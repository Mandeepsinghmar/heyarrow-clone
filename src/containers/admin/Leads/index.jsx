import React, { useEffect, useCallback, useState } from 'react';
import { debounce, get } from 'lodash';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroller';
import {
  Modal, ModalBody
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import TableContent from '../../../components/common/ContentsTable';
import './index.scss';
import {
  createLeads, getCities, getLeadsList, updateLeads
} from '../../../api';
import { onChangeAdminLeads } from '../../../redux/actions';
import SearchInput from '../../../components/common/SearchInput';
import CustomIcon from '../../../components/common/CustomIcon';
import CitiesDropDown from '../../../components/common/CitiesDropDown';
import StatesDropDown from '../../../components/common/StatesDropDown';
import AssignToDropDown from '../../../components/common/AssignToDropDown';

const columns = [
  { label: 'Date', key: 'createdAt', type: 'date' },
  { label: 'Source', key: 'source' },
  { label: 'First name', key: 'firstName' },
  { label: 'Last name', key: 'lastName' },
  { label: 'Email address', key: 'email', require: true },
  {
    label: 'Phone number',
    key: 'phone',
    type: 'phone',
    value: { countryCode: '+93', phoneNumber: '' },
    options: 'phoneCode',
  },
  {
    label: 'State',
    key: 'stateId',
    type: 'state',
    options: 'stateCode',
  },
  {
    label: 'City',
    key: 'cityId',
    type: 'city',
    options: 'cityCode',
  },
  { label: 'Product purchased', key: 'totPurchased', type: 'totPurchased' },
  {
    label: 'Assign to',
    key: 'salesRep',
    type: 'salesRepId',
  },
  {
    label: 'Status',
    key: 'status',
    type: 'status',
    options: 'statusList',
  },
];

const formObject2 = {
  firstName: '',
  lastName: '',
  type: '',
  status: 'Open',
  email: '',
  phone: '',
  source: '',
  cityId: '',
  stateId: '',
  city: '',
  assignedOn: new Date(),
  salesRepId: '',
  productId: '',
  date: new Date(),
};

const phoneCode = [
  {
    label: 'India', value: 1, country_code: 'IN', code: '91'
  },
  {
    label: 'UK', value: 2, country_code: 'GB', code: '255'
  },
  {
    label: 'USA', value: 3, country_code: 'US', code: '1'
  },
  {
    label: 'Australia', value: 4, country_code: 'AU', code: '251'
  },
];
const statusList = [
  {
    label: 'Open',
    value: 'Open'
  },
  {
    label: 'Close',
    value: 'Close'
  },
];

function Leads(props) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {
    adminLeadsList, countries, users, states, cities,
  } = props;
  const [modal, setModal] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);
  const [limit] = useState(30);
  const [addLead, setAddLead] = useState(formObject2);

  const fetchLeads = (nextValue, assignVal) => {
    setloading(true);
    dispatch(
      getLeadsList(height >= 900 ? (limit * 3) : limit,
        nextValue && `&search=${nextValue}`,
        assignVal === undefined || assignVal === null
          ? ''
          : `&assigned=${assignVal}`)
    ).then((res) => {
      if (res.length) {
        setHasMore(false);
      }
    }).finally(() => {
      setloading(false);
    });
  };

  useEffect(() => {
    fetchLeads();
    setHeight(window.innerHeight);
  }, []);

  const fetchInitialCites = (stateId) => {
    dispatch(getCities(stateId));
  };

  const loadFunc = () => {
    if (!loading) {
      fetchLeads();
    }
  };

  const toggle = () => {
    setModal(!modal);
    setAddLead(formObject2);
  };

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      fetchLeads(nextValue);
    }, 1000),
    []
  );

  const handleChange = (event) => {
    setPage(1);
    debouncedSave(event);
  };

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setAddLead({ ...addLead, [name]: value });
  };

  const onChange = (e, key, item, index) => {
    const { value } = e.target;
    dispatch(onChangeAdminLeads(value, key, item, index));
  };

  const onSave = async (item, index, payload) => {
    if (item.id) {
      dispatch(updateLeads(item.id, payload, index));
    } else {
      dispatch(createLeads(item, index));
    }
  };

  const addNew = () => {
    // eslint-disable-next-line max-len
    const emailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailCheck = emailValid.test(String(addLead.email).toLowerCase());
    if (!addLead.firstName) {
      toast.error('Please mention the First name');
    }
    if (!addLead.email) {
      toast.error('Please mention the Email address');
    }
    if (!addLead.salesRepId) {
      toast.error('Please mention the salesRepId');
    }
    if (addLead.email && !emailCheck) {
      toast.error('Require valid Email address');
    }
    if (addLead.firstName && addLead.email && emailCheck) {
      onSave(addLead);
      toggle();
    }
  };

  const onSelectAssignTo = (event) => {
    const { value } = event.target;
    setAddLead({ ...addLead, salesRepId: value });
  };

  const onSelectCities = (e) => {
    const { value } = e.target;
    setAddLead({ ...addLead, cityId: value });
  };

  const onSelectStates = (e) => {
    const { value } = e.target;
    setAddLead({ ...addLead, stateId: value, cityId: '' });
  };

  const assignSalesRepHandler = (customerId, salesId) => {
    const changeSalesRep = users && users.find(
      (data) => salesId === data.id
    );
    const customerUpdateRecord = adminLeadsList && adminLeadsList.find(
      (data) => customerId === data.id
    );

    const salesRep = {
      email: changeSalesRep.email,
      firstName: changeSalesRep.firstName,
      id: changeSalesRep.id,
      lastName: changeSalesRep.lastName,
      phoneNumber: changeSalesRep.phoneNumber
    };

    const dataToBeSent = {
      salesRep, salesRepId: salesId
    };

    const salesIndex = adminLeadsList.findIndex(
      (data) => data.id === dataToBeSent.id
    );
    const valTarget = {
      target: {
        value: dataToBeSent.salesRep
      }
    };
    onChange(valTarget, 'salesRep', dataToBeSent, salesIndex);
    dispatch(updateLeads(customerUpdateRecord.id, dataToBeSent, salesIndex))
      .then(() => {
        toast.success('Sales Rep assigned successfully.');
      })
      .catch(() => {});
  };

  const newLeadsList = adminLeadsList && adminLeadsList.map((item) => ({
    ...item.customer,
    id: item.id,
    customerId: item.customer.customerId,
    createdAt: item.createdAt,
    source: item.source,
    status: item.status ? item.status : '-',
    salesRep: item.salesRep,
    totPurchased: item.totPurchased > 0 ? item.totPurchased : '-'
  }));

  const renderTableActions = () => (
    <div className="table-actions" />
  );

  return (
    <>
      <div className="contentContainerFull leadList">
        <div className="innerFullCon">
          <div className="cardHeader noborder">
            <h4>Leads</h4>
            <div className="topActionBar">
              <SearchInput
                onChange={(e) => handleChange(e.target.value)}
                onClear={() => handleChange('')}
              />
              <button
                type="button"
                className="sendBtn"
                onClick={() => toggle()}
              >
                <CustomIcon icon="Header/Icon/Add" />
              </button>
              <Modal isOpen={modal} toggle={toggle} className="addLeadModal">
                <ModalBody>
                  <div className="createLeadHeader">
                    <h1>Create Lead</h1>
                    <button type="button" className="roleCloseBtn" onClick={toggle}>
                      <span>
                        <i className="fas fa fa-times" />
                      </span>
                    </button>
                  </div>
                  <div className="roleContent">
                    <div className="halfInputContainer">
                      <input type="text" name="firstName" value={addLead.firstName} onChange={handleLeadChange} placeholder="First name" />
                      <input type="text" name="lastName" value={addLead.lastName} onChange={handleLeadChange} placeholder="Last name" />
                    </div>
                    <input type="email" name="email" value={addLead.email} onChange={handleLeadChange} placeholder="Email address" />
                    <input type="text" name="source" value={addLead.source} onChange={handleLeadChange} placeholder="Source" />
                    <div className="phoneInputContainer">
                      <input className="countryDrop" onChange={handleLeadChange} type="text" name="countryCode" style={{ backgroundColor: '#EDEFF2' }} disabled placeholder="+1" />
                      <input type="phone" name="phone" onChange={handleLeadChange} placeholder="Phone number" />
                    </div>
                    <div className="halfInputContainer">
                      <div className="LeadsDropDown">
                        <StatesDropDown
                          isFilter
                          item={addLead}
                          selectedValue={get(addLead, 'city.state.name')}
                          onSelect={(e) => onSelectStates(e)}
                          placeholder="State"
                        />
                        <span className="dropIcons"><i className="fas fa-caret-down" /></span>
                      </div>
                      <div className="LeadsDropDown">
                        <CitiesDropDown
                          isFilter
                          item={addLead}
                          stateId={addLead.stateId}
                          selectedValue={get(addLead, 'city.name')}
                          onSelect={(e) => onSelectCities(e)}
                          fetchInitialCites={fetchInitialCites}
                          placeholder="City"
                        />
                        <span className="dropIcons"><i className="fas fa-caret-down" /></span>
                      </div>
                    </div>
                    <div className="LeadsDropDown salesRepDrop">
                      <AssignToDropDown
                        isFilter
                        onSelect={(data) => onSelectAssignTo(data)}
                        selectedSalesRep={addLead.salesRep}
                        placeholder="Assign to"
                      />
                      <span className="dropIcons"><i className="fas fa-caret-down" /></span>
                    </div>
                  </div>
                  <div className="buttonOuterLead">
                    <button type="button" className="cancelRoleBtn" onClick={toggle}>Cancel</button>
                    <button type="button" className="sendRoleBtn" onClick={addNew}>Create</button>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={(
                <div className="tableLoading ShowTableLoader" key={0}>
                  <Loader
                    type="Oval"
                    color="#008080"
                    height={30}
                    width={30}
                  />
                </div>
              )}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              <TableContent
                columns={columns}
                data={newLeadsList || []}
                options={{
                  statusList,
                  phoneCode,
                  countryCode: countries,
                  stateCode: states,
                  cityCode: cities
                }}
                tableName="Leads"
                loading={loading}
                onChange={onChange}
                hasVerticalScroll
                onSave={onSave}
                tableActions={renderTableActions}
                assignSalesRepHandler={assignSalesRepHandler}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

Leads.propTypes = {
  adminLeadsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  countries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  adminLeadsList: state.leads.adminLeadsList,
  users: state.common.users,
  cities: state.common.cities,
  states: state.common.states,
  countries: state.common.countries,
  salesRepId: state.common.salesRepId
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Leads);
