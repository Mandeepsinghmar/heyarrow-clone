import {
  customersInitialState
} from '../initial-states';
import {
  GETTING_MY_CUSTOMERS,
  GET_MY_CUSTOMERS_FAILURE,
  GET_MY_CUSTOMERS_SUCCESS,
  GETTING_PINNED_CUSTOMERS,
  GET_PINNED_CUSTOMERS_SUCCESS,
  GET_PINNED_CUSTOMERS_FAILURE,
  PINNING_CUSTOMER,
  UNPINNING_CUSTOMER,
  PIN_CUSTOMER_FAILURE,
  PIN_CUSTOMER_SUCCESS,
  UNPIN_CUSTOMER_SUCCESS,
  UNPIN_CUSTOMER_FAILURE,
  GETTING_CUSTOMER_DETAILS,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GET_CUSTOMER_DETAILS_FAILURE,
  GET_CUSTOMER_PURCHASE_HISTORY_FAILURE,
  GET_CUSTOMER_PURCHASE_HISTORY_SUCCESS,
  GETTING_CUSTOMER_PURCHASE_HISTORY,
  GETTING_ALL_CUSTOMERS,
  GET_ALL_CUSTOMERS_FAILURE,
  GET_ALL_CUSTOMERS_SUCCESS,
  CLEAR_ALL_CUSTOMERS,
  GETTING_CUSTOMER_STATS,
  GET_CUSTOMER_STATS_SUCCESS,
  GET_CUSTOMER_STATS_FAILURE,
  ADD_CUSTOMER_SUCCESS,
  GETTING_UNASSIGNED_CUSTOMERS,
  GET_UNASSIGNED_CUSTOMERS_SUCCESS,
  GET_UNASSIGNED_CUSTOMERS_FAILURE,
  UPDATE_CUSTOMER_SUCCESS,
  GETTING_QUOTE_PREVIEW,
  GET_QUOTE_PREVIEW_SUCCESS,
  GET_QUOTE_PREVIEW_FAILURE,
  GETTING_CUSTOMER_OVERVIEW,
  GET_CUSTOMER_OVERVIEW_FAILURE,
  GET_CUSTOMER_OVERVIEW_SUCCESS,
  CLEAR_MY_CUSTOMERS,
  UPDATE_CUSTOMER_STATS,
  GETTING_CUSTOMER_NOTES,
  GET_CUSTOMER_NOTES_SUCCESS,
  GET_CUSTOMER_NOTES_FAILURE,
  ADD_CUSTOMER_NOTE_SUCCESS,
  DELETE_CUSTOMER_NOTE_SUCCESS,
  UPDATE_CUSTOMER_NOTE_SUCCESS,
  UPDATE_CUSTOMER_OVERVIEW,
  GETTING_CUSTOMER_PRODUCT_TAGS,
  GET_CUSTOMER_PRODUCT_TAGS_SUCCESS,
  GET_CUSTOMER_PRODUCT_TAGS_FAILURE,
  REMOVE_CUSTOMER_TAG_SUCCESS,
  GETTING_CUSTOMER_INTEREST,
  GET_CUSTOMER_INTEREST_SUCCESS,
  GET_CUSTOMER_INTEREST_FAILURE
} from '../types';

