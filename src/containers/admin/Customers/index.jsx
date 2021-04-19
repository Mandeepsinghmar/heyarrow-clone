/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import TableContent from '../../../components/common/ContentsTable';
import SearchInput from '../../../components/common/SearchInput';
import ProfileInitial from '../../../components/common/ProfileInitials';
import DetailDrawer from '../../../components/common/DetailDrawer';
// import {
//   addNewCustomer,
//   clearCustomers,
//   onChangeCustomer,
//   removeNewCustomers,
// } from '../../actions/customer';
// import {
//   getCustomers,
//   addCustomers,
//   updateCustomer,
//   multipleArchivedCustomers,
//   assignSalesRep,
// } from '../../api/customer';
import './index.scss';
import TableSendButton from '../../../components/common/TableSendButton';
import removeEmptyProperty from '../../../utils/removeEmptyProperty';
import CustomIcon from '../../../components/common/CustomIcon';
import { getCustomers, createCustomer, updateCustomer } from '../../../api/adminCustomers';
import { addNewAdminCustomer, removeNewCustomers, onChangeCustomer, clearCustomers } from '../../../redux/actions';
import { toast } from 'react-toastify';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from 'react-loader-spinner';
import AddCustomerModal from '../../../components/AddCustomerModal';
import { SwipeableDrawer } from '@material-ui/core';

const formObject = {
  firstName: '',
  lastName: '',
  accountName: '',
  email: '',
  phone: '',
  countryId: '',
  stateId: '',
  cityId: '',
  zipcode: '',
  salesRepId: '',
  product: '',
  purchased_on: '',
  service_due: '',
  isNewItem: true,
};

const phoneCode = [
  {
    label: 'India',
    value: 1,
    country_code: 'IN',
    code: '91',
  },
  {
    label: 'UK',
    value: 2,
    country_code: 'GB',
    code: '255',
  },
  {
    label: 'USA',
    value: 3,
    country_code: 'US',
    code: '1',
  },
  {
    label: 'Australia',
    value: 4,
    country_code: 'AU',
    code: '251',
  },
];

