import React, { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';
import { API_MARKETING } from '../../../../constants';

const CampaignFileUpload = (props) => {
  const { campaignFormData } = props;
  const [isSaveDraft, setIsSaveDraft] = useState(false);

  const saveDraft = () => {
    setIsSaveDraft(true);
  };

  const getData = (uploadFile) => {
    const EmptyObj = {};
    const draftData = JSON.stringify({
      type: campaignFormData && campaignFormData.type,
      isDraft: true,
      isPin: true,
      data: {
        campaignName: campaignFormData && campaignFormData.campaignName,
        url: campaignFormData && campaignFormData.url,
        subject: campaignFormData && campaignFormData.subject,
        content: campaignFormData && campaignFormData.content,
        fileUrl: uploadFile.fileUrl,
        linkedLibraries: EmptyObj,
        productIds: [],
        recipientIds: [],
        scheduleAt: '',
        isSalesfeed: false,
        remindAt: '',
        fileType: uploadFile.fileType,
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
        title="Select files from your computer"
        isBackBtnVisible
        isSaveDraft={isSaveDraft}
        getData={getData}
        saveDraft={saveDraft}
        campaignFormData={campaignFormData}
      />
    </>
  );
};
CampaignFileUpload.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignFileUpload.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignFileUpload);
