/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchInput from '../../../components/common/SearchInput';
import Input from '../../../components/common/Input';
import CustomDropDown from '../../../components/common/CustomeDropDown';
import CitiesDropDown from '../../../components/common/CitiesDropDown';
import StatesDropDown from '../../../components/common/StatesDropDown';
import AssignToDropDown from '../../../components/common/AssignToDropDown';
import DetailDrawer from '../../../components/common/DetailDrawer';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { isEmpty } from 'lodash';
// import {
//   getTeam,
//   getDepartments,
//   assignDepartment,
//   reInvite,
//   cancelInvite,
// } from '../../api/team';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
// import {
//   addNewTeam,
//   removeNewTeam,
//   onChangeTeam,
//   clearTeams,
// } from '../../actions/team';
// import {
//   addTeam,
//   updateTeam,
//   archivedTeam,
//   multipleArchivedTeams,
//   assignReportTo,
//   getRoles,
//   updateUserDepartment,
// } from '../../api/team';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import TableContent from '../../../components/common/ContentsTable';
import CustomIcon from '../../../components/common/CustomIcon';
import Departments from '../../../components/common/Departments';
import Button from '../../../components/common/Button';
import TableSendButton from '../../../components/common/TableSendButton';
import './index.scss';
import {
  getDepartmentList,
  getAllDepartmentUserList,
  createTeamUser,
  updateTeamUser,
  deactivateUser,
  getDeactivatedUser,
  activateUser,
  inviteTeamUser,
  cancelUserInvitation,
} from '../../../api/adminTeam';
import { getRolesList, getStates, getCities } from '../../../api';
import { addNewTeamMember, onChangeTeam, removeNewTeam } from '../../../redux/actions';
import { setLocale } from 'yup';

let columns = [
  { label: 'First name', key: 'firstName', hasInitials: true },
  { label: 'Last name', key: 'lastName' },
  { label: 'Email address', key: 'email', type: 'email', isEmail: true },
  {
    label: 'Department',
    key: 'departments',
    type: 'department',
    options: 'departmentCode',
  },
  { label: 'Role', key: 'roleId', options: 'roleCode', type: 'role' },
  {
    label: 'Phone number',
    key: 'phoneNumber',
    type: 'phone',
    options: 'phoneCode',
  },
  { label: 'State', key: 'stateId', type: 'state', options: 'stateCode' },
  { label: 'City', key: 'cityId', type: 'city', options: 'cityCode' },
  { label: 'Zip code', key: 'zipcode', value: '', type: 'zipcode' },
  { label: 'Reporting to', key: 'reportingTo', type: 'reportTo', minWidth: 150 },
  { label: 'Created on', key: 'updatedAt', type: 'date', readOnly: true },
];

let deactivatedColumns = [
  { label: 'First name', key: 'firstName', hasInitials: true },
  { label: 'Last name', key: 'lastName' },
  { label: 'email address', key: 'email', type: 'email', isEmail: true },
  {
    label: 'Department',
    key: 'departments',
    type: 'department',
    options: 'departmentCode',
  },
  { label: 'Role', key: 'roleId', options: 'roleCode', type: 'role' },
  {
    label: 'Phone number',
    key: 'phoneNumber',
    type: 'phone',
    options: 'phoneCode',
  },
  { label: 'State', key: 'stateId', type: 'state', options: 'stateCode' },
  { label: 'City', key: 'cityId', type: 'city', options: 'cityCode' },
  { label: 'Zip code', key: 'zipcode', value: '', type: 'zipcode' },
  {
    label: 'Reporting to',
    key: 'reportingTo',
    type: 'reportTo',
    minWidth: 150,
  },
  { label: 'Deactivated on', key: 'updatedAt', type: 'date', readOnly: true },
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
  {
    field: {
      label: 'Email address',
      key: 'email',
    },
  },
  {
    field: {
      label: 'Phone number',
      key: 'phoneNumber',
    },
  },
  {
    field: {
      label: 'Department',
      key: 'department',
    },
  },
  {
    field: {
      label: 'Role',
      key: 'role',
    },
  },
  {
    field: {
      label: 'State',
      key: 'stateName',
    },
  },
  {
    field: {
      label: 'City',
      key: 'cityName',
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
      label: 'Created on',
      key: 'updatedAt',
      fullWidth: true,
    },
  },
  {
    field: {
      label: 'Reporting to',
      key: 'reportingTo',
      type: 'profile',
      fullWidth: true,
      readOnly: true,
    },
  },
];

