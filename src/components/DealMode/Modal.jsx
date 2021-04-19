import React,
{
  useState,
  useEffect
} from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  IconButton,
  Divider,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import CustomIcon from '../common/CustomIcon';
import SearchInput from '../common/SearchInput';
import getProductImgUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import Button from '../common/Button';
import TabPanel from '../common/TabPanel';
import Loader from '../common/Loader';
import {
  getAllProducts,
  getCustomerPurchaseHistory,
  getPaymentMethods,
  getDealElemets,
  createDealMode,
  updateDeal,
  getDealById
} from '../../api';
import {
  clearAllProducts,
  updateCustomerOverview,
  updateDealSuccess,
  createDealSuccess
} from '../../redux/actions';
import DealElement from './DealElement';
import getFullName from '../../utils/getFullName';

const DealModal = ({
  isOpen,
  toggle,
  editMode,
  editableDeal
}) => {
  const [steps, setSteps] = useState([
    {
      value: 'product',
      label: 'Product',
      completed: false,
    },
    {
      value: 'trade-in',
      label: 'Trade In (optional)',
      completed: false,
    },
    {
      value: 'payment-method',
      label: 'Payment Method',
      completed: false,
    },
    {
      value: 'deal-elements',
      label: 'Deal Elements',
      completed: false,
    },
    {
      value: 'delivery',
      label: 'Delivery',
      completed: false,
    }
  ]);
  const [activeMenu, setActiveMenu] = useState(0);
  const { allProducts } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    page: 1,
    search: ''
  });
  const dispatch = useDispatch();
  const [
    selectedProducts,
    setSelectedProducts
  ] = useState(editMode ? editableDeal?.purchaseProducts
    .map(({ product, deliveryOn }) => ({
      ...product,
      deliveryOn: moment(deliveryOn).format('YYYY-MM-DD')
    })) : []);
  const [
    selectedSoldProducts,
    setSelectedSoldProducts
  ] = useState(editMode ? editableDeal?.tradeProducts
    .map(({ productSold }) => productSold) : []);
  const [
    selectedPayments,
    setSelectedPayments
  ] = useState(editMode ? editableDeal.paymentMethods : []);
  const [
    selectedDealElements,
    setSelectedDealElements
  ] = useState(editMode ? editableDeal.dealElements : []);
  const { customerId } = useParams();
  const { purchaseHistory } = useSelector((state) => state.customers);
  const { paymentMethods } = useSelector((state) => state.dealMode);
  const { dealElements } = useSelector((state) => state.dealMode);
  const [isAdding, setIsAdding] = useState(false);
  const [customDealElements, setCustomDealElements] = useState([]);
  const [name, setName] = useState('');
  const {
    customerOverview
  } = useSelector((state) => state.customers);
  const [dealName, setDealName] = useState();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setDealName(editMode ? editableDeal.dealName
      : `${getFullName(customerOverview?.customer)}'s Deal Mode`);
  }, [customerOverview]);

  useEffect(() => {
  }, [selectedProducts]);

  const onChange = (index) => {
    setActiveMenu(index);
  };

  const next = () => {
    const newStep = { ...steps[activeMenu], completed: true };
    setSteps([...steps.slice(0, activeMenu),
      newStep,
      ...steps.slice(activeMenu + 1)]);
    setActiveMenu(activeMenu + 1);
  };

  const loadMoreProducts = () => {
    setFilters({
      ...filters,
      page: filters.page + 1,
    });
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllProducts(filters));
    }
  }, [isOpen, filters]);

  useEffect(() => {
    if (customerId && activeMenu === 1) {
      dispatch(getCustomerPurchaseHistory(customerId));
    }
    if (activeMenu === 2 && !paymentMethods.data.length) {
      dispatch(getPaymentMethods());
    }
    if (activeMenu === 3) {
      dispatch(getDealElemets());
    }
  }, [activeMenu]);

  const searchHandler = debounce((text) => {
    dispatch(clearAllProducts());
    setFilters({
      page: 1,
      search: text
    });
  }, 500);

  const isSelected = (product) => selectedProducts
    .find((pr) => pr.id === product.id);

  const isSoldSelected = (soldProduct) => selectedSoldProducts
    .find((sold) => sold.id === soldProduct.id);

  const isPaymentSelected = (payment) => selectedPayments
    .find((py) => py.id === payment.id);

  const isSelectedDealElement = (deal) => selectedDealElements
    .find((dl) => dl?.name === deal?.name);

  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, {
      ...product,
      deliveryOn: moment(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))).format('YYYY-MM-DD')
    }]);
  };

  const addSoldProduct = (soldProduct) => {
    setSelectedSoldProducts([
      ...selectedSoldProducts,
      soldProduct
    ]);
  };

  const addPaymentMethod = (payment) => {
    setSelectedPayments([
      ...selectedPayments,
      payment
    ]);
  };

  const addDealElement = (deal) => {
    setSelectedDealElements([
      ...selectedDealElements,
      deal
    ]);
  };

  const removeProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((pr) => pr.id !== product.id));
  };

  const removeSoldProduct = (soldProduct) => {
    setSelectedSoldProducts(selectedSoldProducts
      .filter((sold) => sold.id !== soldProduct.id));
  };

  const removePaymentMethod = (payment) => {
    setSelectedPayments(selectedPayments.filter((py) => py.id !== payment.id));
  };

  const removeDealElement = (deal) => {
    setSelectedDealElements(selectedDealElements
      .filter((dl) => dl.name !== deal.name));
  };

  const toggleProduct = (product) => {
    if (isSelected(product)) {
      removeProduct(product);
    } else {
      addProduct(product);
    }
  };

  const toggleSoldProduct = (soldProduct) => {
    if (isSoldSelected(soldProduct)) {
      removeSoldProduct(soldProduct);
    } else {
      addSoldProduct(soldProduct);
    }
  };

  const togglePayment = (payment) => {
    if (isPaymentSelected(payment)) {
      removePaymentMethod(payment);
    } else {
      addPaymentMethod(payment);
    }
  };

  const toggleDealElement = (deal) => {
    if (isSelectedDealElement(deal)) {
      removeDealElement(deal);
    } else {
      addDealElement(deal);
    }
  };

  const toggleIsAdding = () => {
    setName('');
    setIsAdding(!isAdding);
  };

  const addNewDealElement = (e) => {
    e.preventDefault();
    setCustomDealElements([
      ...customDealElements,
      {
        isDefault: false,
        name,
      }
    ]);
    setName('');
  };

  const removeCustomDealElement = (deal) => {
    setCustomDealElements(customDealElements.filter((dl) => dl.id !== deal.id));
  };

  const editCustomDealElement = (index, newCustom) => {
    setCustomDealElements([
      ...customDealElements.slice(0, index),
      newCustom,
      ...customDealElements.slice(index + 1, customDealElements.length)
    ]);
  };

  const isDisabled = () => {
    if (activeMenu === 0) {
      return !selectedProducts.length;
    }
    if (activeMenu === 1) {
      return false;
    }

    if (activeMenu === 2) {
      return !selectedPayments.length;
    }

    if (activeMenu === 3) {
      return !selectedDealElements.length;
    }
    return true;
  };

  const onDeliveryDateChange = (index, product) => {
    setSelectedProducts([
      ...selectedProducts.slice(0, index),
      product,
      ...selectedProducts.slice(index + 1, selectedProducts.length)
    ]);
  };

  const resetForm = () => {
    setSteps([
      {
        value: 'product',
        label: 'Product',
        completed: false,
      },
      {
        value: 'trade-in',
        label: 'Trade In (optional)',
        completed: false,
      },
      {
        value: 'payment-method',
        label: 'Payment Method',
        completed: false,
      },
      {
        value: 'deal-elements',
        label: 'Deal Elements',
        completed: false,
      },
      {
        value: 'delivery',
        label: 'Delivery',
        completed: false,
      }
    ]);
    setSelectedDealElements([]);
    setSelectedPayments([]);
    setActiveMenu(0);
    setDealName(`${getFullName(customerOverview?.customer)}'s Deal Mode`);
    setSelectedProducts([]);
    setSelectedSoldProducts([]);
    setName('');
  };

  const onCreate = () => {
    const body = {
      dealName,
      customerId,
      // eslint-disable-next-line no-shadow
      paymentMethods: selectedPayments.map(({ id, name }) => ({
        id,
        name,
      })),
      purchaseProducts: selectedProducts.map(({ id, deliveryOn }) => ({
        productId: id,
        deliveryOn
      })),
      tradeProducts: selectedSoldProducts.map(({ id }) => ({
        productSoldId: id
      })),
      // eslint-disable-next-line no-shadow
      dmElements: selectedDealElements.map(({ name, id, isDefault }) => ({
        name,
        id,
        isDefault
      }))
    };
    setIsCreating(true);
    if (editMode) {
      dispatch(updateDeal(editableDeal.id, body))
        .then(() => {
          dispatch(getDealById(editableDeal.id))
            .then((res) => {
              dispatch(updateDealSuccess(res));
            });
        })
        .finally(() => {
          setIsCreating(false);
          toggle();
        });
    } else {
      dispatch(createDealMode(body))
        .then((result) => {
          dispatch(updateCustomerOverview({
            ...customerOverview,
            counts: {
              ...customerOverview?.counts,
              deal_mode: {
                ...customerOverview?.counts?.deal_mode,
                total: customerOverview?.counts?.deal_mode?.total + 1
              }
            }
          }));
          dispatch(getDealById(result.deal.id))
            .then((res) => {
              dispatch(createDealSuccess(res));
            });
        })
        .finally(() => {
          toggle();
          setIsCreating(false);
          resetForm();
        });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="deal-mode__modal"
    >
      <div className="modal-header">
        <h5 className="modal-title w-100">
          <input
            value={dealName}
            onChange={(e) => setDealName(e.target.value)}
            className="input-element w-100"
            placeholder="Deal name"
          />
        </h5>
        <IconButton
          className="cancel modal-close"
          onClick={toggle}
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
              <SearchInput
                onChange={(e) => searchHandler(e.target.value)}
                onClear={() => searchHandler('')}
              />
              <InfiniteScroll
                dataLength={allProducts.data.length}
                next={loadMoreProducts}
                hasMore={allProducts.hasMore}
                height="380px"
                loader={<Loader secondary />}
                endMessage={(
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                )}
              >
                {editMode
                  ? (
                    <div className="products-list">
                      {[
                        ...selectedProducts,
                        ...allProducts.data
                          .filter((product) => !isSelected(product))
                      ]
                        .map((product) => (
                          <div
                            onClick={() => toggleProduct(product)}
                            key={product.id}
                            className="flex items-center w-100 deal-mode-product-list-item-container"
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
                              {isSelected(product) ? (
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
                    </div>
                  ) : (
                    <div className="products-list">
                      {allProducts.data
                        .map((product) => (
                          <div
                            onClick={() => toggleProduct(product)}
                            key={product.id}
                            className="flex items-center w-100 deal-mode-product-list-item-container"
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
                              {isSelected(product) ? (
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
                    </div>
                  )}
              </InfiniteScroll>
            </TabPanel>
            <TabPanel index={1} value={activeMenu}>
              <InfiniteScroll
                dataLength={allProducts.data.length}
                next={loadMoreProducts}
                hasMore={purchaseHistory.hasMore}
                height="430px"
                loader={<Loader secondary />}
              >
                <div className="products-list">
                  <h3 className="product-list-header">Customer purchase history</h3>
                  <Divider />
                  {purchaseHistory.loading && <Loader secondary />}
                  {!purchaseHistory.loading && !purchaseHistory.data.length
                  && <center>No purchase history</center>}
                  {!purchaseHistory.loading
                  && [...purchaseHistory.data].map((sold) => (
                    <div
                      onClick={() => toggleSoldProduct(sold)}
                      key={sold.id}
                      className="flex items-center w-100 deal-mode-product-list-item-container"
                    >
                      <div className="products-list__item flex-1">
                        <div className="product-list-img">
                          <img alt="" src={getProductImgUrl(sold.product)} />
                        </div>
                        <div className="flex-1">
                          <h3 className="flex justify-between">
                            <span>{getProductName(sold.product)}</span>
                            <span>{formattedProductPrice(sold.product)}</span>
                          </h3>
                          <div>
                            <span className="tag">{sold.product?.category}</span>
                          </div>
                        </div>
                        {isSoldSelected(sold) ? (
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
                </div>
              </InfiniteScroll>
            </TabPanel>
            <TabPanel index={2} value={activeMenu}>
              <div className="flex column" style={{ height: '430px' }}>
                {paymentMethods.loading && <Loader secondary />}
                {!paymentMethods.loading
                && (
                  <FormControl component="fieldset" className="w-100">
                    <FormGroup>
                      {paymentMethods.data.map((method) => (
                        <>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                name="financing"
                                size="small"
                                checked={isPaymentSelected(method)}
                                onChange={() => togglePayment(method)}
                              />
                            )}
                            label={method.name}
                          />
                          <Divider />
                        </>
                      ))}
                    </FormGroup>
                  </FormControl>
                )}
              </div>
            </TabPanel>
            <TabPanel index={3} value={activeMenu}>
              <div style={{ height: '430px' }} className="overflow-auto">
                {dealElements.loading && <Loader secondary />}
                {dealElements.data.map((element) => (
                  <DealElement
                    checked={isSelectedDealElement(element)}
                    onChange={() => toggleDealElement(element)}
                    element={element}
                    isDefault={element.isDefault}
                  />
                ))}
                {customDealElements.map((element, index) => (
                  <DealElement
                    checked={isSelectedDealElement(element)}
                    onChange={() => toggleDealElement(element)}
                    element={element}
                    isDefault={element.isDefault}
                    onDelete={() => removeCustomDealElement(element)}
                    onEdit={(
                      newElement
                    ) => editCustomDealElement(index, newElement)}
                  />
                ))}
                {isAdding
                && (
                  <>
                    <div className="deal-element">
                      <Checkbox size="small" disabled />
                      <form className="w-100" onSubmit={addNewDealElement}>
                        <input
                          className="input-element w-100"
                          placeholder="New type"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </form>
                      <CustomIcon
                        className="cursor-pointer"
                        icon="Close"
                        onClick={toggleIsAdding}
                      />
                    </div>
                    <Divider />
                  </>
                )}
                <div className="flex add-button cursor-pointer" onClick={toggleIsAdding}>
                  <CustomIcon icon="Add" />
                  <span>Add</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel index={4} value={activeMenu}>
              <div className="products-list deal-mode__delivery" style={{ height: '420px', overflow: 'auto' }}>
                {selectedProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center w-100 deal-mode-product-list-item-container">
                    <div className="products-list__item flex-1">
                      <div className="product-list-img">
                        <img alt="" src={getProductImgUrl(product)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="flex justify-between">
                          <span>{getProductName(product)}</span>
                          <span>{formattedProductPrice(product)}</span>
                        </h3>
                        <div style={{ marginTop: '-10px' }}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              label="Deliver on"
                              placeholder="- Deliver on -"
                              value={product.deliveryOn}
                              className="half-size"
                              disableToolbar
                              variant="inline"
                              format="MM-dd-yyyy"
                              margin="normal"
                              onChange={
                                (date) => onDeliveryDateChange(index, {
                                  ...product,
                                  deliveryOn: date
                                })
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
            <div className="flex justify-between self-end">
              <span />
              {activeMenu !== (steps.length - 1)
              && (
                <Button disabled={isDisabled()} onClick={next}>
                  Continue
                </Button>
              ) }
              {activeMenu === (steps.length - 1)
              && (
                <Button
                  onClick={onCreate}
                  disabled={isCreating}
                >
                  {!editMode ? 'Create Deal Mode' : 'Edit Deal Mode'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

DealModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  editableDeal: PropTypes.objectOf(PropTypes.any)
};

DealModal.defaultProps = {
  editMode: false,
  editableDeal: {}
};

export default DealModal;
