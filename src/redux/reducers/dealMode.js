import { dealModeInitialState } from '../initial-states';

import {
  GETTING_DEAL_ELEMENTS,
  GET_DEAL_ELEMENT_FAILURE,
  GET_DEAL_ELEMENT_SUCCESS,
  GETTING_PAYMENT_METHODS,
  GET_PAYMENT_METHODS_SUCCESS,
  GET_PAYMENT_METHODS_FAILURE,
  GETTING_DEALS,
  GET_DEALS_SUCCESS,
  GET_DEALS_FAILURE,
  CREATE_DEAL_SUCCESS,
  UPLOAD_DEAL_DOC_SUCCESS,
  UPDATE_DEAL_SUCCESS,
} from '../types';

export default (state = dealModeInitialState, { type, payload }) => {
  switch (type) {
  case GETTING_DEAL_ELEMENTS:
    return {
      ...state,
      dealElements: {
        ...state.dealElements,
        loading: true,
      },
    };
  case GET_DEAL_ELEMENT_SUCCESS:
    return {
      ...state,
      dealElements: {
        ...state.dealElements,
        loading: false,
        data: payload,
      },
    };
  case GET_DEAL_ELEMENT_FAILURE:
    return {
      ...state,
      dealElements: {
        loading: false,
      },
    };
  case GETTING_PAYMENT_METHODS:
    return {
      ...state,
      paymentMethods: {
        ...state.paymentMethods,
        loading: true,
      },
    };
  case GET_PAYMENT_METHODS_SUCCESS:
    return {
      ...state,
      paymentMethods: {
        ...state.paymentMethods,
        loading: false,
        data: payload,
      },
    };
  case GET_PAYMENT_METHODS_FAILURE:
    return {
      ...state,
      paymentMethods: {
        ...state.paymentMethods,
        loading: false,
      },
    };
  case GETTING_DEALS:
    return {
      ...state,
      deals: {
        ...state.deals,
        loading: true,
      },
    };
  case GET_DEALS_SUCCESS:
    return {
      ...state,
      deals: {
        ...state.deals,
        loading: false,
        ...payload,
      },
    };
  case GET_DEALS_FAILURE:
    return {
      ...state,
      deals: {
        ...state.deals,
        loading: false,
      },
    };
  case CREATE_DEAL_SUCCESS:
    return {
      ...state,
      deals: {
        ...state.deals,
        deals: [payload, ...state.deals.deals],
      },
    };
  case UPLOAD_DEAL_DOC_SUCCESS: {
    const dealIndex = state.deals.deals.findIndex(
      (deal) => deal.id === payload.dealId
    );
    if (dealIndex === -1) {
      return state;
    }
    const dealElementIndex = state.deals.deals[
      dealIndex
    ].dmElements.findIndex(
      (dmElement) => dmElement.id === payload.dmElementId
    );
    if (dealElementIndex === -1) {
      return state;
    }
    return {
      ...state,
      deals: {
        ...state.deals,
        deals: [
          ...state.deals.deals.slice(0, dealIndex),
          {
            ...state.deals.deals[dealIndex],
            dmElements: [
              ...state.deals.deals[dealIndex].dmElements.slice(
                0,
                dealElementIndex
              ),
              {
                ...state.deals.deals[dealIndex].dmElements[dealElementIndex],
                dmElementsDocs: [
                  ...state.deals.deals[dealIndex].dmElements[dealElementIndex]
                    .dmElementsDocs,
                  {
                    ...payload,
                    createdAt: new Date(),
                  },
                ],
              },
              ...state.deals.deals[dealIndex].dmElements.slice(
                dealElementIndex + 1,
                state.deals.deals[dealIndex].dmElements.length
              ),
            ],
          },
          ...state.deals.deals.slice(dealIndex + 1, state.deals.deals.length),
        ],
      },
    };
  }
  case UPDATE_DEAL_SUCCESS: {
    const dealIndex = state.deals.deals.findIndex(
      (deal) => deal.id === payload.id
    );
    if (dealIndex === -1) {
      return state;
    }
    return {
      ...state,
      deals: {
        ...state.deals,
        deals: [
          ...state.deals.deals.slice(0, dealIndex),
          {
            ...state.deals.deals[dealIndex],
            ...payload,
          },
          ...state.deals.deals.slice(dealIndex + 1, state.deals.deals.length),
        ],
      },
    };
  }
  default:
    return state;
  }
};
