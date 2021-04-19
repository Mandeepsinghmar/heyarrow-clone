import {
  GETTING_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATING_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../types';

export const gettingProfile = () => ({
  type: GETTING_PROFILE,
});

export const getProfileSuccess = (payload) => ({
  type: GET_PROFILE_SUCCESS,
  payload
});

export const getProfileFailure = () => ({
  type: GET_PROFILE_FAILURE
});

export const updatingProfile = () => ({
  type: UPDATING_PROFILE
});

export const updateProfileSuccess = (payload) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload
});

export const updateProfileFailure = () => ({
  type: UPDATE_PROFILE_FAILURE
});
