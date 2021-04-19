import React from 'react';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import './index.scss';
import PropTypes from 'prop-types';
import Tabs from '../../../components/common/Tab';

const tabs = [
  'Preview',
  'Analytics',
  'Responses',
  'Comments',
  'Messages'
];

const emailTabs = [
  'Preview',
  'Analytics',
];

const previewTab = [
  'Preview',
];

const CampaignsPreviewHeader = ({
  title,
  BtnContent,
  BtnRightContent,
  switchTab,
  activeTab,
  campaignCreatedDate,
  campaignType,
  onEditBtnClick,
  handleDuplicateApi,
  statused,
  campaignId
}) => {
  const renderMenu = () => {
    <div className="centerSideheader" />;
  };

  const renderTabs = () => {
    if (campaignType === 'social_post' || campaignType === 'social_ad') return tabs;
    if (campaignType === 'email') return emailTabs;
    return previewTab;
  };

  return (
    <div className="campaignpreviewheader">
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'
      }}
      >
        <div className="leftSide">
          <div className="campaignTitle">
            {title}
            {' '}
          </div>
          {activeTab === 0 ? (
            <div className="saveCampdraftbutton">
              <Button>
                <span className="savedrafttext">{statused === 'completed' ? 'Scheduled' : BtnContent}</span>
              </Button>
            </div>
          ) : (
            <div className="scheduled_date">
              <span className="scheduled_date_text">
                {
                  moment(campaignCreatedDate).format('DD/MM/YYYY')
                }
              </span>
            </div>
          )}
        </div>
        {renderMenu()}
        <div className="centerSide">
          <div className="headingBox align-center">
            <Tabs
              tabs={renderTabs()}
              className="headingBox__tabs"
              onChange={switchTab}
            />
          </div>
        </div>
        <div className="rightSide">
          <ul className="iconList">
            {activeTab === 0 ? (
              <div className="cancelbutton_preview">
                {statused === 'completed'
                  ? (
                    <div className="duplicate_btn" onClick={() => handleDuplicateApi(campaignId)}>
                      <span className="duplicate_btn_text">Duplicate</span>
                    </div>
                  )
                  : (
                    <Button onClick={onEditBtnClick}>
                      <span className="edittext">{BtnRightContent}</span>
                    </Button>
                  )}
              </div>
            ) : (
              <div className="duplicate_btn">
                <span className="duplicate_btn_text">Duplicate</span>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
CampaignsPreviewHeader.propTypes = {
  title: PropTypes.string.isRequired,
  BtnContent: PropTypes.string.isRequired,
  BtnRightContent: PropTypes.string.isRequired,
  switchTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  campaignCreatedDate: PropTypes.string.isRequired,
  campaignType: PropTypes.string.isRequired,
  onEditBtnClick: PropTypes.func.isRequired,
  statused: PropTypes.string.isRequired,
  campaignId: PropTypes.string.isRequired,
  handleDuplicateApi: PropTypes.func.isRequired,
};
export default CampaignsPreviewHeader;
