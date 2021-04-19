import queryString from 'query-string';

import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  gettingTeamMemberDetails,
  getTeamMemberDetailSuccess,
  getTeamDetailFailure,
  gettingAllUsers,
  getAllUserFailure,
  getAllUserSuccess,
  gettingTeamOverview,
  getTeamOverviewFailure,
  getTeamOverviewSuccess,
  gettingSalesData,
  getSalesDataFailure,
  getSalesDataSuccess,
  gettingTeamMembers,
  getTeamMembersSuccess,
  getTeamMembersFailure,
  gettingTeamCustomers,
  getTeamCustomersSuccess,
  getTeamCustomersFailure
} from '../redux/actions';

export const getTeamMemberDetails = (userId) => {
  const options = generateOptions(`team/user/${userId}`);
  return (dispatch) => {
    dispatch(gettingTeamMemberDetails());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getTeamMemberDetailSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getTeamDetailFailure());
      throw error;
    });
  };
};

export const getAllUsers = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters,
  };
  const options = generateOptions(`team/departments/users?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingAllUsers());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getAllUserSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getAllUserFailure());
      throw error;
    });
  };
};

export const getTeamDetail = (filters = {}) => {
  const options = generateOptions(`team/details?${queryString.stringify(filters)}`);
  return (dispatch) => {
    dispatch(gettingTeamMembers());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getTeamMembersSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getTeamMembersFailure());
      throw error;
    });
  };
};

export const getTeamOverview = (filters = {}) => {
  const options = generateOptions(`team/overview?${queryString.stringify(filters)}`);
  return (dispatch) => {
    dispatch(gettingTeamOverview());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getTeamOverviewSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getTeamOverviewFailure());
      throw error;
    });
  };
};

export const getSalesData = (status = 'shared', filters = {}) => {
  const allFilters = {
    durationType: 'yearly',
    duration: 'all',
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`team/customers/${status}?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingSalesData());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getSalesDataSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getSalesDataFailure());
      throw error;
    });
  };
};

export const getTeamCustomers = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    durationType: 'yearly',
    duration: 'all',
    ...filters
  };
  const options = generateOptions(`team/customers?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingTeamCustomers());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getTeamCustomersSuccess(data.customers));
      return data;
    }).catch((error) => {
      dispatch(getTeamCustomersFailure());
      throw error;
    });
  };
};
