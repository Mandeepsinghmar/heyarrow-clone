import moneyFormatter from './moneyFormatter';

const getProductPrice = (product) => product?.price || product?.advertisedPrice;

export const formattedProductPrice = (product) => {
  const price = getProductPrice(product);
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(price) ? moneyFormatter.format(price) : '';
};

export default getProductPrice;
