import {
  GETTING_CUSTOMER_CHAT_CONTANCTS,
  GET_CUSTOMER_CHAT_CONTACTS_FAILURE,
  GET_CUSTOMER_CHAT_CONTACTS_SUCCESS,
  GETTING_CHAT_MESSAGES,
  GET_CHAT_MESSAGES_FAILURE,
  GET_CHAT_MESSAGES_SUCCESS,
  POSTING_MESSAGE,
  POST_MESSAGE_FAILURE,
  POST_MESSAGE_SUCCESS,
  GETTING_TEAM_CHAT_CONTACTS,
  GET_TEAM_CHAT_CONTACTS_SUCCESS,
  GET_TEAM_CHAT_CONTACTS_FAILURE,
  GETTING_GROUP_CHAT_DETAILS,
  GET_GROUP_CHAT_DETAILS_SUCCESS,
  GET_GROUP_CHAT_DETAILS_FAILURE,
  INITIAL_CHAT_WITH_CUSTOMER_ASSIGNED,
  INITIAL_CHAT_WITH_CUSTOMER_UNASSIGNED,
  INITIAL_CHAT_WITH_USER,
  CREATE_CHAT_GROUP_SUCCESS,
  INITIAL_CHAT_WITH_GROUP,
  ADD_MEMBER_TO_GROUP_SUCCESS,
  REMOVE_MEMBER_FROM_GROUP_SUCCESS,
  MARK_AS_READ_TEAM_SUCCESS,
  MARK_AS_READ_CUSTOMER_ASSIGNED_SUCCESS,
  MARK_AS_READ_CUSTOMER_UNASSIGNED_SUCCESS,
  UPDATE_GROUP_CHAT_SUCCESS,
  GET_UNREAD_COUNT_SUCCESS,
  DELETE_GROUP_CHAT_SUCCESS,
  GET_USER_MESSAGE,
  LOAD_MORE_MESSAGES,
  SET_MEMBER_ASSIGNED,
  SET_MEMBER_UNASSIGNED,
  SET_MEMBER_TEAM
} from '../types';

export const gettingCustomerChatContacts = () => ({
  type: GETTING_CUSTOMER_CHAT_CONTANCTS
});

export const getCustomerChatContactsFailure = () => ({
  type: GET_CUSTOMER_CHAT_CONTACTS_FAILURE
});

export const getCustomerChatContactsSuccess = (payload) => ({
  type: GET_CUSTOMER_CHAT_CONTACTS_SUCCESS,
  payload
});

export const gettingChatMessages = () => ({
  type: GETTING_CHAT_MESSAGES,
});

export const getChatMessageFailure = () => ({
  type: GET_CHAT_MESSAGES_FAILURE
});

export const getChatMessageSuccess = (payload) => ({
  type: GET_CHAT_MESSAGES_SUCCESS,
  payload
});

export const postingMessage = () => ({
  type: POSTING_MESSAGE
});

export const postMessageFailure = () => ({
  type: POST_MESSAGE_FAILURE
});

export const postMessageSuccess = (payload) => ({
  type: POST_MESSAGE_SUCCESS,
  payload
});

export const gettingTeamChatContacts = () => ({
  type: GETTING_TEAM_CHAT_CONTACTS,
});

export const getTeamChatContactSuccess = (payload) => ({
  type: GET_TEAM_CHAT_CONTACTS_SUCCESS,
  payload,
});

export const getTeamChatContactFailure = () => ({
  type: GET_TEAM_CHAT_CONTACTS_FAILURE,
});

export const gettingGroupChatDetails = () => ({
  type: GETTING_GROUP_CHAT_DETAILS,
});

export const getGroupChatDetailFailure = () => ({
  type: GET_GROUP_CHAT_DETAILS_FAILURE
});

export const getGroupChatDetailSuccess = (payload) => ({
  type: GET_GROUP_CHAT_DETAILS_SUCCESS,
  payload
});

export const initialChatWithCustomerAssigned = (payload) => ({
  type: INITIAL_CHAT_WITH_CUSTOMER_ASSIGNED,
  payload
});

export const initialChatWithCustomerUnassigned = (payload) => ({
  type: INITIAL_CHAT_WITH_CUSTOMER_UNASSIGNED,
  payload
});

export const initialChatWithUser = (payload) => ({
  type: INITIAL_CHAT_WITH_USER,
  payload,
});

export const createChatGroupSuccess = (payload) => ({
  type: CREATE_CHAT_GROUP_SUCCESS,
  payload
});

export const initialChatWithGroup = (payload) => ({
  type: INITIAL_CHAT_WITH_GROUP,
  payload,
});

export const addMemberToGroupSuccess = (payload) => ({
  type: ADD_MEMBER_TO_GROUP_SUCCESS,
  payload
});

export const removeMemberFromGroupSuccess = (payload) => ({
  type: REMOVE_MEMBER_FROM_GROUP_SUCCESS,
  payload
});

export const markAsReadTeamSuccess = (payload) => ({
  type: MARK_AS_READ_TEAM_SUCCESS,
  payload,
});

export const markAsReadCustomerAssignedSuccess = (payload) => ({
  type: MARK_AS_READ_CUSTOMER_ASSIGNED_SUCCESS,
  payload,
});

export const markAsReadCustomerUnassignedSuccess = (payload) => ({
  type: MARK_AS_READ_CUSTOMER_UNASSIGNED_SUCCESS,
  payload
});

export const updateGroupChatSuccess = (payload) => ({
  type: UPDATE_GROUP_CHAT_SUCCESS,
  payload,
});

export const getUnreadCountSuccess = (payload) => ({
  type: GET_UNREAD_COUNT_SUCCESS,
  payload
});

export const deleteGroupChatSuccess = (payload) => ({
  type: DELETE_GROUP_CHAT_SUCCESS,
  payload
});

export const getUserMessage = (payload) => ({
  type: GET_USER_MESSAGE,
  payload
});

export const loadMoreMessages = (payload) => ({
  type: LOAD_MORE_MESSAGES,
  payload
});

export const setMemberAssigned = (payload) => ({
  type: SET_MEMBER_ASSIGNED,
  payload
});

export const setMemberUnassigned = (payload) => ({
  type: SET_MEMBER_UNASSIGNED,
  payload
});

export const setMemberTeam = (payload) => ({
  type: SET_MEMBER_TEAM,
  payload
});