export default (state = customersInitialState, { type, payload, limit }) => {
  switch (type) {
  case GETTING_MY_CUSTOMERS:
    return {
      ...state,
      myCustomers: {
        ...state.myCustomers,
        loading: true
      }
    };
  case GET_MY_CUSTOMERS_SUCCESS:
    return {
      ...state,
      myCustomers: {
        ...state.myCustomers,
        loading: false,
        data: [...state.myCustomers.data, ...payload],
        hasMore: payload.length > limit
      }
    };
  case GET_MY_CUSTOMERS_FAILURE:
    return {
      ...state,
      myCustomers: {
        ...state.myCustomers,
        loading: false
      }
    };
  case GETTING_PINNED_CUSTOMERS:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        loading: true,
      }
    };
  case GET_PINNED_CUSTOMERS_SUCCESS:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        loading: false,
        data: payload.customers
      }
    };
  case GET_PINNED_CUSTOMERS_FAILURE:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        loading: false,
      }
    };
  case PINNING_CUSTOMER:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        pinning: true,
      }
    };
  case PIN_CUSTOMER_SUCCESS:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        pinning: false,
        data: [
          ...state.pinnedCustomers.data,
          payload
        ]
      }
    };
  case PIN_CUSTOMER_FAILURE:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        pinning: false,
      }
    };
  case UNPINNING_CUSTOMER:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        unpinning: true,
      }
    };
  case UNPIN_CUSTOMER_FAILURE:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        unpinning: false,
      }
    };
  case UNPIN_CUSTOMER_SUCCESS:
    return {
      ...state,
      pinnedCustomers: {
        ...state.pinnedCustomers,
        unpinning: false,
        data: state.pinnedCustomers.data
          .filter((customer) => customer.id !== payload.id)
      }
    };
  case GETTING_CUSTOMER_DETAILS:
    return {
      ...state,
      customerDetails: {
        ...state.customerDetails,
        loading: true,
      }
    };
  case GET_CUSTOMER_DETAILS_FAILURE:
    return {
      ...state,
      customerDetails: {
        ...state.customerDetails,
        loading: false,
      }
    };
  case GET_CUSTOMER_DETAILS_SUCCESS:
    return {
      ...state,
      customerDetails: {
        ...state.customerDetails,
        loading: false,
        data: {
          ...state.customerDetails.data,
          ...payload
        }
      }
    };
  case GETTING_CUSTOMER_PURCHASE_HISTORY:
    return {
      ...state,
      purchaseHistory: {
        ...state.purchaseHistory,
        loading: true,
      }
    };
  case GET_CUSTOMER_PURCHASE_HISTORY_SUCCESS:
    return {
      ...state,
      purchaseHistory: {
        ...state.purchaseHistory,
        loading: false,
        data: payload
      }
    };
  case GET_CUSTOMER_PURCHASE_HISTORY_FAILURE:
    return {
      ...state,
      purchaseHistory: {
        ...state.purchaseHistory,
        loading: false
      }
    };
  case GETTING_ALL_CUSTOMERS:
    return {
      ...state,
      allCustomers: {
        ...state.allCustomers,
        loading: true,
      }
    };
  case GET_ALL_CUSTOMERS_FAILURE:
    return {
      ...state,
      allCustomers: {
        ...state.allCustomers,
        loading: false,
        hasMore: false,
      }
    };
  case GET_ALL_CUSTOMERS_SUCCESS:
    return {
      ...state,
      allCustomers: {
        ...state.allCustomers,
        data: [...state.allCustomers.data, ...payload],
        loading: false,
        hasMore: !!payload.length
      }
    };
  case CLEAR_ALL_CUSTOMERS:
    return {
      ...state,
      allCustomers: {
        ...state.allCustomers,
        data: [],
        hasMore: true,
      }
    };
  case GETTING_CUSTOMER_STATS:
    return {
      ...state,
      customerStats: {
        ...state.customerStats,
        loading: true,
      }
    };
  case GET_CUSTOMER_STATS_FAILURE:
    return {
      ...state,
      customerStats: {
        ...state.customerStats,
        loading: false,
      }
    };
  case GET_CUSTOMER_STATS_SUCCESS:
    return {
      ...state,
      customerStats: {
        ...state.customerStats,
        loading: false,
        ...payload,
      }
    };
  case ADD_CUSTOMER_SUCCESS:
    return {
      ...state,
      myCustomers: {
        ...state.myCustomers,
        data: [payload, ...state.myCustomers.data]
      }
    };
  case GETTING_UNASSIGNED_CUSTOMERS:
    return {
      ...state,
      unassignedCustomers: {
        ...state.unassignedCustomers,
        loading: true,
      }
    };
  case GET_UNASSIGNED_CUSTOMERS_SUCCESS:
    return {
      ...state,
      unassignedCustomers: {
        ...state.unassignedCustomers,
        loading: false,
        data: payload
      }
    };
  case GET_UNASSIGNED_CUSTOMERS_FAILURE:
    return {
      ...state,
      unassignedCustomers: {
        ...state.unassignedCustomers,
        loading: false
      }
    };
  case UPDATE_CUSTOMER_SUCCESS:
    return {
      ...state,
      customerDetails: {
        ...state.customerDetails,
        data: {
          ...state.customerDetails.data,
          ...payload
        }
      }
    };
  case GETTING_QUOTE_PREVIEW:
    return {
      ...state,
      quotePreview: {
        ...state.quotePreview,
        loading: true,
      }
    };
  case GET_QUOTE_PREVIEW_SUCCESS:
    return {
      ...state,
      quotePreview: {
        ...state.quotePreview,
        loading: false,
        ...payload
      }
    };
  case GET_QUOTE_PREVIEW_FAILURE:
    return {
      ...state,
      quotePreview: {
        ...state.quotePreview,
        loading: false,
      }
    };
  case GETTING_CUSTOMER_OVERVIEW:
    return {
      ...state,
      customerOverview: {
        ...state.customerOverview,
        loading: true
      }
    };
  case GET_CUSTOMER_OVERVIEW_SUCCESS:
    return {
      ...state,
      customerOverview: {
        ...state.customerOverview,
        loading: false,
        ...payload,
      }
    };
  case GET_CUSTOMER_OVERVIEW_FAILURE:
    return {
      ...state,
      customerOverview: {
        ...state.customerOverview,
        loading: false
      }
    };
  case CLEAR_MY_CUSTOMERS:
    return {
      ...state,
      myCustomers: {
        ...state.myCustomers,
        hasMore: true,
        data: []
      }
    };
  case UPDATE_CUSTOMER_STATS: {
    const todays = state.customerStats.products.Today || [];
    return {
      ...state,
      customerStats: {
        ...state.customerStats,
        salesData: {
          ...state.customerStats.salesData,
          units: Number(state.customerStats.salesData.units)
          + payload?.quotes?.length,
        },
        products: {
          ...state.customerStats.products,
          Today: [...payload.quotes, ...todays]
        },
      }
    };
  }
  case GETTING_CUSTOMER_NOTES: {
    return {
      ...state,
      notes: {
        ...state.notes,
        loading: true
      }
    };
  }
  case GET_CUSTOMER_NOTES_SUCCESS: {
    return {
      ...state,
      notes: {
        ...state.notes,
        loading: false,
        data: payload,
      }
    };
  }
  case GET_CUSTOMER_NOTES_FAILURE: {
    return {
      ...state,
      notes: {
        ...state.notes,
        loading: false,
      }
    };
  }
  case ADD_CUSTOMER_NOTE_SUCCESS:
    return {
      ...state,
      notes: {
        ...state.notes,
        data: [...state.notes.data, payload]
      }
    };
  case DELETE_CUSTOMER_NOTE_SUCCESS:
    return {
      ...state,
      notes: {
        ...state.notes,
        data: state.notes.data.filter((note) => note.id !== payload)
      }
    };
  case UPDATE_CUSTOMER_NOTE_SUCCESS:
  {
    const index = state.notes.data.findIndex((note) => note.id === payload.id);
    return {
      ...state,
      notes: {
        ...state.notes,
        data: [
          ...state.notes.data.slice(0, index),
          { ...state.notes.data[index], ...payload },
          ...state.notes.data.slice(index + 1, state.notes.data.length)
        ],
      }
    }; }
  case UPDATE_CUSTOMER_OVERVIEW:
    return {
      ...state,
      customerOverview: {
        ...state.customerOverview,
        customer: payload
      }
    };
  case GETTING_CUSTOMER_PRODUCT_TAGS:
    return {
      ...state,
      taggedProducts: {
        ...state.taggedProducts,
        loading: true
      }
    };
  case GET_CUSTOMER_PRODUCT_TAGS_SUCCESS:
    return {
      ...state,
      taggedProducts: {
        ...state.taggedProducts,
        loading: false,
        data: payload
      }
    };
  case GET_CUSTOMER_PRODUCT_TAGS_FAILURE:
    return {
      ...state,
      taggedProducts: {
        ...state.taggedProducts,
        loading: false
      }
    };
  case REMOVE_CUSTOMER_TAG_SUCCESS:
    return {
      ...state,
      taggedProducts: {
        ...state.taggedProducts,
        data: {
          ...state.taggedProducts.data,
          [payload.createdOn]: state.taggedProducts
            .data[payload.createdOn].filter((tag) => tag.id !== payload.id)
        },
      },
      customerOverview: {
        ...state.customerOverview,
        counts: {
          ...state.customerOverview.counts,
          tag_products: {
            total: state.customerOverview.counts.tag_products.total - 1
          }
        }
      }
    };
  case GETTING_CUSTOMER_INTEREST:
    return {
      ...state,
      interests: {
        ...state.interests,
        loading: true
      }
    };
  case GET_CUSTOMER_INTEREST_SUCCESS:
    return {
      ...state,
      interests: {
        ...state.interests,
        data: payload,
        loading: false
      }
    };
  case GET_CUSTOMER_INTEREST_FAILURE:
    return {
      ...state,
      interests: {
        ...state.interests,
        loading: false
      }
    };
  default:
    return state;
  }
};
