import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  setAllNotification,
  fetchingNotification,
  getUnreadNotificationCountSuccess,
  markAllNotificationAsReadSuccess
} from '../redux/actions';

export const fetchAllNotifications = (limit = 1000, page = 1) => {
  const options = generateOptions('notifications', 'GET', { limit, page });
  return (dispatch) => {
    dispatch(fetchingNotification());
    return makeTheApiCall(options)
      .then((response) => {
        dispatch(setAllNotification(response.data));
        return response.data;
      })
      .catch(() => {
        dispatch(setAllNotification([]));
      });
  };
};

export const getNotificationUnreadCounts = () => {
  const options = generateOptions('notifications/unread/count');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(getUnreadNotificationCountSuccess(data?.unread));
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const markAllNotificationAsRead = () => {
  const options = generateOptions('notifications/read-all', 'POST');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(markAllNotificationAsReadSuccess());
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
