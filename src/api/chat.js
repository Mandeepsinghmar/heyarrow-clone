import queryString from 'query-string';
import { toast } from 'react-toastify';

import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  gettingCustomerChatContacts,
  getCustomerChatContactsFailure,
  getCustomerChatContactsSuccess,
  gettingChatMessages,
  getChatMessageFailure,
  getChatMessageSuccess,
  postingMessage,
  postMessageFailure,
  postMessageSuccess,
  gettingTeamChatContacts,
  getTeamChatContactSuccess,
  getTeamChatContactFailure,
  gettingGroupChatDetails,
  getGroupChatDetailFailure,
  getGroupChatDetailSuccess,
  removeMemberFromGroupSuccess,
  updateGroupChatSuccess,
  getUnreadCountSuccess,
  deleteGroupChatSuccess,
  loadMoreMessages
} from '../redux/actions';

export const getCustomerChatContacts = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`chat/customers?${queryString.stringify(allFilters)}`, 'GET');
  return (dispatch) => {
    dispatch(gettingCustomerChatContacts());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerChatContactsSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getCustomerChatContactsFailure());
        throw error;
      });
  };
};

export const reloadCustomerChatContacts = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`chat/customers?${queryString.stringify(allFilters)}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(getCustomerChatContactsSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getCustomerChatContactsFailure());
      throw error;
    });
};

export const getTeamChatContacts = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`chat/team?${queryString.stringify(allFilters)}`, 'GET');
  return (dispatch) => {
    dispatch(gettingTeamChatContacts());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getTeamChatContactSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getTeamChatContactFailure());
        throw error;
      });
  };
};

export const reloadTeamChatContacts = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`chat/team?${queryString.stringify(allFilters)}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(getTeamChatContactSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getTeamChatContactFailure());
      throw error;
    });
};

export const getCustomerChatMessages = (customerId, filters = {}) => {
  const allFilters = {
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`chat/history/customer/${customerId}`, 'GET', allFilters);
  return (dispatch) => {
    if (allFilters.page === 1) {
      dispatch(gettingChatMessages());
    }
    return makeTheApiCall(options)
      .then(({ data }) => {
        if (allFilters.page === 1) {
          dispatch(getChatMessageSuccess(data));
        } else {
          dispatch(loadMoreMessages(data));
        }
        return data;
      }).catch((error) => {
        dispatch(getChatMessageFailure());
        throw error;
      });
  };
};

export const getUserChatMessages = (userId, filters = {}) => {
  const allFilters = {
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`chat/history/user/${userId}`, 'GET', allFilters);
  return (dispatch) => {
    if (allFilters.page === 1) {
      dispatch(gettingChatMessages());
    }
    return makeTheApiCall(options)
      .then(({ data }) => {
        if (allFilters.page === 1) {
          dispatch(getChatMessageSuccess(data));
        } else {
          dispatch(loadMoreMessages(data));
        }
        return data;
      }).catch((error) => {
        dispatch(getChatMessageFailure());
        throw error;
      });
  };
};

export const getGroupChatMessages = (groupId, filters = {}) => {
  const allFilters = {
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`chat/history/group/${groupId}`, 'GET', allFilters);
  return (dispatch) => {
    if (allFilters.page === 1) {
      dispatch(gettingChatMessages());
    }
    return makeTheApiCall(options)
      .then(({ data }) => {
        if (allFilters.page === 1) {
          dispatch(getChatMessageSuccess(data));
        } else {
          dispatch(loadMoreMessages(data));
        }
        return data;
      })
      .catch((error) => {
        dispatch(getChatMessageFailure());
        throw error;
      });
  };
};

export const postMessage = (body, preMessage) => {
  const options = generateOptions('chat', 'POST', body);
  return (dispatch) => {
    dispatch(postingMessage());
    dispatch(postMessageSuccess(preMessage));
    return makeTheApiCall(options)
      .then(({ data }) => data).catch((error) => {
        dispatch(postMessageFailure());
        throw error;
      });
  };
};

export const getGroupChatDetails = (groupId) => {
  const options = generateOptions(`chat/group/${groupId}`);
  return (dispatch) => {
    dispatch(gettingGroupChatDetails());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getGroupChatDetailSuccess(data));
    }).catch((error) => {
      dispatch(getGroupChatDetailFailure());
      throw error;
    });
  };
};

export const createChatGroup = (body) => {
  const options = generateOptions('chat/group', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data).catch((error) => {
      throw error;
    });
};

export const deleteChatGroup = (id) => {
  const options = generateOptions(`chat/group/${id}`, 'DELETE');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Group deleted successfully');
      dispatch(deleteGroupChatSuccess(id));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const addMemberToGroup = (body) => {
  const options = generateOptions('chat/group/user', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data).catch((error) => {
      throw error;
    });
};

export const removeMemberFromGroup = (body) => {
  const options = generateOptions('chat/group/user', 'DELETE', body);
  return (dispatch) => makeTheApiCall(options).then(({ data }) => {
    dispatch(removeMemberFromGroupSuccess(body));
    return data;
  }).catch((error) => {
    throw error;
  });
};

export const updateGroupChat = (id, body) => {
  const options = generateOptions(`chat/group/${id}`, 'PUT', body);
  return (dispatch) => makeTheApiCall(options).then(({ data }) => {
    dispatch(updateGroupChatSuccess({
      groupName: body.name,
      description: body.details
    }));
    return data;
  }).catch((error) => {
    throw error;
  });
};

export const getTotalUnreadCounts = () => {
  const options = generateOptions('chat/unread/count', 'GET');
  return (dispatch) => makeTheApiCall(options).then(({ data }) => {
    dispatch(getUnreadCountSuccess(data.unread));
    return data;
  }).catch((error) => {
    throw error;
  });
};

export const sendAttachment = (body) => {
  const options = generateOptions('chat/assets', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
};
