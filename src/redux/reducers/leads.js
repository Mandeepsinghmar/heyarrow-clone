import {
  SET_ADMIN_LEADS_LIST, CREATE_ADMIN_LEADS,
  ONCHANGE_ADMIN_LEADS, SET_NEW_ADMIN_LEADS_ITEM,
  UPDATE_ADMIN_LEAD
} from '../types/leads';

const initialState = {
  adminLeadsList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_LEADS_LIST:
    return {
      ...state,
      adminLeadsList: action.payload
    };
  case CREATE_ADMIN_LEADS: {
    let items = [...state.adminLeadsList];
    items = [action.payload, ...items];
    return {
      ...state,
      adminLeadsList: items
    };
  }
  case ONCHANGE_ADMIN_LEADS: {
    const formRows = [...state.adminLeadsList];
    formRows[action.index] = {
      ...formRows[action.index],
      [action.key]: action.value,
    };
    return {
      ...state,
      adminLeadsList: formRows,
    };
  }
  case SET_NEW_ADMIN_LEADS_ITEM: {
    let allCustomersItems = [...state.adminLeadsList];
    allCustomersItems = [action.item, ...allCustomersItems];
    return {
      ...state,
      adminLeadsList: allCustomersItems,
    };
  }
  case UPDATE_ADMIN_LEAD: {
    const allLeadsUpdate = [...state.adminLeadsList];
    allLeadsUpdate[action.index] = action.data;
    return {
      ...state,
      adminLeadsList: allLeadsUpdate,
    };
  }
  default:
    return state;
  }
};
