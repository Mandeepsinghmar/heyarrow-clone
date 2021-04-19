/* eslint-disable import/prefer-default-export */
import { toast } from 'react-toastify';
import { startCase } from 'lodash';
import {
  addNewAdminProducts, removeProductComment,
  setAdminProductComment, setAdminProductDetail,
  setAdminProductList, setAdminProductSold,
  setProductStatuses, updateExistAdminProduct,
  setAdminProductAsset, removeAdminProductAsset,
  setProductCommentList, setAdminProductTags
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const getAdminProductsList = (limit, page, search) => {
  let url = `products?archived=false&order=DESC&sortBy=machine&limit=${limit}&page=${page}`;
  if (search) {
    url += search;
  }
  const options = generateOptions(url, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminProductList(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const getProductDetail = (id) => {
  const options = generateOptions(`products/${id}`, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminProductDetail(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};
export const getProductListComment = (id) => {
  const options = generateOptions(`products/comment/${id}`, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setProductCommentList(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const getProductSoldHistory = (id) => {
  const options = generateOptions(`products/${id}/customers`, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminProductSold(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const getAdminProductTags = (id) => {
  const options = generateOptions(`product/tag/customer-list/${id}?limit=10&page=1`, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminProductTags(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const createAdminProduct = (data) => {
  const options = generateOptions('products', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(addNewAdminProducts(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const updateAdminProduct = (id, data) => {
  const options = generateOptions(`products/${id}`, 'PUT', data);
  return (dispatch) => {
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Product Info updated successfully.');
        dispatch(updateExistAdminProduct({ ...data }));
        return response.data;
      })
      .catch((error) => {
        if (error.status === 202) {
          toast.success('Product Info updated successfully.');
          dispatch(updateExistAdminProduct(data));
        } else {
          toast.error('Failed to save product.');
        }
        throw error;
      });
  };
};

export const createProductComment = (data) => {
  const options = generateOptions('products/comment', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminProductComment(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const deleteProductComment = (comment, id) => {
  const options = generateOptions(`products/comment/${id}`, 'DELETE');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(removeProductComment(comment));
        return response.data;
      }).catch((error) => {
        if (error.status === 202) {
          toast.success('Comment deleted successfully.');
          dispatch(removeProductComment(comment));
        } else {
          toast.error('Failed to update comment.');
        }
        throw error;
      })
  );
};

export const getProductStatus = () => {
  const options = generateOptions('products/statuses', 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setProductStatuses(response.data.map((data) => ({
          label: data.status,
          value: data.id
        }))));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const createProductAsset = (id, data) => {
  const options = generateOptions(`products/${id}/assets`, 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        let type = data.get('type');
        type = type === ('cover_photo' && 'Cover photo') || startCase(type);
        toast.success(`${type} added successfully.`);
        dispatch(setAdminProductAsset(response.data));
        return response.data;
      }).catch((error) => {
        let type = data.get('type');
        type = type === ('cover_photo' && 'Cover photo') || startCase(type);
        if (error.status === 202) {
          toast.success(`${type} added successfully.`);
          dispatch(setAdminProductAsset());
        } else {
          toast.error(`Failed to add ${type}`);
        }
        throw error;
      })
  );
};

export const reorderCoverPhoto = (id, data) => {
  const options = generateOptions(`products/assets/${id}/coverphoto`,
    'PUT', data);
  return () => (
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Product cover photo reordered successfully.');
        return response.data;
      }).catch((error) => {
        if (error.status === 202) {
          toast.success('Product cover photo reordered successfully.');
        } else {
          toast.error('Product cover photo reordering failed!');
        }
        throw error;
      })
  );
};

export const deleteAdminProductAsset = (id, type) => {
  const options = generateOptions(`products/assets/${id}`, 'DELETE');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        // eslint-disable-next-line no-param-reassign
        type = type === ('cover_photo' && 'Cover photo') || startCase(type);
        toast.success(`${type} deleted successfully.`);
        dispatch(removeAdminProductAsset(id));
        return response.data;
      }).catch((error) => {
        // eslint-disable-next-line no-param-reassign
        type = type === ('cover_photo' && 'Cover photo') || startCase(type);
        if (error.status === 202) {
          toast.success(`${type} deleted successfully.`);
          dispatch(removeAdminProductAsset(id));
        } else {
          toast.error(`Failed to delete ${type}.`);
        }
        throw error;
      })
  );
};

export const deleteAdminProducteTag = (tag, body) => {
  const options = generateOptions(`product/tag/${tag.id}`, 'DELETE', body);
  return () => makeTheApiCall(options)
    .then(() => {
      toast.success('Tag removed successfully');
      return tag.id;
    })
    .catch((error) => {
      throw error;
    });
};
