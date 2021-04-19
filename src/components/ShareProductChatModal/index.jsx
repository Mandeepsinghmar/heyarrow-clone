import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Divider,
  IconButton,
  Checkbox
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import Textarea from '../common/TextArea';
import Button from '../common/Button';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import getProductImageUrl from '../../utils/getProductImageUrl';
import getFullName from '../../utils/getFullName';
import { shareProduct, getAllProducts } from '../../api';
import SearchInput from '../common/SearchInput';
import { clearAllProducts, postMessageSuccess } from '../../redux/actions';
import Loader from '../common/Loader';
import CustomDropDown from '../common/CustomDropdown';
import { EXTERNAL_PRODUCT_URL } from '../../constants';

const SHARE_OPTIONS = [{
  label: 'Share via Email',
  value: 'email'
},
{
  label: 'Share via Message',
  value: 'text',
}];

const ShareProductChatModal = ({
  isOpen,
  toggle,
  chat,
  updateChatList
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const { allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [isSharing, setIsSharing] = useState(false);
  const { customerId, userId, groupId } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shareType, setShareType] = useState('email');
  const [filters, setFilters] = useState({
    page: 1
  });

  const shareProductHandler = () => {
    setIsSharing(true);
    dispatch(shareProduct({
      type: chat ? 'text' : shareType,
      products: selectedProducts.map((product) => product.id),
      customerId,
      userId,
      groupId,
      message
    })).then(() => {
      setIsSharing(false);
      toggle();
      if (chat) {
        selectedProducts.forEach((product) => {
          const preMessage = {
            fromUserId: currentUser.id,
            fromUser: currentUser,
            message: `${message}${EXTERNAL_PRODUCT_URL}/${product.id}`,
            toCustomerId: customerId,
            toUserId: userId,
            toGroupId: groupId,
            created_at: new Date()
          };
          dispatch(postMessageSuccess(preMessage));
        });
        updateChatList(`${message}${EXTERNAL_PRODUCT_URL}/${selectedProducts[selectedProducts.length - 1].id}`);
      }
      setSelectedProducts([]);
    });
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllProducts(filters));
    }
  }, [filters, isOpen]);

  const onSearchProduct = debounce((text) => {
    dispatch(clearAllProducts());
    setFilters({
      ...filters,
      search: text,
      page: 1
    });
  }, 500);

  const addProduct = (product) => {
    setSelectedProducts([
      ...selectedProducts,
      product
    ]);
  };

  const removeProduct = (product) => {
    setSelectedProducts(
      selectedProducts.filter((pr) => pr.id !== product.id)
    );
  };

  const isSelected = (product) => selectedProducts
    .find((pr) => pr.id === product.id);

  const onCheck = (product) => {
    if (isSelected(product)) {
      removeProduct(product);
    } else {
      addProduct(product);
    }
  };

  const loadMoreProducts = () => {
    setFilters({
      ...filters,
      page: filters.page + 1,
    });
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
          <div className="share-product-modal__left flex">
            {selectedProducts.length
              ? (
                <div className="product-preview">
                  <h2>{`${getFullName(currentUser)} has shared a product with you.`}</h2>
                  <div className="product-preview__img">
                    <img src={getProductImageUrl(selectedProducts[0])} alt="img" />
                  </div>
                  <h2>{`${getProductName({})} ${formattedProductPrice(selectedProducts[0])}`}</h2>
                  <Divider />
                  <span className="product-preview__message">{message || 'There is no message.'}</span>
                </div>
              ) : (
                <div className="product-preview no-product">
                  <div className="product-preview__img no-product">
                    <img src="/images/purchase-history.svg" alt="img" />
                    <span>Select product to see the preview</span>
                  </div>
                </div>
              ) }
          </div>
          <div className="share-product-modal__right">
            <div className="flex justify-between align-center share-product-modal__header">
              {chat
                ? <h3>Share via Message</h3> : (
                  <CustomDropDown
                    data={SHARE_OPTIONS}
                    value={shareType}
                    className="share-product-modal__dropdown"
                    onChange={(value) => setShareType(value)}
                  />
                )}
              <div className="flex">
                <IconButton
                  size="small"
                  onClick={toggle}
                >
                  <CustomIcon icon="Close" />
                </IconButton>
              </div>
            </div>
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
                <div className="share-product__madal_search">
                  <SearchInput
                    onChange={(e) => onSearchProduct(e.target.value)}
                    onClear={() => onSearchProduct('')}
                  />
                </div>
                <InfiniteScroll
                  dataLength={allProducts.data.length}
                  next={loadMoreProducts}
                  hasMore={allProducts.hasMore}
                  height="300px"
                  loader={<Loader secondary />}
                  endMessage={(
                    <p style={{ textAlign: 'center' }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  )}
                >
                  <div>
                    {allProducts.data.map((product) => (
                      <div className="share-product-list-item flex">
                        <Checkbox
                          onChange={() => onCheck(product)}
                          checked={isSelected(product)}
                        />
                        <div className="product-img">
                          <img
                            src={getProductImageUrl(product, '/images/purchase-history.svg')}
                            alt=""
                            className={!product.productAssets?.length ? 'no-image' : ''}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between product-name">
                            <span>{getProductName(product)}</span>
                            <span>{formattedProductPrice(product)}</span>
                          </div>
                          <div>
                            {product.model && <span className="tag">{product.model}</span>}
                            {product.category
                              && <span className="tag">{product.category}</span>}
                            {product.manufacturer
                              && <span className="tag">{product.manufacturer}</span>}
                            {product.modelYear
                              && <span className="tag">{product.modelYear}</span> }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {!!selectedProducts.length && <div className="selected-products">{`${selectedProducts.length} product(s) selected`}</div>}
                </div>
                <Button
                  className="share-button"
                  onClick={shareProductHandler}
                  disabled={isSharing || !selectedProducts.length}
                >
                  {isSharing ? 'Sharing...' : 'Share'}
                </Button>
              </div>
            </>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

ShareProductChatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  chat: PropTypes.bool,
  updateChatList: PropTypes.func
};

ShareProductChatModal.defaultProps = {
  chat: false,
  updateChatList: () => {}
};

export default ShareProductChatModal;
