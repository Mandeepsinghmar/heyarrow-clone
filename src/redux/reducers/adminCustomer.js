import {
  SET_ADMIN_CUSTOMER_LIST, SET_NEW_ADMIN_CUSTOMER,
  REMOVE_NEW_CUSTOMER_ITEM, ONCHANGE_CUSTOMER,
  UPDATE_ADMIN_CUSTOMER, SET_ADMIN_CUSTOMER_DETAIL,
  SET_ADMIN_CUSTOMER_SIDE_DETAIL, CLEAR_CUSTOMER_LIST,
  SET_NEW_ADMIN_CUSTOMER_ITEM, SET_ADMIN_CUSTOMER_DEAL,
  SET_ADMIN_TAG_PRODUCT_LIST
} from '../types/adminCustomer';

const initialState = {
  adminCustomerList: [],
  adminCustomerDetail: {
    products: {}
  },
  adminCustomerSide: {
    counts: {}
  },
  adminCustomerDeal: {},
  adminTagProductDetails: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_CUSTOMER_LIST: {
    let allItems = [...state.adminCustomerList];
    if (action.page === 1) {
      allItems = action.payload;
    } else {
      allItems = allItems.concat(action.payload);
    }
    return {
      ...state,
      adminCustomerList: allItems
    };
  }
  case SET_NEW_ADMIN_CUSTOMER: {
    let items = [...state.adminCustomerList];
    items = [action.form, ...items];
    return {
      ...state,
      adminCustomerList: items,
    };
  }
  case REMOVE_NEW_CUSTOMER_ITEM: {
    const allCustomersRow = [...state.adminCustomerList];
    allCustomersRow.splice(action.index, 1);
    return {
      ...state,
      adminCustomerList: allCustomersRow,
    };
  }
  case ONCHANGE_CUSTOMER: {
    const formRows = [...state.adminCustomerList];
    formRows[action.index] = {
      ...formRows[action.index],
      [action.key]: action.value,
    };
    return {
      ...state,
      adminCustomerList: formRows,
    };
  }
  case UPDATE_ADMIN_CUSTOMER: {
    const allCustomersUpdate = [...state.adminCustomerList];
    allCustomersUpdate[action.index] = action.data;
    return {
      ...state,
      adminCustomerList: allCustomersUpdate,
    };
  }
  case SET_ADMIN_CUSTOMER_DETAIL:
    if (action.page === 1) {
      return {
        ...state,
        adminCustomerDetail: action.payload
      };
    }
    return {
      ...state,
      adminCustomerDetail: {
        ...state.adminCustomerDetail,
        products: {
          ...state.adminCustomerDetail.products,
          ...action.payload.products
        }
      }
    };
  case SET_ADMIN_CUSTOMER_SIDE_DETAIL:
    return {
      ...state,
      adminCustomerSide: action.payload
    };
  case SET_ADMIN_TAG_PRODUCT_LIST:
    return {
      ...state,
      taggedProducts: action.payload
    };
  case CLEAR_CUSTOMER_LIST:
    return {
      ...state,
      adminCustomerList: [],
    };
  case SET_NEW_ADMIN_CUSTOMER_ITEM: {
    const allCustomersItems = [...state.adminCustomerList];
    allCustomersItems[action.index] = action.item;
    return {
      ...state,
      adminCustomerList: allCustomersItems,
    };
  }
  case SET_ADMIN_CUSTOMER_DEAL: {
    return {
      ...state,
      adminCustomerDeal: action.payload,
    };
  }
  default:
    return state;
  }
};
