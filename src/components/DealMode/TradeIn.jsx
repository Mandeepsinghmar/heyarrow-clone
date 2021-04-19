import React, { useState } from 'react';
import PropTypes from 'prop-types';

import getProductName from '../../utils/getProductName';
import getProductImgUrl from '../../utils/getProductImageUrl';
import moneyFormatter from '../../utils/moneyFormatter';

const TradeIn = ({
  productSold,
  allowance,
  onChange,
  disabled
}) => {
  const [innerAllowance, setAllowance] = useState(allowance);
  const reformatMoney = (money) => {
    if (money === '$') {
      return '';
    }
    return Number(money.replaceAll(/[^0-9.]/g, ''));
  };
  const formatMoney = (money) => {
    if (money === '') {
      return money;
    }
    return moneyFormatter.format(money);
  };
  return (
    <>
      <div className="deal-list-item mb-2">
        <div className="deal-img">
          <img
            src={getProductImgUrl(productSold?.product, '/Icons/product-img-small.svg')}
            alt="deal-img"
          />
          <span>Trade In</span>
        </div>
        <div className="flex-1">
          <h3 className="deal-mode__name">
            <span>{getProductName(productSold?.product)}</span>
            <span>
              {moneyFormatter.format(productSold?.amount)}
            </span>
          </h3>
        </div>
      </div>
      <div className="quote-detail-item">
        <span>Trade In (Book Price)</span>
        <span>{moneyFormatter.format(productSold?.amount)}</span>
      </div>
      <div className="quote-detail-item">
        <span>Allowance</span>
        <input
          value={formatMoney(innerAllowance)}
          onChange={(e) => setAllowance(reformatMoney(e.target.value))}
          onBlur={() => onChange({
            allowance: innerAllowance,
          })}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item">
        <span>Trade Value (To Customer)</span>
        <span>
          {moneyFormatter
            .format(Number(productSold.amount) + Number(innerAllowance))}
        </span>
      </div>
    </>
  );
};

TradeIn.propTypes = {
  productSold: PropTypes.objectOf(PropTypes.any),
  allowance: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

TradeIn.defaultProps = {
  productSold: {},
  allowance: 0,
  onChange: () => {},
  disabled: false
};

export default TradeIn;
