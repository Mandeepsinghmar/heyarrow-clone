import {
  GETTING_DEAL_ELEMENTS,
  GET_DEAL_ELEMENT_FAILURE,
  GET_DEAL_ELEMENT_SUCCESS,
  GETTING_PAYMENT_METHODS,
  GET_PAYMENT_METHODS_SUCCESS,
  GET_PAYMENT_METHODS_FAILURE,
  GETTING_DEALS,
  GET_DEALS_SUCCESS,
  GET_DEALS_FAILURE,
  CREATE_DEAL_SUCCESS,
  UPLOAD_DEAL_DOC_SUCCESS,
  UPDATE_DEAL_SUCCESS
} from '../types';

export const gettingDealElements = () => ({
  type: GETTING_DEAL_ELEMENTS
});

export const getDealElementFailure = () => ({
  type: GET_DEAL_ELEMENT_FAILURE
});

export const getDealElementSuccess = (payload) => ({
  type: GET_DEAL_ELEMENT_SUCCESS,
  payload
});

export const gettingPaymentMethods = () => ({
  type: GETTING_PAYMENT_METHODS
});

export const getPaymentMethodSuccess = (payload) => ({
  type: GET_PAYMENT_METHODS_SUCCESS,
  payload
});

export const getPaymentMethodFailure = () => ({
  type: GET_PAYMENT_METHODS_FAILURE
});

export const gettingDeals = () => ({
  type: GETTING_DEALS
});

export const getDealSuccess = (payload) => ({
  type: GET_DEALS_SUCCESS,
  payload
});

export const getDealFailure = () => ({
  type: GET_DEALS_FAILURE
});

export const createDealSuccess = (payload) => ({
  type: CREATE_DEAL_SUCCESS,
  payload
});

export const uploadDealDocSuccess = (payload) => ({
  type: UPLOAD_DEAL_DOC_SUCCESS,
  payload
});

export const updateDealSuccess = (payload) => ({
  type: UPDATE_DEAL_SUCCESS,
  payload
});