function Customers(props) {
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRow] = useState([]);
  const [isLocked, setIsLocked] = useState(true);
  const [hideBtn, setHidden] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);
  const [isOpen, setIsOpen] = useState(false);
  const [limit] = useState(30);
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerDetailIdIdx, setCustomerDetailIdIdx] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const { history } = props;
  const { adminCustomerList, countries, states, cities, users } = props;

  const columns = [
    { label: 'First name', key: 'firstName', hasInitials: true },
    { label: 'Last name', key: 'lastName' },
    { label: 'Account name', key: 'accountName' },
    { label: 'Email address', key: 'email', isEmail: true },
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
    { label: 'Zip code', key: 'zipcode', value: '', type: 'zipcode' },
    { label: 'Assign to', key: 'assign_to', type: 'salesRepId', readOnly: true },
  ];

  const columnsDrawer = [
    {
      field: {
        label: 'First name',
        key: 'firstName',
      },
    },
    {
      field: {
        label: 'Last name',
        key: 'lastName',
      },
    },
    { field: { label: 'Account name', key: 'accountName', fullWidth: true } },
    {
      field: {
        label: 'Email address',
        key: 'email',
        type: 'email',
      },
    },
    {
      field: {
        label: 'Phone number',
        key: 'phone',
        type: 'phone',
      },
    },
    {
      field: {
        label: 'State',
        key: 'stateName',
        type: 'state',
      },
    },
    {
      field: {
        label: 'City',
        key: 'cityName',
        type: 'city',
      },
    },
    {
      field: {
        label: 'Zip Code',
        key: 'zipcode',
        fullWidth: true,
      },
    },
    {
      field: {
        label: 'Address',
        key: 'address',
        fullWidth: true,
      },
    },
    {
      field: {
        label: 'Assign to',
        key: 'assignTo',
        type: 'profile',
        fullWidth: true
      },
    },
  ];

  useEffect(() => {
    fetchCustomers();
    setHeight(window.innerHeight);
  }, []);

  const selectMultipleRowHandler = (id) => {
    // eslint-disable-next-line no-underscore-dangle
    const _selectedRows = Object.assign([], selectedRows);
    const index = _selectedRows.findIndex((o) => o === id);
    if (index >= 0) {
      _selectedRows.splice(index, 1);
    } else {
      _selectedRows.push(id);
    }
    setSelectedRow(_selectedRows);
  };

  const fetchCustomers = (nextValue) => {
    setloading(true);
    dispatch(getCustomers(height >= 900 ? limit * 3 : limit, page, nextValue && `&search=${nextValue}`)).then((res) => {
      setloading(false);
      setPage(page + 1);
      if (res.length < 10) {
        setHasMore(false);
      }
    });
  };

  const addNew = () => {
    //setHidden(true);
    setIsOpen(true);
    //dispatch(addNewAdminCustomer(JSON.parse(JSON.stringify(formObject))));
  };

  const loadFunc = () => {
    if (!loading) {
      fetchCustomers();
    }
  };

  const onSave = (item, index, payload, button) => {
    const emailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneValid = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/;
    const emailCheck = emailValid.test(String(item.email).toLowerCase());
    if (!item.firstName) {
      return toast.error('Require First Name');
    }
    if (!emailCheck) {
      return toast.error('Require valid Email');
    }
    if (!phoneValid) {
      return toast.error('Require valid Phone No');
    }
    if (item.id) {
      setSaving(true);
      dispatch(updateCustomer(item.id, item))
        .then(() => {
          setSaving(false);
        })
        .catch(() => {
          setSaving(false);
        });
    } else {
      if (button) {
        setSaving(true);
        dispatch(createCustomer(item, index))
          .then(() => {
            setSaving(false);
            setHidden(false);
          })
          .catch(() => {
            setSaving(false);
            setHidden(false);
          });
      }
    }
  };

  const removeRow = (index) => {
    dispatch(removeNewCustomers(index));
    setHidden(false);
  };

  const onChange = (e, key, item, index) => {
    const { value,state } = e.target;

    if (key === 'cityName') {
      dispatch(onChangeCustomer({ ...customerDetail.city,state: { name: state }, name: value }, 'city', item, index));
      return;
    }

    if (key === 'stateName') {
      dispatch(onChangeCustomer({ ...customerDetail.city, state: { name: value } }, 'city', item, index));
      return;
    }

    dispatch(onChangeCustomer(value, key, item, index));
  };

  const assignSalesRepHandler = (customer_id, sales_rep_id) => {
    const changeSalesRep = users && users.find((data) => sales_rep_id == data.id);
    const customerUpdateRecord = adminCustomerList && adminCustomerList.find((data) => customer_id == data.id);

    const salesRep = {
      email: changeSalesRep.email,
      firstName: changeSalesRep.firstName,
      id: changeSalesRep.id,
      lastName: changeSalesRep.lastName,
      phoneNumber: changeSalesRep.phoneNumber,
    };

    const dataToBeSent = {
      ...customerUpdateRecord,
      salesRep,
      salesRepId: sales_rep_id,
    };

    setSaving(true);
    const salesIndex = adminCustomerList.findIndex((data) => data.id === dataToBeSent.id);
    const valTarget = {
      target: {
        value: dataToBeSent.salesRep,
      },
    };
    onChange(valTarget, 'salesRep', dataToBeSent, salesIndex);
    dispatch(updateCustomer(dataToBeSent.id, dataToBeSent))
      .then(() => {
        setSaving(false);
        toast.success('Sales Rep assigned successfully.');
      })
      .catch(() => {
        setSaving(false);
      });
  };

  const handleCustomerDetail = (value) => {
    setCustomerDetailIdIdx(value);
    const { id, index } = value;

    const customerDetailState = adminCustomerList.filter((customer) => {
      return id === customer.id;
    });
    setCustomerDetail({ ...customerDetailState[0], index });
  };

  const renderTableActions = (item, index) => (
    <div className="table-actions">
      <button
        className="sendBtn"
        onClick={(e) => {
          toggleDrawer();
          handleCustomerDetail({ id: item.id, index: index });
        }}
      >
        <i className="fas fa-info-circle" />
      </button>
    </div>
  );

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      dispatch(clearCustomers());
      fetchCustomers(nextValue);
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    setPage(1);
    setSearch(event);
    // highlight-starts
    debouncedSave(event);
    // highlight-ends
  };

  const saveBtn = (item, index) => {
    const isDisabled = () => {
      return !item.firstName && !item.phone && !item.email;
    };
    return (
      <TableSendButton
        disabled={isDisabled()}
        className="sendBtn"
        onClick={() => onSave(item, index, null, true)}
        title="Add a customer"
        placement="left"
        icon="Save"
      >
        <CustomIcon icon="Send" />
      </TableSendButton>
    );
  };

  const onRowClick = (item) => {
    props.history.push(`/admin/customer-detail/${item.id}`);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    console.log('adminCustomerList',adminCustomerList)
    handleCustomerDetail(customerDetailIdIdx);
  }, [adminCustomerList]);

  console.log(adminCustomerList);

  return (
    <>
      <div className="contentContainerFull customerList">
        <div className="innerFullCon">
          <div className="cardHeader noborder">
            <h4>Customers</h4>
            <div className="topActionBar">
              {saving ? <button className="btn">Saving...</button> : ''}
              <SearchInput onChange={(e) => handleChange(e.target.value)} onClear={() => handleChange('')} />
              <button type="button" className="teamHeadBtn" onClick={() => addNew()} disabled={hideBtn ? true : false}>
                Create
              </button>
            </div>
          </div>
          <div className="tableBox">
            <InfiniteScroll
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={
                <div className="tableLoading ShowTableLoader" key={0}>
                  <Loader type="Oval" color="#008080" height={30} width={30} />
                </div>
              }
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              <TableContent
                loading={loading}
                columns={columns}
                options={{
                  phoneCode,
                  countryCode: countries,
                  stateCode: states,
                  cityCode: cities,
                }}
                data={adminCustomerList}
                tableActions={renderTableActions}
                removeRow={removeRow}
                onChange={onChange}
                onSave={onSave}
                customers
                selectMultipleRowHandler={selectMultipleRowHandler}
                assignSalesRepHandler={assignSalesRepHandler}
                selectedRows={selectedRows}
                hasVerticalScroll
                readOnly={isLocked}
                saveBtn={saveBtn}
                onRowClick={onRowClick}
              />
            </InfiniteScroll>
          </div>
          <AddCustomerModal
            isOpen={isOpen}
            toggle={() => {
              setIsOpen(!isOpen);
            }}
          />
          <DetailDrawer
            label="Customer details"
            columns={columnsDrawer}
            data={{
              ...customerDetail,
              cityName: customerDetail?.city?.name,
              stateName: customerDetail?.city?.state?.name,
              assignTo: customerDetail?.salesRep?.reportingTo,
            }}
            assignSalesRepHandler={assignSalesRepHandler}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            onSave={onSave}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}

Customers.propTypes = {
  customer: PropTypes.object,
  history: PropTypes.any,
};

const mapStateToProps = (state) => ({
  adminCustomerList: state.adminCustomer.adminCustomerList,
  users: state.common.users,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
