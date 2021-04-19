import React, { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';
import { API_MARKETING } from '../../../../constants';

const CampaignSchedule = (props) => {
  const { campaignFormData } = props;
  const [isSaveDraft, setIsSaveDraft] = useState(false);

  const saveDraft = () => {
    setIsSaveDraft(true);
  };

  const getData = (saveDraftObj) => {
    const EmptyObj = {};
    const draftData = JSON.stringify({
      type: campaignFormData && campaignFormData.type,
      isDraft: false,
      isPin: false,
      data: {
        campaignName: campaignFormData && campaignFormData.campaignName,
        url: campaignFormData && campaignFormData.url,
        subject: campaignFormData && campaignFormData.subject,
        content: campaignFormData && campaignFormData.content,
        fileUrl: campaignFormData && campaignFormData.fileUpload
          && campaignFormData.fileUpload.fileUrl,
        linkedLibraries: EmptyObj,
        productIds: [],
        recipientIds: campaignFormData.recipientIds,
        scheduleAt: saveDraftObj.scheduleAt,
        isSalesfeed: false,
        remindAt: '5',
        fileType: campaignFormData && campaignFormData.fileUpload
          && campaignFormData.fileUpload.fileType,
        folderId: '10'
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
        title="Almost there!"
        isBackBtnVisible
        isSaveDraft={isSaveDraft}
        saveDraft={saveDraft}
        getData={getData}
      />
    </>
  );
};

CampaignSchedule.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignSchedule.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignSchedule);
