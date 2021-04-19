import { authInitialState } from '../initial-states';
import {
  LOGGING_USER,
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT,
  UPDATE_CURRENT_USER
} from '../types';

export default (state = authInitialState, { type, payload }) => {
  switch (type) {
  case LOGGING_USER:
    return {
      ...state,
      loading: true,
    };
  case LOGIN_USER_FAILURE:
    return {
      ...state,
      loading: false,
    };
  case LOGIN_USER_SUCCESS:
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      currentUser: payload.user,
      token: payload.token
    };
  case LOGOUT:
    return {
      ...state,
      isAuthenticated: false,
      currentUser: null,
      token: null
    };
  case UPDATE_CURRENT_USER:
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        ...payload
      }
    };
  default:
    return state;
  }
};
