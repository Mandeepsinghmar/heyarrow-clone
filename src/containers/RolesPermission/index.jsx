import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import {
  Table, Modal, ModalBody
} from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import CustomIcon from '../../components/common/CustomIcon';
import './index.scss';
import {
  addRolesPermission, getRolesList, getRolesPermission, updateRolesPermission
} from '../../api';

// eslint-disable-next-line import/order
// import _ from 'lodash';

const NewPermissionsInfo = {
  name: 'NewUser',
  permissions: [
    {
      name: 'create_products',
      state: true
    },
    {
      name: 'update_products',
      state: true
    },
    {
      name: 'update_products_status',
      state: true
    },
    {
      name: 'share_products',
      state: true
    },
    {
      name: 'update_comment',
      state: true
    },
    {
      name: 'create_comment',
      state: true
    },
    {
      name: 'delete_comment',
      state: true
    },
    {
      name: 'create_customer',
      state: true
    },
    {
      name: 'update_customer',
      state: true
    },
    {
      name: 'assign_salesRep_to_customer',
      state: true
    },
    {
      name: 'view_unassigned_customer',
      state: true
    },
    {
      name: 'read_sales_report',
      state: true
    },
    {
      name: 'export_sales_report',
      state: true
    },
    {
      name: 'create_team',
      state: true
    },
    {
      name: 'update_team',
      state: true
    },
    {
      name: 'active_team',
      state: true
    },
    {
      name: 'inactive_team',
      state: true
    },
    {
      name: 'update_team_reportingTo',
      state: true
    },
    {
      name: 'create_department',
      state: true
    },
    {
      name: 'update_department',
      state: true
    },
    {
      name: 'delete_department',
      state: true
    },
    {
      name: 'chat_customers',
      state: true
    },
    {
      name: 'chat_with_team_member',
      state: true
    },
    {
      name: 'chat_unassigned_customers',
      state: true
    },
    {
      name: 'create_chat_groups',
      state: true
    },
    {
      name: 'edit_chat_groups',
      state: true
    },
    {
      name: 'view_lead',
      state: true
    },
    {
      name: 'assign_lead_salesRep',
      state: true
    },
    {
      name: 'update_lead_status',
      state: true
    },
    {
      name: 'access_web_app',
      state: true
    },
    {
      name: 'access_mobile_app',
      state: true
    },
  ]
};

const group = (data = [], column = '') => {
  if (!data.length) {
    return [];
  }

  return data.reduce(
    (result, item) => {
      const resultCopy = { ...result };

      if (result[item[column]]) {
        resultCopy[item[column]].push(item);
      } else {
        resultCopy[item[column]] = [];
        resultCopy[item[column]].push(item);
      }

      return resultCopy;
    }, {}
  );
};

const permissionToTable = (role) => {
  if (!role) {
    return {
      columns: [],
      data: []
    };
  }

  const permissions = (role.permissions || []).map((item) => {
    const number = item.name.indexOf('_');
    const number2 = number + 1;
    return {
      ...item,
      group: item.name.slice(0, number),
      top: item.name.slice(number2, item.name.length)
    };
  });

  const modules = group(permissions, 'group');
  const columns = group(permissions, 'top');

  const permissionToShow = {
    columns: Object.keys(columns),
    data: []
  };

  permissionToShow.data = Object.keys(modules).reduce(
    (result, moduleKey) => result.concat({
      name: moduleKey,
      columns: Object.keys(columns).reduce(
        (columnResult, columnKey) => {
          const foundColumn = (columns[columnKey].find((item) => item.name === `${moduleKey}_${columnKey}`));

          return {
            ...columnResult,
            [columnKey]: foundColumn ? foundColumn.state : null
          };
        }, {}
      )
    }), []
  );

  return permissionToShow;
};

const newPermissionToTable = (role) => {
  if (!role) {
    return {
      modalColumns: [],
      modalData: []
    };
  }

  const permissions = (role.permissions || []).map((item) => {
    const number = item.name.indexOf('_');
    const number2 = number + 1;
    return {
      ...item,
      group: item.name.slice(0, number),
      top: item.name.slice(number2, item.name.length)
    };
  });

  const modules = group(permissions, 'group');
  const modalColumns = group(permissions, 'top');

  const permissionToShow = {
    modalColumns: Object.keys(modalColumns),
    modalData: []
  };

  permissionToShow.modalData = Object.keys(modules).reduce(
    (result, moduleKey) => result.concat({
      name: moduleKey,
      modalColumns: Object.keys(modalColumns).reduce(
        (columnResult, columnKey) => {
          const foundColumn = (modalColumns[columnKey].find((item) => item.name === `${moduleKey}_${columnKey}`));

          return {
            ...columnResult,
            [columnKey]: foundColumn ? foundColumn.state : null
          };
        }, {}
      )
    }), []
  );

  return permissionToShow;
};

