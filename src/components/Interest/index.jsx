import React from 'react';
import { Divider } from '@material-ui/core';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.scss';
import Loader from '../common/Loader';
import moneyFormatter from '../../utils/moneyFormatter';

const Interest = ({ interests, roles }) => {
  if (interests?.loading) {
    return (
      <div className="customer-interest-container">
        <div className="customer-interest__header">
          <h3>Interest</h3>
          <Divider />
          <Loader secondary />
        </div>
      </div>
    );
  }

  switch (roles) {
  case 'admin':
    return (
      <div className="customer-interest-container">
        <div className="customer-interest__header">
          <h3>Interest</h3>
          <Divider />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="time-icon"
            style={{ background: '#EDEFF2', borderRadius: 4 }}
          >
            <i className="fas fa-clock" />
          </button>
        </div>
        {isEmpty(interests.data) && <center>No interest found!</center>}
        <div className="container-fluid">
          <div className="row ">
            {!isEmpty(interests.data)
              ? interests.data.map((interest) => (
                <div className="col-6 pt-2 px-2">
                  <div className="customer-interest-body">
                    <div className="customer-interest__item">
                      <h4>Product categories</h4>
                      {interest.categories.split(',').map((category) => (
                        <span className="tag">{category}</span>
                      ))}
                    </div>
                    <div className="customer-interest__item">
                      <h4>Price range</h4>
                      <span className="tag">
                        {`${moneyFormatter.format(
                          interest.priceRange.split('-')[0]
                        )} - ${moneyFormatter.format(
                          interest.priceRange.split('-')[1]
                        )}`}
                      </span>
                    </div>
                    <div className="customer-interest__item">
                      <h4>Product type</h4>
                      <span className="tag">{interest.productType}</span>
                    </div>
                    <div className="customer-interest__item">
                      <h4>Notes</h4>
                      <span className="tag">{interest.notes}</span>
                    </div>
                    <span className="time">
                      {`Submitted ${moment(interest.createdAt).format(
                        'll'
                      )}`}
                    </span>
                  </div>
                </div>
              ))
              : null}
          </div>
        </div>
      </div>
    );
  case 'salesRep':
    return (
      <div className="customer-interest-container">
        <div className="customer-interest__header">
          <h3>Interest</h3>
          <Divider />
        </div>
        {!interests.data.length && <center>No interest found!</center>}
        {interests.data.map((interest) => {
          const prices = interest.priceRange.split('-');
          return (
            <div className="customer-interest-body">
              <div className="customer-interest__item">
                <h4>Product categories</h4>
                {interest.categories.split(',').map((category) => (
                  <span className="tag">{category}</span>
                ))}
              </div>
              <div className="customer-interest__item">
                <h4>Price range</h4>
                <span className="tag">
                  {`${moneyFormatter.format(
                    prices[0]
                  )} - ${moneyFormatter.format(prices[1])}`}
                </span>
              </div>
              <div className="customer-interest__item">
                <h4>Product type</h4>
                <span className="tag">{interest.productType}</span>
              </div>
              <div className="customer-interest__item">
                <h4>Notes</h4>
                <span className="tag">{interest.notes}</span>
              </div>
              <span className="time">
                {`Submitted ${moment(
                  interest.createdAt
                ).format('ll')}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  default:
    return (
      <div className="customer-interest-container">
        <div className="customer-interest__header">
          <h3>Interest</h3>
          <Divider />
        </div>
        {!interests.data.length && <center>No interest found!</center>}
        {interests.data.map((interest) => {
          const prices = interest.priceRange.split('-');
          return (
            <div className="customer-interest-body">
              <div className="customer-interest__item">
                <h4>Product categories</h4>
                {interest.categories.split(',').map((category) => (
                  <span className="tag">{category}</span>
                ))}
              </div>
              <div className="customer-interest__item">
                <h4>Price range</h4>
                <span className="tag">
                  {`${moneyFormatter.format(
                    prices[0]
                  )} - ${moneyFormatter.format(prices[1])}`}
                </span>
              </div>
              <div className="customer-interest__item">
                <h4>Product type</h4>
                <span className="tag">{interest.productType}</span>
              </div>
              <div className="customer-interest__item">
                <h4>Notes</h4>
                <span className="tag">{interest.notes}</span>
              </div>
              <span className="time">
                {`Submitted ${moment(
                  interest.createdAt
                ).format('ll')}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
};

Interest.defaultProps = {
  roles: '',
};

Interest.propTypes = {
  roles: PropTypes.string,
  interests: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Interest;
