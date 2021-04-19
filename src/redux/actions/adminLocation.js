import {
  SET_ADMIN_LOCATION_REGION, CREATE_ADMIN_LOCATION_REGION,
  ONCHANGE_LOCATION, UPDATE_ADMIN_LOCATION
} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const setAdminLocationRegion = (data) => ({
  type: SET_ADMIN_LOCATION_REGION,
  payload: data
});

export const createAdminLocationRegion = (data) => ({
  type: CREATE_ADMIN_LOCATION_REGION,
  payload: data
});

export const onChangeLocation = (value, key, item, index) => ({
  type: ONCHANGE_LOCATION,
  value,
  key,
  item,
  index
});

export const updateExistLocation = (data, index) => ({
  type: UPDATE_ADMIN_LOCATION,
  data,
  index
});
