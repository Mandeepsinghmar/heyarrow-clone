import {
  SET_ADMIN_CUSTOMER_LIST, SET_ALL_COUNTRIES,
  SET_ALL_STATES, SET_ALL_CITIES,
  SET_NEW_ADMIN_CUSTOMER, REMOVE_NEW_CUSTOMER_ITEM,
  ONCHANGE_CUSTOMER, UPDATE_ADMIN_CUSTOMER,
  SET_ALL_USERS, SET_ADMIN_CUSTOMER_DETAIL,
  SET_ADMIN_CUSTOMER_SIDE_DETAIL, CLEAR_CUSTOMER_LIST,
  SET_NEW_ADMIN_CUSTOMER_ITEM, SET_ADMIN_CUSTOMER_DEAL,
  SET_ADMIN_TAG_PRODUCT_LIST
} from '../types';

export const setAdminCustomerList = (data) => ({
  type: SET_ADMIN_CUSTOMER_LIST,
  payload: data
});

export const addNewAdminCustomer = (form) => ({
  type: SET_NEW_ADMIN_CUSTOMER,
  form
});

export const removeNewCustomers = (index) => ({
  type: REMOVE_NEW_CUSTOMER_ITEM,
  index
});

export const onChangeCustomer = (value, key, item, index) => ({
  type: ONCHANGE_CUSTOMER,
  value,
  key,
  item,
  index
});

export const updateExistCustomer = (data) => ({
  type: UPDATE_ADMIN_CUSTOMER,
  data
});

export const setCountries = (data) => ({
  type: SET_ALL_COUNTRIES,
  data
});

export const setStates = (data, index) => ({
  type: SET_ALL_STATES,
  data,
  index
});

export const setCities = (data, index) => ({
  type: SET_ALL_CITIES,
  data,
  index
});

export const setAllUsers = (data, page) => ({
  type: SET_ALL_USERS,
  data,
  page
});

export const setAdminCustomerDetail = (data, page) => ({
  type: SET_ADMIN_CUSTOMER_DETAIL,
  payload: data,
  page,
});

export const setCustomerSideDetail = (data) => ({
  type: SET_ADMIN_CUSTOMER_SIDE_DETAIL,
  payload: data
});

export const setTagProductList = (data) => ({
  type: SET_ADMIN_TAG_PRODUCT_LIST,
  payload: data
});

export const clearCustomers = () => ({
  type: CLEAR_CUSTOMER_LIST,
});

export const setNewAdminCustomer = (item, index) => ({
  type: SET_NEW_ADMIN_CUSTOMER_ITEM,
  item,
  index
});

export const setAdminCustomerDeal = (data) => ({
  type: SET_ADMIN_CUSTOMER_DEAL,
  payload: data
});
