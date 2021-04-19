import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.scss';
import getProductImageUrl from '../../../utils/getProductImageUrl';
import getProductName from '../../../utils/getProductName';

const PurchaseHistoryItem = ({
  purchase
}) => (
  <div className="purchase-history-item">
    <div className="purchase-history-item__img">
      <img src={getProductImageUrl(purchase.product)} alt="product-img" />
    </div>
    <div className="purchase-history-item__description">
      <h4 className="purchase-history-item__title">{getProductName(purchase.product)}</h4>
      <span className="purchase-history-item__category">{purchase.product?.category}</span>
      <span className="purchase-history-item__date">{purchase.purchaseDate ? moment(purchase.purchaseDate).format('MM/DD/YYYY') : ''}</span>
    </div>
  </div>
);

PurchaseHistoryItem.propTypes = {
  purchase: PropTypes.objectOf(PropTypes.any).isRequired
};

export default PurchaseHistoryItem;
