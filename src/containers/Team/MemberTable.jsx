import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import ProfileInitials from '../../components/common/ProfileInitials';
import getFullName from '../../utils/getFullName';
import Loader from '../../components/common/Loader';

const MemberTable = ({
  users
}) => {
  const history = useHistory();
  const onRowClick = (id) => {
    history.push(`/teams/${id}`);
  };

  if (users.loading) {
    return <Loader secondary />;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Email address</th>
          <th>Phone number</th>
          <th>City</th>
          <th>Customers</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {users.data.map((user) => (
          <tr>
            <td>
              <div className="flex table-customer__item">
                <ProfileInitials
                  firstName={user.firstName}
                  lastName={user.lastName}
                  profileId={user.id}
                  size="small"
                />
                <span>
                  {getFullName(user)}
                </span>
              </div>
            </td>
            <td>{user.role?.name}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber ? user.phoneNumber : '-'}</td>
            <td>{user.city?.name}</td>
            <td>{user.totalCustomers}</td>
            <td className="stats-table__actions">
              <div className="table-actions">
                <button type="button" className="sendBtn" onClick={() => onRowClick(user.id)}>
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MemberTable.propTypes = {
  users: PropTypes.objectOf(PropTypes.any)
};

MemberTable.defaultProps = {
  users: []
};

export default MemberTable;
