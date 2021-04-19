import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { useDispatch, connect, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Divider } from '@material-ui/core';
import { CheckCircle, RadioButtonUnchecked } from '@material-ui/icons';
import moment from 'moment';
import {
  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown
} from 'reactstrap';
import CustomIcon from '../../../components/common/CustomIcon';
import LabelValuePair from '../../../components/common/LabelValuePair';
import formatter from '../../../utils/moneyFormatter';
import {
  getDealById, createDocumentForDeal, uploadDocumentForDeal,
  updateDealState
} from '../../../api/adminCustomers';
import getProductName from '../../../utils/getProductName';
import { DEAL_MODE_STATUSES, GOOGLE_STORAGE } from '../../../constants';
import DocumentPreviewModal from '../../../components/DealMode/DocumentPreviewModal';

function EditableStyledInput({ inputVal, onChangeCallback }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(inputVal);
  }, [inputVal]);
  return (
    <input
      value={formatter.format(value)}
      onChange={(e) => {
        const val = e.target.value.replaceAll(/[^0-9.]/g, '');
        setValue(val);
        onChangeCallback(val);
      }}
    />
  );
}

EditableStyledInput.propTypes = {
  inputVal: PropTypes.number.isRequired,
  onChangeCallback: PropTypes.func.isRequired
};

