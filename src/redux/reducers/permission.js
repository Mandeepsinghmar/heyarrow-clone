import {
  SET_ROLE_LIST, SET_ROLE_PERMISSION,
  CREATE_ROLE_PERMISSION, UPDATE_ROLE_PERMISSION
} from '../types/permission';

const initialState = {
  roleList: [],
  rolePermission: [],
  addRolePermission: {},
  updateRolePermission: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ROLE_LIST:
    return {
      ...state,
      roleList: action.payload
    };
  case SET_ROLE_PERMISSION:
    return {
      ...state,
      rolePermission: action.payload
    };
  case CREATE_ROLE_PERMISSION:
    return {
      ...state,
      addRolePermission: action.payload
    };
  case UPDATE_ROLE_PERMISSION:
    return {
      ...state,
      updateRolePermission: action.payload
    };
  default:
    return state;
  }
};
