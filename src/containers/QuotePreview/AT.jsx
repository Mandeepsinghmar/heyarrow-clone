import React from 'react';
import PropTypes from 'prop-types';

import moneyFormatter from '../../utils/moneyFormatter';
import getFullName from '../../utils/getFullName';

const ATTemplate = ({
  quotePreview,
  client
}) => (
  <div className="at-container">
    <div className="preview__body">
      <div className="at-preview-heading">
        <div className="at-preview-heading__left">
          <div className="logo">
            <img src={client?.logo} alt="logo" />
          </div>
          <div className="flex column at-preview-address">
            <span>Aerial Titans Inc</span>
            <span>3758 Lavista Rd Suite 200</span>
            <span>Tucker, GA 30084</span>
          </div>
          <div className="at-quote-to">
            <h4>Quote to</h4>
            <span>Crystal Contracting</span>
            <span>16773 Springdale Rd</span>
            <span>Thompsonville, MI 49683</span>
            <span>
              {getFullName(quotePreview?.customer) }
              {' '}
              {quotePreview?.customer?.phone}
            </span>
            <span>{quotePreview?.customer?.email}</span>
          </div>
        </div>
        <div className="at-preview-heading__right">
          <h1 className="preview__title">Quotation</h1>
          <div className="at-quote-number">
            <div className="at-quote-number-row">
              <span>Date</span>
              <span>Quote#</span>
            </div>
            <div className="at-quote-number-row">
              <span>{quotePreview?.date}</span>
              <span>{quotePreview?.serialNumber}</span>
            </div>
          </div>
          <div className="at-quote-to at-ship-to">
            <h4>Ship to</h4>
            <span>Customer Pick-Up</span>
            <span>Flora, IL</span>
          </div>
        </div>
      </div>
      <div className="at-preview-content">
        <table className="terms-table border-bottom-none">
          <thead>
            <th>P.O. Number</th>
            <th>Terms</th>
            <th>Rep</th>
          </thead>
          <tbody>
            <tr className="border-bottom-none">
              <td>NA</td>
              <td>Due on receipt</td>
              <td>AJ</td>
            </tr>
          </tbody>
        </table>
        <table className="at-description">
          <thead>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price Each</th>
            <th>Amount</th>
          </thead>
          <tbody>
            <tr>
              <td className="at-description-col">
                <div className="flex column">
                  <span>
                    YEAR/MAKE/MODEL:
                    {quotePreview?.product?.modelYear}
                    {' '}
                    {quotePreview?.product?.manufacturer}
                    {' '}
                    {quotePreview?.product?.model}
                  </span>
                  <span>
                    HOURS:
                    {quotePreview?.operationHours || '-' }
                    {' '}
                    DC
                  </span>
                  <span>
                    {quotePreview?.product?.description}
                  </span>
                </div>
              </td>
              <td className="td-top-right">1</td>
              <td className="td-top-right">{quotePreview?.amount}</td>
              <td className="td-top-right">{quotePreview?.amount}</td>
            </tr>
            <tr className="secondary-col">
              <td className="at-description-col">Sales Tax</td>
              <td className="td-top-right">&nbsp;</td>
              <td className="td-top-right">6.0%</td>
              <td className="td-top-right">957.00</td>
            </tr>
            <tr>
              <td style={{ height: '8px' }} />
              <td />
              <td />
              <td />
            </tr>
            <tr className="secondary-col">
              <td className="at-description-col">Shipping fee</td>
              <td>&nbsp;</td>
              <td className="td-top-right">{quotePreview?.shipping}</td>
              <td className="td-top-right">{quotePreview?.shipping}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex at-notes">
          <p>
            The customer acknowledges that he or she has reviewed and accepted
            the AERIAL TITANS INC. SALES AGREEMENT ADDITIONAL TERMS AND
            CONDITIONS
            <br />
            <br />
            Customer understands that they must notify the seller if a
            lienholder is financing the purchase.
            <br />
            <br />
            Customer is responsible for the payment of any local sales or use,
            or similar fees or taxes arising as a result of this purchase
          </p>
          <table className="terms-table at-totals">
            <tbody>
              <tr>
                <td className="flex justify-between">
                  <strong>Total</strong>
                  <span>{moneyFormatter.format(quotePreview.amount)}</span>
                </td>
              </tr>
              <tr>
                <td className="flex justify-between">
                  <strong>Payments/Credits</strong>
                  <span>$0.00</span>
                </td>
              </tr>
              <tr>
                <td className="flex justify-between">
                  <strong>Balance Due</strong>
                  <span>{moneyFormatter.format(quotePreview?.balanceDue)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

ATTemplate.propTypes = {
  quotePreview: PropTypes.objectOf(PropTypes.any),
  client: PropTypes.objectOf(PropTypes.any),
};

ATTemplate.defaultProps = {
  quotePreview: {},
  client: {},
};

export default ATTemplate;
