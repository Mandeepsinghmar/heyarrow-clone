import axios from 'axios';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import { API_URL } from '../constants';
import store from '../redux';
import logout from '../services/logout';

/**
 * This function would universally handle API errors
 *
 * @param apiOptions
 * @param multiple Parameter for axios.all
 * request (apiOptions should be array of axios requests)
 * @param dispatch
 * @returns {axios.Promise}
 * @constructor
 */

export default function makeTheApiCall(apiOptions, multiple = false) {
  const success = (resolve, reject, response) => {
    const checkResponse = (res) => {
      if (
        res.status !== 200
        && res.status !== 201
        && res.status !== 202
        && res.status !== 203
        && res.status !== 204
      ) {
        return reject(res);
      }
      return resolve(res);
    };
    if (Array.isArray(response)) {
      response.forEach((r) => {
        checkResponse(r);
      });
    } else {
      checkResponse(response);
    }
  };

  const onError = debounce((err) => {
    toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Something went wrong!');
  }, 500);

  const error = (resolve, reject, err) => {
    if (err.status === 401 || (err.response && err.response.status === 401)) {
      store.dispatch(logout());
    } else {
      onError(err);
      return reject(err.response);
    }
    const er = JSON.parse(JSON.stringify(err));
    return reject(er);
  };

  if (multiple) {
    return new Promise((resolve, reject) => axios
      .all(apiOptions)
      .then((response) => success(resolve, reject, response))
      .catch((err) => error(resolve, reject, err)));
  }
  return new Promise((resolve, reject) => axios(apiOptions)
    .then((response) => success(resolve, reject, response))
    .catch((err) => error(resolve, reject, err)));
}
/**
 * Build the correct headers and options to make the API call.
 * @params url: string
 * @params method: string
 * @params data: object
 * @returns {{
 * method: string,
 * url: string,
 * crossDomain: boolean,
 * headers: {Authorization: string, Content-Type: string}, json: boolean
 * }}
 */

export function generateOptions(url = '', method = 'GET', data, formType = 'application/json', baseUrl = '') {
  const APIBaseUrl = baseUrl || API_URL;
  const options = {
    method,
    url: `${APIBaseUrl}/${url}`,
  };
  options.headers = {
    'Content-Type': formType,
    Authorization: `Bearer ${store?.getState()?.auth?.token || localStorage.token}`,
  };
  if (!data) {
    return options;
  }

  if (method === 'GET') {
    options.params = { ...data };
  } else {
    options.data = data;
  }
  return options;
}
