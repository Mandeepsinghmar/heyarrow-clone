import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Radio,
  IconButton,
  Divider
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { toast } from 'react-toastify';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';
import { getAllProducts, getQuotePreview, markProductsAsQuoted } from '../../api';

import Loader from '../common/Loader';
import { clearAllProducts } from '../../redux/actions';
import getProductPrice, { formattedProductPrice } from '../../utils/getProductPrice';
import QuotePreviewModal from '../../containers/QuotePreview/Modal';
import getProductImgUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import TabPanel from '../common/TabPanel';
import Input from '../common/Input';
import QuoteTemplate from '../QuoteTemplate';
import ConfirmationModal from './ConfrimationModal';
import ProductQuotation from './ProductQuotation';

const CreateQuotedModal = ({
  isOpen,
  toggle,
  ...props
}) => {
  const { allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    page: 1,
  });
  const [shippingPrice] = useState('');
  const [isQuotePreviewModal, setIsQuotePreviewModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [steps, setSteps] = useState([
    {
      value: 'product',
      label: 'Product',
      completed: false,
    },
    {
      value: 'markup',
      label: 'Markup',
      completed: false,
    },
    {
      value: 'message',
      label: 'Message',
      completed: false,
    }
  ]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shipping, setShipping] = useState(0);
  const [quotedPrice, setQuotedPrice] = useState(0);
  const { client } = useSelector((state) => state);
  const { customerId } = useParams();
  const { quotePreview } = useSelector((state) => state.customers);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirmModal, setConfirmModal] = useState(false);

  const toggleConfirmModal = () => {
    setConfirmModal(!isConfirmModal);
  };

  const onChange = (index) => {
    setActiveMenu(index);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllProducts(filters));
    }
  }, [filters, isOpen]);

  useEffect(() => {
    setQuotedPrice(getProductPrice(selectedProducts[0]));
  }, [selectedProducts]);

  const loadMoreProducts = () => {
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };

  const onSearch = debounce((text) => {
    dispatch(clearAllProducts());
    setFilters({
      search: text,
      page: 1
    });
  }, 500);

  const toggleisQuotePreviewModal = () => {
    setIsQuotePreviewModal(!isQuotePreviewModal);
  };

  const next = () => {
    const newStep = { ...steps[activeMenu], completed: true };
    setSteps([...steps.slice(0, activeMenu),
      newStep,
      ...steps.slice(activeMenu + 1)]);
    setActiveMenu(activeMenu + 1);
  };

  const onPreview = () => {
    const body = {
      amount: quotedPrice,
      shipping,
      productId: selectedProducts[0].id,
      customerId
    };
    dispatch(getQuotePreview(body));
    next();
  };

  const previous = () => {
    setActiveMenu(activeMenu - 1);
  };

  const reset = () => {
    toggle();
    setSelectedProducts([]);
    setSubject('');
    setMessage('');
    setShipping(0);
    setActiveMenu(0);
    setSteps([
      {
        value: 'product',
        label: 'Product',
        completed: false,
      },
      {
        value: 'markup',
        label: 'Markup',
        completed: false,
      },
      {
        value: 'message',
        label: 'Message',
        completed: false,
      }
    ]);
  };

  const onSend = () => {
    const body = {
      products: selectedProducts.map(({ form, id }) => ({
        productId: id,
        ...form,
      })),
      customerId,
      via: 2,
      message: {
        subject,
        body: message
      },
      validThru: new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)),
    };
    setSending(true);
    dispatch(markProductsAsQuoted(body)).then(() => {
      toast.success('Quote sent successfully');
    }).catch(() => {
      toast.error('Quote failed!');
    }).finally(() => {
      toggle();
      setSending(false);
      reset();
    });
  };

  const closeQuote = () => {
    toggle();
    toggleConfirmModal();
    reset();
  };

  const addProduct = (product) => {
    setSelectedProducts([
      ...selectedProducts,
      {
        ...product,
        form: {
          amount: getProductPrice(product),
          shipping: 0,
          taxes: 0,
          otherFees: 0,
          discount: 0
        }
      }
    ]);
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts
      .filter((product) => product.id !== productId));
  };

  const isProductSelected = (productId) => selectedProducts
    .find((product) => product.id === productId);

  const onSelectProduct = (product) => {
    if (isProductSelected(product.id)) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  const onQuoteInputChange = (form, index) => {
    setSelectedProducts([
      ...selectedProducts.slice(0, index),
      {
        ...selectedProducts[index],
        form,
      },
      ...selectedProducts.slice(index + 1, selectedProducts.length)
    ]);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggleConfirmModal}
        centered
        className="deal-mode__modal"
      >
        <div className="modal-header">
          <h5 className="modal-title">Create quote</h5>
          <IconButton
            className="cancel modal-close"
            onClick={toggleConfirmModal}
            size="small"
          >
            <CustomIcon icon="Close" />
          </IconButton>
        </div>
        <ModalBody>
          <div className="flex h-full">
            <div className="deal-mode__left-section">
              <FormControl component="fieldset">
                <RadioGroup aria-label="menus" name="menu">
                  {steps.map((step, index) => (
                    <FormControlLabel
                      className={step.selected ? 'selected' : ''}
                      value={step.value}
                      control={(
                        <>
                          {step.completed
                          && (
                            <CustomIcon
                              className="radio-option-done"
                              icon="check"
                              key={step.value}
                            />
                          )}
                          <Radio
                            checked={activeMenu === index}
                            size="small"
                            onChange={() => onChange(index)}
                            hidden={step.completed}
                            disabled={index !== 0
                              && !steps[index - 1]?.completed}
                          />
                        </>
                      )}
                      label={step.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <Divider orientation="vertical" />
            <div className="deal-mode__right-section">
              <TabPanel index={0} value={activeMenu}>
                <div className="action-product-modal__inputs">
                  <SearchInput
                    onChange={(e) => onSearch(e.target.value)}
                    onClear={() => onSearch('')}
                    placeholder="Search and add product"
                  />
                </div>
                <div className="products-list">
                  <InfiniteScroll
                    dataLength={allProducts.data.length}
                    hasMore={allProducts.hasMore}
                    next={loadMoreProducts}
                    loader={<Loader secondary key={0} />}
                    height="380px"
                    endMessage={(
                      <p style={{ textAlign: 'center' }}>
                        <b>No more data</b>
                      </p>
                    )}
                  >
                    {allProducts.data.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center w-100 deal-mode-product-list-item-container"
                        onClick={() => onSelectProduct(product)}
                      >
                        <div className="products-list__item flex-1">
                          <div className="product-list-img">
                            <img alt="" src={getProductImgUrl(product)} />
                          </div>
                          <div className="flex-1">
                            <h3 className="flex justify-between">
                              <span>{getProductName(product)}</span>
                              <span>{formattedProductPrice(product)}</span>
                            </h3>
                            <div>
                              <span className="tag">{product?.category}</span>
                            </div>
                          </div>
                          {isProductSelected(product.id) ? (
                            <CustomIcon
                              className="self-end"
                              icon="Tick"
                            />
                          ) : (
                            <CustomIcon
                              className="self-end"
                              icon="Add"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              </TabPanel>
              <TabPanel index={1} value={activeMenu}>
                <div className="products-list" style={{ height: '430px', overflow: 'auto' }}>
                  {selectedProducts.map((product, index) => (
                    <>
                      <ProductQuotation
                        product={product}
                        onChange={(form) => onQuoteInputChange(form, index)}
                      />
                    </>
                  ))}
                </div>
              </TabPanel>
              <TabPanel index={2} value={activeMenu}>
                <div className="input-group">
                  <Input
                    label="Subject"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <Input
                    label="Message"
                    fullWidth
                    multiline
                    rows="24"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </TabPanel>
              <TabPanel index={3} value={activeMenu}>
                <div className="quote-preview-container">
                  <QuoteTemplate
                    client={client}
                    quotePreview={quotePreview}
                    taxes={selectedProducts
                      .reduce((total,
                        { form }) => total + (form?.taxes || 0), 0)}
                    shipping={selectedProducts.reduce((total,
                      { form }) => total + (form?.shipping || 0), 0)}
                    discount={selectedProducts.reduce((total,
                      { form }) => total + (form?.discount || 0), 0)}
                    otherFees={selectedProducts.reduce((total,
                      { form }) => total + (form?.otherFees || 0), 0)}
                    subTotal={selectedProducts.reduce((total,
                      { form }) => total + (form?.amount || 0), 0)}
                    products={selectedProducts}
                  />
                </div>
              </TabPanel>
              <div className="flex items-center justify-between">
                <div>
                  {activeMenu > 0 && activeMenu !== steps.length
                  && (
                    <Button
                      color="secondary"
                      onClick={previous}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                {activeMenu <= steps.length - 2
                && (
                  <Button
                    className="justify-end"
                    disabled={!selectedProducts.length
                      || (activeMenu === 1 && !quotedPrice)}
                    onClick={next}
                  >
                    Continue
                  </Button>
                )}
                {steps.length - 1 === activeMenu
                  && (
                    <Button
                      onClick={onPreview}
                      disabled={!subject}
                    >
                      Preview Quote
                    </Button>
                  ) }
                {steps.length === activeMenu
                && (
                  <Button
                    onClick={onSend}
                    disabled={sending}
                  >
                    {sending ? 'Sending...'
                      : 'Send to Customer' }
                  </Button>
                ) }
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <QuotePreviewModal
        isOpen={isQuotePreviewModal}
        toggle={toggleisQuotePreviewModal}
        shippingPrice={shippingPrice}
        toggleCreateModal={toggle}
        {...props}
      />
      <ConfirmationModal
        isOpen={isConfirmModal}
        toggle={toggleConfirmModal}
        onConfirm={closeQuote}
      />
    </>
  );
};

CreateQuotedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CreateQuotedModal;
