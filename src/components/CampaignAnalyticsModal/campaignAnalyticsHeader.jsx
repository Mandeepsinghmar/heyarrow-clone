import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Tabs from '../common/Tab';
// import TabPanel from '../common/TabPanel';

const tabs = [
  'Preview',
  'Analytics',
  'Responses',
  'Comments',
  'Messages'
];

const CampaignAnalyticsHeader = ({
  title,
  BtnContent,
  BtnRightContent
}) => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState([tabs]);
  const history = useHistory();

  const renderMenu = () => {
    <div className="centerSideanalyticsheader" />;
  };
  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 1 && activeTab) {
      history.push('/campaign/analytics');
    } else if (tab === 2 && activeTab) {
      history.push('/campaign/response');
    } else if (tab === 3 && activeTab) {
      history.push('/campaign/comments');
    } else if (tab === 4 && activeTab) {
      history.push('/campaign/messages');
    }
  };

  return (
    <>
      <div className="campaignanalyticsheader">
        <div className="leftSideHeader">
          <div className="campaignAnalyticsTitle">
            {title}
            {' '}
          </div>
          <div className="datebutton">
            <Button>
              <span className="datetext">{BtnContent}</span>
            </Button>
          </div>
        </div>
        {renderMenu()}
        <div className="centerSideHeader">
          <div className="headingBoxAnalytics align-center">
            <Tabs
              tabs={tabs}
              className="headingBoxAnalytics__tabs"
              onChange={switchTab}
              activeTab={activeTab}

            />
          </div>
        </div>
        <div className="rightSideHeader">
          <ul className="iconList">
            <div className="duplicatebutton">
              <Button>
                <span className="duplicatetext">{BtnRightContent}</span>
              </Button>
            </div>
          </ul>
        </div>
      </div>
    </>

  );
};
CampaignAnalyticsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  BtnContent: PropTypes.string.isRequired,
  BtnRightContent: PropTypes.string.isRequired
};
export default CampaignAnalyticsHeader;
