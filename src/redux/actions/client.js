import {
  GETTING_CLIENT_DETAILS,
  GET_CLIENT_DETAILS_FAILURE,
  GET_CLIENT_DETAILS_SUCCESS,
  UPDATE_CLIENT_DETAIL_SUCCESS,
  UPDATE_CLIENT_DETAILS_FROM_FORM
} from '../types';

export const gettingClientDetails = () => ({
  type: GETTING_CLIENT_DETAILS,
});

export const getClientFailure = () => ({
  type: GET_CLIENT_DETAILS_FAILURE
});

export const getClientSuccess = (payload) => ({
  type: GET_CLIENT_DETAILS_SUCCESS,
  payload
});

export const updateClientDetailSuccess = (payload) => ({
  type: UPDATE_CLIENT_DETAIL_SUCCESS,
  payload
});

export const updateClientDetailFromForm = (payload) => ({
  type: UPDATE_CLIENT_DETAILS_FROM_FORM,
  payload,
});
