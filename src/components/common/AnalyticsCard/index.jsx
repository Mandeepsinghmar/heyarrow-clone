import React from 'react';
import PropTypes from 'prop-types';
import Expand from '../../../assets/Icons/Header/Icon/Expand.svg';
import './index.scss';

const AnalyticsCard = ({
  label,
  value,
  viewDetails,
  onViewOpenDetails,
  cardType,
  selectedClickColor,
  campaignType
}) => {
  const formatValue = () => {
    if (value > 0) {
      return value.toFixed(2);
    }
    return value;
  };
  return (
    <div id={cardType} className="analytics_cardBox">
      <div className={selectedClickColor && selectedClickColor ? selectedClickColor : 'analytics_innerCardCon gray'}>
        <h4>{label}</h4>
        <h3>
          {formatValue()}
        </h3>
        {
          value > 0 && viewDetails && campaignType !== 'email'
            ? (
              <div className="cardOpenDetails">
                <span className="card_open_text" onClick={() => onViewOpenDetails('1', label, cardType)}>View Details</span>
                <img src={Expand} className="card_open_icon" alt="" />
              </div>
            )
            : null
        }
      </div>
    </div>
  );
};

AnalyticsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onViewOpenDetails: PropTypes.func,
  viewDetails: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  selectedClickColor: PropTypes.string.isRequired,
  campaignType: PropTypes.string.isRequired
};

AnalyticsCard.defaultProps = {
  onViewOpenDetails: () => { }
};

export default AnalyticsCard;
