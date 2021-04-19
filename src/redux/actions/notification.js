import {
  FETCH_ALL_NOTIFICATIONS,
  START_FETCH_ALL_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATION_COUNT_SUCCESS,
  MARK_ALL_NOTIFICATION_AS_READ_SUCCESS
} from '../types/notification';

export const fetchingNotification = () => ({
  type: START_FETCH_ALL_NOTIFICATIONS
});

export const setAllNotification = (data) => ({
  type: FETCH_ALL_NOTIFICATIONS,
  payload: data,
});

export const getUnreadNotificationCountSuccess = (payload) => ({
  type: GET_UNREAD_NOTIFICATION_COUNT_SUCCESS,
  payload
});

export const markAllNotificationAsReadSuccess = () => ({
  type: MARK_ALL_NOTIFICATION_AS_READ_SUCCESS
});
