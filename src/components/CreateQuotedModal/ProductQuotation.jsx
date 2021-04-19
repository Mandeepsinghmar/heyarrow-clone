import React, { useState } from 'react';
import PropTypes from 'prop-types';

import getProductPrice, { formattedProductPrice } from '../../utils/getProductPrice';
import getProductImgUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import moneyFormatter from '../../utils/moneyFormatter';
import calcPercentage from '../../utils/calCulatePercentage';

const ProductQuotation = ({
  product,
  onChange
}) => {
  const [taxes, setTaxes] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [otherFees, setOtherFees] = useState(0);
  const [discount, setDisount] = useState(0);
  const [amount, setAmount] = useState(getProductPrice(product));

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

  const onChangeHandler = (label, value) => {
    const form = {
      taxes,
      shipping,
      otherFees,
      discount,
      amount
    };
    onChange({
      ...form,
      [label]: value
    });
  };

  return (
    <>
      <div className="flex items-center w-100">
        <div className="products-list__item flex-1">
          <div className="product-list-img">
            <img alt="" src={getProductImgUrl(product)} />
          </div>
          <div className="flex-1">
            <h3 className="flex justify-between">
              <span>{getProductName(product)}</span>
              <span>
                {formattedProductPrice(product)}
              </span>
            </h3>
            <div>
              <span className="tag">{product?.category}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="quote-details">
        <div className="quote-detail-item">
          <span>Cost</span>
          <span>
            {!product?.cost && product?.cost !== 0 ? '-' : moneyFormatter.format(product?.cost)}
          </span>
        </div>
        <div className="quote-detail-item">
          <span>{`Listed Price(${calcPercentage(formattedProductPrice(product), product?.wholesalePrice)}%)`}</span>
          <span>
            {formattedProductPrice(product)}
          </span>
        </div>
        <div className="quote-detail-item">
          <span>{`Quoted Price(${calcPercentage(amount, product?.wholesalePrice)}%)`}</span>
          <input
            value={formatMoney(amount)}
            onChange={
              (e) => {
                setAmount(
                  reformatMoney(e.target.value)
                );
                onChangeHandler('amount', reformatMoney(e.target.value));
              }
            }
          />
        </div>
        <div className="quote-detail-item">
          <span>Shipping cost</span>
          <input
            value={formatMoney(shipping)}
            onChange={
              (e) => {
                setShipping(reformatMoney(e.target.value));
                onChangeHandler('shipping', reformatMoney(e.target.value));
              }
            }
          />
        </div>
        <div className="quote-detail-item">
          <span>Discounts</span>
          <input
            value={formatMoney(discount)}
            onChange={
              (e) => {
                setDisount(reformatMoney(e.target.value));
                onChangeHandler('discount', reformatMoney(e.target.value));
              }
            }
          />
        </div>
        <div className="quote-detail-item">
          <span>Taxes</span>
          <input
            value={formatMoney(taxes)}
            onChange={
              (e) => {
                setTaxes(reformatMoney(e.target.value));
                onChangeHandler('taxes', reformatMoney(e.target.value));
              }
            }
          />
        </div>
        <div className="quote-detail-item">
          <span>Other fees</span>
          <input
            value={formatMoney(otherFees)}
            onChange={
              (e) => {
                setOtherFees(reformatMoney(e.target.value));
                onChangeHandler('otherFees', reformatMoney(e.target.value));
              }
            }
          />
        </div>
      </div>
      <div className="quote-detail-item total">
        <span>
          {`Selling Price (${calcPercentage(Number(shipping)
                        + Number(amount)
                        + Number(taxes)
                        + Number(otherFees)
                        + Number(product?.cost)
                        - Number(discount), product?.wholesalePrice)}%)`}
        </span>
        <span>
          {moneyFormatter
            .format(Number(shipping)
                        + Number(amount)
                        + Number(taxes)
                        + Number(otherFees)
                        + Number(product?.cost)
                        - Number(discount))}
        </span>
      </div>
    </>
  );
};

ProductQuotation.propTypes = {
  product: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func
};

ProductQuotation.defaultProps = {
  product: {},
  onChange: () => {},
};

export default ProductQuotation;