let addNewTeamTopColumn = [
  { label: 'First name *', key: 'firstName' },
  { label: 'Last name *', key: 'lastName' },
  { label: 'Email address 1 *', key: 'email' },
  { label: 'Phone number 1', key: 'phoneNumber', type: 'number' },
];

let addNewTeamFieldRequired = ['firstName', 'lastName', 'email', 'departments', 'stateId', 'cityId'];

const formObject = {
  isNewItem: true,
  firstName: '',
  lastName: '',
  email: '',
  departments: '',
  phoneNumber: '',
  countryCode: '1',
  roleId: '',
  role: '',
  stateId: '',
  cityId: '',
  zipcode: '',
  reportingTo: '',
  updatedAt: '',
};

const phoneCode = [
  { label: 'India', value: 1, country_code: 'IN', code: '91' },
  { label: 'UK', value: 2, country_code: 'GB', code: '255' },
  { label: 'USA', value: 3, country_code: 'US', code: '1' },
  { label: 'Australia', value: 4, country_code: 'AU', code: '251' },
];

const useStyles = makeStyles({
  label: {
    marginBottom: 2,
    color: '#40444D',
    fontSize: 13,
    fontWeight: 500,
  },
  input: {
    backgroundColor: '#F2F3F5',
    // height: 34,
    marginBottom: 0,
  },
});

