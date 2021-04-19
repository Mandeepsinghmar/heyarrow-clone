import {
  GETTING_TEAM_MEMBER_DETAILS,
  GET_TEAM_MEMBER_DETAILS_SUCCESS,
  GET_TEAM_MEMBER_DETAILS_FAILURE,
  GETTING_ALL_USERS,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  CLEAR_ALL_USERS,
  GETTING_TEAM_OVERVIEW,
  GET_TEAM_OVERVIEW_SUCCESS,
  GET_TEAM_OVERVIEW_FAILURE,
  GETTING_SALESDATA,
  GET_SALESDATA_SUCCESS,
  GET_SALESDATA_FAILURE,
  GETTING_TEAM_MEMBERS,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAILURE,
  GETTING_TEAM_CUSTOMERS,
  GET_TEAM_CUSTOMERS_SUCCESS,
  GET_TEAM_CUSTOMERS_FAILURE
} from '../types';

export const gettingTeamMemberDetails = () => ({
  type: GETTING_TEAM_MEMBER_DETAILS,
});

export const getTeamMemberDetailSuccess = (payload) => ({
  type: GET_TEAM_MEMBER_DETAILS_SUCCESS,
  payload,
});

export const getTeamDetailFailure = () => ({
  type: GET_TEAM_MEMBER_DETAILS_FAILURE
});

export const gettingAllUsers = () => ({
  type: GETTING_ALL_USERS,
});

export const getAllUserSuccess = (payload) => ({
  type: GET_ALL_USERS_SUCCESS,
  payload,
});

export const getAllUserFailure = () => ({
  type: GET_ALL_USERS_FAILURE,
});

export const clearAllUsers = () => ({
  type: CLEAR_ALL_USERS
});

export const gettingTeamOverview = () => ({
  type: GETTING_TEAM_OVERVIEW
});

export const getTeamOverviewSuccess = (payload) => ({
  type: GET_TEAM_OVERVIEW_SUCCESS,
  payload,
});

export const getTeamOverviewFailure = () => ({
  type: GET_TEAM_OVERVIEW_FAILURE
});

export const gettingSalesData = () => ({
  type: GETTING_SALESDATA,
});

export const getSalesDataSuccess = (payload) => ({
  type: GET_SALESDATA_SUCCESS,
  payload
});

export const getSalesDataFailure = () => ({
  type: GET_SALESDATA_FAILURE,
});

export const gettingTeamMembers = () => ({
  type: GETTING_TEAM_MEMBERS
});

export const getTeamMembersSuccess = (payload) => ({
  type: GET_TEAM_MEMBERS_SUCCESS,
  payload
});

export const getTeamMembersFailure = () => ({
  type: GET_TEAM_MEMBERS_FAILURE
});

export const gettingTeamCustomers = () => ({
  type: GETTING_TEAM_CUSTOMERS
});

export const getTeamCustomersSuccess = (payload) => ({
  type: GET_TEAM_CUSTOMERS_SUCCESS,
  payload
});

export const getTeamCustomersFailure = () => ({
  type: GET_TEAM_CUSTOMERS_FAILURE
});