function DealModeDrawer({
  isOpen, onClose, deal, dealId
}) {
  const [open, setOpen] = useState(isOpen);
  const [quotedValues, setQuotedValues] = useState([]);
  const [tradeAllowance, setTradeAllowance] = useState([]);
  const [isModal, setModal] = useState(false);
  const { customer } = useSelector(
    (state) => state.adminCustomer.adminCustomerSide
  );
  const [docType, setDocType] = useState('');
  const [elementId, setElementId] = useState('');

  const toggleModal = () => {
    setModal(!isModal);
  };
  const dispatch = useDispatch();
  const fetchDealById = async () => {
    if (dealId) {
      dispatch(getDealById(dealId));
    }
  };
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    fetchDealById();
  }, [dealId]);
  useEffect(() => {
    const quoteValues = deal?.purchaseProducts?.map((newAsset) => {
      const { productQuoted } = newAsset;
      return {
        id: productQuoted?.id,
        amount: productQuoted?.amount || '0',
        shipping: productQuoted?.shipping || '0',
        discount: productQuoted?.discount || '0',
        taxes: productQuoted?.taxes || '0',
        otherFees: productQuoted?.otherFees || '0'
      };
    });
    setQuotedValues(quoteValues);

    const allowanceValues = deal?.tradeProducts?.map((tradeIn) => (
      {
        id: tradeIn?.id,
        allowance: tradeIn?.allowance || '0'
      }
    ));
    setTradeAllowance(allowanceValues);
  }, [deal]);
  // eslint-disable-next-line no-unused-vars
  const createDealElement = (id, type) => {
    const productQuotedIds = [];
    deal.purchaseProducts.forEach((product) => {
      if (product.productQuotedId) {
        productQuotedIds.push(product.productQuotedId);
      }
    });
    const createApi = async () => {
      const resp = await dispatch(
        createDocumentForDeal(id, type, productQuotedIds)
      );
      if (resp.status === 200) {
        fetchDealById();
      }
    };
    createApi();
  };
  const fileChange = (id, file) => {
    if (file) {
      const uploadFile = async () => {
        try {
          const resp = await dispatch(uploadDocumentForDeal(id, file));
          if (resp.status === 200) {
            fetchDealById();
            return;
          }
          toast.error(resp?.response?.data?.message || resp?.response?.data?.error || 'Something went wrong!');
        } catch (err) {
          toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Something went wrong!');
        }
      };
      uploadFile();
    }
  };
  const updateDealStatus = (status) => {
    const updateStatus = async () => {
      const resp = await dispatch(updateDealState(dealId, status));
      if (resp.status === 200) {
        fetchDealById();
      }
    };
    updateStatus();
  };
  const updateQuoteInputValue = (val, id, type) => {
    const ind = quotedValues.findIndex(
      (item) => item.id === id
    );
    const currentVal = quotedValues[ind];
    currentVal[type] = val;
    quotedValues[ind] = currentVal;
    setQuotedValues(quotedValues);
  };
  const updateAllowanceInputValue = (val, id, type) => {
    const ind = tradeAllowance.findIndex(
      (item) => item.id === id
    );
    const currentVal = tradeAllowance[ind];
    currentVal[type] = val;
    tradeAllowance[ind] = currentVal;
    setTradeAllowance(tradeAllowance);
  };

  const openModal = (id, type) => {
    setDocType(type);
    setElementId(id);
    toggleModal();
  };

  return (
    <div className={open ? 'deal__opened' : 'deal__closed'}>
      <div className="drawer">
        <div className="innerDrawerCon">
          <div className="deal-category">
            <div className="flex justify-between align-items-center title">
              <div>
                <h3 className="deal-category__title">
                  {/* {`${deal?.dealName?.firstName} ${deal?.lastName}`} */}
                  {`${deal.dealName ? deal.dealName : ''}`}
                </h3>
                <div className="deal-category__subtitle">
                  <span>Created on </span>
                  {moment(deal?.createdAt).format('MM/DD/YYYY')}
                </div>
              </div>
              <div className="flex flex-end">
                <span
                  className={
                    `${deal?.state === 'in_progress' ? 'deal-mode-inprogress' : 'deal-mode-cancelled'} status`
                  }
                >
                  { DEAL_MODE_STATUSES.find(
                    (status) => status.value === deal?.state
                  )?.label }
                </span>
                <UncontrolledDropdown className="moreOptionsCon status">
                  <DropdownToggle className="moreLeads">
                    <button type="button">
                      <CustomIcon icon="Header/Icon/More" />
                    </button>
                  </DropdownToggle>
                  {
                    deal?.state === 'in_progress'
                      ? (
                        <DropdownMenu>
                          <DropdownItem onClick={() => updateDealStatus('canceled')}>
                            Cancel Deal
                          </DropdownItem>
                          <DropdownItem onClick={() => updateDealStatus('closed')}>
                            Close Deal
                          </DropdownItem>
                        </DropdownMenu>
                      )
                      : (
                        <DropdownMenu>
                          <DropdownItem onClick={() => updateDealStatus('in_progress')}>
                            Reopen
                          </DropdownItem>
                        </DropdownMenu>
                      )
                  }
                </UncontrolledDropdown>
                <button
                  className="status"
                  type="button"
                  onClick={onClose}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            <Divider />
            <div className="subsection">
              <h3 className="deal-category__title">New Assets</h3>
            </div>
            <Divider />
            <div className="subsection">
              { deal?.purchaseProducts?.map((newAsset) => {
                const { id, product, productQuoted } = newAsset;
                const { price, productAssets } = product;
                const dueIn = moment(
                  newAsset?.deliveryOn
                ).diff(moment(), 'days');
                return (
                  <div key={id}>
                    <div className="deal-list-item">
                      <div className="deal-img">
                        <img src={productAssets.length > 0 && productAssets[0]?.url} alt="deal-img" />
                      </div>
                      <div className="flex-1">
                        <div className="deal-mode__name">
                          <span>
                            {getProductName(product)}
                          </span>
                          <span>
                            {formatter.format(price)}
                          </span>
                        </div>
                        <span className="deal-mode-due">
                          {`Delivery due in ${dueIn} days`}
                        </span>
                      </div>
                    </div>
                    <div className="spacer">
                      <LabelValuePair label="Cost" value="-" />
                      <LabelValuePair label="Listed Price" value={formatter.format(price)} />
                      {
                        deal?.state === 'in_progress' && productQuoted?.id
                          ? (
                            <>
                              <LabelValuePair
                                label="Quoted Price"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      quotedValues?.find(
                                        (item) => item?.id === productQuoted?.id
                                      )?.amount
                                    }
                                    onChangeCallback={
                                      (val) => updateQuoteInputValue(val, productQuoted?.id, 'amount')
                                    }
                                  />
                                )}
                              />
                              <LabelValuePair
                                label="Shipping Cost"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      quotedValues?.find(
                                        (item) => item?.id === productQuoted?.id
                                      )?.shipping
                                    }
                                    onChangeCallback={
                                      (val) => updateQuoteInputValue(val, productQuoted?.id, 'shipping')
                                    }
                                  />
                                )}
                              />
                              <LabelValuePair
                                label="Discounts"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      quotedValues?.find(
                                        (item) => item?.id === productQuoted?.id
                                      )?.discount
                                    }
                                    onChangeCallback={
                                      (val) => updateQuoteInputValue(val, productQuoted?.id, 'discount')
                                    }
                                  />
                                )}
                              />
                              <LabelValuePair
                                label="Taxes"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      quotedValues?.find(
                                        (item) => item?.id === productQuoted?.id
                                      )?.taxes
                                    }
                                    onChangeCallback={
                                      (val) => updateQuoteInputValue(val, productQuoted?.id, 'taxes')
                                    }
                                  />
                                )}
                              />
                              <LabelValuePair
                                label="Other Fees"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      quotedValues?.find(
                                        (item) => item?.id === productQuoted?.id
                                      )?.otherFees
                                    }
                                    onChangeCallback={
                                      (val) => updateQuoteInputValue(val, productQuoted?.id, 'otherFees')
                                    }
                                  />
                                )}
                              />
                            </>
                          ) : (
                            <>
                              <LabelValuePair
                                label="Quoted Price"
                                value={
                                  productQuoted && productQuoted.amount !== ''
                                    ? formatter.format(productQuoted.amount) : '-'
                                }
                              />
                              <LabelValuePair
                                label="Shipping Cost"
                                value={
                                  productQuoted && productQuoted.shipping !== ''
                                    ? formatter.format(productQuoted.shipping) : '-'
                                }
                              />
                              <LabelValuePair
                                label="Discounts"
                                value={
                                  productQuoted && productQuoted.discount !== ''
                                    ? formatter.format(productQuoted.discount) : '-'
                                }
                              />
                              <LabelValuePair
                                label="Taxes"
                                value={
                                  productQuoted && productQuoted.taxes !== ''
                                    ? formatter.format(productQuoted.taxes) : '-'
                                }
                              />
                              <LabelValuePair
                                label="Other Fees"
                                value={
                                  productQuoted && productQuoted.otherFees !== ''
                                    ? formatter.format(productQuoted.otherFees) : '-'
                                }
                              />
                            </>
                          )
                      }
                      <div className="selling-price">
                        <LabelValuePair
                          label="Selling Price"
                          value={
                            productQuoted
                              ? formatter.format(productQuoted.amount
                                + productQuoted.shipping
                                + productQuoted.taxes
                                + productQuoted.otherFees
                                - productQuoted.discount)
                              : '-'
                          }
                        />
                      </div>
                    </div>
                    <Divider />
                  </div>
                );
              })}
            </div>
            <div>
              {
                deal?.state === 'in_progress'
                && (
                  <>
                    <div className="subsection">
                      <h3 className="deal-category__title">Trade in deal</h3>
                    </div>
                    <Divider />
                    <div className="subsection">
                      { deal?.tradeProducts?.map((tradeProduct) => {
                        const { id, productSold, allowance } = tradeProduct;
                        const { amount, product } = productSold;
                        const { productAssets } = product;
                        return (
                          <div key={id}>
                            <div className="deal-list-item">
                              <div className="deal-img">
                                <img src={productAssets.length > 0 && productAssets[0].url} alt="deal-img" />
                              </div>
                              <div className="flex-1">
                                <h3 className="deal-mode__name">
                                  <span>
                                    {getProductName(productSold.product)}
                                  </span>
                                  <span>
                                    {formatter.format(amount)}
                                  </span>
                                </h3>
                              </div>
                            </div>
                            <div className="spacer">
                              <LabelValuePair label="Trade In (Book Price)" value={formatter.format(amount)} />
                              <LabelValuePair
                                label="Allowance"
                                valueComp={(
                                  <EditableStyledInput
                                    inputVal={
                                      tradeAllowance?.find(
                                        (item) => item?.id === id
                                      )?.allowance
                                    }
                                    onChangeCallback={
                                      (val) => updateAllowanceInputValue(val, id, 'allowance')
                                    }
                                  />
                                )}
                              />
                              <LabelValuePair
                                label="Trade Value (To Customer)"
                                value={
                                  formatter.format(allowance + amount)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )
              }
            </div>
          </div>
          <div className="pricesSection">
            {deal?.purchaseProducts?.map((item) => (
              <LabelValuePair
                key={item.id}
                label={getProductName(item.product)}
                value={formatter.format(item.product.price)}
              />
            ))}
            {deal?.state === 'in_progress' && deal?.tradeProducts?.map((item) => (
              <LabelValuePair
                key={item.id}
                label={getProductName(item.productSold.product)}
                value={`- ${formatter.format(item.productSold.amount)}`}
              />
            ))}
            <div className="selling-price">
              <LabelValuePair
                label="Net Price"
                value={
                  formatter.format(
                    deal?.purchaseProducts?.reduce(
                      (t, c) => t + c.product.price, 0
                    ) - deal?.tradeProducts?.reduce(
                      (t, c) => t + c.productSold.amount, 0
                    )
                  )
                }
              />
            </div>
          </div>
          <div className="deal-category">
            <div className="subsection">
              <h3 className="deal-category__title">Payment Methods</h3>
            </div>
            <Divider />
            <div className="spacer">
              { deal?.paymentMethods?.map((payment) => (
                <span key={payment.name} className="deal-mode-payment">
                  {payment.name}
                </span>
              ))}
            </div>
          </div>
          <div className="deal-category">
            <div className="subsection">
              <h3 className="deal-category__title">Deal Elements</h3>
            </div>
            <Divider />
            { deal?.dealElements?.map((dmElement) => {
              const { id, dealElementsDocs, ...dealElement } = dmElement;
              const name = dealElement.name.toLowerCase().replaceAll(' ', '_');
              return (
                <div key={id}>
                  <input
                    id={`filePicker_${name}`}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={
                      (e) => fileChange(id, e.target.files[0])
                    }
                  />
                  <div className="spacer bottomSpacer">
                    <div className="dealElementsSection">
                      {
                        dealElementsDocs.length > 0
                          ? <CheckCircle fontSize="small" className="circle active" />
                          : <RadioButtonUnchecked className="circle" />
                      }
                      <div className="dealElementsSection__title__container">
                        <div className="dealElementsSection__title">
                          <div className="deal-category__title">{dealElement.name}</div>
                          {
                            deal?.state === 'in_progress'
                            && (
                              <div className="deal-category__title">
                                {
                                  ((dealElement.name === 'Quote' || dealElement.name === 'Purchase Order'))
                                    ? (
                                      <div
                                        className="pointer"
                                        onClick={() => openModal(id, name)}
                                      >
                                        Create
                                      </div>
                                    )
                                    : (
                                      <div
                                        className="pointer"
                                        onClick={
                                          () => document.getElementById(`filePicker_${name}`).click()
                                        }
                                      >
                                        Upload
                                      </div>
                                    )
                                }
                              </div>
                            )
                          }
                        </div>
                        <Divider />
                      </div>
                    </div>
                    <div className="dealElements__documents">
                      { dealElementsDocs?.map((doc) => (
                        <div
                          key={doc.id}
                          className="preview"
                        >
                          <div className="preview__image">
                            <img src="/Icons/Pdf-File.svg" alt="document" />
                          </div>
                          <div className="document__details">
                            <div className="document-title__section">
                              <div className="title">
                                { name === 'quote' && `Quote #${doc.serial}` }
                                { name === 'purchase_order' && `PO #${doc.serial}` }
                                { name !== 'quote' && name !== 'purchase_order' && doc.filename }
                              </div>
                              <div className="subtitle">
                                {`Sent On ${moment(doc.updatedAt).format('M/DD/YYYY')}`}
                              </div>
                            </div>
                            <div
                              className="action_text"
                              onClick={() => window.open(`https://drive.google.com/viewerng/viewer?embedded=true&url=${GOOGLE_STORAGE}${doc.gcsFilename}`, '_target')}
                            >
                              Preview
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isModal
      && (
        <DocumentPreviewModal
          isOpen={isModal}
          toggle={toggleModal}
          deal={deal}
          customer={customer}
          type={docType}
          elementId={elementId}
          includeTradeIn
        />
      )}
    </div>
  );
}

DealModeDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dealId: PropTypes.string.isRequired,
  deal: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = (state) => ({
  deal: state.adminCustomer.adminCustomerDeal,
});

export default connect(mapStateToProps, null)(DealModeDrawer);
