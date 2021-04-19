import { toast } from 'react-toastify';

import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  gettingProfile,
  getProfileSuccess,
  getProfileFailure,
  updatingProfile,
  updateProfileSuccess,
  updateProfileFailure,
  updateCurrentUser
} from '../redux/actions';

export const getProfile = () => {
  const options = generateOptions('profile');
  return (dispatch) => {
    dispatch(gettingProfile());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getProfileSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getProfileFailure());
      throw error;
    });
  };
};

export const updateProfile = (body) => {
  const options = generateOptions('profile', 'PUT', body);
  return (dispatch) => {
    dispatch(updatingProfile());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(updateProfileSuccess(data));
        dispatch(updateCurrentUser(data));
        toast.success('Profile updated successfully');
        return data;
      }).catch((error) => {
        dispatch(updateProfileFailure());
        throw error;
      });
  };
};
