import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { API_MARKETING } from '../../../../constants';
import CampaignModal from '../../../../components/CampaignModal';

const EmailSpecificCampaign = (props) => {
  const { campaignFormData } = props;
  const [apiResponse, setApiResponse] = useState([]);
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const saveDraft = () => {
    setIsSaveDraft(true);
  };
  const dynamicTextInputFieldsApi = () => {
    axios
      .get(`${API_MARKETING}/dynamic-fields`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => setApiResponse(res.data.dynamicFieldsData));
  };

  useEffect(() => {
    dynamicTextInputFieldsApi();
  }, []);

  const getData = (description, subject, destinationUrl) => {
    const EmptyObj = {};
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
      url: `${API_MARKETING}/campaigns-dev/create`,
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
        type="emailSpecific"
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

EmailSpecificCampaign.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

EmailSpecificCampaign.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(EmailSpecificCampaign);
