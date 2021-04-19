import {
  SET_ROLE_LIST, SET_ROLE_PERMISSION,
  CREATE_ROLE_PERMISSION, UPDATE_ROLE_PERMISSION
} from '../types';

export const setRoleList = (data) => ({
  type: SET_ROLE_LIST,
  payload: data
});

export const setRolePermission = (data) => ({
  type: SET_ROLE_PERMISSION,
  payload: data
});

export const createRolePermission = (data) => ({
  type: CREATE_ROLE_PERMISSION,
  payload: data
});

export const updateRolePermission = (data) => ({
  type: UPDATE_ROLE_PERMISSION,
  payload: data
});
