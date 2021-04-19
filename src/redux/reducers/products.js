import {
  productInitialState
} from '../initial-states';
import {
  GETTING_PRODUCTS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_SUCCESS,
  GETTING_SOLD_PRODUCTS,
  GET_SOLD_PRODUCTS_FAILURE,
  GET_SOLD_PRODUCTS_SUCCESS,
  CLEAR_AVAILABLE_PRODUCTS,
  CLEAR_SOLD_PRODUCTS,
  GETTING_AVAILABLE_PRODUCTS_FILTERS,
  GET_AVAILABLE_PRODUCTS_FILTERS_FAILURE,
  GET_AVAILABLE_PRODUCTS_FILTERS_SUCCESS,
  GET_PRODUCTS_STATS_SUCCESS,
  GET_PRODUCTS_STATS_FAILURE,
  GETTING_PRODUCTS_STATS,
  ADD_PRODUCT_COMMENT_SUCCESS,
  DELETE_PRODUCT_COMMENT_SUCCESS,
  GETTING_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCTS_SUCCESS,
  CLEAR_PRODUCTS,
  GETTING_SOLD_PRODUCTS_FILTERS,
  GET_SOLD_PRODUCTS_FILTERS_SUCCESS,
  GET_SOLD_PRODUCTS_FILTERS_FAILURE,
  GETTING_PRODUCT_TAGS,
  GET_PRODUCT_TAGS_SUCCESS,
  GET_PRODUCT_TAGS_FAILURE,
  CREATE_PRODUCT_TAG_SUCCESS,
  REMOVE_PRODUCT_TAG_SUCCESS
} from '../types';

