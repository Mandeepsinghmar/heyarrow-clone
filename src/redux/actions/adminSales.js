import {
  SET_ADMIN_SALES_LIST, SET_ADMIN_SALES_REPORT,
  CLEAR_ALL_SALES
} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const setAdminSalesList = (data, page) => ({
  type: SET_ADMIN_SALES_LIST,
  payload: data,
  page
});

export const setAdminSalesReport = (data) => ({
  type: SET_ADMIN_SALES_REPORT,
  payload: data
});

export const clearSales = () => ({
  type: CLEAR_ALL_SALES,
});
