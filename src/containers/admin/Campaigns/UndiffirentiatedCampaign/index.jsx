import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { API_MARKETING } from '../../../../constants';
import CampaignModal from '../../../../components/CampaignModal';

const UndiffirentiatedCampaign = (props) => {
  const { campaignFormData } = props;
  const [apiResponse, setApiResponse] = useState([]);
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const saveDraft = () => {
    setIsSaveDraft(true);
  };
  const dynamicInputFieldsApi = () => {
    axios
      .get(`${API_MARKETING}/dynamic-fields`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => setApiResponse(response.data.dynamicFieldsData));
  };
  useEffect(() => {
    dynamicInputFieldsApi();
  }, []);

  const getData = (description, subject, destinationUrl) => {
    const draftData = JSON.stringify({
      type: campaignFormData && campaignFormData.type,
      isDraft: true,
      isPin: false,
      data: {
        campaignName: campaignFormData && campaignFormData.campaignName,
        url: destinationUrl,
        subject,
        content: description,
        fileUrl: '',
        linkedLibraries: campaignFormData && campaignFormData.linkedLibraries,
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
        title="Add copy or description:"
        type="Undiffirentiated"
        isBackBtnVisible
        apiResponse={apiResponse}
        getData={getData}
        saveDraft={saveDraft}
        isSaveDraft={isSaveDraft}
        campaignFormData={campaignFormData}
      />
    </>
  );
};

UndiffirentiatedCampaign.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

UndiffirentiatedCampaign.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(UndiffirentiatedCampaign);
