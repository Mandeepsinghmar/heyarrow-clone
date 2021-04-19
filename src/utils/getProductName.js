import { get } from 'lodash';

const getProductName = (product) => {
  if (!product) {
    return '';
  }
  if (product.machine) {
    return product.machine;
  }
  return `${get(product, 'model', '')} ${get(product, 'manufacturer', '')}`;
};

export default getProductName;
