import {
  clientDetailInitialState
} from '../initial-states';
import {
  GETTING_CLIENT_DETAILS,
  GET_CLIENT_DETAILS_SUCCESS,
  GET_CLIENT_DETAILS_FAILURE,
  UPDATE_CLIENT_DETAIL_SUCCESS,
  UPDATE_CLIENT_DETAILS_FROM_FORM
} from '../types';

export default (state = clientDetailInitialState, { type, payload }) => {
  switch (type) {
  case GETTING_CLIENT_DETAILS:
    return {
      ...state,
      loading: true,
    };
  case GET_CLIENT_DETAILS_FAILURE:
    return {
      ...state,
      loading: false,
    };
  case GET_CLIENT_DETAILS_SUCCESS:
    return {
      ...state,
      ...payload,
      loading: false,
    };
  case UPDATE_CLIENT_DETAIL_SUCCESS:
    return {
      ...state,
      ...payload
    };
  case UPDATE_CLIENT_DETAILS_FROM_FORM:
    return {
      ...state,
      ...payload,
    };
  default:
    return state;
  }
};
