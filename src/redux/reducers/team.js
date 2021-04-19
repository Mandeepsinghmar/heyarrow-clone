import {
  teamInitialState
} from '../initial-states';
import {
  GETTING_TEAM_MEMBER_DETAILS,
  GET_TEAM_MEMBER_DETAILS_SUCCESS,
  GET_TEAM_MEMBER_DETAILS_FAILURE,
  GETTING_ALL_USERS,
  GET_ALL_USERS_FAILURE,
  GET_ALL_USERS_SUCCESS,
  CLEAR_ALL_USERS,
  GETTING_TEAM_OVERVIEW,
  GET_TEAM_OVERVIEW_SUCCESS,
  GET_TEAM_OVERVIEW_FAILURE,
  GETTING_SALESDATA,
  GET_SALESDATA_SUCCESS,
  GET_SALESDATA_FAILURE,
  GETTING_TEAM_MEMBERS,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAILURE,
  GETTING_TEAM_CUSTOMERS,
  GET_TEAM_CUSTOMERS_SUCCESS,
  GET_TEAM_CUSTOMERS_FAILURE
} from '../types';

export default (state = teamInitialState, { type, payload }) => {
  switch (type) {
  case GETTING_TEAM_MEMBER_DETAILS:
    return {
      ...state,
      memberDetails: {
        ...state.memberDetails,
        loading: true,
      }
    };
  case GET_TEAM_MEMBER_DETAILS_SUCCESS:
    return {
      ...state,
      memberDetails: {
        ...state.memberDetails,
        loading: false,
        data: payload,
      }
    };
  case GET_TEAM_MEMBER_DETAILS_FAILURE:
    return {
      ...state,
      memberDetails: {
        ...state.memberDetails,
        loading: false
      }
    };
  case GETTING_ALL_USERS:
    return {
      ...state,
      users: {
        ...state.users,
        loading: true,
        hasMore: true,
      }
    };
  case GET_ALL_USERS_FAILURE:
    return {
      ...state,
      users: {
        ...state.users,
        loading: false,
      }
    };
  case GET_ALL_USERS_SUCCESS:
    return {
      ...state,
      users: {
        loading: false,
        data: [...state.users.data, ...payload],
        hasMore: !!payload.length
      }
    };
  case CLEAR_ALL_USERS:
    return {
      ...state,
      users: {
        data: [],
        hasMore: true,
      }
    };
  case GETTING_TEAM_OVERVIEW:
    return {
      ...state,
      overview: {
        ...state.overview,
        loading: true,
      }
    };
  case GET_TEAM_OVERVIEW_FAILURE:
    return {
      ...state,
      overview: {
        ...state.overview,
        loading: false,
      }
    };
  case GET_TEAM_OVERVIEW_SUCCESS:
    return {
      ...state,
      overview: {
        ...state.overview,
        loading: false,
        ...payload
      }
    };
  case GETTING_SALESDATA:
    return {
      ...state,
      salesData: {
        ...state.salesData,
        loading: true,
      }
    };
  case GET_SALESDATA_FAILURE:
    return {
      ...state,
      salesData: {
        ...state.salesData,
        loading: false
      }
    };
  case GET_SALESDATA_SUCCESS:
    return {
      ...state,
      salesData: {
        ...state.salesData,
        loading: false,
        ...payload
      }
    };
  case GETTING_TEAM_MEMBERS:
    return {
      ...state,
      members: {
        ...state.members,
        loading: true
      }
    };
  case GET_TEAM_MEMBERS_FAILURE:
    return {
      ...state,
      members: {
        ...state.members,
        loading: false
      },
    };
  case GET_TEAM_MEMBERS_SUCCESS:
    return {
      ...state,
      members: {
        ...state.members,
        data: payload,
        loading: false
      }
    };
  case GETTING_TEAM_CUSTOMERS:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: true,
      }
    };
  case GET_TEAM_CUSTOMERS_SUCCESS:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: false,
        data: payload
      }
    };
  case GET_TEAM_CUSTOMERS_FAILURE:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: false
      }
    };
  default:
    return state;
  }
};
