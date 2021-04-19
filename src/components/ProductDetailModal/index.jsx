/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { IconButton, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import Comment from '../Comment';
import ProfileInitials from '../common/ProfileInitials';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import { addProductComment } from '../../api';
import { canShareProducts } from '../../utils/checkPermission';
import getFullName from '../../utils/getFullName';
import SendReminderModal from '../SendReminderModal';

const options = {
  items: 1,
  nav: false,
  rewind: true,
  autoplay: false,
  loop: true
};

const ProductDetailModal = ({
  isOpen,
  toggle,
  product,
  sold,
  toggleShareModal
}) => {
  const inputEl = useRef(null);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const [commentBody, setCommentBody] = useState('');
  const [soldProduct, setSoldProduct] = useState({});
  const [isSendReminderModal, setIsReminderModal] = useState(false);

  const jumpTo = (position) => {
    inputEl.current.to(position, 200, true);
    setTimeout(() => {
      setCurrent(position);
    }, 200);
  };

  const findPdfFile = (type) => {
    if (!product.productAssets || !product.productAssets.length) {
      return false;
    }
    return product.productAssets.find((asset) => asset.type === type)
      ?.url;
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    dispatch(addProductComment({
      comment: commentBody,
      productId: product.id
    }, sold ? 'soldProducts' : 'availableProducts', product.id));
    setCommentBody('');
  };

  const toggleSendReminderModal = () => {
    setIsReminderModal(!isSendReminderModal);
  };

  const OpenSendReminderModal = (sale) => {
    setSoldProduct(sale);
    toggleSendReminderModal();
  };

  return (
    <>
      <Modal
        className="postDetailModal"
        isOpen={isOpen}
      >
        <ModalBody>
          <div className="postDetailCon">
            <div className="postDetailSlider">
              <div className="itemBox">
                <div className="topSection">
                  <OwlCarousel
                    className="owl-theme"
                    {...options}
                    ref={inputEl}
                    startPosition={current}
                  >
                    {product?.productAssets?.filter((asset) => asset.type === 'cover_photo'
                    || asset.type === 'other_photo'
                    || asset.type === 'photo').map((asset) => (
                      <div className="item" key={asset.id}>
                        <img alt="img-alt" src={asset?.url} />
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
                <div className="product-thumbnails flex-wrap">
                  {product?.productAssets?.filter((asset) => asset.type === 'cover_photo'
                  || asset.type === 'other_photo'
                  || asset.type === 'photo').map((asset, index) => (
                    <div
                      key={asset.id}
                      onClick={() => jumpTo(index)}
                      className={`product-thumbnail__img cursor-pointer ${current === index ? 'active' : ''}`}
                    >
                      <img src={asset?.url} alt="product-thumbnail" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="postDetailContent">
              <div className="flex justify-between postDetailContent__header">
                <h4>Product Details</h4>
                <i className="closeBtn" onClick={toggle}>
                  <CustomIcon icon="Close" />
                </i>
              </div>
              <Divider />
              <div className="sectionCointent">
                <div className="flex justify-between">
                  <h5>
                    {getProductName(product)}
                  </h5>
                  <h5 className="priceBtn">
                    {formattedProductPrice(product)}
                  </h5>
                </div>
                <div className="postDetailContent__props">
                  <div className="postDetailContent__props-group">
                    <div className="postDetailContent__props__item">
                      <span>YEAR</span>
                      <span>{product.modelYear}</span>
                    </div>
                    <Divider orientation="vertical" />
                    <div className="postDetailContent__props__item">
                      <span>Category</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                  <div className="postDetailContent__props-group">
                    <div className="postDetailContent__props__item">
                      <span>Make</span>
                      <span>{product.manufacturer}</span>
                    </div>
                    <div className="postDetailContent__props__item">
                      <span>MODEL</span>
                      <span>{product.model}</span>
                    </div>
                  </div>
                </div>
                <div className="flex pdf-files">
                  {findPdfFile('brochure') && (
                    <a
                      className="flex pdf-file-item"
                      href={findPdfFile('brochure')}
                    >
                      <CustomIcon icon="Pdf-File" />
                      <span className="pdf-file-name">Brochure</span>
                    </a>
                  )}
                  {findPdfFile('report') && (
                    <a
                      className="flex pdf-file-item"
                      href={findPdfFile('report')}
                    >
                      <CustomIcon icon="Pdf-File" />
                      <span className="pdf-file-name">Report</span>
                    </a>
                  )}
                </div>
                {canShareProducts()
              && (
                <div className="gridShare" onClick={toggleShareModal}>
                  <CustomIcon icon="Mobile_Share" />
                  <span>SHARE</span>
                </div>
              ) }
              </div>
              <div className="infoSection">
                <h4>Additional Information</h4>
                <p>
                  {ReactHtmlParser(product.description)}
                </p>
              </div>
              { sold
            && (
              <div className="sold-to">
                <div className="sold-to__title">
                  <h4>Sold to</h4>
                </div>
                <Divider />
                {product.sold?.map((sale) => (
                  <div className="sold-to__profile">
                    <div className="sold-to__profile-name">
                      <ProfileInitials
                        className="imgCon"
                        firstName={sale.customer.firstName}
                        lastName={sale.customer.lastName}
                        profileUrl={sale.customer.profileUrl}
                        profileId={sale.customer.id}
                        size="small"
                      />
                      <div className="flex-1 sold-to__profile-text">
                        <span>{getFullName(sale.customer)}</span>
                        <span>{moment(sale.purchaseDate).format('MM/DD/YYYY')}</span>
                      </div>
                    </div>
                    {sale?.productService
                    && (
                      <div className="flex column items-end">
                        <span>{`Service due ${moment(sale?.productService?.dueDate).fromNow()}`}</span>
                        <div className="sold-to__title-reminder" onClick={() => OpenSendReminderModal(sale)}>
                          <CustomIcon icon="alert/warning" />
                          <span>Send reminder</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) }
              <div className="infoSection">
                <h4>Comments</h4>
                <div className="bottomSection comment-list">
                  {product?.comments?.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      productId={product.id}
                    />
                  ))}
                </div>
              </div>
              <form className="messageBox">
                <input
                  type="text"
                  placeholder="Post a comment or @reply"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                />
                <div className="">
                  <IconButton
                    size="small"
                    onClick={addCommentHandler}
                    type="submit"
                    disabled={!commentBody}
                  >
                    <CustomIcon icon="Send-Enabled" />
                  </IconButton>
                </div>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <SendReminderModal
        toggle={toggleSendReminderModal}
        isOpen={isSendReminderModal}
        soldProduct={soldProduct}
        product={product}
      />
    </>
  );
};

ProductDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  sold: PropTypes.bool,
  toggleShareModal: PropTypes.func
};

ProductDetailModal.defaultProps = {
  isOpen: false,
  sold: false,
  toggleShareModal: () => {}
};

export default ProductDetailModal;
