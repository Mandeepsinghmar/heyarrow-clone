import queryString from 'query-string';

import { toast } from 'react-toastify';
import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  gettingMyCustomers,
  getMyCustomersFailure,
  getMyCustomersSuccess,
  gettingPinnedCustomers,
  getPinnedCustomersFailure,
  getPinnedCustomersSuccess,
  pinningCustomer,
  pinCustomerFailure,
  pinCustomerSuccess,
  unpinningCustomer,
  unpinCustomerFailure,
  unpinCustomerSuccess,
  gettingCustomerDetails,
  getCustomerDetailsFailure,
  getCustomerDetailsSuccess,
  gettingCustomerPurchaseHistory,
  getCustomerPurchaseHistoryFailure,
  getCustomerPurchaseHistorySuccess,
  gettingAllCustomers,
  getAllCustomersFailure,
  getAllCustomerSuccess,
  gettingCustomerStats,
  getCustomerStatsSuccess,
  getCustomerStatsFailure,
  addCustomerSuccess,
  gettingUnassignedCustomers,
  getUnassignedCustomerSuccess,
  getUnassignedCustomerFailure,
  updateCustomerOverview,
  gettingQuotePreview,
  getQuotePreviewSuccess,
  getQuotePreviewFailure,
  gettingCustomerOverview,
  getCustomerOverviewFailure,
  getCustomerOverviewSuccess,
  gettingCustomerNotes,
  getCustomerNotesSuccess,
  getCustomerNotesFailure,
  addCustomerNoteSuccess,
  deleteCustomerNoteSuccess,
  updateCustomerNoteSuccess,
  gettingCustomerProductTags,
  getCustomerProductTagsSuccess,
  getCustomerProductTagsFailure,
  gettingCustomerInterest,
  getCustomerInterestFailure,
  getCustomerInterestSuccess
} from '../redux/actions';
import store from '../redux';

export const getMyCustomers = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`customers/my?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingMyCustomers());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getMyCustomersSuccess(data, allFilters.limit));
        return data;
      }).catch((error) => {
        dispatch(getMyCustomersFailure());
        throw error;
      });
  };
};

export const getPinnedCustomers = () => {
  const options = generateOptions('customers/pinned');
  return (dispatch) => {
    dispatch(gettingPinnedCustomers());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getPinnedCustomersSuccess(data));
      }).catch((error) => {
        dispatch(getPinnedCustomersFailure());
        throw error;
      });
  };
};

export const pinCustomer = (customer) => {
  const options = generateOptions(`customers/pin/${customer.id}`, 'POST');
  return (dispatch) => {
    dispatch(pinningCustomer());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(pinCustomerSuccess(customer));
        return data;
      }).catch((error) => {
        dispatch(pinCustomerFailure());
        throw error;
      });
  };
};

export const unpinCustomer = (customer) => {
  const options = generateOptions(`customers/pin/${customer.id}`, 'DELETE');
  return (dispatch) => {
    dispatch(unpinningCustomer());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(unpinCustomerSuccess(customer));
        return data;
      }).catch((error) => {
        dispatch(unpinCustomerFailure());
        throw error;
      });
  };
};

export const getCustomerDetails = (id) => {
  const options = generateOptions(`customers/${id}`);
  return (dispatch) => {
    dispatch(gettingCustomerDetails());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerDetailsSuccess(data.customers));
        return data;
      })
      .catch((error) => {
        dispatch(getCustomerDetailsFailure());
        throw error;
      });
  };
};

export const getCustomerPurchaseHistory = (id) => {
  const options = generateOptions(`chat/customer/${id}/purchases`);
  return (dispatch) => {
    dispatch(gettingCustomerPurchaseHistory());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerPurchaseHistorySuccess(data.history));
        return data;
      }).catch((error) => {
        dispatch(getCustomerPurchaseHistoryFailure());
        throw error;
      });
  };
};

export const getAllCustomers = (filters = { }) => {
  const defaultlters = {
    page: 1,
    limit: 10,
  };
  const allFilters = {
    ...defaultlters,
    ...filters
  };
  const options = generateOptions(`customers?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingAllCustomers());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getAllCustomerSuccess(data));
        return data;
      })
      .catch((error) => {
        dispatch(getAllCustomersFailure());
        throw error;
      });
  };
};

export const getCustomerStats = (id, filters = {}) => {
  const allFilters = {
    status: 'shared',
    durationType: 'yearly',
    duration: 'all',
    ...filters
  };
  const options = generateOptions(`customers/${id}/products?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingCustomerStats());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerStatsSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getCustomerStatsFailure());
        throw error;
      });
  };
};

export const addCustomer = (body) => {
  const options = generateOptions('customers', 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(addCustomerSuccess(data));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const updateCustomer = (id, body) => {
  const options = generateOptions(`customers/${id}`, 'PUT', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(updateCustomerOverview(data));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const getUnassignedCustomers = (filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 20,
    ...filters
  };
  const options = generateOptions(`customers/unassigned?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingUnassignedCustomers());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getUnassignedCustomerSuccess(data.customers));
        return data;
      }).catch((error) => {
        dispatch(getUnassignedCustomerFailure());
        throw error;
      });
  };
};

export const getQuotePreview = (body) => {
  const options = generateOptions(`customers/quote/preview?${queryString.stringify(body)}`);
  return (dispatch) => {
    dispatch(gettingQuotePreview());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getQuotePreviewSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getQuotePreviewFailure());
        throw error;
      });
  };
};

export const getCustomerOverview = (customerId) => {
  const options = generateOptions(`customers/${customerId}/overview`);
  return (dispatch) => {
    dispatch(gettingCustomerOverview());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerOverviewSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getCustomerOverviewFailure());
        throw error;
      });
  };
};

export const sendReminder = (body) => {
  const options = generateOptions('customers/reminder', 'POST', body);

  return () => makeTheApiCall(options).then(({ data }) => {
    toast.success('Reminder sent successully');
    return data;
  }).catch((error) => {
    throw error;
  });
};

export const getCustomerNotes = (filters) => {
  const allFilters = {
    limit: 100,
    page: 1,
    order: 'ASC',
    ...filters
  };
  const options = generateOptions(`customers/note?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingCustomerNotes());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getCustomerNotesSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getCustomerNotesFailure());
      throw error;
    });
  };
};

export const addCustomerNote = (body) => {
  const options = generateOptions('customers/note', 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(addCustomerNoteSuccess({
        ...data,
        createdBy: store.getState().auth.currentUser
      }));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const deleteCustomerNote = (noteId) => {
  const options = generateOptions(`customers/note/${noteId}`, 'DELETE');
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(deleteCustomerNoteSuccess(noteId));
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateCustomerNote = (noteId, body) => {
  const options = generateOptions(`customers/note/${noteId}`, 'PUT', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(updateCustomerNoteSuccess(data));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const getCustomerTags = (customerId, filters = {}) => {
  const allFilters = {
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`product/tag/product-list/${customerId}`, 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingCustomerProductTags());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerProductTagsSuccess(data));
        return data;
      })
      .catch((error) => {
        dispatch(getCustomerProductTagsFailure());
        throw error;
      });
  };
};

export const getCustomerInterest = (customerId, filters = {}) => {
  const allFilters = {
    page: 1,
    limit: 100,
    status: 'interests',
    durationType: 'yearly',
    duration: 'all',
    ...filters
  };
  const options = generateOptions(`customers/${customerId}/products`, 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingCustomerInterest());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getCustomerInterestSuccess(data.interests));
        return data;
      }).catch((error) => {
        dispatch(getCustomerInterestFailure());
        throw error;
      });
  };
};
