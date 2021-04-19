import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';

import getFullName from '../../utils/getFullName';
import moneyFormatter from '../../utils/moneyFormatter';

const CbopsTemplate = ({
  quotePreview,
  client,
}) => (
  <div className="preview-container">
    <div className="preview__body">
      <h1 className="preview__title">Quotation</h1>
      <div className="flex preview__intro">
        <div className="flex items-center flex-1">
          <img src={client.logo} alt="" />
          <h2>{client.name}</h2>
        </div>
        <p className="flex column preview__address flex-1">
          <span>ABC Equipment Company</span>
          <span>1234 25th St. - Suite F</span>
          <span>St. Paul MN, 55101</span>
          <span>Phone: (651) 559-0488 - Fax: (651) 559-8491</span>
        </p>
        <div className="flex-1">&nbsp;</div>
      </div>
      <div className="flex">
        <div className="preview__to flex-1">
          <h3>Bill To:</h3>
          <span>{getFullName(quotePreview.customer)}</span>
          <span>1370 60th Ave</span>
          <span>Luverne, MN 56156</span>
        </div>
        <div className="preview__quote-details flex-1">
          <div className="preview__quote-details-group">
            <div className="preview__quote-detail-item">
              <h4>Quote Date:</h4>
              <span>{moment(quotePreview.date).format('MM/DD/YYYY')}</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Quote #:</h4>
              <span>{quotePreview.serialNumber}</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Purchaser Account #:</h4>
              <span>-</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Customer Sales Tax Exempt #:</h4>
              <span>10/4/2020</span>
            </div>
          </div>
          <div className="preview__quote-details-group">
            <div className="preview__quote-detail-item">
              <h4>Customer Purchaser Type:</h4>
              <span>Private commercial</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Customer Market Use:</h4>
              <span>-</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Location of First Working Use:</h4>
              <span>N/A</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Sales Rep:</h4>
              <span>{getFullName(quotePreview.customer?.salesRep)}</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Phone:</h4>
              <span>{quotePreview.customer?.phone}</span>
            </div>
            <div className="preview__quote-detail-item">
              <h4>Email:</h4>
              <span>{quotePreview.customer?.email}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="preview__table">
        <div className="preview__table-header">
          <h3>
            Equipment Information
          </h3>
        </div>
        <table>
          <thead>
            <th>Quantity</th>
            <th>Serial Number</th>
            <th>Hours</th>
            <th>Status/Year/Make/Model</th>
            <th>Price</th>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                {quotePreview.product?.serialNumber}
              </td>
              <td>
                {get(quotePreview, 'product.operationHours', '-')}
              </td>
              <td>
                {quotePreview.product?.isNew ? 'New' : 'Used'}
                /
                {quotePreview.product?.modelYear}
                /
                {quotePreview.product?.manufacturer}
                /
                {quotePreview.product?.model}
              </td>
              <td>{moneyFormatter.format(quotePreview.amount)}</td>
            </tr>
            <tr className="preview__subtotal">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>Equipment subtotal:</td>
              <td>{moneyFormatter.format(quotePreview.amount)}</td>
            </tr>
          </tbody>
        </table>
        <div className="preview__table-header preview__totals">
          <h3>
            Totals
          </h3>
        </div>
        <div className="flex items-end column">
          <div className="preview__totals-details">
            <div className="preview__totals-details-item">
              <h3>Balance:</h3>
              <span>{moneyFormatter.format(quotePreview.amount)}</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Shipping fees</h3>
              <span>{moneyFormatter.format(quotePreview.shipping)}</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Tax Rate 3: (MNEA 0%)</h3>
              <span>-</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Sales Tax Total:</h3>
              <span>-</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Sub Total:</h3>
              <span>-</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Cash with Order:</h3>
              <span>-</span>
            </div>
            <div className="preview__totals-details-item">
              <h3>Balance Due:</h3>
              <span>{moneyFormatter.format(quotePreview.balanceDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CbopsTemplate.propTypes = {
  quotePreview: PropTypes.objectOf(PropTypes.any),
  client: PropTypes.objectOf(PropTypes.any),
};

CbopsTemplate.defaultProps = {
  quotePreview: {},
  client: {},
};

export default CbopsTemplate;
