/* eslint-disable import/prefer-default-export */
import { toast } from 'react-toastify';
import {
  setAdminLeadsList, setNewAdminLeads,
  updateExistLead
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const getLeadsList = (limit, search, assigned) => {
  let url = `leads?limit=${limit}&page=1`;
  if (search) {
    url += search;
  }
  if (assigned) {
    url += assigned;
  }
  const options = generateOptions(url, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminLeadsList(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const createLeads = (data, index) => {
  const url = 'leads';
  const options = generateOptions(url, 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Lead added successfully.');
        dispatch(setNewAdminLeads(response.data, index));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const updateLeads = (id, data, index) => {
  const url = `leads/${id}`;
  const options = generateOptions(url, 'PUT', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Lead updated successfully.');
        const newRes = {
          ...response.data.customer,
          stateId: data.stateId
        };
        const finalRes = { ...response.data, customer: newRes };
        dispatch(updateExistLead(finalRes, index));
        return response.data;
      }).catch((error) => {
        if (error.status === 202) {
          toast.success('Lead updated successfully.');
          dispatch(updateExistLead({ ...data }, index));
        }
        throw error;
      })
  );
};