function Team(props) {
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSidebar, setloadingSidebar] = useState(false);
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [selectedRows, setSelectedRow] = useState([]);
  const [search, setSearch] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalCreateTeam, setModalCreateTeam] = useState(false);
  const [disableUser, setDeactivateUser] = useState(null);
  const [height, setHeight] = useState(window.innerHeight);
  const [limit] = useState(30);
  const [team, setTeam] = useState(formObject);
  const [teamDetail, setTeamDetail] = useState({});
  const [teamDetailIdIdx, setTeamDetailIdIdx] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    match: {
      params: { id },
    },
  } = props;

  const { countries, states, cities, users, adminTeamDepartmentList, adminAllTeamDepartment, roleList, adminDeactivatedUsers } = props;

  const fetchInitialCites = (stateId) => {
    dispatch(getCities(stateId));
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleResetState = () => {
    setTeam({});
  };

  const handleTeamDetail = (value) => {
    setTeamDetailIdIdx(value);
    const { id, index } = value;

    const teamDetailState = adminAllTeamDepartment.filter((adminAllTeamDepartment) => {
      return id === adminAllTeamDepartment.id;
    });

    setTeamDetail({ ...teamDetailState[0], index });
  };

  const handleChangeTeam = (e) => {
    const { value, name } = e.target;

    setTeam({ ...team, [name]: value });
  };

  const onSelectAssignTo = (event) => {
    const { value } = event.target;
    setTeam({ ...team, reportingToId: value });
  };

  const onSelectStates = (e) => {
    const { value } = e.target;
    setTeam({ ...team, stateId: value, cityId: '' });
  };

  const onStateOpen = () => {
    dispatch(getStates());
  };

  useEffect(() => {
    handleTeamDetail(teamDetailIdIdx);
  }, [adminAllTeamDepartment]);

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (id === 'deactivate') {
      dispatch(getDeactivatedUser(''));
      setloading(false);
      setHasMore(false);
    } else {
      setFilter(id || 'all');
      fetchTeam(id, page, '');
      setHeight(window.innerHeight);
    }
  }, [id]);

  const fetchRoles = () => {
    dispatch(getRolesList());
  };

  const selectMultipleRowHandler = (id) => {
    const _selectedRows = Object.assign([], selectedRows);
    const index = _selectedRows.findIndex((o) => o === id);
    if (index >= 0) {
      _selectedRows.splice(index, 1);
    } else {
      _selectedRows.push(id);
    }
    setSelectedRow(_selectedRows);
  };

  /*
   * Getting Team list
   */
  const fetchTeam = (currentFilter, currentPage, searchText) => {
    // currentFilter = currentFilter ? currentFilter : filter;
    // currentPage = currentPage ? currentPage : page;
    // searchText = searchText ? searchText : currentSearchText;
    setloading(true);
    dispatch(
      getAllDepartmentUserList(
        height >= 900 ? limit * 3 : limit,
        currentFilter && `${currentFilter}`,
        currentPage,
        searchText && `${searchText}`
      )
    ).then((res) => {
      setloading(false);
      if (res.length < 30) {
        setHasMore(false);
        setSearch('');
      } else {
        setHasMore(true);
        setPage(page + 1);
        setSearch('');
      }
    });
  };

  const fetchDepartments = () => {
    setloadingSidebar(true);
    dispatch(getDepartmentList()).then(() => {
      setloadingSidebar(false);
    });
  };

  /*
   * Add new data row for Team
   */
  const addNew = () => {
    // eslint-disable-next-line max-len

    const emailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailCheck = emailValid.test(String(team.email).toLowerCase());
    if (!team.firstName) {
      toast.error('Please mention the First name');
    }
    if (!team.lastName) {
      toast.error('Please mention the Last name');
    }
    if (!team.email) {
      toast.error('Please mention the Email address');
    }
    if (!team.departments) {
      toast.error('Please mention the Department');
    }
    if (!team.roleId) {
      toast.error('Please mention the Role');
    }

    if (team.email && !emailCheck) {
      toast.error('Require valid Email address');
    }

    if (team.firstName && team.lastName && team.email && team.departments && team.stateId && team.cityId && emailCheck) {
      onSave(team);
      toggleCreateteam();
    }
  };

  const loadFunc = () => {
    if (!loading) {
      fetchTeam(id, page, '');
    }
  };

  const removeRow = (index) => {
    dispatch(removeNewTeam(index));
  };

  const onSave = (row, index, payload, button) => {
    let item = row;
    if (item.id) {
      setSaving(true);
      item = {
        ...row,
      };
      dispatch(updateTeamUser(item.id, payload)).then(() => {
        setSaving(false);
        setloading(false);
      });
    } else if (button) {
      const obj = {
        ...item,
      };
      setSaving(true);
      dispatch(createTeamUser(item, index))
        .then((res) => {
          if (!res.errors) {
          }
          setSaving(false);
          setloading(false);
        })
        .catch(() => {});
    } else {
      setSaving(true);
      dispatch(createTeamUser(item, index))
        .then((res) => {
          if (!res.errors) {
          }
          setSaving(false);
          setloading(false);
        })
        .catch(() => {});
    }
  };

  const assignReportToHandler = (customer_id, rep_to_id) => {
    const changeSalesRep = users && users.find((data) => rep_to_id == data.id);
    const dataToBeSent = {
      reportingToId: rep_to_id,
      reportingTo: {
        id: rep_to_id,
        firstName: changeSalesRep.firstName,
        lastName: changeSalesRep.lastName,
        email: changeSalesRep.email,
      },
    };

    setSaving(true);
    dispatch(updateTeamUser(customer_id, dataToBeSent))
      .then(() => {
        setSaving(false);
        toast.success('ReportingTo assigned successfully.');
      })
      .catch(() => {
        setSaving(false);
      });
  };

  const toggle = () => {
    setModal(!modal);
  };

  const toggleCreateteam = () => {
    handleResetState();
    setModalCreateTeam(!modalCreateTeam);
  };

  const showModal = (e, item) => {
    e.stopPropagation();
    setModal(!modal);
    setDeactivateUser(item);
  };

  const reactivateTeamMember = (e, item) => {
    e.stopPropagation();
    onActivate(item);
  };

  const inviteTeamMember = (e, item) => {
    e.stopPropagation();
    dispatch(inviteTeamUser(item.id, item)).then((res) => {
      toast.success('Team member invite successfully.');
    });
  };

  const cancelInviteMember = (e, item) => {
    e.stopPropagation();
    dispatch(cancelUserInvitation(item.id, item)).then((res) => {
      toast.success('Team member invite cancelled successfully.');
    });
    props.history.push(`/admin/team/deactivate`);
  };

  /*
   * Table actions for Team.
   */
  const renderTableActions = (item, index) => {
    return (
      <div className="table-actions">
        {item.inviteStatus === 'pending' ? (
          <>
            <button className="sendBtn">
              <UncontrolledDropdown className="moreOptionsConnew" direction="left">
                <DropdownToggle className="moreLeads">
                  <Tooltip
                    title="Member have not
                    accepted invitation yet"
                    placement="top-start"
                  >
                    <button
                      type="button"
                      className="sendBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeamDetail({ id: item.id, index: index });
                        toggleDrawer();
                      }}
                    >
                      <CustomIcon icon="alert/warning-yellow" />
                    </button>
                  </Tooltip>
                </DropdownToggle>
              </UncontrolledDropdown>
            </button>
            <UncontrolledDropdown className="moreOptionsConnew" direction="left">
              <DropdownToggle className="moreLeads" onClick={(e) => e.stopPropagation()}>
                <button className="sendBtn">
                  <CustomIcon icon="Header/Icon/More" />
                </button>
              </DropdownToggle>
              <DropdownMenu className="dropdownMenuTeam" style={{ minWidth: 'unset' }}>
                {' '}
                <DropdownItem onClick={(e) => inviteTeamMember(e, item)} className="dropdownMenu_invite">
                  Resend Invite
                </DropdownItem>
                <DropdownItem onClick={(e) => cancelInviteMember(e, item)} className="dropdownMenu_invite">
                  Cancel Invite
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        ) : (
          <>
            <button className="sendBtn">
              <UncontrolledDropdown className="moreOptionsConnew" direction="left">
                <DropdownToggle className="moreLeads" onClick={(e) => e.stopPropagation()}>
                  <button className="sendBtn">
                    <CustomIcon icon="Header/Icon/More" />
                  </button>
                </DropdownToggle>
                <DropdownMenu className="dropdownMenuTeam">
                  {id !== 'deactivate' ? (
                    <DropdownItem onClick={(e) => showModal(e, item)} className="dropdownMenu_invite dropdownMenu_invite__width_108px">
                      <CustomIcon icon="Icon/Archive" />
                      Deactivate
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      onClick={(e) => reactivateTeamMember(e, item)}
                      className="dropdownMenu_invite dropdownMenu_invite__width_108px"
                    >
                      <CustomIcon icon="Icon/Archive" />
                      Reactivate
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </button>

            <button className="sendBtn" onClick={() => props.history.push(`/admin/team-details/${item.id}`)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>
    );
  };

  const onChange = (e, key, item, index) => {
    const value = e.target.value;

    if (key === 'role') {
      dispatch(onChangeTeam({ name: value }, key, item, index));
      return;
    }

    if (key === 'cityName') {
      dispatch(onChangeTeam({ ...teamDetail.city, name: value }, 'city', item, index));
      return;
    }

    if (key === 'stateName') {
      dispatch(onChangeTeam({ ...teamDetail.city, state: { name: value } }, 'city', item, index));
      return;
    }

    if (key === 'departments' || key === 'department') {
      dispatch(onChangeTeam([{ name: value }], 'departments', item, index));
      return;
    }

    if (key === 'stateId') {
      dispatch(onChangeTeam(value, key, item, index));
      dispatch(onChangeTeam('', 'cityId', item, index));
    }

    dispatch(onChangeTeam(value, key, item, index));
  };

  const filterTeam = async (currentFilter) => {
    setHasMore(true);
    setPage(1);
    props.history.push(`/admin/team/${currentFilter}`);
  };

  const onSelectCities = (e) => {
    const { value } = e.target;
    setTeam({ ...team, cityId: value });
  };

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      setSearch(nextValue);
      fetchTeam(filter, 1, nextValue);
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
      return !item.firstName || !item.lastName || !item.email || !item.roleId || !item.departments.length;
    };
    return (
      <button
        disabled={isDisabled()}
        className="sendBtn send-invite-team"
        onClick={() => onSave(item, index, null, true)}
        title="Send an invite"
        placement="left"
      >
        <CustomIcon icon="airplane" />
      </button>
    );
  };

  const onDeactivate = () => {
    const data = {
      ids: [disableUser.id],
    };
    dispatch(deactivateUser(data)).then((res) => {
      toast.success('Team member deactivated successfully.');
      toggle();
      setDeactivateUser(null);
    });
  };

  const onActivate = (item) => {
    const data = {
      ids: [item.id],
    };
    dispatch(activateUser(data)).then((res) => {
      toast.success('Team member Reactivated successfully.');
      dispatch(getDeactivatedUser(''));
    });
  };

  const onRowClick = (item) => {
    if (item.inviteStatus !== 'pending') {
      props.history.push(`/admin/team-details/${item.id}`);
    }
  };

  return (
    <>
      <div className="contentContainerFull teamDescription teamList">
        <div className="innerFullCon leftSideBar">
          <Departments {...props} loading={loadingSidebar} filterTeam={filterTeam} filter={filter} />
        </div>
        <div className="innerFullCon rightSection">
          <div className="cardHeader noborder">
            <h4>{id === 'deactivate' ? 'Deactivated Team Members' : 'All Team Members'}</h4>
            <div className="topActionBar">
              {selectedRows.length > 0 && <button className="btn">Deactivate All</button>}
              <span className="mx-1" style={{ background: '#F2F3F5' }}>
                <SearchInput onChange={(e) => handleChange(e.target.value)} onClear={() => handleChange('')} bgGray />
              </span>
              {id !== 'deactivate' ? (
                <>
                  <Button className="text-white rounded py-1 px-3 createBtn mx-1" onClick={() => toggleCreateteam()}>
                    Create
                  </Button>
                  <UncontrolledDropdown className="moreOptionsCon">
                    <DropdownToggle className="moreLeads">
                      <button className="sendBtn">
                        <CustomIcon icon="Header/Icon/More" />
                      </button>
                    </DropdownToggle>
                    <DropdownMenu className="dropdownMenuTeam">
                      {id !== 'deactivate' ? (
                        <NavLink to="/admin/team/deactivate">
                          <DropdownItem className="viewDeactivated">View Deactivated</DropdownItem>
                        </NavLink>
                      ) : (
                        <NavLink to="/admin/team">
                          <DropdownItem className="viewDeactivated">View Activated</DropdownItem>
                        </NavLink>
                      )}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
              ) : (
                <UncontrolledDropdown className="moreOptionsCon">
                  <DropdownToggle className="moreLeads">
                    <button className="sendBtn">
                      <CustomIcon icon="Header/Icon/More" />
                    </button>
                  </DropdownToggle>
                  <DropdownMenu className="dropdownMenuTeam">
                    <NavLink to="/admin/team">
                      <DropdownItem className="viewDeactivated">View Activated</DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </div>
          </div>
          <DetailDrawer
            label="Member details"
            columns={columnsDrawer}
            data={{
              ...teamDetail,
              role: teamDetail?.role?.name,
              department: [!isEmpty(teamDetail?.departments) ? teamDetail?.departments[0]?.name : []],
              cityName: teamDetail?.city?.name,
              stateName: teamDetail?.city?.state?.name,
              reportingTo: teamDetail?.reportingTo,
              updatedAt: moment(teamDetail?.updatedAt).format('MM/DD/YYYY'),
            }}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            onSave={onSave}
            onChange={onChange}
          />
          <Modal isOpen={modal} toggle={toggle} className="addLeadModal">
            <ModalBody>
              <div className="createLeadHeader">
                <h1>Confirmation</h1>
                <button type="button" className="roleCloseBtn" onClick={toggle}>
                  <span>
                    <i className="fas fa fa-times" />
                  </span>
                </button>
              </div>
              <div className="roleContent">
                <p>Once you deactivate, team member would not have an access to login.</p>
              </div>
              <div className="buttonOuter">
                <button type="button" className="cancelRoleBtn" onClick={toggle}>
                  Cancel
                </button>
                <button type="button" className="sendRoleBtn" onClick={onDeactivate}>
                  Deactivate
                </button>
              </div>
            </ModalBody>
          </Modal>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
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
                columns={id === 'deactivate' ? deactivatedColumns : columns}
                data={(id === 'deactivate' ? adminDeactivatedUsers : adminAllTeamDepartment) || []}
                tableActions={renderTableActions}
                loading={loading}
                onSave={onSave}
                onChange={onChange}
                removeRow={removeRow}
                selectMultipleRowHandler={selectMultipleRowHandler}
                selectedRows={selectedRows}
                options={{
                  countryCode: countries,
                  stateCode: states,
                  cityCode: cities,
                  phoneCode: phoneCode,
                  roleCode: roleList,
                  departmentCode: adminTeamDepartmentList,
                }}
                noEditingEmail
                assignReportToHandler={assignReportToHandler}
                saveBtn={saveBtn}
                readOnly={isLocked}
                onRowClick={onRowClick}
              />
            </InfiniteScroll>
            <Modal
              style={{
                maxHeight: 'unset',
              }}
              isOpen={modalCreateTeam}
              toggle={toggleCreateteam}
              className="addLeadModal"
            >
              <ModalBody>
                <div className="createLeadHeader">
                  <h1>Add Team Member</h1>
                  <button type="button" className="roleCloseBtn" onClick={toggleCreateteam}>
                    <span>
                      <i className="fas fa fa-times" />
                    </span>
                  </button>
                </div>
                <div className="container-fluid team__add-team-input-field">
                  <CustomIcon className="mx-auto mt-4 mb-1 team__person-regular" icon="Placeholder/Person/Regular" />
                  <div className="row">
                    {addNewTeamTopColumn.map((field) => (
                      <div key={field.key} className="col-6">
                        <label htmlFor={field.key} className={classes.label}>
                          {field.label}
                        </label>
                        <Input
                          className={classes.input}
                          id={field.key}
                          name={field.key}
                          onChange={handleChangeTeam}
                          value={team[field.key]}
                          inputProps={{ required: true }}
                          type={field?.type || 'text'}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="d-flex ">
                    <div className="w-50">
                      <label htmlFor="departments" className={classes.label}>
                        Department *
                      </label>
                      <div className="addTeamModalDropdown">
                        <CustomDropDown
                          readOnly={false}
                          name="name"
                          valueFeild="id"
                          item={team}
                          options={JSON.parse(JSON.stringify(adminTeamDepartmentList))}
                          onSelect={(e) => {
                            handleChangeTeam({
                              target: {
                                value: [e.target.value],
                                name: 'departments',
                              },
                            });
                          }}
                          placeholder="-Select-"
                        />
                        <span className="dropIcons">
                          <i className="fas fa-caret-down" />
                        </span>
                      </div>
                    </div>
                    <div className="w-50">
                      <label htmlFor="role" className={classes.label}>
                        Role *
                      </label>
                      <div className="addTeamModalDropdown">
                        <CustomDropDown
                          readOnly={false}
                          name="name"
                          valueFeild="id"
                          item={team}
                          options={JSON.parse(JSON.stringify(roleList))}
                          onSelect={(e) => {
                            handleChangeTeam({
                              target: {
                                value: e.target.value,
                                name: 'roleId',
                              },
                            });
                          }}
                          placeholder="-Select-"
                        />
                        <span className="dropIcons">
                          <i className="fas fa-caret-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50">
                      <label htmlFor="state" className={classes.label}>
                        State
                      </label>
                      <div className="addTeamModalDropdown">
                        <StatesDropDown
                          id="state"
                          isFilter
                          item={states}
                          selectedValue={team?.city?.state?.name}
                          onSelect={(e) => onSelectStates(e)}
                          placeholder="-Select-"
                        />
                        <span className="dropIcons">
                          <i className="fas fa-caret-down" />
                        </span>
                      </div>
                    </div>
                    <div className="w-50 ">
                      <label htmlFor="city" className={classes.label}>
                        City
                      </label>
                      <div className="addTeamModalDropdown">
                        <CitiesDropDown
                          id="city"
                          isFilter
                          item={team}
                          stateId={team.stateId}
                          selectedValue={team?.city?.name}
                          onSelect={(e) => onSelectCities(e)}
                          fetchInitialCites={fetchInitialCites}
                          placeholder="-Select-"
                        />
                        <span className="dropIcons">
                          <i className="fas fa-caret-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="zipCode" className={classes.label}>
                        Zip Code
                      </label>
                      <Input className={classes.input} id="zipcode" name="zipcode" onChange={handleChangeTeam} value={team.zipcode} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <label htmlFor="reportingTo" className={classes.label}>
                        Reporting to
                      </label>
                      <div className="addTeamModalDropdown mx-1">
                        <AssignToDropDown
                          placeholder="-Select-"
                          readOnly={false}
                          onSelect={(data) => onSelectAssignTo(data)}
                          selectedSalesRep={team.reportingTo}
                        />
                        <span className="dropIcons">
                          <i className="fas fa-caret-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buttonOuterLead pt-3">
                  <button
                    type="button"
                    className="cancelRoleBtn"
                    onClick={() => {
                      toggleCreateteam();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`sendRoleBtn ${loading && 'btn disabled cursor-default'}`}
                    onClick={() => {
                      addNew();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Send Invite'}
                  </button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

Team.propTypes = {
  match: PropTypes.object,
  team: PropTypes.object,
  history: PropTypes.any,
};
const mapStateToProps = (state) => ({
  adminTeamDepartmentList: state.adminTeam.adminTeamDepartmentList,
  adminAllTeamDepartment: state.adminTeam.adminAllTeamDepartment,
  roleList: state?.permission?.roleList,
  users: state.common.users,
  adminDeactivatedUsers: state.adminTeam.adminDeactivatedUsers,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Team);
