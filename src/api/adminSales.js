/* eslint-disable import/prefer-default-export */
import {
  setAdminSalesList, setAdminSalesReport
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const getSalesReportWithSearch = (
  durationType, duration, limit, page, search
) => {
  const options = generateOptions(
   `sales/report?durationType=${durationType}&duration=${duration}&page=${page}&limit=${limit}&search=${search}&sortBy=model&order=DESC`, 'GET'
  );
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminSalesList(response.data, page));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getSalesReport = (
  id, durationType, duration, page, search
) => {
  const options = generateOptions(
   `sales/${id}/report/product?durationType=${durationType}&duration=${duration}&page=${page}&limit=30&search=${search}&sortBy=firstName&order=DESC`, 'GET'
  );
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminSalesReport(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};
