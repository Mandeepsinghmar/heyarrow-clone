import React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';

const SocialPostCampaign = (props) => {
  const { campaignFormData } = props;
  return (
    <>
      <CampaignModal
        title="Social Profiles or Pages"
        type="allLists"
        isBackBtnVisible
        campaignFormData={campaignFormData}
      />
    </>
  );
};
SocialPostCampaign.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

SocialPostCampaign.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(SocialPostCampaign);
