/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import { get } from 'lodash';
import {
  Table
} from 'reactstrap';
import './index.scss';
import ProfileInitial from '../../../components/common/ProfileInitials';
import { getSideBarSalesRep } from '../../../api/adminTeam';
import { getRolesPermissionById, updateUserRolesPermission } from '../../../api/permission';
import CustomIcon from '../../../components/common/CustomIcon';
import { Link } from 'react-router-dom';

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

function TeamPermission(props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    dispatch,
    adminTeamSideDetails,
    rolePermission
  } = props;

  const [showPermission, setPermission] = useState(null);

  useEffect(() => {
    dispatch(getSideBarSalesRep(id));
    dispatch(getRolesPermissionById(id));
  }, []);

  useEffect(() => {
    if (rolePermission && rolePermission.length) {
      setPermission(rolePermission[0]);
    }
  }, [rolePermission]);

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

    const permissions = (role.userPermission || []).map((item) => {
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

  const { columns = [], data = [] } = permissionToTable(showPermission);

  const groupNameModifier = (name) => {
    const modifiedName = nameSwitcher(name);
    return modifiedName.charAt(0).toUpperCase() + modifiedName.slice(1);
  };

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
                columns.filter((column) => item.columns[column] !== null).map(
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
                            checked={item.columns[column]}
                            value={item.columns[column]}
                            onChange={() => {
                              const updatePermissionState = showPermission
                                .userPermission.map(
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
                                userPermission: updatePermissionState
                              };
                              const updateUserPermission = {
                                ...showPermission,
                                userPermissions: updatePermissionState
                              };
                              dispatch(updateUserRolesPermission(
                                updateUserPermission, updateUserPermission.id
                              ));
                              setPermission(updatedPermission);
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
      <div className="contentContainerFull teamDescription fullHeight teamDetails">
        <div className="innerFullCon leftSideBar">
          <div className="tableBox">
            <ul className="listCon timeLineContainer">
              <li className="listItem active">
                <div className="userCard">
                  <div style={{position: 'relative', zIndex: 9}}>
                    <ProfileInitial firstName={get(adminTeamSideDetails.user, 'firstName', '')} lastName={get(adminTeamSideDetails.user, 'lastName', '')} size="medium" profileId={get(adminTeamSideDetails.user, 'id', '')} />
                  </div>
                  {adminTeamSideDetails && adminTeamSideDetails.user && adminTeamSideDetails.user.reportingTo ?
                    <div style={{position: 'absolute', top: 0, left: 20}}>
                      <ProfileInitial firstName={get(adminTeamSideDetails.user.reportingTo, 'firstName', '')} lastName={get(adminTeamSideDetails.user.reportingTo, 'lastName', '')} size="medium" profileId={get(adminTeamSideDetails.user.reportingTo, 'id', '')} />
                    </div>
                  : null}
                </div>
                <div className="userName">
                  <h4>
                    {`${get(adminTeamSideDetails.user, 'firstName', '')} ${get(
                      adminTeamSideDetails.user,
                      'lastName',
                      ''
                    )}`}
                  </h4>
                  <p>{`${get(adminTeamSideDetails && adminTeamSideDetails.user && adminTeamSideDetails.user.role, 'name', '')}`}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="innerFullCon rightSection">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className="TeamSideTitle">
              <div className="TeamHeaderContainer">
                <h1>
                  Permissions
                </h1>
                <Link className="sendBtn" to={`/admin/team-details/${id}`}>
                  <CustomIcon icon="Icon/Close" />
                </Link>
              </div>
              <div className="tableBox hidePermissionTable">
                <Table className="roles-table">
                  {renderTableHead()}
                  {renderTableBody()}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  teamStateData: state.team.teamStateData,
  teamSales: state.team.teamSales,
  teamSalesRepLoader: state.team.teamSalesRepLoader,
  teamStateLoader: state.team.teamStateLoader,
  adminTeamSideDetails: state.adminTeam.adminTeamSideDetails,
  adminTeamMemberData: state.adminTeam.adminTeamMemberData,
  rolePermission: state.permission.rolePermission,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(TeamPermission);
