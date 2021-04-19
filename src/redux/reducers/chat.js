import { groupBy } from 'lodash';

import {
  chatInitialState
} from '../initial-states';
import {
  GETTING_CUSTOMER_CHAT_CONTANCTS,
  GET_CUSTOMER_CHAT_CONTACTS_SUCCESS,
  GET_CUSTOMER_CHAT_CONTACTS_FAILURE,
  GETTING_CHAT_MESSAGES,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_FAILURE,
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
  INITIAL_CHAT_WITH_GROUP,
  ADD_MEMBER_TO_GROUP_SUCCESS,
  REMOVE_MEMBER_FROM_GROUP_SUCCESS,
  MARK_AS_READ_TEAM_SUCCESS,
  MARK_AS_READ_CUSTOMER_ASSIGNED_SUCCESS,
  MARK_AS_READ_CUSTOMER_UNASSIGNED_SUCCESS,
  UPDATE_GROUP_CHAT_SUCCESS,
  GET_UNREAD_COUNT_SUCCESS,
  DELETE_GROUP_CHAT_SUCCESS,
  LOAD_MORE_MESSAGES,
  SET_MEMBER_ASSIGNED,
  SET_MEMBER_UNASSIGNED,
  SET_MEMBER_TEAM
} from '../types';

export default (state = chatInitialState, { type, payload }) => {
  switch (type) {
  case GETTING_CUSTOMER_CHAT_CONTANCTS:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: true,
      }
    };
  case GET_CUSTOMER_CHAT_CONTACTS_SUCCESS:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: false,
        ...payload,
      }
    };
  case GET_CUSTOMER_CHAT_CONTACTS_FAILURE:
    return {
      ...state,
      customers: {
        ...state.customers,
        loading: false,
      }
    };
  case GETTING_CHAT_MESSAGES:
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        loading: true,
      }
    };
  case GET_CHAT_MESSAGES_FAILURE:
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        loading: false,
      }
    };
  case GET_CHAT_MESSAGES_SUCCESS: {
    const byDateMessages = groupBy(payload, (chat) => chat.chatDate);
    const orderedMessages = {};
    Object.keys(byDateMessages).forEach((key) => {
      orderedMessages[key] = byDateMessages[key].reverse();
    });
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        data: {
          Today: [],
          ...orderedMessages,
        },
        loading: false,
        hasMore: !!payload.length,
        dataLength: payload.length
      }
    }; }
  case LOAD_MORE_MESSAGES: {
    const byDateMessages = groupBy(payload, (chat) => chat.chatDate);
    const orderedMessages = {};
    Object.keys(byDateMessages).forEach((key) => {
      orderedMessages[key] = byDateMessages[key].reverse();
    });
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        data: {
          ...state.chatMessages.data,
          ...orderedMessages
        },
        hasMore: !!payload.length,
        dataLength: payload.length + state.chatMessages.dataLength
      }
    };
  }
  case POSTING_MESSAGE:
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        posting: true
      }
    };
  case POST_MESSAGE_SUCCESS: {
    const date = 'Today';
    let newMessages = [];
    if (state.chatMessages.data[date]) {
      newMessages = [...state.chatMessages.data[date]];
    }
    newMessages = [...newMessages, {
      ...payload,
      chatDate: date,
    }];
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        data: {
          ...state.chatMessages.data,
          [date]: [...newMessages],
        },
        posting: false,
      }
    }; }
  case POST_MESSAGE_FAILURE:
    return {
      ...state,
      chatMessages: {
        ...state.chatMessages,
        posting: false
      }
    };
  case GETTING_TEAM_CHAT_CONTACTS:
    return {
      ...state,
      team: {
        ...state.team,
        loading: true,
      }
    };
  case GET_TEAM_CHAT_CONTACTS_SUCCESS:
    return {
      ...state,
      team: {
        ...state.team,
        loading: false,
        data: payload,
      }
    };
  case GET_TEAM_CHAT_CONTACTS_FAILURE:
    return {
      ...state,
      team: {
        ...state.team,
        loading: false,
      }
    };
  case GETTING_GROUP_CHAT_DETAILS:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        loading: true,
      }
    };
  case GET_GROUP_CHAT_DETAILS_SUCCESS:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        ...payload,
        loading: false,
      }
    };
  case GET_GROUP_CHAT_DETAILS_FAILURE:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        loading: false
      }
    };
  case INITIAL_CHAT_WITH_CUSTOMER_ASSIGNED: {
    let newChat = {};
    const chatIndex = state.customers.assigned
      .findIndex((chat) => chat.id === payload.id);

    if (chatIndex !== -1) {
      newChat = state.customers.assigned[chatIndex];
    }
    newChat = {
      ...newChat,
      ...payload
    };
    return {
      ...state,
      customers: {
        ...state.customers,
        assigned: [
          newChat,
          ...state.customers.assigned.filter((chat) => chat.id !== payload.id),
        ]
      }
    }; }
  case INITIAL_CHAT_WITH_CUSTOMER_UNASSIGNED: {
    let newChat = {};
    const chatIndex = state.customers.unassigned
      .findIndex((chat) => chat.id === payload.id);

    if (chatIndex !== -1) {
      newChat = state.customers.unassigned[chatIndex];
    }
    newChat = {
      ...newChat,
      ...payload
    };
    return {
      ...state,
      customers: {
        ...state.customers,
        unassigned: [
          newChat,
          ...state.customers.unassigned
            .filter((chat) => chat.id !== payload.id),
        ]
      }
    }; }
  case INITIAL_CHAT_WITH_USER: {
    let newChat = {};
    const chatIndex = state.team.data
      .findIndex((chat) => chat.id === payload.id);
    if (chatIndex !== -1) {
      newChat = state.team.data[chatIndex];
    }

    newChat = {
      ...newChat,
      ...payload
    };
    return {
      ...state,
      team: {
        ...state.team,
        data: [
          newChat,
          ...state.team.data.filter((chat) => chat.id !== payload.id)
        ]
      }
    }; }
  case INITIAL_CHAT_WITH_GROUP: {
    let newChat = {};
    const chatIndex = state.team.data
      .findIndex((chat) => (chat.groupId === payload.groupId));
    if (chatIndex !== -1) {
      newChat = state.team.data[chatIndex];
    }
    newChat = {
      ...newChat,
      ...payload
    };
    return {
      ...state,
      team: {
        ...state.team,
        data: [
          newChat,
          ...state.team.data.filter((chat) => chat.groupId !== payload.groupId)
        ]
      }
    }; }
  case ADD_MEMBER_TO_GROUP_SUCCESS:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        members: [
          ...state.groupDetails.members,
          payload,
        ]
      }
    };
  case REMOVE_MEMBER_FROM_GROUP_SUCCESS:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        members: [...state.groupDetails.members
          .filter(({ member }) => member.id !== payload.userId)]
      }
    };
  case MARK_AS_READ_TEAM_SUCCESS: {
    const chatIndex = state.team.data
      .findIndex((chat) => chat.chatId === payload);
    if (chatIndex === -1) {
      return state;
    }
    const newChat = { ...state.team.data[chatIndex], unreadCount: 0 };
    return {
      ...state,
      team: {
        ...state.team,
        data: [
          ...state.team.data.slice(0, chatIndex),
          newChat,
          ...state.team.data.slice(chatIndex + 1, state.team.data.length)
        ]
      }
    }; }
  case MARK_AS_READ_CUSTOMER_ASSIGNED_SUCCESS: {
    const chatIndex = state.customers.assigned
      .findIndex((chat) => chat.chatId === payload);
    if (chatIndex === -1) {
      return state;
    }
    const newChat = {
      ...state.customers.assigned[chatIndex],
      unreadCount: 0
    };
    return {
      ...state,
      customers: {
        ...state.customers,
        assigned: [
          ...state.customers.assigned.slice(0, chatIndex),
          newChat,
          ...state.customers.assigned
            .slice(chatIndex + 1, state.customers.assigned.length)
        ]
      }
    }; }
  case MARK_AS_READ_CUSTOMER_UNASSIGNED_SUCCESS: {
    const chatIndex = state.customers.unassigned
      .findIndex((chat) => chat.chatId === payload);
    if (chatIndex === -1) {
      return state;
    }
    const newChat = {
      ...state.customers.unassigned[chatIndex],
      unreadCount: 0
    };
    return {
      ...state,
      customers: {
        ...state.customers,
        assigned: [
          ...state.customers.unassigned.slice(0, chatIndex),
          newChat,
          ...state.customers.unassigned
            .slice(chatIndex + 1, state.customers.unassigned.length)
        ]
      }
    }; }
  case UPDATE_GROUP_CHAT_SUCCESS:
    return {
      ...state,
      groupDetails: {
        ...state.groupDetails,
        group: {
          ...state.groupDetails.group,
          ...payload,
        }
      }
    };
  case GET_UNREAD_COUNT_SUCCESS:
    return {
      ...state,
      totalUnreadCounts: payload
    };
  case DELETE_GROUP_CHAT_SUCCESS:
    return {
      ...state,
      team: {
        ...state.team,
        data: state.team.data
          .filter((contact) => Number(contact.groupId) !== Number(payload))
      },
      chatMessages: {
        ...state.chatMessages,
        data: {
          Today: state.chatMessages.data.Today
            .filter((contact) => {
              if (
                contact.toGroupId
                && (Number(contact.toGroupId) !== Number(payload))
              ) {
                return true;
              }
              return false;
            })
        }
      },
      groupDetails: {
        ...state.groupDetails,
        group: {},
        members: []
      },
    };
  case SET_MEMBER_ASSIGNED:
    return {
      ...state,
      customers: {
        ...state.customers,
        assigned: payload
      }
    };
  case SET_MEMBER_UNASSIGNED:
    return {
      ...state,
      customers: {
        ...state.customers,
        unassigned: payload
      }
    };
  case SET_MEMBER_TEAM:
    return {
      ...state,
      team: {
        ...state.team,
        data: payload
      }
    };
  default:
    return state;
  }
};