export default (state = productInitialState, {
  type,
  payload,
  page,
  category,
  productId
}) => {
  switch (type) {
  case GETTING_PRODUCTS:
    return {
      ...state,
      availableProducts: {
        ...state.availableProducts,
        loading: true,
      }
    };
  case GET_PRODUCTS_FAILURE:
    return {
      ...state,
      availableProducts: {
        ...state.availableProducts,
        loading: false,
      }
    };
  case GET_PRODUCTS_SUCCESS: {
    let products = state.availableProducts.data;
    if (page === 1) {
      products = payload;
    } else {
      products = [...products, ...payload];
    }
    return {
      ...state,
      availableProducts: {
        loading: false,
        data: products,
        hasMore: !!payload.length
      }
    }; }
  case GETTING_SOLD_PRODUCTS:
    return {
      ...state,
      soldProducts: {
        ...state.soldProducts,
        loading: true,
      }
    };
  case GET_SOLD_PRODUCTS_FAILURE:
    return {
      ...state,
      soldProducts: {
        ...state.soldProducts,
        loading: false,
      }
    };
  case GET_SOLD_PRODUCTS_SUCCESS: {
    let products = state.soldProducts.data;
    if (page === 1) {
      products = payload;
    } else {
      products = [...products, ...payload];
    }
    return {
      ...state,
      soldProducts: {
        loading: false,
        data: products,
        hasMore: !!payload.length
      }
    }; }
  case CLEAR_SOLD_PRODUCTS: {
    return {
      ...state,
      soldProducts: {
        ...state.soldProducts,
        data: [],
        hasMore: true,
      }
    };
  }
  case CLEAR_AVAILABLE_PRODUCTS: {
    return {
      ...state,
      availableProducts: {
        ...state.availableProducts,
        data: [],
        hasMore: true,
      }
    };
  }
  case GETTING_AVAILABLE_PRODUCTS_FILTERS: {
    return {
      ...state,
      availableFilters: {
        ...state.availableFilters,
        loading: true
      }
    };
  }
  case GET_AVAILABLE_PRODUCTS_FILTERS_FAILURE: {
    return {
      ...state,
      availableFilters: {
        ...state.availableFilters,
        loading: false
      }
    };
  }
  case GET_AVAILABLE_PRODUCTS_FILTERS_SUCCESS: {
    return {
      ...state,
      availableFilters: {
        ...state.availableFilters,
        loading: false,
        data: payload
      }
    };
  }
  case GETTING_SOLD_PRODUCTS_FILTERS: {
    return {
      ...state,
      soldFilters: {
        ...state.soldFilters,
        loading: true
      }
    };
  }
  case GET_SOLD_PRODUCTS_FILTERS_FAILURE: {
    return {
      ...state,
      soldFilters: {
        ...state.soldFilters,
        loading: false
      }
    };
  }
  case GET_SOLD_PRODUCTS_FILTERS_SUCCESS: {
    return {
      ...state,
      soldFilters: {
        ...state.soldFilters,
        loading: false,
        data: payload
      }
    };
  }
  case GETTING_PRODUCTS_STATS: {
    return {
      ...state,
      stats: {
        ...state.stats,
        loading: true,
      }
    };
  }
  case GET_PRODUCTS_STATS_FAILURE: {
    return {
      ...state,
      stats: {
        ...state.stats,
        loading: false,
      }
    };
  }
  case GET_PRODUCTS_STATS_SUCCESS: {
    return {
      ...state,
      stats: {
        ...state.stats,
        data: payload,
        loading: false,
      }
    };
  }
  case ADD_PRODUCT_COMMENT_SUCCESS: {
    const productIndex = state[category].data
      .findIndex((pr) => pr.id === payload.productId);
    if (productIndex === -1) {
      return state;
    }
    const newProduct = state[category].data[productIndex];
    return {
      ...state,
      [category]: {
        ...state[category],
        data: [
          ...state[category].data.slice(0, productIndex),
          { ...newProduct, comments: [payload, ...newProduct.comments] },
          ...state[category].data
            .slice(productIndex + 1, state[category].data.length)
        ]
      }
    }; }
  case DELETE_PRODUCT_COMMENT_SUCCESS: {
    const productIndex = state[category].data
      .findIndex((pr) => pr.id === productId);
    if (productIndex === -1) {
      return state;
    }
    const newProduct = state[category].data[productIndex];
    return {
      ...state,
      [category]: {
        ...state[category],
        data: [
          ...state[category].data.slice(0, productIndex),
          {
            ...newProduct,
            comments: [...state[category].data[productIndex].comments
              .filter((comment) => comment.id !== payload)]
          },
          ...state[category].data
            .slice(productIndex + 1, state[category].data.length)
        ]
      }
    };
  }
  case GETTING_ALL_PRODUCTS:
    return {
      ...state,
      allProducts: {
        ...state.allProducts,
        loading: true,
      }
    };
  case GET_ALL_PRODUCTS_SUCCESS:
    return {
      ...state,
      allProducts: {
        ...state.allProducts,
        loading: false,
        data: [...state.allProducts.data, ...payload],
        hasMore: !!payload.length
      }
    };
  case GET_ALL_PRODUCTS_FAILURE:
    return {
      ...state,
      allProducts: {
        ...state.allProducts,
        loading: false,
      }
    };
  case CLEAR_PRODUCTS:
    return {
      ...state,
      allProducts: {
        ...state.allProducts,
        data: [],
        hasMore: true
      }
    };
  case GETTING_PRODUCT_TAGS:
    return {
      ...state,
      taggedCustomers: {
        ...state.taggedCustomers,
        loading: true
      }
    };
  case GET_PRODUCT_TAGS_SUCCESS:
    return {
      ...state,
      taggedCustomers: {
        ...state.taggedCustomers,
        loading: false,
        data: payload
      }
    };
  case GET_PRODUCT_TAGS_FAILURE:
    return {
      ...state,
      taggedCustomers: {
        ...state.taggedCustomers,
        loading: false
      }
    };
  case CREATE_PRODUCT_TAG_SUCCESS:
    return {
      ...state,
      taggedCustomers: {
        ...state.taggedCustomers,
        data: {
          ...state.taggedCustomers.data,
          Today: [
            ...(state.taggedCustomers.data?.Today
              ? state.taggedCustomers.data?.Today
              : []),
            payload]
        }
      },
    };
  case REMOVE_PRODUCT_TAG_SUCCESS: {
    return {
      ...state,
      taggedCustomers: {
        ...state.taggedCustomers,
        data: {
          ...state.taggedCustomers.data,
          [payload.createdOn]: state.taggedCustomers
            .data[payload.createdOn]
            .filter((tag) => tag.id !== payload.id)
        }
      }
    }; }
  default:
    return state;
  }
};
