import React, { useState } from 'react';
import moment from 'moment';
import { Divider } from '@material-ui/core';
import PropTypes from 'prop-types';

import getProductName from '../../utils/getProductName';
import getProductImgUrl from '../../utils/getProductImageUrl';
import { formattedProductPrice } from '../../utils/getProductPrice';
import moneyFormatter from '../../utils/moneyFormatter';
import calcPercentage from '../../utils/calCulatePercentage';

const NewAsset = ({
  product,
  deliveryOn,
  showDivider,
  productQuoted,
  onChange,
  disabled
}) => {
  const [taxes, setTaxes] = useState(productQuoted?.taxes || 0);
  const [shipping, setShipping] = useState(productQuoted?.shipping || 0);
  const [otherFees, setOtherFees] = useState(productQuoted?.otherFees || 0);
  const [discount, setDisount] = useState(productQuoted?.discount || 0);
  const [amount, setAmount] = useState(productQuoted?.amount || 0);
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

  const onChangeHandler = () => {
    onChange({
      taxes,
      shipping,
      otherFees,
      discount,
      amount
    });
  };

  return (
    <>
      <div className="deal-list-item mb-2">
        <div className="deal-img">
          <img src={getProductImgUrl(product, '/Icons/product-img-small.svg')} alt="deal-img" />
          <span>New Asset</span>
        </div>
        <div className="flex-1 cursor-pointer">
          <h3 className="deal-mode__name">
            <span>{getProductName(product)}</span>
            <span>{formattedProductPrice(product)}</span>
          </h3>
          {disabled
          && (
            <span className="deal-mode-due">
              {`Delivery due ${moment(deliveryOn).fromNow()}`}
            </span>
          )}
        </div>
      </div>
      <div className="quote-detail-item">
        <span>Cost</span>
        <span>{!product.wholesalePrice && product.wholesalePrice !== 0 ? '-' : moneyFormatter.format(product.wholesalePrice)}</span>
      </div>
      <div className="quote-detail-item">
        <span>{`Listed Price(${calcPercentage(formattedProductPrice(product), product.wholesalePrice)}%)`}</span>
        <span>{formattedProductPrice(product)}</span>
      </div>
      <div className="quote-detail-item">
        <span>{`Quoted Price(${calcPercentage(amount, product.wholesalePrice)}%)`}</span>
        <input
          value={formatMoney(amount)}
          onChange={(e) => setAmount(reformatMoney(e.target.value))}
          onBlur={onChangeHandler}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item">
        <span>Shipping Cost</span>
        <input
          value={formatMoney(shipping)}
          onChange={(e) => setShipping(reformatMoney(e.target.value))}
          onBlur={onChangeHandler}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item">
        <span>Discounts</span>
        <input
          value={formatMoney(discount)}
          onChange={(e) => setDisount(reformatMoney(e.target.value))}
          onBlur={onChangeHandler}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item">
        <span>Taxes</span>
        <input
          value={formatMoney(taxes)}
          onChange={(e) => setTaxes(reformatMoney(e.target.value))}
          onBlur={onChangeHandler}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item">
        <span>Other fees</span>
        <input
          value={formatMoney(otherFees)}
          onChange={(e) => setOtherFees(reformatMoney(e.target.value))}
          onBlur={onChangeHandler}
          disabled={disabled}
        />
      </div>
      <div className="quote-detail-item total">
        <span>
          {`Selling Price (${calcPercentage(Number(shipping)
                        + Number(amount)
                        + Number(taxes)
                        + Number(otherFees)
                        - Number(discount), product.wholesalePrice)}%)`}
        </span>
        <span>
          {moneyFormatter
            .format(Number(shipping)
                        + Number(amount)
                        + Number(taxes)
                        + Number(otherFees)
                        - Number(discount))}
        </span>
      </div>
      {showDivider && <Divider />}
    </>
  );
};

NewAsset.propTypes = {
  product: PropTypes.objectOf(PropTypes.any),
  deliveryOn: PropTypes.string,
  showDivider: PropTypes.bool,
  productQuoted: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

NewAsset.defaultProps = {
  product: {},
  deliveryOn: '',
  showDivider: false,
  productQuoted: {},
  onChange: () => {},
  disabled: false
};

export default NewAsset;
