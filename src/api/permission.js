import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  createRolePermission,
  setRoleList, setRolePermission, updateRolePermission
} from '../redux/actions';
import logout from '../services/logout';

export const getRolesList = () => {
  const options = generateOptions('rbac/roles', 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setRoleList(response.data));
        return response.data;
      }).catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        throw error;
      })
  );
};

export const getRolesPermission = () => {
  const options = generateOptions('rbac', 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setRolePermission(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const getRolesPermissionById = (id) => {
  const options = generateOptions(`rbac/user/permissions/${id}`, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setRolePermission(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const addRolesPermission = (data) => {
  const options = generateOptions('rbac', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(createRolePermission(response.data));
        dispatch(getRolesList());
        dispatch(getRolesPermission());
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const updateRolesPermission = (data, id) => {
  const options = generateOptions(`rbac/${id}`, 'PUT', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(updateRolePermission(response.data));
        dispatch(getRolesPermission());
        dispatch(getRolesList());
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const updateUserRolesPermission = (data, id) => {
  const options = generateOptions(`rbac/user/${id}`, 'PUT', data);
  return () => (
    makeTheApiCall(options)
      .then((response) => response.data).catch((error) => {
        throw error;
      })
  );
};
