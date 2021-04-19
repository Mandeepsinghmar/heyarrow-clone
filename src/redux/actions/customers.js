import {
  GETTING_MY_CUSTOMERS,
  GET_MY_CUSTOMERS_FAILURE,
  GET_MY_CUSTOMERS_SUCCESS,
  GETTING_PINNED_CUSTOMERS,
  GET_PINNED_CUSTOMERS_FAILURE,
  GET_PINNED_CUSTOMERS_SUCCESS,
  PINNING_CUSTOMER,
  UNPINNING_CUSTOMER,
  PIN_CUSTOMER_FAILURE,
  PIN_CUSTOMER_SUCCESS,
  UNPIN_CUSTOMER_FAILURE,
  UNPIN_CUSTOMER_SUCCESS,
  GETTING_CUSTOMER_DETAILS,
  GET_CUSTOMER_DETAILS_FAILURE,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GETTING_CUSTOMER_PURCHASE_HISTORY,
  GET_CUSTOMER_PURCHASE_HISTORY_FAILURE,
  GET_CUSTOMER_PURCHASE_HISTORY_SUCCESS,
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

export const gettingMyCustomers = () => ({
  type: GETTING_MY_CUSTOMERS,
});

export const getMyCustomersFailure = () => ({
  type: GET_MY_CUSTOMERS_FAILURE
});

export const getMyCustomersSuccess = (payload, limit) => ({
  type: GET_MY_CUSTOMERS_SUCCESS,
  payload,
  limit
});

export const gettingPinnedCustomers = () => ({
  type: GETTING_PINNED_CUSTOMERS
});

export const getPinnedCustomersFailure = () => ({
  type: GET_PINNED_CUSTOMERS_FAILURE
});

export const getPinnedCustomersSuccess = (payload) => ({
  type: GET_PINNED_CUSTOMERS_SUCCESS,
  payload
});

export const pinningCustomer = () => ({
  type: PINNING_CUSTOMER
});

export const pinCustomerFailure = () => ({
  type: PIN_CUSTOMER_FAILURE,
});

export const pinCustomerSuccess = (payload) => ({
  type: PIN_CUSTOMER_SUCCESS,
  payload
});

export const unpinningCustomer = () => ({
  type: UNPINNING_CUSTOMER
});

export const unpinCustomerFailure = () => ({
  type: UNPIN_CUSTOMER_FAILURE
});

export const unpinCustomerSuccess = (payload) => ({
  type: UNPIN_CUSTOMER_SUCCESS,
  payload
});

export const gettingCustomerDetails = () => ({
  type: GETTING_CUSTOMER_DETAILS,
});

export const getCustomerDetailsFailure = () => ({
  type: GET_CUSTOMER_DETAILS_FAILURE
});

export const getCustomerDetailsSuccess = (payload) => ({
  type: GET_CUSTOMER_DETAILS_SUCCESS,
  payload,
});

export const gettingCustomerPurchaseHistory = () => ({
  type: GETTING_CUSTOMER_PURCHASE_HISTORY,
});

export const getCustomerPurchaseHistorySuccess = (payload) => ({
  type: GET_CUSTOMER_PURCHASE_HISTORY_SUCCESS,
  payload,
});

export const getCustomerPurchaseHistoryFailure = () => ({
  type: GET_CUSTOMER_PURCHASE_HISTORY_FAILURE
});

export const gettingAllCustomers = () => ({
  type: GETTING_ALL_CUSTOMERS,
});

export const getAllCustomersFailure = () => ({
  type: GET_ALL_CUSTOMERS_FAILURE
});

export const getAllCustomerSuccess = (payload) => ({
  type: GET_ALL_CUSTOMERS_SUCCESS,
  payload,
});

export const clearAllCustomers = () => ({
  type: CLEAR_ALL_CUSTOMERS
});

export const gettingCustomerStats = () => ({
  type: GETTING_CUSTOMER_STATS,
});

export const getCustomerStatsSuccess = (payload) => ({
  type: GET_CUSTOMER_STATS_SUCCESS,
  payload,
});

export const getCustomerStatsFailure = () => ({
  type: GET_CUSTOMER_STATS_FAILURE
});

export const addCustomerSuccess = (payload) => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload
});

export const gettingUnassignedCustomers = () => ({
  type: GETTING_UNASSIGNED_CUSTOMERS
});

export const getUnassignedCustomerSuccess = (payload) => ({
  type: GET_UNASSIGNED_CUSTOMERS_SUCCESS,
  payload
});

export const getUnassignedCustomerFailure = () => ({
  type: GET_UNASSIGNED_CUSTOMERS_FAILURE
});

export const updateCustomerSuccess = (payload) => ({
  type: UPDATE_CUSTOMER_SUCCESS,
  payload
});

export const gettingQuotePreview = () => ({
  type: GETTING_QUOTE_PREVIEW
});

export const getQuotePreviewSuccess = (payload) => ({
  type: GET_QUOTE_PREVIEW_SUCCESS,
  payload
});

export const getQuotePreviewFailure = () => ({
  type: GET_QUOTE_PREVIEW_FAILURE
});

export const gettingCustomerOverview = () => ({
  type: GETTING_CUSTOMER_OVERVIEW
});

export const getCustomerOverviewFailure = () => ({
  type: GET_CUSTOMER_OVERVIEW_FAILURE
});

export const getCustomerOverviewSuccess = (payload) => ({
  type: GET_CUSTOMER_OVERVIEW_SUCCESS,
  payload
});

export const clearMyCustomers = () => ({
  type: CLEAR_MY_CUSTOMERS
});

export const updateCustomerStats = (payload) => ({
  type: UPDATE_CUSTOMER_STATS,
  payload
});

export const gettingCustomerNotes = () => ({
  type: GETTING_CUSTOMER_NOTES
});

export const getCustomerNotesSuccess = (payload) => ({
  type: GET_CUSTOMER_NOTES_SUCCESS,
  payload
});

export const getCustomerNotesFailure = () => ({
  type: GET_CUSTOMER_NOTES_FAILURE
});

export const addCustomerNoteSuccess = (payload) => ({
  type: ADD_CUSTOMER_NOTE_SUCCESS,
  payload
});

export const deleteCustomerNoteSuccess = (payload) => ({
  type: DELETE_CUSTOMER_NOTE_SUCCESS,
  payload
});

export const updateCustomerNoteSuccess = (payload) => ({
  type: UPDATE_CUSTOMER_NOTE_SUCCESS,
  payload
});

export const updateCustomerOverview = (payload) => ({
  type: UPDATE_CUSTOMER_OVERVIEW,
  payload
});

export const gettingCustomerProductTags = () => ({
  type: GETTING_CUSTOMER_PRODUCT_TAGS
});

export const getCustomerProductTagsSuccess = (payload) => ({
  type: GET_CUSTOMER_PRODUCT_TAGS_SUCCESS,
  payload,
});

export const getCustomerProductTagsFailure = () => ({
  type: GET_CUSTOMER_PRODUCT_TAGS_FAILURE
});

export const removeCustomerTagSuccess = (payload) => ({
  type: REMOVE_CUSTOMER_TAG_SUCCESS,
  payload
});

export const gettingCustomerInterest = () => ({
  type: GETTING_CUSTOMER_INTEREST
});

export const getCustomerInterestSuccess = (payload) => ({
  type: GET_CUSTOMER_INTEREST_SUCCESS,
  payload
});

export const getCustomerInterestFailure = () => ({
  type: GET_CUSTOMER_INTEREST_FAILURE
});
