import {
  SET_ADMIN_PRODUCT_LIST, SET_ADMIN_PRODUCT_SOLD,
  SET_ADMIN_PRODUCT_DETAIL, REMOVE_NEW_PRODUCT_ITEM,
  CLEAR_ALL_ADMIN_PRODUCT, ONCHANGE_ADMIN_PRODUCT,
  SET_NEW_ADMIN_PRODUCT, UPDATE_ADMIN_PRODUCT,
  SET_PRODUCT_STATUS, SET_ADMIN_PRODUCT_COMMENT,
  REMOVE_ADMIN_PRODUCT_COMMENT, SET_ADMIN_PRODUCT_ASSET,
  REMOVE_ADMIN_PRODUCT_ASSET, SET_COVER_PHOTO_ORDER, SET_PRODUCT_COMMENT_LIST,
  SET_ADMIN_PRODUCT_TAGS, REMOVE_ADMIN_PRODUCT_TAG
} from '../types/adminProducts';

const initialState = {
  adminProductList: [],
  adminProductSold: [],
  adminProductDetail: {},
  productStatuses: {},
  productCommentList: [],
  adminProductTags: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_PRODUCT_LIST: {
    let allItems = [...state.adminProductList];
    if (action.page === 1) {
      allItems = action.payload;
    } else {
      allItems = allItems.concat(action.payload);
    }
    return {
      ...state,
      adminProductList: allItems
    };
  }
  case SET_ADMIN_PRODUCT_SOLD:
    return {
      ...state,
      adminProductSold: action.payload
    };
  case SET_ADMIN_PRODUCT_TAGS:
    return {
      ...state,
      adminProductTags: action.payload
    };
  case SET_ADMIN_PRODUCT_DETAIL:
    return {
      ...state,
      adminProductDetail: action.payload
    };
  case REMOVE_NEW_PRODUCT_ITEM: {
    const allProductsRow = [...state.adminProductList];
    allProductsRow.splice(action.index, 1);
    return {
      ...state,
      adminProductList: allProductsRow,
    };
  }
  case CLEAR_ALL_ADMIN_PRODUCT:
    return {
      ...state,
      adminProductList: [],
    };
  case ONCHANGE_ADMIN_PRODUCT: {
    const formRows = [...state.adminProductList];
    if (formRows.length === 0) {
      formRows.unshift(action.item);
    }
    if (!action.index) {
      // eslint-disable-next-line no-param-reassign
      action.index = formRows.findIndex((row) => row.id === action.item.id);
    }
    formRows[action.index] = {
      ...formRows[action.index],
      [action.key]: action.value,
    };
    return {
      ...state,
      adminProductList: formRows,
      adminProductDetail: formRows[action.index],
    };
  }
  case SET_NEW_ADMIN_PRODUCT: {
    let items = [...state.adminProductList];
    items = [action.form, ...items];
    return {
      ...state,
      adminProductList: items,
    };
  }
  case UPDATE_ADMIN_PRODUCT: {
    const allProductsUpdate = [...state.adminProductList];
    allProductsUpdate[action.index] = action.item;
    return {
      ...state,
      adminProductList: allProductsUpdate,
    };
  }
  case SET_PRODUCT_STATUS:
    return {
      ...state,
      productStatuses: action.data,
    };
  case SET_ADMIN_PRODUCT_COMMENT:
    return {
      ...state,
      adminProductDetail: {
        ...state.adminProductDetail,
        comments: [...state.adminProductDetail.comments, action.data],
      },
    };
  case REMOVE_ADMIN_PRODUCT_COMMENT: {
    return {
      ...state,
      adminProductDetail: {
        ...state.adminProductDetail,
        comments: state.adminProductDetail.comments.filter(
          (comment) => comment.id !== action.data.id
        ),
      },
    };
  }
  case SET_ADMIN_PRODUCT_ASSET: {
    return {
      ...state,
      adminProductDetail: {
        ...state.adminProductDetail,
        productAssets: state.adminProductDetail.productAssets.filter(
          (asset) => asset.id !== action.data.id
        ),
      },
    };
  }
  case REMOVE_ADMIN_PRODUCT_ASSET:
    return {
      ...state,
      adminProductDetail: {
        ...state.adminProductDetail,
        productAssets: state.adminProductDetail.productAssets.filter(
          (asset) => asset.id !== action.data
        ),
      },
    };
  case SET_COVER_PHOTO_ORDER:
    return {
      ...state,
      adminProductDetail: {
        ...state.adminProductDetail,
        productAssets: [...state.adminProductDetail.productAssets
          .map((productAsset, index) => (
            {
              ...productAsset,
              order: action.data.assets[index].order
            }
          ))],
      },
    };
  case SET_PRODUCT_COMMENT_LIST: {
    return {
      ...state,
      productCommentList: action.payload
    };
  }
  case REMOVE_ADMIN_PRODUCT_TAG: {
    return {
      ...state,
      adminProductTags: {
        ...state.adminProductTags,
        comments: state.adminProductDetail.comments.filter(
          (comment) => comment.id !== action.data.id
        ),
      },
    };
  }
  default:
    return state;
  }
};
