import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import './index.scss';
import ProfileGroup from '../common/ProfileGroup';
import CustomIcon from '../common/CustomIcon';
import PurchaseHistoryItem from '../common/PurchaseHistoryItem';
import Loader from '../common/Loader';
import getFullName from '../../utils/getFullName';
import getLocation from '../../utils/getLocation';

const CustomerDetails = ({
  admin
}) => {
  const { customerDetails, purchaseHistory } = useSelector(
    (state) => state.customers
  );

  return (
    <div className="customer-details">
      <h3>
        Details
      </h3>
      {customerDetails.loading ? <Loader secondary={admin} /> : (
        <>
          {customerDetails?.data?.id
            ? (
              <>
                <ProfileGroup
                  profiles={[
                    {
                      ...customerDetails.data
                    },
                    {
                      ...customerDetails?.data?.salesRep
                    }
                  ]}
                />
                <div className="customer-details__profile">
                  <h4>{getFullName(customerDetails.data)}</h4>
                  <span>{getLocation(customerDetails.data.city)}</span>
                </div>
                <div className="customer-details__buttons">
                  {customerDetails.data.email
                  && (
                    <Tooltip title={customerDetails.data.email}>
                      <IconButton size="small">
                        <a href={`mailto: ${customerDetails.data.email}`}>
                          <CustomIcon icon="Icon/Email" />
                        </a>
                      </IconButton>
                    </Tooltip>
                  ) }
                  {customerDetails.data.phone
                  && (
                    <Tooltip title={customerDetails.data.phone}>
                      <IconButton size="small">
                        <a href={`tel: ${customerDetails.data.phone}`}>
                          <CustomIcon icon="Phone" />
                        </a>
                      </IconButton>
                    </Tooltip>
                  ) }
                </div>
              </>
            ) : (
              <div className="flex column justify-between items-center empty-state">
                <CustomIcon icon="empty-state/customers" />
                <span>No customer selected or was not found!</span>
              </div>
            )}
        </>
      )}
      <div className="purchase-history-list">
        <h3>
          Purchase history
        </h3>
        { purchaseHistory.loading ? <Loader secondary={admin} /> : (
          <>
            {purchaseHistory.data.map((purchase) => (
              <PurchaseHistoryItem purchase={purchase} />
            ))}
            {!purchaseHistory.data.length
            && (
              <div className="flex column justify-between items-center empty-state">
                <CustomIcon icon="empty-state/purchase" />
                <span>No purchase history!</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

CustomerDetails.propTypes = {
  admin: PropTypes.bool,
};

CustomerDetails.defaultProps = {
  admin: false
};

export default CustomerDetails;
