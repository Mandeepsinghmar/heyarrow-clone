import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import ProfileInitials from '../../components/common/ProfileInitials';
import getFullName from '../../utils/getFullName';
import Loader from '../../components/common/Loader';

const CustomersTable = ({
  customers
}) => {
  const history = useHistory();
  const onRowClick = (id) => {
    history.push(`/customers/${id}`);
  };

  if (customers.loading) {
    return <Loader seconAdary />;
  }

  if (!customers.data.length) {
    return <center>No customers</center>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>State</th>
          <th>City</th>
          <th>Assigned to</th>
          <th>Assigned on</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {customers.data.map((customer) => (
          <tr key={customer.id}>
            <td>
              <div className="flex table-customer__item">
                <ProfileInitials
                  firstName={customer.firstName}
                  lastName={customer.lastName}
                  profileId={customer.id}
                  size="small"
                />
                <span>
                  {getFullName(customer)}
                </span>
              </div>
            </td>
            <td>{(customer.city?.state?.name) ? (customer.city?.state?.name) : '-' }</td>
            <td>{(customer.city?.name) ? (customer.city?.name) : '-'}</td>
            <td>
              <div className="flex table-customer__item">
                <ProfileInitials
                  firstName={customer.salesRep?.firstName}
                  lastName={customer.salesRep?.lastName}
                  profileId={customer.salesRep?.id}
                  profileUrl={customer.salesRep.profileUrl}
                  size="small"
                />
                <span>
                  {getFullName(customer.salesRep)}
                </span>
              </div>
            </td>
            <td>
              {customer.assignedOn ? moment(customer.assignedOn).format('MM/DD/YYYY') : '-'}
            </td>
            <td className="stats-table__actions">
              <div className="table-actions">
                <button type="button" className="sendBtn" onClick={() => onRowClick(customer.id)}>
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

CustomersTable.propTypes = {
  customers: PropTypes.objectOf(PropTypes.any)
};

CustomersTable.defaultProps = {
  customers: {}
};

export default CustomersTable;
