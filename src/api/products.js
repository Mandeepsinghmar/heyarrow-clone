import queryString from 'query-string';
import { toast } from 'react-toastify';

import makeTheApiCall, { generateOptions } from './apiCalls';
import {
  gettingProducts,
  getProductsFailure,
  getProductsSuccess,
  gettingSoldProducts,
  getSoldProductFailure,
  getSoldProductSuccess,
  gettingAvailableProductsFilters,
  getAvailableProductsFiltersFailure,
  getAvailableProductsFiltersSuccess,
  gettingProductStats,
  getProductStatsFailure,
  getProductStatsSuccess,
  addingProductComment,
  addProductCommentFailure,
  addProductCommentSuccess,
  deleteProductCommentFailure,
  deleteProductCommentSuccess,
  deletingProductComment,
  getAllProductsSuccess,
  gettingAllProducts,
  getAllProductsFailure,
  gettingSoldProductsFilters,
  getSoldProductsFiltersSuccess,
  getSoldProductFiltersFailure,
  updateCustomerStats,
  gettingProductTags,
  getProductTagsSuccess,
  getProductTagsFailure,
} from '../redux/actions';
import removeEmptyProps from '../utils/removeEmptyProps';

export const getAvailableProducts = (filters = {}) => {
  const defaultFilters = {
    limit: 10,
    page: 1,
    sortBy: 'modelYear'
  };
  const allFilters = removeEmptyProps({
    ...defaultFilters,
    ...filters
  });
  const options = generateOptions('products/feed', 'POST', allFilters);
  return (dispatch) => {
    dispatch(gettingProducts());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getProductsSuccess(data, allFilters.page));
      return data;
    }).catch((error) => {
      dispatch(getProductsFailure());
      throw error;
    });
  };
};

export const getSoldProducts = (filters = {}) => {
  const defaultFilters = {
    limit: 10,
    page: 1,
    sortBy: 'modelYear'
  };
  const allFilters = removeEmptyProps({
    ...defaultFilters,
    ...filters
  });
  const options = generateOptions('products/feed/sold', 'POST', allFilters);
  return (dispatch) => {
    dispatch(gettingSoldProducts());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getSoldProductSuccess(data, allFilters.page));
      return data;
    }).catch((error) => {
      dispatch(getSoldProductFailure());
      throw error;
    });
  };
};

export const getAvailableProductsFiters = () => {
  const options = generateOptions('products/filters');
  return (dispatch) => {
    dispatch(gettingAvailableProductsFilters());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getAvailableProductsFiltersSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getAvailableProductsFiltersFailure());
        throw error;
      });
  };
};

export const getSoldProductsFilters = () => {
  const options = generateOptions('products/sold/filters');
  return (dispatch) => {
    dispatch(gettingSoldProductsFilters());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getSoldProductsFiltersSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getSoldProductFiltersFailure());
        throw error;
      });
  };
};

export const getProductStats = (filters = {}) => {
  const queries = queryString.stringify(removeEmptyProps(filters));
  const options = generateOptions(`products/my/statistics?${queries}`);
  return (dispatch) => {
    dispatch(gettingProductStats());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getProductStatsSuccess(data));
        return data;
      }).catch(() => {
        dispatch(getProductStatsFailure());
      });
  };
};

export const addProductComment = (body, category, productId) => {
  const options = generateOptions('products/comment', 'POST', body);
  return (dispatch) => {
    dispatch(addingProductComment());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(addProductCommentSuccess(data, category, productId));
        return data;
      }).catch((error) => {
        dispatch(addProductCommentFailure());
        throw error;
      });
  };
};

export const deleteProductComment = (commentId, category, productId) => {
  const options = generateOptions(`products/comment/${commentId}`);
  return (dispatch) => {
    dispatch(deletingProductComment());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(deleteProductCommentSuccess(commentId, category, productId));
        return data;
      }).catch((error) => {
        dispatch(deleteProductCommentFailure());
        throw error;
      });
  };
};

export const shareProduct = (body) => {
  const options = generateOptions('products/share', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Product has been shared successfully.');
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const shareProductWithCustomers = (body, via) => {
  const options = generateOptions(`products/share/${via}`, 'POST', body);
  return () => makeTheApiCall(options)
    .then((data) => {
      toast.success('Product has been shared successfully');
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const getAllProducts = (filters = {}) => {
  const allFilters = {
    limit: 100,
    page: 1,
    archived: false,
    ...filters
  };
  const options = generateOptions(`products?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingAllProducts());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getAllProductsSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getAllProductsFailure());
        throw error;
      });
  };
};

export const markProductAsSold = (body) => {
  const options = generateOptions('customers/sold', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data).catch((error) => {
      throw error;
    });
};

export const markProductAsClosed = (body) => {
  const options = generateOptions('customers/close', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => data).catch((error) => {
      throw error;
    });
};

export const markProductAsQuoted = (body) => {
  const options = generateOptions('customers/quote', 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(updateCustomerStats(data));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const markProductsAsQuoted = (body) => {
  const options = generateOptions('customers/multiple/quote', 'POST', body);
  return (dispatch) => makeTheApiCall(options)
    .then(({ data }) => {
      dispatch(updateCustomerStats(data));
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const getProductTags = (productId, filters) => {
  const allFilters = {
    limit: 100,
    page: 1,
    ...filters
  };
  const options = generateOptions(`product/tag/customer-list/${productId}`, 'GET', allFilters);
  return (dispatch) => {
    dispatch(gettingProductTags());
    return makeTheApiCall(options)
      .then(({ data }) => {
        dispatch(getProductTagsSuccess(data));
        return data;
      }).catch((error) => {
        dispatch(getProductTagsFailure());
        throw error;
      });
  };
};

export const createTag = (body) => {
  const options = generateOptions('product/tag', 'POST', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Customer tagged successfully');
      return data;
    }).catch((error) => {
      throw error;
    });
};

export const removeTag = (tag, body) => {
  const options = generateOptions(`product/tag/${tag.id}`, 'DELETE', body);
  return () => makeTheApiCall(options)
    .then(({ data }) => {
      toast.success('Tag removed successfully');
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
