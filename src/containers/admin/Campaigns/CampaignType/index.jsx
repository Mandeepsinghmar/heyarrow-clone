import React, { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';
import { API_MARKETING } from '../../../../constants';

const CampaignType = (props) => {
  const { campaignFormData } = props;
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const saveDraft = () => {
    setIsSaveDraft(true);
  };

  const getData = (campaignType, checked, campaignName) => {
    const EmptyObj = {};
    const draftData = JSON.stringify({
      type: campaignType,
      isDraft: false,
      isPin: false,
      data: {
        campaignName,
        url: '',
        subject: '',
        content: '',
        fileUrl: '',
        linkedLibraries: EmptyObj,
        productIds: [],
        recipientIds: [],
        scheduleAt: '',
        isSalesfeed: false,
        remindAt: '',
        fileType: '',
        folderId: ''
      },
    });
    const config = {
      method: 'post',
      url: `${API_MARKETING}/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`
      },
      data: draftData
    };
    axios(config)
      .then((response) => {
        if (response.data) {
          toast.success('Saved draft successfully');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <CampaignModal
        title="Campaign Type"
        isBackBtnVisible={false}
        saveDraft={saveDraft}
        getData={getData}
        isSaveDraft={isSaveDraft}
        campaignFormData={campaignFormData}
      />
    </>
  );
};

CampaignType.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignType.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignType);
