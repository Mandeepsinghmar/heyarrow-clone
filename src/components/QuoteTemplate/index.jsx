import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, IconButton } from '@material-ui/core';
import { Popover, PopoverBody } from 'reactstrap';

import CustomIcon from '../common/CustomIcon';

import './index.scss';
import getFullName from '../../utils/getFullName';
import getProductName from '../../utils/getProductName';
import moneyFormatter from '../../utils/moneyFormatter';
import getLocation from '../../utils/getLocation';
import getProductImgUrl from '../../utils/getProductImageUrl';

const QuoteTemplate = ({
  client,
  quotePreview,
  products,
  discount,
  shipping,
  taxes,
  otherFees,
  subTotal
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  const [isAerialTitan] = useState(client.domain === 'aerialtitans');

  return (
    <div className="preview__body quote-template-body">
      <div className="document-preview-header">
        <div className="document-preview-header__img">
          <img src={client.logo} alt="logo" />
        </div>
        <h1>{client.name}</h1>
      </div>
      <Divider className="underline" />
      <div className="document-preview-address">
        <div className="d-flex">
          <div>
            {isAerialTitan && <img alt="" src={getProductImgUrl(products[0])} />}
          </div>
          <div className={`${isAerialTitan && 'ml-2'}`}>
            <div>{quotePreview?.customer?.acountName}</div>
            <div>
              c/o
              <strong>{` ${getFullName(quotePreview?.customer)}`}</strong>
            </div>
            <div>{getLocation(quotePreview?.customer?.city)}</div>
            <div>{quotePreview?.customer?.phone}</div>
            <div>{quotePreview?.customer?.email}</div>
          </div>
        </div>
        <div className="flex column items-end">
          <span>
            <strong>
              {getFullName(quotePreview?.customer?.salesRep)}
            </strong>
          </span>
          <span>{quotePreview.customer?.salesRep?.phoneNumber}</span>
          <span>{quotePreview.customer?.salesRep?.email}</span>
        </div>
      </div>
      <div className="flex column document-preview-date">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{moment(new Date()).format('MM/DD/YYYY')}</span>
        </div>
        <div className="flex justify-between">
          <span>Quote ID:</span>
          <span>-</span>
        </div>
        <div className="flex justify-between">
          <span>Valid thru:</span>
          <span>{moment(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))).format('MM/DD/YYYY')}</span>
        </div>
      </div>
      <table className="document-preview-table">
        <thead>
          <th>Qty</th>
          <th>Description</th>
          <th>Taxable</th>
          <th>Unit Price</th>
          <th>Total</th>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>1</td>
              <td>{getProductName(product)}</td>
              <td>-</td>
              <td>
                {moneyFormatter.format(product.form?.amount || 0)}
              </td>
              <td>
                {moneyFormatter.format(product.form?.amount || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="document-preview-total flex justify-between align-items-end">
        {isAerialTitan
        && (
          <div>
            <IconButton id="Popover1" type="button">
              <CustomIcon icon="alert/info" />
            </IconButton>
            <Popover placement="top" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
              <PopoverBody>
                <div>
                  &quot; For more information on this machine
                  please call your sales rep listed in
                  the information below. Please visit
                  us online at
                  <a
                    className="mx-1"
                    href="https://aerialtitans.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    www.aerialtitans.com
                  </a>
                  and also at
                  <a
                    className="mx-1"
                    href="http://www.towbehindboomlifts.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    www.towbehindboomlifts.com
                  </a>
                  If you do not see the exact machine you are
                  looking for don’t hesitate to give us a call.
                  Due to high demand our inventory changes
                  daily and we would love to show you the
                  latest machines in stock. &quot;
                </div>
                <Divider className="my-2" />
                <div>
                  Office: 866-874-0584
                </div>
              </PopoverBody>
            </Popover>
          </div>
        )}
        <div>
          <div className="document-preview-total-item">
            <span>
              <strong>Sub Total</strong>
            </span>
            <span>
              <strong>
                {moneyFormatter.format(subTotal) }
              </strong>
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
            <span>
              {moneyFormatter.format(
                subTotal
                + taxes
                + otherFees
                + shipping
                - discount
              )}
              {isAerialTitan && <span className="ml-1">Delivered</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

QuoteTemplate.propTypes = {
  client: PropTypes.objectOf(PropTypes.any).isRequired,
  quotePreview: PropTypes.objectOf(PropTypes.any).isRequired,
  taxes: PropTypes.number.isRequired,
  otherFees: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  subTotal: PropTypes.number.isRequired,
  products: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default QuoteTemplate;
