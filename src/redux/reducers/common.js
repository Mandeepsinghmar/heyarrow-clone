import {
  SET_ALL_COUNTRIES,
  SET_ALL_STATES,
  SET_ALL_CITIES,
  SET_ALL_USERS,
  GET_MENTIONS_SUCCESS,
  GETTING_MENTIONS,
  GET_MENTIONS_FAILURE,
} from '../types';

import { commonInitialState } from '../initial-states';

export default (state = commonInitialState, action) => {
  switch (action.type) {
  case SET_ALL_COUNTRIES:
    return {
      ...state,
      loader: false,
      countries: action.data,
    };
  case SET_ALL_STATES:
    return {
      ...state,
      loader: false,
      states: action.data,
    };
  case SET_ALL_CITIES:
    return {
      ...state,
      loader: false,
      cities: {
        ...state.cities,
        [action.index]: action.data,
      },
    };
  case SET_ALL_USERS: {
    let allUsers = [...state.users];
    if (action.page === 1) {
      allUsers = action.data;
    } else {
      allUsers = allUsers.concat(action.data);
    }
    return {
      ...state,
      loader: false,
      users: allUsers,
    };
  }
  case GETTING_MENTIONS:
    return {
      ...state,
      mentions: {
        ...state.mentions,
        loading: true,
      },
    };
  case GET_MENTIONS_FAILURE:
    return {
      ...state,
      mentions: {
        ...state.mentions,
        loading: false,
      },
    };
  case GET_MENTIONS_SUCCESS:
    return {
      ...state,
      mentions: {
        ...state.mentions,
        loading: false,
        data: action.payload,
      },
    };
  default:
    return state;
  }
};
