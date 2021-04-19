import {
  profileInitialState
} from '../initial-states';

import {
  GETTING_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATING_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from '../types';

export default (state = profileInitialState, {
  type,
  payload
}) => {
  switch (type) {
  case GETTING_PROFILE:
    return {
      ...state,
      loading: true
    };
  case GET_PROFILE_SUCCESS:
    return {
      ...state,
      loading: false,
      user: {
        ...state.user,
        ...payload,
      }
    };
  case GET_PROFILE_FAILURE:
    return {
      ...state,
      loading: false
    };
  case UPDATING_PROFILE:
    return {
      ...state,
      updating: true
    };
  case UPDATE_PROFILE_SUCCESS:
    return {
      ...state,
      updating: false,
      user: {
        ...state.user,
        ...payload
      }
    };
  case UPDATE_PROFILE_FAILURE:
    return {
      ...state,
      updating: false
    };
  default:
    return state;
  }
};
