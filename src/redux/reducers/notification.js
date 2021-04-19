import {
  FETCH_ALL_NOTIFICATIONS,
  START_FETCH_ALL_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATION_COUNT_SUCCESS,
  MARK_ALL_NOTIFICATION_AS_READ_SUCCESS
} from '../types';

import { notificationInitialState } from '../initial-states';

export default ((state = notificationInitialState, { type, payload }) => {
  switch (type) {
  case FETCH_ALL_NOTIFICATIONS:
    return {
      ...state,
      loading: false,
      data: payload
    };
  case START_FETCH_ALL_NOTIFICATIONS:
    return {
      ...state,
      loading: true,
    };
  case GET_UNREAD_NOTIFICATION_COUNT_SUCCESS:
    return {
      ...state,
      unreadCounts: payload
    };
  case MARK_ALL_NOTIFICATION_AS_READ_SUCCESS:
    return {
      ...state,
      unreadCounts: 0
    };
  default:
    return state;
  }
});
