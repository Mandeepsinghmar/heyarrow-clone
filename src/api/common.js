import {
  setAllUsers,
  setCities,
  setCountries,
  setStates,
  getMentionsSuccess,
  gettingMentions,
  getMentionsFailure
} from '../redux/actions';

import makeTheApiCall, { generateOptions } from './apiCalls';

export const getCountries = (page = 1) => {
  const url = `services/countries?limit=100&page=${page}`;
  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setCountries(response.data));
      return response.data;
    })
    .catch((error) => error);
};

export const getStates = (countryId = 1, page = 1, search = '') => {
  const url = `services/states?limit=70&page=${page}&country=${countryId}&search=${search}`;
  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setStates(response.data, page));
      return response.data;
    })
    .catch((error) => error);
};

export const getCities = (stateId, page = 1, search = '') => {
  const url = `services/cities?limit=1396&page=${page}&state=${stateId}&search=${search}`;
  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setCities(response.data, stateId));
      return response.data;
    })
    .catch((error) => error);
};

export const getUsers = (page = 1, limit = 10) => {
  const options = generateOptions(
    `team/departments/users/?page=${page}&limit=${limit}`,
    'GET'
  );
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAllUsers(response.data, page));
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getMentions = (filters) => {
  const options = generateOptions('mention/role-department-list', 'GET', filters);
  return (dispatch) => {
    dispatch(gettingMentions());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getMentionsSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getMentionsFailure());
        throw error;
      });
  };
};
