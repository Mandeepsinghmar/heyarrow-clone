import { toast } from 'react-toastify';

import {
  getDealElementFailure,
  getDealElementSuccess,
  gettingDealElements,
  gettingPaymentMethods,
  getPaymentMethodFailure,
  getPaymentMethodSuccess,
  gettingDeals,
  getDealFailure,
  getDealSuccess,
  uploadDealDocSuccess
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const getDealElemets = (filters) => {
  const allFilters = {
    page: 1,
    limit: 100,
    order: 'ASC',
    sortBy: 'name',
    ...filters
  };
  const options = generateOptions('deal-mode/deal/elements', 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingDealElements());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getDealElementSuccess(data.dealElementsDefault));
        return data;
      }).catch((error) => {
        dispatch(getDealElementFailure());
        throw error;
      });
  };
};

export const getPaymentMethods = (filters) => {
  const allFilters = {
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions('deal-mode/payment/methods', 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingPaymentMethods());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getPaymentMethodSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getPaymentMethodFailure());
      throw error;
    });
  };
};

export const createDealMode = (body) => {
  const options = generateOptions('deal-mode/deal', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Deal mode created successfully');
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getDeals = (customerId, filters = {}) => {
  const allFilters = {
    durationType: 'yearly',
    duration: 'all',
    page: 1,
    limit: 100,
    ...filters
  };
  const options = generateOptions(`deal-mode/customers/${customerId}/deals`, 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingDeals());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getDealSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getDealFailure());
      throw error;
    });
  };
};

export const uploadDocForDealElement = (elementId, body) => {
  const options = generateOptions(`deal-mode/deal/elements/${elementId}/upload`, 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(uploadDealDocSuccess(data[0]));
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateDeal = (dealId, body) => {
  const options = generateOptions(`deal-mode/deal/${dealId}`, 'PUT', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Deal updated successfully');
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getSignedDocumentUrl = (documentId) => {
  const options = generateOptions(`deal-mode/document/${documentId}`);
  return () => makeTheApiCall(options)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
};

export const getDealById = (id) => {
  const options = generateOptions(`deal-mode/deal/${id}`);
  return () => makeTheApiCall(options)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
};

export const createDealElementDoc = (elementId, body) => {
  const options = generateOptions(`deal-mode/deal/elements/${elementId}/create`, 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(uploadDealDocSuccess(data.document));
      toast.success('Sent successfully!');
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
