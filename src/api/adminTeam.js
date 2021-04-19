/* eslint-disable no-unused-vars */
/* eslint-disable */
import { toast } from 'react-toastify';
import queryString from 'query-string';
import {
  setAdminAllTeamDepartment, setAdminTeamDepartmentList,
  disableEditDepartment, setNewDepartment,
  pushNewDepartment, setAdminTeamDetails,
  setAdminTeamMemberData, setNewTeamMember,
  updateExistTeam, setAdminDeactivatedUsers,
  setAdminOrgChart, setMembersFilter
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const inviteTeamUser = (id) => {
  const options = generateOptions(`team/invite/${id}`, 'PUT');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const createTeamUser = (data, index) => {
  const options = generateOptions('team/users', 'POST', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      toast.success('You have sent an invite successfully.');
      const result = { ...response.data, zipcode: data.zipcode || '' };
      dispatch(setNewTeamMember(result, index));
      return response.data;
    })
    .catch((error) => {
      toast.error('Invite could not be send successfully.');
      return error;
    });
};

export const updateTeamUser = (id, data) => {
  const options = generateOptions(`team/users/${id}`, 'PUT', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      toast.success('Team member’s details updated successfully.');
      dispatch(updateExistTeam(response));
      return response.data;
    })
    .catch((error) => {
      toast.error('Team member’s details not successfully.');
      return error;
    });
};

export const cancelUserInvitation = (id, data) => {
  // bug expected here
  const options = generateOptions(`team/invite/cancel/${id}`, 'PUT', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const getInvitationStatus = (id) => {
  // bug expected here
  const options = generateOptions(`team/invite/status/${id}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const getOrgChart = () => {
  // bug expected here
  const options = generateOptions('team/orgchart', 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminOrgChart(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getDepartmentList = () => {
  // bug expected here
  const options = generateOptions('team/departments', 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminTeamDepartmentList(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getAllDepartmentUserList = (limit, id, page, search) => {
  const allFilters = {
    page,
    limit,
    sortBy: 'firstName',
    order: 'ASC',
    search
  };
  let url = `team/departments/users?${queryString.stringify(allFilters)}`;
  if (id !== 'all' && id !== undefined && id !== 'deactivate') {
    url = `team/departments/${id}/users?${queryString.stringify(allFilters)}`;
  }
  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      let result = [];
      if (id === 'all' || id === undefined) {
        result = response.data;
      } else if (response.data && response.data.length) {
        result = response.data[0].users;
      } else {
        result = [];
      }
      dispatch(setAdminAllTeamDepartment(result, page));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const createDepartment = (data, index) => {
  const options = generateOptions('team/departments', 'POST', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      if (index) {
        dispatch(setNewDepartment(response.data, index));
      } else {
        dispatch(pushNewDepartment(response.data));
      }
      toast.success('Department added successfully');
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const updateDepartment = (id, data, index) => {
  const options = generateOptions(`team/departments/${id}`, 'PUT', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(disableEditDepartment(index, data));
      return response.data;
    }).catch((error) => {
      if (error && error.status && error.status === 202) {
        toast.success('Department updated successfully');
        dispatch(disableEditDepartment(index, data));
      } else {
        toast.error('Department not updated');
        return error;
      }
      throw error;
    });
};

export const assignUserDepartment = (data) => {
  const options = generateOptions('team/assign', 'POST', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const removeUserDepartment = (data) => {
  const options = generateOptions('team/user/assign', 'DELETE', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const getDeactivatedUser = (search) => {
  // bug expected here
  const options = generateOptions(`team/deactivated?search=${search}&sortBy=firstName&order=ASC`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminDeactivatedUsers(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const activateUser = (data) => {
  const options = generateOptions('team/users/activate', 'PUT', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const deactivateUser = (data) => {
  const options = generateOptions('team/users/deactivate', 'PUT', data);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

// eslint-disable-next-line max-len
export const getMemberSalesRepData = (type, durationType, duration, page, id, limit, order) => {
  const allFilters = {
    page,
    durationType,
    duration,
    limit,
    order,
    user: id
  };
  let url = '';
  if (type === 'team') {
    url = `team/details?user=${id}`;
  } else if (type === 'customers') {
    url = `team/customers?${queryString.stringify(allFilters)}`;
  } else {
    url = `team/customers/${type}?${queryString.stringify(allFilters)}`;
  }

  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      const key =  type === 'customers' ? 'customers' : 'data';
      const data = type === 'team' ? {data: response.data } : response.data;
      dispatch(setAdminTeamMemberData(data, allFilters.page, key));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getMembersFilter = (
  durationType,
  duration,
  page,
  limit,
  order
) => {
  const allFilters = {
    page,
    durationType,
    duration,
    limit,
    order,
    user: ''
  };
  const url = `team/customers/shared?${queryString.stringify(allFilters)}`;

  const options = generateOptions(url, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setMembersFilter(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getCustomerSalesRep = (page, search, durationType, duration) => {
  // bug expected here
  const options = generateOptions(`team/customers?limit=10&page=${page}&search=${search}&user=4&sortBy=email&order=ASC&durationType=${durationType}&duration=${duration}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};

export const getSideBarSalesRep = (id) => {
  // bug expected here
  const options = generateOptions(`team/overview?user=${id}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminTeamDetails(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getTeamDetails = () => {
  // bug expected here
  const options = generateOptions('team/details', 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => response.data).catch((error) => {
      throw error;
    });
};
