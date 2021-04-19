import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CampaignModal from '../../../../components/CampaignModal';
import { API_MARKETING } from '../../../../constants';

const CampaignRecipients = (props) => {
  const { campaignFormData } = props;
  const [apiResponse, setApiResponse] = useState([]);
  const [apiCustomerResponse, setApiCustomerResponse] = useState([]);
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const RecipientsListApi = () => {
    axios
      .get(`${API_MARKETING}/lists/list?page=1&limit=1000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => {
        setApiResponse(res.data.searchList);
      });
  };

  const CustomerListApi = () => {
    axios
      .get(`${API_MARKETING}/customers?page=1&limit=500`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => {
        setApiCustomerResponse(res.data.customerList);
      });
  };

  const saveDraft = () => {
    setIsSaveDraft(true);
  };

  const getData = (selectedCustomerIds) => {
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
        fileUrl: campaignFormData && campaignFormData.fileUpload
          && campaignFormData.fileUpload.fileUrl,
        linkedLibraries: EmptyObj,
        productIds: [],
        recipientIds: selectedCustomerIds,
        scheduleAt: '',
        isSalesfeed: false,
        remindAt: '',
        fileType: campaignFormData && campaignFormData.fileUpload
          && campaignFormData.fileUpload.fileType,
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

  useEffect(() => {
    RecipientsListApi();
    CustomerListApi();
  }, []);

  return (
    <>
      <CampaignModal
        title="Select Recipients"
        isBackBtnVisible
        apiResponse={apiResponse}
        apiCustomerResponse={apiCustomerResponse}
        isSaveDraft={isSaveDraft}
        saveDraft={saveDraft}
        getData={getData}
        campaignFormData={campaignFormData}
      />
    </>
  );
};

CampaignRecipients.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignRecipients.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignRecipients);
