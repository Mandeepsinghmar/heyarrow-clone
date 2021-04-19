import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProductCommentView from '../ProductCommentView';
import CommentInput from '../CommentInput';
import ShareProductModal from '../ShareProductModal';
import getProductImageUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import { canShareProducts } from '../../utils/checkPermission';
import ProductReminder from '../ProductReminder';

const ProductListItem = ({
  product,
  sold,
  toggleProductTagModal
}) => {
  const [isShareModal, setIsShareModal] = useState(false);

  const toggleShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  return (
    <>
      <div className="sold-product-item column">
        <div className="flex sold-product-item__details">
          <div className="sold-product-item__img">
            <img src={getProductImageUrl(product)} alt="product_photo" />
          </div>
          <div className="flex column flex-1">
            <h4 className="flex justify-between sold-product-item__title">
              <span>{getProductName(product)}</span>
              <span>{formattedProductPrice(product)}</span>
            </h4>
            <div className="flex">
              <div className="sold-product-item__props">
                <span>MODEL</span>
                <span>{product.model}</span>
              </div>
              <div className="sold-product-item__props">
                <span>CATEGORY</span>
                <span>{product.category}</span>
              </div>
              <div className="sold-product-item__props">
                <span>MAKE</span>
                <span>{product.manufacturer}</span>
              </div>
              <div className="sold-product-item__props">
                <span>TYPE</span>
                <span>Used</span>
              </div>
              <div className="sold-product-item__props">
                <span>YEAR</span>
                <span>{product.modelYear}</span>
              </div>
            </div>
            <div className="self-end sold-product-item__button">
              <IconButton
                size="small"
                onClick={toggleProductTagModal}
                className="list-tag-btn"
              >
                {Number(product.customersTagged) ? product.customersTagged
                  : <CustomIcon icon="tag" />}
              </IconButton>
              {canShareProducts()
            && (
              <IconButton
                size="small"
                onClick={toggleShareModal}
              >
                <CustomIcon
                  icon="share-disabled"
                  onMouseOver={(e) => { e.target.src = './Icons/share-enabled.svg'; }}
                  onMouseLeave={(e) => { e.target.src = './Icons/share-disabled.svg'; }}
                />
              </IconButton>
            )}
            </div>
          </div>
        </div>
        {sold
        && product.sold.map((sale) => (
          <ProductReminder sale={sale} />
        ))}
        <div className="sold-product-item__footer">
          <ProductCommentView product={product} />
        </div>
        <CommentInput productId={product.id} sold={sold} />
      </div>
      {canShareProducts()
      && (
        <ShareProductModal
          isOpen={isShareModal}
          toggle={toggleShareModal}
          product={product}
        />
      )}
    </>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  sold: PropTypes.bool,
  toggleProductTagModal: PropTypes.func,
};

ProductListItem.defaultProps = {
  sold: false,
  toggleProductTagModal: () => {}
};

export default ProductListItem;
