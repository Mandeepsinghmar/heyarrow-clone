import {
  CAMPAIGN_TYPE, CAMPAIGN_MEDIA_TYPE, CAMPAIGN_FILE_UPLOAD,
  SELECTED_RECIPIENTS, SCHEDULE_CAMPAIGN, EMAIL_SPECIFIC_CAMPAIGN,
  TEXT_SPECIFIC_CAMPAIGN, UNDIFFIRENTIATED_CAMPAIGN, FACEBOOK_SPECIFIC_CAMPAIGN,
  FACEBOOK_LINKED_LIBRARY, SELECTED_PRODUCTS_ID, CLEAR_ALL_CAMPAIGN_DATA,
  CAMPAIGN_ANALYTICS_VIEW_DETAILS
} from '../types';

export const campaignTypeData = (data) => ({
  type: CAMPAIGN_TYPE,
  payload: data
});

export const campaignMediaType = (data) => ({
  type: CAMPAIGN_MEDIA_TYPE,
  payload: data
});

export const campaignFileUpload = (data) => ({
  type: CAMPAIGN_FILE_UPLOAD,
  payload: data
});

export const selectedRecipients = (data) => ({
  type: SELECTED_RECIPIENTS,
  payload: data
});

export const scheduleCampaign = (data) => ({
  type: SCHEDULE_CAMPAIGN,
  payload: data
});

export const emailSpecificCampaign = (data) => ({
  type: EMAIL_SPECIFIC_CAMPAIGN,
  payload: data
});

export const textSpecificCampaign = (data) => ({
  type: TEXT_SPECIFIC_CAMPAIGN,
  payload: data
});

export const undiffirentiatedCampaign = (data) => ({
  type: UNDIFFIRENTIATED_CAMPAIGN,
  payload: data
});

export const facebookSpecificCampaign = (data) => ({
  type: FACEBOOK_SPECIFIC_CAMPAIGN,
  payload: data
});

export const facebookLinkedLibrary = (data) => ({
  type: FACEBOOK_LINKED_LIBRARY,
  payload: data
});

export const selectedProducts = (data) => ({
  type: SELECTED_PRODUCTS_ID,
  payload: data
});

export const clearAllCampaignData = (data) => ({
  type: CLEAR_ALL_CAMPAIGN_DATA,
  payload: data
});

export const campAnalyticsViewDetails = (data) => ({
  type: CAMPAIGN_ANALYTICS_VIEW_DETAILS,
  payload: data
});
