import {
  GETTING_PRODUCTS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_SUCCESS,
  GETTING_SOLD_PRODUCTS,
  GET_SOLD_PRODUCTS_SUCCESS,
  GET_SOLD_PRODUCTS_FAILURE,
  CLEAR_PRODUCTS,
  CLEAR_SOLD_PRODUCTS,
  GETTING_AVAILABLE_PRODUCTS_FILTERS,
  GET_AVAILABLE_PRODUCTS_FILTERS_FAILURE,
  GET_AVAILABLE_PRODUCTS_FILTERS_SUCCESS,
  GET_PRODUCTS_STATS_FAILURE,
  GET_PRODUCTS_STATS_SUCCESS,
  GETTING_PRODUCTS_STATS,
  ADD_PRODUCT_COMMENT_FAILURE,
  ADDING_PRODUCT_COMMENT,
  ADD_PRODUCT_COMMENT_SUCCESS,
  DELETE_PRODUCT_COMMENT_FAILURE,
  DELETE_PRODUCT_COMMENT_SUCCESS,
  DELETING_PRODUCT_COMMENT,
  GETTING_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCTS_SUCCESS,
  CLEAR_AVAILABLE_PRODUCTS,
  GETTING_SOLD_PRODUCTS_FILTERS,
  GET_SOLD_PRODUCTS_FILTERS_SUCCESS,
  GET_SOLD_PRODUCTS_FILTERS_FAILURE,
  GETTING_PRODUCT_TAGS,
  GET_PRODUCT_TAGS_SUCCESS,
  GET_PRODUCT_TAGS_FAILURE,
  CREATE_PRODUCT_TAG_SUCCESS,
  REMOVE_PRODUCT_TAG_SUCCESS
} from '../types';

export const gettingProducts = () => ({
  type: GETTING_PRODUCTS
});

export const getProductsFailure = () => ({
  type: GET_PRODUCTS_FAILURE,
});

export const getProductsSuccess = (payload, page) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload,
  page
});

export const gettingSoldProducts = () => ({
  type: GETTING_SOLD_PRODUCTS
});

export const getSoldProductSuccess = (payload, page) => ({
  type: GET_SOLD_PRODUCTS_SUCCESS,
  payload,
  page
});

export const getSoldProductFailure = () => ({
  type: GET_SOLD_PRODUCTS_FAILURE,
});

export const clearSoldProducts = () => ({
  type: CLEAR_SOLD_PRODUCTS
});

export const clearAllProducts = () => ({
  type: CLEAR_PRODUCTS
});

export const clearAvailableProducts = () => ({
  type: CLEAR_AVAILABLE_PRODUCTS
});

export const gettingAvailableProductsFilters = () => ({
  type: GETTING_AVAILABLE_PRODUCTS_FILTERS,
});

export const getAvailableProductsFiltersFailure = () => ({
  type: GET_AVAILABLE_PRODUCTS_FILTERS_FAILURE
});

export const getAvailableProductsFiltersSuccess = (payload) => ({
  type: GET_AVAILABLE_PRODUCTS_FILTERS_SUCCESS,
  payload
});

export const gettingProductStats = () => ({
  type: GETTING_PRODUCTS_STATS
});

export const getProductStatsFailure = () => ({
  type: GET_PRODUCTS_STATS_FAILURE
});

export const getProductStatsSuccess = (payload) => ({
  type: GET_PRODUCTS_STATS_SUCCESS,
  payload
});

export const addingProductComment = () => ({
  type: ADDING_PRODUCT_COMMENT
});

export const addProductCommentSuccess = (payload, category) => ({
  type: ADD_PRODUCT_COMMENT_SUCCESS,
  payload,
  category
});

export const addProductCommentFailure = () => ({
  type: ADD_PRODUCT_COMMENT_FAILURE
});

export const deletingProductComment = () => ({
  type: DELETING_PRODUCT_COMMENT
});

export const deleteProductCommentSuccess = (payload, category, productId) => ({
  type: DELETE_PRODUCT_COMMENT_SUCCESS,
  payload,
  category,
  productId
});

export const deleteProductCommentFailure = () => ({
  type: DELETE_PRODUCT_COMMENT_FAILURE
});

export const gettingAllProducts = () => ({
  type: GETTING_ALL_PRODUCTS
});

export const getAllProductsSuccess = (payload) => ({
  type: GET_ALL_PRODUCTS_SUCCESS,
  payload
});

export const getAllProductsFailure = () => ({
  type: GET_ALL_PRODUCTS_FAILURE
});

export const gettingSoldProductsFilters = () => ({
  type: GETTING_SOLD_PRODUCTS_FILTERS
});

export const getSoldProductsFiltersSuccess = (payload) => ({
  type: GET_SOLD_PRODUCTS_FILTERS_SUCCESS,
  payload
});

export const getSoldProductFiltersFailure = () => ({
  type: GET_SOLD_PRODUCTS_FILTERS_FAILURE
});

export const gettingProductTags = () => ({
  type: GETTING_PRODUCT_TAGS
});

export const getProductTagsSuccess = (payload) => ({
  type: GET_PRODUCT_TAGS_SUCCESS,
  payload
});

export const getProductTagsFailure = () => ({
  type: GET_PRODUCT_TAGS_FAILURE
});

export const createProductTagSuccess = (payload) => ({
  type: CREATE_PRODUCT_TAG_SUCCESS,
  payload
});

export const removeProductTagSuccess = (payload) => ({
  type: REMOVE_PRODUCT_TAG_SUCCESS,
  payload,
});