const nameSwitcher = (name) => {
  switch (name) {
  case 'edit':
    return 'Update';
  case 'text':
    return 'Chat';
  case 'user':
    return 'Sales';
  case 'status':
    return 'Product Status';
  case 'platform':
    return 'Access to platform';
  case 'archive':
    return 'Active';
  case 'status_update':
    return 'Product Status';
  case 'assign_salesRep_to':
    return 'Assign Sales Rep';
  case 'view_unassigned':
    return 'View Unassign';
  case 'report_read':
    return 'Read';
  case 'report_export':
    return 'Export';
  case 'update_reportingTo':
    return 'Update Reporting To';
  case 'customers':
    return 'Chat With Customers';
  case 'with_team_member':
    return 'Chat With Team Member';
  case 'unassigned_customers':
    return 'Chat With Unassigned Customers';
  case 'create_groups':
    return 'Create Group';
  case 'edit_groups':
    return 'Edit Group';
  case 'update_status':
    return 'Update Lead Status';
  case 'web_app':
    return 'Web App';
  case 'mobile_app':
    return 'Mobile App';
  case 'comment':
    return 'Product Comment';
  case 'view':
    return 'View Lead';
  case 'assign_salesRep':
    return 'Assign Lead to Sales Rep';
  case 'access':
    return 'Access To Platform';
  default:
    return name;
  }
};

const groupNameModifier = (name) => {
  const modifiedName = nameSwitcher(name);
  return modifiedName.charAt(0).toUpperCase() + modifiedName.slice(1);
};

