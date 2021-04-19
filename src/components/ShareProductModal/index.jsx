import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Divider, IconButton, Tooltip
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './index.scss';
import { SHARE_OPTIONS, EXTERNAL_PRODUCT_URL } from '../../constants';
import CustomDropDown from '../common/CustomDropdown';
import CustomIcon from '../common/CustomIcon';
import Textarea from '../common/TextArea';
import ListItem from '../common/ListItem';
import Button from '../common/Button';
import SocialShareBtns from '../SocialShareBtns';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import getProductImageUrl from '../../utils/getProductImageUrl';
import getFullName from '../../utils/getFullName';
import { shareProductWithCustomers, getMyCustomers, getAllCustomers } from '../../api';
import AutoComplete from './AutoComplete';
import { clearAllCustomers } from '../../redux/actions';

const ShareProductModal = ({
  isOpen,
  product,
  toggle
}) => {
  const [shareType, setShareType] = useState('email');
  const { currentUser } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const { myCustomers } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const socialPreview = () => (
    <div className="share-product-modal__left">
      <div className="product-preview">
        <div className="product-preview__img">
          <img src={getProductImageUrl(product)} alt="img" />
        </div>
        <h2>{`${getProductName(product)} ${formattedProductPrice(product)}`}</h2>
      </div>
    </div>
  );

  const emailPreview = () => (
    <div className="share-product-modal__left flex">
      <div className="product-preview">
        <h2>{`${getFullName(currentUser)} has shared a product with you.`}</h2>
        <div className="product-preview__img">
          <img src={getProductImageUrl(product)} alt="img" />
        </div>
        <h2>{`${getProductName(product)} ${formattedProductPrice(product)}`}</h2>
        <Divider />
        <span className="product-preview__message">{message || 'There is no message.'}</span>
      </div>
    </div>
  );

  const textPreview = () => (
    <div className="share-product-modal__left">
      <div className="product-preview product-preview__message">
        <div
          className="product-preview__img"
          style={{
            backgroundImage: `url(${getProductImageUrl(product)})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <CustomIcon icon="external" className="external" />
          <div className="product__description">
            <h3>
              {getProductName(product)}
            </h3>
            <span className="priceBtn">
              {formattedProductPrice(product)}
            </span>
          </div>
        </div>
      </div>
      <div className="dialog-arrow">
        <svg width="27" height="16" viewBox="0 0 27 16" fill="none">
          <path d="M0 15C9.2 9.8 11.8333 3.16667 12 0.5L27 8C18.6 14 5.5 15.1667 0 15Z" fill="white" />
        </svg>
      </div>
    </div>
  );

  useEffect(() => {
    if (!myCustomers.data.length && isOpen) {
      dispatch(getMyCustomers());
    }
  }, [isOpen]);

  const renderPreview = () => {
    switch (shareType) {
    case 'text':
      return textPreview();
    case 'social':
      return socialPreview();
    case 'email':
      return emailPreview();
    default:
      return (
        <div className="share-product-modal__left">
          <div className="product-preview">
             &nbsp;
          </div>
        </div>
      );
    }
  };

  const shareProductHandler = () => {
    setIsSharing(true);
    dispatch(shareProductWithCustomers({
      product: product.id,
      ids: selectedCustomers.map((customer) => customer.id),
      message
    }, shareType)).finally(() => {
      setIsSharing(false);
      toggle();
    });
  };

  const onSearch = (e) => {
    dispatch(clearAllCustomers());
    dispatch(getAllCustomers({
      search: e.target.value
    }));
  };

  const addCustomer = (customer) => {
    setSelectedCustomers([...selectedCustomers, customer]);
  };

  const removeCustomer = (customer) => {
    setSelectedCustomers(selectedCustomers
      .filter((selected) => selected.id !== customer.id));
  };

  const isCustomerSelected = (customer) => selectedCustomers
    .find((sel) => sel.id === customer.id);

  const customerClick = (customer) => {
    if (isCustomerSelected(customer)) {
      removeCustomer(customer);
    } else {
      addCustomer(customer);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      centered
      className="share-product-modal"
      toggle={toggle}
    >
      <ModalBody>
        <div className="modalContent">
          {renderPreview()}
          <div className="share-product-modal__right">
            <div className="flex justify-between align-center">
              <CustomDropDown
                data={SHARE_OPTIONS}
                value="email"
                className="share-product-modal__dropdown"
                onChange={(value) => setShareType(value)}
              />
              <div className="flex">
                <Tooltip title={copied ? 'Copied!' : 'Copy product link to share'}>
                  <CopyToClipboard
                    text={`${EXTERNAL_PRODUCT_URL}/${product.id}`}
                    onCopy={() => setCopied(true)}
                    onMouseOver={() => setCopied(false)}
                  >
                    <IconButton
                      size="small"
                    >
                      <CustomIcon icon="link/link-enabled" />
                    </IconButton>
                  </CopyToClipboard>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={toggle}
                >
                  <CustomIcon icon="Close" />
                </IconButton>
              </div>
            </div>
            {shareType === 'social' ? (
              <div className="flex align-center justify-center social-share-container">
                <SocialShareBtns url={`${EXTERNAL_PRODUCT_URL}/${product.id}`} />
              </div>
            )
              : (
                <>
                  <div>
                    <div className="flex column">
                      <Textarea
                        rows={4}
                        placeholder="Write a message (optional)"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        inputProps={{
                          maxlength: 160
                        }}
                      />
                      <span className="word-count self-end">{`${message.length}/160 characters`}</span>
                    </div>
                    <div className="contact-search flex">
                      <AutoComplete
                        selected={selectedCustomers}
                        onChange={setSelectedCustomers}
                        onSearch={onSearch}
                        shareType={shareType}
                      />
                    </div>
                    <div className="contact-list">
                      <h3 className="contact-list__title">Assigned Customers</h3>
                      {myCustomers.data.map((customer) => (
                        <ListItem
                          title={getFullName(customer)}
                          subTitle={shareType === 'email' ? customer.email : customer.phone}
                          profile={customer}
                          key={customer.id}
                          action={() => customerClick(customer)}
                          hideAction={isCustomerSelected(customer)}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    className="share-button"
                    onClick={shareProductHandler}
                    disabled={isSharing}
                  >
                    {isSharing ? 'Sharing...' : 'Share'}
                  </Button>
                </>
              ) }
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

ShareProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  toggle: PropTypes.func.isRequired
};

export default ShareProductModal;
