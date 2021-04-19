import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  setAdminLocationRegion, createAdminLocationRegion
} from '../redux/actions';

export const getRegions = () => {
  const options = generateOptions('locations/regions', 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminLocationRegion(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const createRegion = (data) => {
  const options = generateOptions('locations/region', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(createAdminLocationRegion(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const setCitiesRegion = (data) => {
  const options = generateOptions('locations/region/cities', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(createAdminLocationRegion(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const deleteRegion = (id) => {
  const options = generateOptions(`locations/region/${id}`, 'DELETE');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(getRegions());
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};
