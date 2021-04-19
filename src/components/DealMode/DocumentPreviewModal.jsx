import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { IconButton, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import CustomIcon from '../common/CustomIcon';
import getFullName from '../../utils/getFullName';
import getLocation from '../../utils/getLocation';
import getProductName from '../../utils/getProductName';
import moneyFormatter from '../../utils/moneyFormatter';
import { createDealElementDoc } from '../../api';
import { getDealById } from '../../api/adminCustomers';
import Input from '../common/Input';
import Button from '../common/Button';
import TextArea from '../common/TextArea';

const DocumentPreviewModal = ({
  isOpen,
  toggle,
  deal = {
    purchaseProducts: [{}]
  },
  includeTradeIn,
  type,
  elementId,
  customer
}) => {
  const { client } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const [isEmailModal, setEmailModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const totalProducts = deal.purchaseProducts
    .reduce(
      (
        total,
        { productQuoted }
      ) => (total + (productQuoted?.amount || 0)),
      0
    );

  const totalTradeIn = deal.tradeProducts.reduce(
    (
      total,
      { productSold, allowance = 0 }
    ) => (
      total + (productSold.amount + allowance)
    ),
    0
  );
  const taxes = deal.purchaseProducts
    .reduce(
      (
        total,
        { productQuoted }
      ) => (total + (productQuoted?.taxes || 0)),
      0
    );
  const discount = deal.purchaseProducts
    .reduce(
      (
        total,
        { productQuoted }
      ) => (total + (productQuoted?.discount || 0)),
      0
    );

  const shipping = deal.purchaseProducts
    .reduce(
      (
        total,
        { productQuoted }
      ) => (total + (productQuoted?.shipping || 0)),
      0
    );

  const otherFees = deal.purchaseProducts
    .reduce(
      (
        total,
        { productQuoted }
      ) => (total + (productQuoted?.otherFees || 0)),
      0
    );

  const netPrice = ((totalProducts - totalTradeIn)
  + taxes
  + shipping
  + otherFees
  ) - discount;

  const toggleMailModal = () => {
    setEmailModal(!isEmailModal);
  };

  const createDocHandler = () => {
    setSending(true);
    const reqBody = includeTradeIn ? {
      purchaseProducts: deal.purchaseProducts
        .map(({ deliveryOn, productId }) => ({
          deliveryOn,
          productId
        })),
      tradeProducts: deal.tradeProducts.map(({ productSoldId }) => ({
        productSoldId
      })),
      message: {
        subject,
        body
      }
    } : {
      purchaseProducts: deal.purchaseProducts
        .map(({ deliveryOn, productId }) => ({
          deliveryOn,
          productId
        })),
      message: {
        subject,
        body
      }
    };
    dispatch(createDealElementDoc(elementId, reqBody))
      .then(() => {
        dispatch(getDealById(deal.id));
      })
      .finally(() => {
        setSending(false);
        toggleMailModal();
        toggle();
        setBody('');
        setSubject('');
      });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="document-preview-modal postDetailModal"
        autoFocus
      >
        <ModalBody>
          <div className="preview-container">
            <IconButton
              className="preview-close-btn"
              onClick={toggle}
            >
              <CustomIcon icon="close-white" />
            </IconButton>
            <div className="preview__body">
              <div className="document-preview-header">
                <div className="document-preview-header__img">
                  <img src={client.logo} alt="logo" />
                </div>
                <h1>{client.name}</h1>
              </div>
              <Divider className="underline" />
              <div className="document-preview-address">
                <div className="flex column">
                  <span>{customer?.acountName}</span>
                  <span>
                    c/o
                    <strong>{` ${getFullName(customer)}`}</strong>
                  </span>
                  <span>{getLocation(customer.city)}</span>
                  <span>{customer?.phone}</span>
                  <span>{customer?.email}</span>
                </div>
                <div className="flex column items-end">
                  <span><strong>{getFullName(customer.salesRep)}</strong></span>
                  <span>{customer?.salesRep?.phoneNumber}</span>
                  <span>{customer?.salesRep?.email}</span>
                </div>
              </div>
              <div className="flex column document-preview-date">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{moment(new Date()).format('MM/DD/YYYY')}</span>
                </div>
                {type !== 'purchase_order'
                  ? (
                    <>
                      <div className="flex justify-between">
                        <span>Quote ID:</span>
                        <span>
                          {deal?.purchaseProducts[0]
                            ?.productQuotedId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid thru:</span>
                        <span>{moment(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))).format('MM/DD/YYYY')}</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span>PO#:</span>
                      <span>-</span>
                    </div>
                  ) }
              </div>
              <table className="document-preview-table">
                <thead>
                  <th>Qty</th>
                  <th>Description</th>
                  {type === 'purchase_order'
                  && <th>Serial #</th>}
                  <th>Taxable</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </thead>
                <tbody>
                  {deal.purchaseProducts.map(({
                    product,
                    productQuoted
                  }) => (
                    <tr key={product.id}>
                      <td>1</td>
                      <td>{`${getProductName(product)} (${product?.isNew ? 'New' : 'Used'})`}</td>
                      {type === 'purchase_order'
                      && <td>{product.serialNumber}</td> }
                      <td>{productQuoted?.taxes ? 'Y' : 'N'}</td>
                      <td>
                        {moneyFormatter.format(productQuoted?.amount || 0)}
                      </td>
                      <td>
                        {moneyFormatter.format(productQuoted?.amount || 0)}
                      </td>
                    </tr>
                  ))}
                  {includeTradeIn
                && deal.tradeProducts.map(({
                  productSold,
                  allowance = 0,
                  ...res
                }) => (
                  <tr key={productSold.id}>
                    <td>1</td>
                    <td>{`${getProductName(productSold?.product || res)} (Trade In)`}</td>
                    <td>-</td>
                    <td>
                      {moneyFormatter.format(
                        (productSold?.amount || 0) + allowance
                      )}
                    </td>
                    <td>
                      {moneyFormatter.format(
                        (productSold?.amount || 0) + allowance
                      )}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <div className="document-preview-total flex justify-end">
                <div>
                  <div className="document-preview-total-item">
                    <span>
                      <strong>Sub Total</strong>
                    </span>
                    <span>
                      {includeTradeIn
                        ? (
                          <strong>
                            {moneyFormatter
                              .format(totalProducts - totalTradeIn)}
                          </strong>
                        )
                        : (
                          <strong>
                            {moneyFormatter.format(totalProducts) }
                          </strong>
                        ) }
                    </span>
                  </div>
                  <div className="document-preview-total-item">
                    <span>Discount</span>
                    <span>
                      {moneyFormatter
                        .format(discount)}
                    </span>
                  </div>
                  <div className="document-preview-total-item">
                    <span>Taxes</span>
                    <span>
                      {moneyFormatter
                        .format(taxes)}
                    </span>
                  </div>
                  <div className="document-preview-total-item">
                    <span>Shipping cost</span>
                    <span>
                      {moneyFormatter
                        .format(shipping)}
                    </span>
                  </div>
                  <div className="document-preview-total-item">
                    <span>Other fees</span>
                    <span>
                      {moneyFormatter
                        .format(otherFees)}
                    </span>
                  </div>
                  <Divider className="total-divider" />
                  <div className="document-preview-total-item document-preview-net">
                    <span>Net price</span>
                    {includeTradeIn
                      ? (
                        <span>
                          {moneyFormatter.format(netPrice)}
                        </span>
                      )
                      : (
                        <span>
                          {moneyFormatter.format(netPrice + totalTradeIn)}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              {type === 'purchase_order'
            && (
              <div className="document-preview-signature">
                <span>Signature</span>
                <div className="document-preview-signature__container" />
                <span>Date signed</span>
              </div>
            )}
            </div>
            <button
              type="button"
              className="preview__send"
              onClick={toggleMailModal}
            >
              Send to customer
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isEmailModal}
        className="quote-email-modal"
        toggle={toggleMailModal}
        autoFocus
      >
        <div className="flex justify-between modal-header items-center">
          <h3 className="heading">
            {`Email ${type === 'quote' ? 'Quote' : 'Purchase Order'}`}
          </h3>
          <IconButton
            className="cancel modal-close"
            onClick={toggleMailModal}
            size="small"
          >
            <CustomIcon icon="Close" />
          </IconButton>
        </div>
        <ModalBody>
          <div className="email-modal-input">
            <Input
              label="Subject"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="email-modal-input">
            <TextArea
              label="Message"
              fullWidth
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="flex justify-end email-modal-action-btns">
            <Button
              color="secondary"
              onClick={toggleMailModal}
            >
              Cancel
            </Button>
            <Button onClick={createDocHandler}>
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

DocumentPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  deal: PropTypes.objectOf(PropTypes.any).isRequired,
  includeTradeIn: PropTypes.bool,
  type: PropTypes.string,
  elementId: PropTypes.string,
  customer: PropTypes.objectOf(PropTypes.any)
};

DocumentPreviewModal.defaultProps = {
  includeTradeIn: false,
  type: '',
  elementId: '',
  customer: {}
};

export default DocumentPreviewModal;
