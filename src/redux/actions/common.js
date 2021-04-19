import {
  GET_MENTIONS_SUCCESS,
  GETTING_MENTIONS,
  GET_MENTIONS_FAILURE
} from '../types';

export const getMentionsSuccess = (payload) => ({
  type: GET_MENTIONS_SUCCESS,
  payload
});

export const gettingMentions = () => ({
  type: GETTING_MENTIONS
});

export const getMentionsFailure = () => ({
  type: GET_MENTIONS_FAILURE
});
