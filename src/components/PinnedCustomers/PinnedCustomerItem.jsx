import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import getFullName from '../../utils/getFullName';
import ProfileInitials from '../common/ProfileInitials';
import getProductImageUrl from '../../utils/getProductImageUrl';

const PinnedCustomerListItem = ({ customer }) => {
  const history = useHistory();

  const onClick = () => {
    history.push(`/customers/${customer.id}`);
  };
  return (
    <li onClick={onClick}>
      <div className="innerGridBox pin-customer-list-item">
        {customer?.lastPurchasedDetails?.product ? (
          <img
            style={{ width: '100px', height: '100px' }}
            alt={getFullName(customer)}
            src={getProductImageUrl(customer?.lastPurchasedDetails?.product)}
          />
        ) : (
          <div style={{ paddingTop: '12px' }}>
            <ProfileInitials
              firstName={customer.firstName}
              lastName={customer.lastName}
              profileId={customer.id}
              profileUrl={customer.profileUrl}
              size="large"
            />
          </div>
        )}
        <h4>{getFullName(customer)}</h4>
      </div>
    </li>
  );
};

PinnedCustomerListItem.propTypes = {
  customer: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ])).isRequired,
};

export default PinnedCustomerListItem;
