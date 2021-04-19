/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProductCommentView from '../ProductCommentView';
import ProductDetailModal from '../ProductDetailModal';
import ShareProductModal from '../ShareProductModal';
import getProductImageUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import CommentInput from '../CommentInput';
import { canShareProducts } from '../../utils/checkPermission';
import ProductReminder from '../ProductReminder';
import SendReminderModal from '../SendReminderModal';

const options = {
  items: 1,
  nav: true,
  rewind: true,
  autoplay: true,
};

const ProductItem = ({
  product,
  sold,
  openDetailModal,
  toggleProductTagModal
}) => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);
  const [isSendReminderModal, setIsReminderModal] = useState(false);
  const [soldProduct, setSoldProduct] = useState({});

  const toggleDetailModal = () => {
    setIsDetailModal(!isDetailModal);
  };

  const toggleShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  const toggleSendReminderModal = () => {
    setIsReminderModal(!isSendReminderModal);
  };

  const hasImage = (productAssets) => productAssets
    ?.find((asset) => asset.type === 'cover_photo') || productAssets?.find((asset) => asset.type === 'photo');

  const OpenSendReminderModal = (sale) => {
    setSoldProduct(sale);
    toggleSendReminderModal();
  };

  return (
    <>
      <div className="itemBox">
        <div className="topSection">
          <div>
            <IconButton
              size="small"
              className="tag-btn"
              onClick={toggleProductTagModal}
            >
              {Number(product.customersTagged) ? product.customersTagged
                : <CustomIcon icon="tag" />}
            </IconButton>
            <OwlCarousel className="owl-theme" loop nav options={options} items={1}>
              {product?.productAssets?.map((asset) => (
                <div
                  className="item cursor-pointer"
                  key={asset.id}
                  onClick={() => openDetailModal()}
                >
                  <img alt="" src={asset.url} />
                </div>
              ))}
            </OwlCarousel>
            {!hasImage(product.productAssets)
            && (
              <div
                onClick={toggleDetailModal}
                className="item-img-container"
              >
                <img alt="product-img-placeholder" src={getProductImageUrl(product)} />
              </div>
            ) }
          </div>
          <div className="sectionCointent">
            <h4>{getProductName(product)}</h4>
            <p>
              {product.model && <span>{product.model}</span>}
              {product.category && <span>{product.category}</span>}
              {product.manufacturer && <span>{product.manufacturer}</span>}
              {product.modelYear && <span>{product.modelYear}</span> }
              <span>{product.isNew ? 'New' : 'Used' }</span>
            </p>
            <span className="priceBtn">
              {formattedProductPrice(product)}
            </span>
            {canShareProducts()
            && (
              <div className="gridShare" onClick={toggleShareModal}>
                <CustomIcon icon="Mobile_Share" />
                <span>SHARE</span>
              </div>
            )}
          </div>
        </div>
        {sold
        && product.sold.map((sale) => (
          <ProductReminder
            sale={sale}
            OpenSendReminderModal={() => OpenSendReminderModal(sale)}
          />
        ))}
        <div className="bottomSection">
          <ProductCommentView product={product} />
        </div>
        <CommentInput productId={product.id} sold={sold} />
      </div>
      <ProductDetailModal
        isOpen={isDetailModal}
        toggle={toggleDetailModal}
        product={product}
        sold={sold}
        toggleShareModal={toggleShareModal}
      />
      <SendReminderModal
        toggle={toggleSendReminderModal}
        isOpen={isSendReminderModal}
        soldProduct={soldProduct}
        product={product}
      />
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

ProductItem.propTypes = {
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  sold: PropTypes.bool,
  openDetailModal: PropTypes.func,
  toggleProductTagModal: PropTypes.func,
};

ProductItem.defaultProps = {
  sold: false,
  openDetailModal: () => {},
  toggleProductTagModal: () => {}
};

export default ProductItem;