const RolesPermission = (props) => {
  const [editRole, setIsEditRole] = useState(null);
  const [roleText, setRoleText] = useState('');
  const [showPermission, setPermission] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(0);
  const [modal, setModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [
    addNewPermissionsInfo, setAddNewPermissionsInfo
  ] = useState(NewPermissionsInfo);

  const dispatch = useDispatch();

  const { roleList, rolePermission } = props;
  const handleChange = (e) => {
    setRoleText(e.target.value);
  };
  useEffect(() => {
    dispatch(getRolesList());
    dispatch(getRolesPermission());
  }, [dispatch]);

  useEffect(() => {
    if (roleList.length) {
      if (rolePermission.length && selectedRoleId) {
        const initialValue = rolePermission && rolePermission.find(
          (data) => data.id === selectedRoleId
        );
        setPermission(initialValue);
        setSelectedRoleId(selectedRoleId || roleList[0].id);
      } else {
        const initialValue = rolePermission && rolePermission.find(
          (data) => data.id === roleList[0].id
        );
        setPermission(initialValue);
        setSelectedRoleId(roleList[0].id);
      }
    }
  }, []);

  const roleSubmit = (id) => {
    const data = [...rolePermission]
      .filter((item) => item.id === selectedRoleId);
    const dataaa = { ...data[0], name: roleText };
    dispatch(updateRolesPermission(dataaa, id));
    setIsEditRole(null);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const addNewRole = () => {
    if (!newRoleName) {
      toast.error('Please mention the Role Name');
    }
    if (newRoleName) {
      const data = {
        ...addNewPermissionsInfo, name: newRoleName
      };
      dispatch(addRolesPermission(data));
      toggle();
    }
  };

  const handleSubmit = (value, index) => {
    setRoleText(value);
    setIsEditRole(index);
  };

  const handleRole = (id) => {
    setSelectedRoleId(id);
    const initialValue = rolePermission && rolePermission.find(
      (data) => data.id === id
    );

    setPermission(initialValue);
  };

  const { columns = [], data = [] } = permissionToTable(showPermission);
  const {
    modalColumns = [], modalData = []
  } = newPermissionToTable(addNewPermissionsInfo);

  const renderTableHead = () => (
    <thead>
      <tr>
        <th className="first-table-row">Group</th>
        <th className="first-table-row">Permission</th>
        <th className="first-table-row">Enable/Disabled</th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {
        data && data.sort(
          // eslint-disable-next-line no-nested-ternary
          (a, b) => ((a.name < b.name) ? -1 : (a.name > b.name ? 1 : 0))
        )
          .map((item) => (
            <>
              <tr>
                <td>{groupNameModifier(item.name)}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              {
                columns.filter((column) => item.columns[column]
                !== null)
                  .sort((a, b) => {
                    if (a < b) {
                      return -1;
                    }
                    if (a > b) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((column) => (
                    <>
                      <tr>
                        <td>&nbsp;</td>
                        <td>{groupNameModifier(column)}</td>
                        <td>
                          <Switch
                            color="primary"
                            name="checkedB"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            className="permissionToggleSwitch"
                            checked={item.columns[column]}
                            value={item.columns[column]}
                            onChange={() => {
                              const updatePermissionState = showPermission
                                .permissions.map(
                                  (val) => {
                                    if (val.name === `${item.name}_${column}`) {
                                      return {
                                        ...val,
                                        state: !val.state
                                      };
                                    }
                                    return val;
                                  }
                                );
                              const updatedPermission = {
                                ...showPermission,
                                permissions: updatePermissionState
                              };
                              setPermission(updatedPermission);
                              dispatch(updateRolesPermission(
                                updatedPermission, updatedPermission.id
                              ));
                            }}
                          />
                        </td>
                      </tr>
                    </>
                  ))
              }
            </>
          ))
      }
    </tbody>
  );

  const renderModalTableBody = () => (
    <tbody>
      {
        modalData && modalData.sort(
          // eslint-disable-next-line no-nested-ternary
          (a, b) => ((a.name < b.name) ? -1 : (a.name > b.name ? 1 : 0))
        ).map((item) => (
          <>
            <tr>
              <td>{groupNameModifier(item.name)}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            {
              modalColumns.filter(
                (column) => item.modalColumns[column] !== null
              ).map(
                (column) => (
                  <>
                    <tr>
                      <td>&nbsp;</td>
                      <td>{groupNameModifier(column)}</td>
                      <td>
                        <Switch
                          color="primary"
                          name="checkedB"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          className="permissionToggleSwitch"
                          checked={item.modalColumns[column]}
                          value={item.modalColumns[column]}
                          onChange={() => {
                            const updatePermissionState = addNewPermissionsInfo
                              .permissions.map(
                                (val) => {
                                  if (val.name === `${item.name}_${column}`) {
                                    return {
                                      ...val,
                                      state: !val.state
                                    };
                                  }
                                  return val;
                                }
                              );
                            const updatedPermission = {
                              ...addNewPermissionsInfo,
                              permissions: updatePermissionState
                            };
                            setAddNewPermissionsInfo(updatedPermission);
                          }}
                        />
                      </td>
                    </tr>
                  </>
                )
              )
            }
          </>
        ))
      }
    </tbody>
  );

  return (
    <>
      <div className="contentContainerFull teamDescription rolesPermissionContainer">
        <div className="innerFullCon leftSideBar">
          <div className="cardHeader">
            <h4>Roles</h4>
            <button type="button" className="addNewItem noborder rolesAddIcon" onClick={() => toggle()}>
              <CustomIcon icon="Header/Icon/Add" />
            </button>
          </div>
          <div className="tableBox">
            <ul className="listCon permissionListTab">
              {roleList && roleList.map((role, index) => (
                <li
                  className={role.id === selectedRoleId ? 'listItem active' : 'listItem'}
                  onClick={() => {
                    handleRole(role.id);
                  }}
                >
                  {editRole === index ? (
                    <input
                      name="role"
                      value={roleText || role.name}
                      onChange={handleChange}
                      onKeyUp={(e) => {
                        if (e.keyCode === 13 || e.keyCode === 9) {
                          roleSubmit(role.id);
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          roleSubmit(role.id);
                        }
                      }}
                    />
                  )
                    : role.name}
                  <button type="button" className={index === editRole ? 'sendBtn editRoleBtn' : 'sendBtn'} onClick={() => handleSubmit(role.name, index)}>
                    <CustomIcon icon="Pen" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="addNewItem noborder addRolesInput" onClick={() => toggle()}>
              <a className="add">+ Add roles</a>
            </div>
            <Modal isOpen={modal} toggle={toggle} className="addRoleModal">
              <ModalBody>
                <h1>Create Role</h1>
                <button type="button" className="roleCloseBtn" onClick={toggle}>
                  <span>
                    <i className="fas fa fa-times" />
                  </span>
                </button>
                <div className="roleContent">
                  <TextField
                    label="Role Name"
                    className="prodDescription"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                  <div className="tableBox hidePermissionTable">
                    <Table className="roles-table">
                      {renderTableHead()}
                      {renderModalTableBody()}
                    </Table>
                  </div>
                </div>
                <button type="button" className="sendRoleBtn" onClick={addNewRole}>Create</button>
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div className="innerFullCon rightSection">
          <div className="cardHeader noborder">
            <h4>Permissions</h4>
          </div>
          <div className="tableBox hidePermissionTable">
            <Table className="roles-table">
              {renderTableHead()}
              {renderTableBody()}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

RolesPermission.propTypes = {
  roleList: PropTypes.arrayOf(PropTypes.object).isRequired,
  rolePermission: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  roleList: state?.permission?.roleList,
  rolePermission: state?.permission?.rolePermission,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(RolesPermission);
