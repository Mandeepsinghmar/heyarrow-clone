import makeTheApiCall, { generateOptions } from './apiCalls';
import { DOMAIN } from '../constants';
import {
  gettingClientDetails,
  getClientFailure,
  getClientSuccess,
  updateClientDetailSuccess
} from '../redux/actions';

export const getClientDetails = () => {
  const options = generateOptions(`services/client/${DOMAIN}`);
  return (dispatch) => {
    dispatch(gettingClientDetails());
    return makeTheApiCall(options)
      .then((response) => {
        dispatch(getClientSuccess(response.data));
        return response.data;
      }).catch((error) => {
        dispatch(getClientFailure());
        throw error;
      });
  };
};

export const getAdminClientDetails = () => {
  const options = generateOptions('clients');
  return (dispatch) => {
    dispatch(gettingClientDetails());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getClientSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getClientFailure());
        throw error;
      });
  };
};

export const updateClientDetails = (clientId, body) => {
  const options = generateOptions(`clients/${clientId}`, 'PUT', body);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(updateClientDetailSuccess());
      return response;
    }).catch((error) => {
      throw error;
    });
};
