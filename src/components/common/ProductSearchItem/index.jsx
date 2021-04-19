import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import getProductImgUrl from '../../../utils/getProductImageUrl';
import { formattedProductPrice } from '../../../utils/getProductPrice';
import getProductName from '../../../utils/getProductName';
import moneyFormatter from '../../../utils/moneyFormatter';

const ProductSearchItem = ({ product, amount }) => (
  <div className="product-search-list-item">
    <div className="product-search-list-item__img">
      <img src={getProductImgUrl(product)} alt="search-product-img" />
    </div>
    <div className="product-search-list-item__text">
      <div className="product-search-list-item_title">
        <span>{getProductName(product)}</span>
        <span>
          {(amount && moneyFormatter.format(amount))
          || formattedProductPrice(product)}
        </span>
      </div>
      <div className="product-search-list-item_tags">
        {product.model && <span className="tag">{product.model}</span>}
        {product.category && <span className="tag">{product.category}</span>}
        {product.manufacturer && (
          <span className="tag">{product.manufacturer}</span>
        )}
        {product.modelYear && <span className="tag">{product.modelYear}</span>}
      </div>
    </div>
  </div>
);

ProductSearchItem.propTypes = {
  product: PropTypes.objectOf(PropTypes.object).isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

ProductSearchItem.defaultProps = {
  amount: 0
};

export default ProductSearchItem;
