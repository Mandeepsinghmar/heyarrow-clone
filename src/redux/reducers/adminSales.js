import { isEmpty } from 'lodash';

import {
  CLEAR_ALL_SALES,
  SET_ADMIN_SALES_LIST, SET_ADMIN_SALES_REPORT
} from '../types/adminSales';

const initialState = {
  adminSalesList: {},
  singleSalesReport: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_SALES_LIST: {
    let allItems = { ...state.adminSalesList };
    if (action.page === 1) {
      allItems = action.payload;
    } else if (!isEmpty(action.payload.salesReport)) {
      const newItem = allItems.salesReport.concat(action.payload.salesReport);
      allItems = {
        ...allItems,
        salesReport: newItem
      };
    }
    return {
      ...state,
      adminSalesList: allItems
    };
  }
  case SET_ADMIN_SALES_REPORT:
    return {
      ...state,
      singleSalesReport: action.payload,
    };
  case CLEAR_ALL_SALES:
    return {
      ...state,
      adminSalesList: [],
    };
  default:
    return state;
  }
};
