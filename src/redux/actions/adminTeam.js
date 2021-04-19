import {
  SET_ADMIN_TEAM_DEPARTMENT_LIST, SET_ADMIN_ALL_TEAM_DEPARTMENT,
  ENABLE_EDIT_DEPARTMENT, DISABLE_EDIT_DEPARTMENT,
  CANCEL_DEPARTMENT, ADD_NEW_DEPARTMENT,
  SET_NEW_DEPARTMENT, PUSH_NEW_DEPARTMENT,
  ONCHANGE_TEAM, SET_ADMIN_TEAM_DETAILS,
  SET_ADMIN_TEAM_MEMBER_DATA, ADD_NEW_TEAM_MEMBER,
  SET_NEW_TEAM_ITEM, REMOVE_NEW_TEAM_ITEM,
  UPDATE_TEAM_ITEM, SET_DEACTIVATED_USERS,
  SET_ORG_CHART, SET_MEMBERS_FILTER
} from '../types';

export const setAdminTeamDepartmentList = (data) => ({
  type: SET_ADMIN_TEAM_DEPARTMENT_LIST,
  payload: data
});

export const setAdminAllTeamDepartment = (data, page) => ({
  type: SET_ADMIN_ALL_TEAM_DEPARTMENT,
  data,
  page
});

export const enableEditDepartment = (index) => ({
  type: ENABLE_EDIT_DEPARTMENT,
  index
});

export const disableEditDepartment = (index, data) => ({
  type: DISABLE_EDIT_DEPARTMENT,
  index,
  data
});

export const cancelDepartment = (index) => ({
  type: CANCEL_DEPARTMENT,
  index
});

export const addNewDepartment = (form) => ({
  type: ADD_NEW_DEPARTMENT,
  form
});

export const setNewDepartment = (item, index) => ({
  type: SET_NEW_DEPARTMENT,
  item,
  index
});

export const pushNewDepartment = (item) => ({
  type: PUSH_NEW_DEPARTMENT,
  item,
});

export const onChangeTeam = (value, key, item, index) => ({
  type: ONCHANGE_TEAM,
  value,
  key,
  item,
  index
});

export const setAdminTeamDetails = (data) => ({
  type: SET_ADMIN_TEAM_DETAILS,
  payload: data
});

export const setAdminTeamMemberData = (data, page, key) => ({
  type: SET_ADMIN_TEAM_MEMBER_DATA,
  payload: data,
  page,
  key
});

export const addNewTeamMember = (form) => ({
  type: ADD_NEW_TEAM_MEMBER,
  form
});

export const setNewTeamMember = (item, index) => ({
  type: SET_NEW_TEAM_ITEM,
  item,
  index
});

export const removeNewTeam = (index) => ({
  type: REMOVE_NEW_TEAM_ITEM,
  index
});

export const updateExistTeam = (item) => ({
  type: UPDATE_TEAM_ITEM,
  item
});

export const setAdminOrgChart = (item) => ({
  type: SET_ORG_CHART,
  item
});

export const setAdminDeactivatedUsers = (item) => ({
  type: SET_DEACTIVATED_USERS,
  item
});

export const setMembersFilter = (item) => ({
  type: SET_MEMBERS_FILTER,
  item
});
