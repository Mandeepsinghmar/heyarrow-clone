import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ProfileInitials from '../common/ProfileInitials';
import CustomIcon from '../common/CustomIcon';
import getFullName from '../../utils/getFullName';

const ProductReminder = ({
  sale,
  OpenSendReminderModal
}) => (
  <div className="product-reminder flex align-center justify-between">
    <div className="flex">
      <ProfileInitials
        className="imgCon"
        firstName={sale.customer.firstName}
        lastName={sale.customer.lastName}
        profileUrl={sale.customer.profileUrl}
        profileId={sale.customer.id}
        size="small"
      />
      <span className="product-reminder__text">{`${getFullName(sale.customer)} ${sale.purchaseDate ? `• ${moment(sale.purchaseDate).format('MM/DD/YYYY')}` : ''} ${sale?.productService?.dueDate ? `• Service due ${moment(sale?.productService?.dueDate).fromNow()}` : ''}`}</span>
    </div>
    {sale?.productService
    && (
      <div
        className="product-reminder__button flex justify-center align-center"
        onClick={OpenSendReminderModal}
      >
        <CustomIcon icon="alert/warning" className="pr-1" />
        Send Reminder
      </div>
    ) }
  </div>
);

ProductReminder.propTypes = {
  sale: PropTypes.objectOf(PropTypes.any),
  OpenSendReminderModal: PropTypes.func,
};

ProductReminder.defaultProps = {
  sale: {},
  OpenSendReminderModal: () => {}
};

export default ProductReminder;
