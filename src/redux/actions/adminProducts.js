import {
  SET_ADMIN_PRODUCT_LIST, SET_ADMIN_PRODUCT_SOLD,
  SET_ADMIN_PRODUCT_DETAIL, REMOVE_NEW_PRODUCT_ITEM,
  CLEAR_ALL_ADMIN_PRODUCT, ONCHANGE_ADMIN_PRODUCT,
  SET_NEW_ADMIN_PRODUCT, UPDATE_ADMIN_PRODUCT,
  SET_PRODUCT_STATUS, SET_ADMIN_PRODUCT_COMMENT,
  REMOVE_ADMIN_PRODUCT_COMMENT, SET_ADMIN_PRODUCT_ASSET,
  REMOVE_ADMIN_PRODUCT_ASSET, SET_COVER_PHOTO_ORDER, SET_PRODUCT_COMMENT_LIST,
  SET_ADMIN_PRODUCT_TAGS, REMOVE_ADMIN_PRODUCT_TAG
} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const setAdminProductList = (data) => ({
  type: SET_ADMIN_PRODUCT_LIST,
  payload: data
});
export const setProductCommentList = (data) => ({
  type: SET_PRODUCT_COMMENT_LIST,
  payload: data
});

export const setAdminProductSold = (data) => ({
  type: SET_ADMIN_PRODUCT_SOLD,
  payload: data
});

export const setAdminProductTags = (data) => ({
  type: SET_ADMIN_PRODUCT_TAGS,
  payload: data
});

export const setAdminProductDetail = (data) => ({
  type: SET_ADMIN_PRODUCT_DETAIL,
  payload: data
});

export const addNewAdminProducts = (form) => ({
  type: SET_NEW_ADMIN_PRODUCT,
  form
});

export const updateExistAdminProduct = (data) => ({
  type: UPDATE_ADMIN_PRODUCT,
  data
});

export const removeNewAdminProducts = (index) => ({
  type: REMOVE_NEW_PRODUCT_ITEM,
  index
});

export const clearAdminProducts = () => ({
  type: CLEAR_ALL_ADMIN_PRODUCT,
});

export const onChangeAdminProduct = (value, key, item, index) => ({
  type: ONCHANGE_ADMIN_PRODUCT,
  value,
  key,
  item,
  index
});

export const setProductStatuses = (data) => ({
  type: SET_PRODUCT_STATUS,
  data
});

export const setAdminProductComment = (comment) => ({
  type: SET_ADMIN_PRODUCT_COMMENT,
  data: comment
});

export const removeProductComment = (comment) => ({
  type: REMOVE_ADMIN_PRODUCT_COMMENT,
  data: comment
});

export const setAdminProductAsset = (asset) => ({
  type: SET_ADMIN_PRODUCT_ASSET,
  data: asset
});

export const removeAdminProductAsset = (id) => ({
  type: REMOVE_ADMIN_PRODUCT_ASSET,
  data: id
});

export const removeAdminProductTag = (id) => ({
  type: REMOVE_ADMIN_PRODUCT_TAG,
  data: id
});

export const setCoverPhotoOrder = (cover) => ({
  type: SET_COVER_PHOTO_ORDER,
  data: cover
});
