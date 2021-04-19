import React, { useState } from 'react';
import { Divider, SwipeableDrawer, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import getProductImgUrl from '../../utils/getProductImageUrl';
import CustomIcon from '../common/CustomIcon';
import CustomSwitch from '../common/CustomSwitch';
import {
  updateDeal
} from '../../api';
import NewAsset from './NewAsset';
import TradeIn from './TradeIn';
import moneyFormatter from '../../utils/moneyFormatter';
import { updateDealSuccess } from '../../redux/actions';
import DealElementItem from './DealElementItem';
import DocumentPreviewModal from './DocumentPreviewModal';
import EditDealModal from './Modal';

const Deal = ({ deal }) => {
  const [isDrawer, setDrawer] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setDrawer(!isDrawer);
  };
  const [dealForm, setDealForm] = useState({
    dealName: deal.dealName,
    purchaseProducts: deal.purchaseProducts || [],
    tradeProducts: deal.tradeProducts || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModal, setPreviewModal] = useState(false);
  const [includeTradeIn, setIncludeTradeIn] = useState(true);
  const [type, setType] = useState('');
  const [elementId, setElementId] = useState('');
  const {
    customerOverview:
    { customer }
  } = useSelector((state) => state.customers);
  const [isLoaded, setLoaded] = useState(false);
  const [isEditModal, setEditModal] = useState(false);

  const togglePreviewModal = () => {
    setLoaded(true);
    setPreviewModal(!isPreviewModal);
    toggleDrawer();
  };

  const changeDealStatusHandler = (state) => {
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      state
    })).finally(() => {
      setIsSaving(false);
      dispatch(updateDealSuccess({
        ...deal,
        state,
      }));
    });
  };

  const updateTradeIn = (newTradeIn, index) => {
    const newDealForm = {
      ...dealForm,
      tradeProducts: [
        ...dealForm.tradeProducts.slice(0, index),
        {
          ...dealForm.tradeProducts[index],
          ...newTradeIn
        },
        ...dealForm.tradeProducts
          .slice(index + 1, dealForm.tradeProducts.length)
      ]
    };
    setDealForm(newDealForm);
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      tradeProducts: [{
        ...newTradeIn,
        id: dealForm.tradeProducts[index].id
      }],
    })).finally(() => {
      setIsSaving(false);
    });
    dispatch(updateDealSuccess({
      ...deal,
      ...newDealForm
    }));
  };

  const updatePurchaseProducts = (value, index) => {
    const newDealForm = {
      ...dealForm,
      purchaseProducts: [
        ...dealForm.purchaseProducts.slice(0, index),
        {
          ...dealForm.purchaseProducts[index],
          productQuoted: {
            ...dealForm.purchaseProducts[index].productQuoted,
            ...value
          }
        },
        ...dealForm
          .purchaseProducts.slice(index + 1, dealForm.purchaseProducts.length)
      ]
    };
    setDealForm(newDealForm);
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      purchaseProducts: [{
        id: dealForm.purchaseProducts[index].id,
        ...value
      }]
    })).finally(() => {
      setIsSaving(false);
    });
    dispatch(updateDealSuccess({
      ...deal,
      ...newDealForm
    }));
  };

  const openPreviewModal = (previewType, element) => {
    setType(previewType);
    setElementId(element);
    togglePreviewModal();
  };

  const toggleEditModal = () => {
    setEditModal(!isEditModal);
    setDrawer(false);
  };

  return (
    <>
      <div className="deal-category">
        <div
          className="flex justify-between items-start cursor-pointer"
          onClick={toggleDrawer}
        >
          <div>
            <h3 className="deal-category__title">{deal.dealName}</h3>
            <span className="deal-category__subtitle">
              {`Created on ${moment(deal.createdAt).format('MM/DD/YYYY')}`}
            </span>
          </div>
          {deal.state === 'in_progress' && (
            <span className="deal-mode-inprogress">In progress</span>
          )}
          {deal.state !== 'in_progress' && (
            <span className="tag">{deal.state}</span>
          )}
        </div>
        <Divider />
        {deal.purchaseProducts.map(({ deliveryOn, product, ...res }) => (
          <div className="deal-list-item">
            <div className="deal-img">
              <img src={getProductImgUrl(product || res, '/Icons/product-img-small.svg')} alt="deal-img" />
              <span>New Asset</span>
            </div>
            <div className="flex-1 cursor-pointer">
              <h3 className="deal-mode__name">
                <span>{getProductName(product || res)}</span>
                <span>{formattedProductPrice(product || res)}</span>
              </h3>
              {deal.state === 'in_progress'
              && (
                <span className="deal-mode-due">
                  {`Delivery due ${moment(deliveryOn).fromNow()}`}
                </span>
              ) }
            </div>
          </div>
        ))}
        {deal?.tradeProducts?.map(({ productSold, ...res }) => (
          <div className="deal-list-item">
            <div className="deal-img">
              <img src={getProductImgUrl(productSold?.product || res, '/Icons/product-img-small.svg')} alt="deal-img" />
              <span>Trade In</span>
            </div>
            <div className="flex-1">
              <h3 className="deal-mode__name">
                <span>{getProductName(productSold?.product || res)}</span>
                <span>{moneyFormatter.format(productSold?.amount || res)}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>
      <SwipeableDrawer
        anchor="right"
        BackdropProps={{ invisible: true }}
        open={isDrawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        style={{ zIndex: '1000' }}
      >
        <div className="quote-details-drawer deal-mode-container">
          <div className="flex items-center">
            <div className="flex flex-1 justify-between items-start cursor-pointer deal-category">
              <div>
                <h3 className="deal-category__title">{deal?.dealName}</h3>
                <span className="deal-category__subtitle">
                  {`Created on ${moment(deal.createdAt).format('MM/DD/YYYY')}`}
                </span>
              </div>
              {deal.state === 'in_progress' && (
                <span className="deal-mode-inprogress">{!isSaving ? 'In progress' : 'Updating...'}</span>
              )}
              {deal.state !== 'in_progress' && (
                <span className="tag">{deal.state}</span>
              )}
            </div>
            {deal.state === 'in_progress'
            && (
              <UncontrolledDropdown className="moreOptionsCon">
                <DropdownToggle>
                  <IconButton size="small">
                    <CustomIcon icon="more-vertical" />
                  </IconButton>
                </DropdownToggle>
                <DropdownMenu>
                  {/* This is a future feature
                  <DropdownItem onClick={toggleEditModal}>
                    Edit
                  </DropdownItem> */}
                  <DropdownItem onClick={() => changeDealStatusHandler('canceled')}>
                    Cancel Deal
                  </DropdownItem>
                  <DropdownItem onClick={() => changeDealStatusHandler('closed')}>
                    Close Deal
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
            <IconButton size="small" onClick={toggleDrawer}>
              <CustomIcon icon="Close" />
            </IconButton>
          </div>
          <Divider />
          <div className="products-list">
            {dealForm.purchaseProducts.map(({
              product,
              deliveryOn,
              productQuoted,
              ...res
            }, index) => (
              <NewAsset
                deliveryOn={deliveryOn}
                product={product || res}
                showDivider={index + 1 !== deal.purchaseProducts.length}
                productQuoted={productQuoted}
                onChange={(value) => updatePurchaseProducts(value, index)}
                key={res.id}
                disabled={deal.state !== 'in_progress'}
              />
            ))}
            <>
              {!!dealForm.tradeProducts.length
            && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="h3-heading mt-2">Trade in</h3>
                  <CustomSwitch
                    checked={includeTradeIn}
                    onChange={() => setIncludeTradeIn(!includeTradeIn)}
                  />
                </div>
                <Divider />
              </>
            )}
              {dealForm
                .tradeProducts.map(({ id, productSold, allowance }, index) => (
                  <TradeIn
                    productSold={productSold}
                    allowance={allowance}
                    onChange={(value) => updateTradeIn(value, index)}
                    key={id}
                    disabled={deal.state !== 'in_progress'}
                  />
                ))}
              <div className="details-group">
                {dealForm.purchaseProducts.map(({ product, productQuoted }) => (
                  <div key={product?.id} className="quote-detail-item">
                    <span>{getProductName(product)}</span>
                    <span>
                      {moneyFormatter
                        .format(Number(productQuoted?.shipping || 0)
                        + Number(productQuoted?.amount || 0)
                        + Number(productQuoted?.taxes || 0)
                        + Number(productQuoted?.otherFees || 0)
                        - Number(productQuoted?.discount || 0))}
                    </span>
                  </div>
                ))}
                {includeTradeIn
                && dealForm.tradeProducts.map(({ productSold, allowance }) => (
                  <div className="quote-detail-item">
                    <span>{getProductName(productSold?.product)}</span>
                    <span>
                      -
                      {moneyFormatter
                        .format(Number((productSold?.amount || 0)
                        + Number(allowance || 0)))}
                    </span>
                  </div>
                ))}
                <div className="quote-detail-item total">
                  <span>Net Price (-%)</span>
                  {includeTradeIn
                    ? (
                      <span>
                        {
                          moneyFormatter
                            .format(
                              dealForm.purchaseProducts
                                .reduce((
                                  total,
                                  { productQuoted }
                                ) => total
                            + (productQuoted?.amount || 0)
                            + (productQuoted?.shipping || 0)
                            + (productQuoted?.taxes || 0)
                            + (productQuoted?.otherFees || 0)
                            - (productQuoted?.discount || 0),
                                0)
                            - dealForm.tradeProducts.reduce((
                              total,
                              { productSold, allowance = 0 }
                            ) => total + (
                              (productSold.amount || 0) + allowance
                            ),
                            0)
                            )
                        }
                      </span>
                    )
                    : (
                      <span>
                        {moneyFormatter
                          .format(
                            dealForm.purchaseProducts
                              .reduce((
                                total,
                                { productQuoted }
                              ) => total
                            + (productQuoted?.amount || 0)
                            + (productQuoted?.shipping || 0)
                            + (productQuoted?.taxes || 0)
                            + (productQuoted?.otherFees || 0)
                            - (productQuoted?.discount || 0),
                              0)
                          )}
                      </span>
                    )}
                </div>
              </div>
            </>
            <h3 className="h3-heading mt-2">Payment Method</h3>
            <Divider />
            <div className="deal-mode-payment-list">
              {deal.paymentMethods.map((method) => (
                <span key={method?.id} className="tag">{method.name}</span>
              ))}
            </div>
            <h3 className="h3-heading mt-3">Deal elements</h3>
            <Divider />
            <div className="deal-element-list">
              {deal.dealElements.map(({
                dealElement,
                id,
                dealElementsDocs = [],
                ...res
              }) => (
                <DealElementItem
                  dealElement={dealElement || res}
                  id={id}
                  dealElementsDocs={dealElementsDocs}
                  key={id}
                  togglePreviewModal={openPreviewModal}
                  disabled={deal.state !== 'in_progress'}
                />
              ))}
            </div>
          </div>
        </div>
      </SwipeableDrawer>
      <DocumentPreviewModal
        toggle={togglePreviewModal}
        isOpen={isLoaded ? isPreviewModal : false}
        deal={deal}
        includeTradeIn={includeTradeIn}
        type={type}
        elementId={elementId}
        customer={customer}
      />
      <EditDealModal
        isOpen={isEditModal}
        toggle={toggleEditModal}
        editableDeal={deal}
        editMode
      />
    </>
  );
};

Deal.propTypes = {
  deal: PropTypes.objectOf(PropTypes.any),
};

Deal.defaultProps = {
  deal: {},
};

export default Deal;
