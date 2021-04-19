import { toast } from 'react-toastify';
import { isSafari } from 'react-device-detect';

import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  loggingUser,
  loginUserFailure,
  loginUserSuccess,
  getClientSuccess,
  getProfileSuccess,
} from '../redux/actions';
import { DOMAIN } from '../constants';
import subscribeUser from '../subscription';
import logoutService from '../services/logout';

export const loginUser = (data) => {
  const options = generateOptions('services/login', 'POST', {
    ...data,
    domain: DOMAIN
  });
  return (dispatch) => {
    dispatch(loggingUser());
    return makeTheApiCall(options)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        dispatch(loginUserSuccess(response.data));
        dispatch(getProfileSuccess(response.data.user));
        dispatch(getClientSuccess(response.data.user.client));
        subscribeUser();
        return response.data;
      })
      .catch((error) => {
        dispatch(loginUserFailure());
        throw error;
      });
  };
};

export const logoutUser = () => {
  const options = generateOptions(`logout/${isSafari ? 'safari' : 'other'}`);
  return (dispatch) => {
    dispatch(logoutService());
    return makeTheApiCall(options)
      .then(({ data }) => data)
      .catch((error) => { throw error; });
  };
};

export const forgotPassword = (body) => {
  const options = generateOptions('services/resetpassword', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data).catch((error) => {
      throw error;
    });
};

export const resetPassword = (body) => {
  const options = generateOptions('services/password', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Password reset successfully');
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const changePassword = (body) => {
  const options = generateOptions('profile/changepassword', 'PUT', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Password changed successfully');
      return data;
    }).catch((error) => {
      throw error;
    });
};
