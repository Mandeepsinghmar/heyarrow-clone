import { campaignInitialState } from '../initial-states';

import {
  CAMPAIGN_TYPE, CAMPAIGN_MEDIA_TYPE, CAMPAIGN_FILE_UPLOAD,
  SELECTED_RECIPIENTS, SCHEDULE_CAMPAIGN, EMAIL_SPECIFIC_CAMPAIGN,
  TEXT_SPECIFIC_CAMPAIGN, UNDIFFIRENTIATED_CAMPAIGN, FACEBOOK_SPECIFIC_CAMPAIGN,
  FACEBOOK_LINKED_LIBRARY, SELECTED_PRODUCTS_ID, CLEAR_ALL_CAMPAIGN_DATA,
  CAMPAIGN_ANALYTICS_VIEW_DETAILS
} from '../types';

export default (state = campaignInitialState, { type, payload }) => {
  switch (type) {
  case CAMPAIGN_TYPE: {
    let addCampaignType = {};
    if (
      state.campaignFormData && state.campaignFormData.type === payload.type
    ) {
      addCampaignType = { ...state.campaignFormData, ...payload };
    } else {
      addCampaignType = { ...payload };
    }
    return {
      ...state,
      campaignFormData: addCampaignType
    };
  }

  case CAMPAIGN_MEDIA_TYPE: {
    const addCampaignMediaType = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: addCampaignMediaType
    };
  }

  case CAMPAIGN_FILE_UPLOAD: {
    const addCampaignFileUpload = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: addCampaignFileUpload
    };
  }

  case SELECTED_RECIPIENTS: {
    const addSelectedRecipients = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: addSelectedRecipients
    };
  }

  case SCHEDULE_CAMPAIGN: {
    return {
      ...state,
      campaignFormData: payload
    };
  }

  case EMAIL_SPECIFIC_CAMPAIGN: {
    const emailSpecificData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: emailSpecificData
    };
  }

  case TEXT_SPECIFIC_CAMPAIGN: {
    const textSpecificData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: textSpecificData
    };
  }

  case UNDIFFIRENTIATED_CAMPAIGN: {
    const undiffirentiatedData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: undiffirentiatedData
    };
  }

  case FACEBOOK_SPECIFIC_CAMPAIGN: {
    const facebookCampaignData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: facebookCampaignData
    };
  }

  case FACEBOOK_LINKED_LIBRARY: {
    const facebookLinkedLibraryData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: facebookLinkedLibraryData
    };
  }

  case SELECTED_PRODUCTS_ID: {
    const slectedProductsData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: slectedProductsData
    };
  }

  case CLEAR_ALL_CAMPAIGN_DATA: {
    return {
      ...state,
      campaignFormData: payload
    };
  }

  case CAMPAIGN_ANALYTICS_VIEW_DETAILS: {
    const campaignAnalyticsData = { ...state.campaignFormData, ...payload };
    return {
      ...state,
      campaignFormData: campaignAnalyticsData
    };
  }

  default:
    return state;
  }
};
