import {
  SET_ADMIN_LEADS_LIST, CREATE_ADMIN_LEADS,
  ONCHANGE_ADMIN_LEADS, SET_NEW_ADMIN_LEADS_ITEM,
  UPDATE_ADMIN_LEAD
} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const setAdminLeadsList = (data) => ({
  type: SET_ADMIN_LEADS_LIST,
  payload: data
});

export const createAdminLeads = (data) => ({
  type: CREATE_ADMIN_LEADS,
  payload: data
});

export const setNewAdminLeads = (item, index) => ({
  type: SET_NEW_ADMIN_LEADS_ITEM,
  item,
  index
});

export const onChangeAdminLeads = (value, key, item, index) => ({
  type: ONCHANGE_ADMIN_LEADS,
  value,
  key,
  item,
  index
});

export const updateExistLead = (data, index) => ({
  type: UPDATE_ADMIN_LEAD,
  data,
  index
});
