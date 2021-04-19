import React, { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';
import { API_MARKETING } from '../../../../constants';

const CampaignUpload = (props) => {
  const { campaignFormData } = props;
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const saveDraft = () => {
    setIsSaveDraft(true);
  };

  const getData = () => {
    const EmptyObj = {};
    const draftData = JSON.stringify({
      type: campaignFormData && campaignFormData.type,
      isDraft: true,
      isPin: false,
      data: {
        campaignName: campaignFormData && campaignFormData.campaignName,
        url: campaignFormData && campaignFormData.url,
        subject: campaignFormData && campaignFormData.subject,
        content: campaignFormData && campaignFormData.content,
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
        title="Upload Content"
        isBackBtnVisible
        getData={getData}
        isSaveDraft={isSaveDraft}
        saveDraft={saveDraft}
        campaignFormData={campaignFormData}
      />
    </>
  );
};

CampaignUpload.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignUpload.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignUpload);
