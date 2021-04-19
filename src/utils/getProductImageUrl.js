const getImgUrl = (product, defaultUrl = '/images/product-image-placeholder.svg') => {
  const assets = product?.productAssets;
  if (!assets || !assets.length) {
    return defaultUrl;
  }
  const cover = assets.find((asset) => asset.type === 'cover_photo');
  if (cover) {
    return cover.url;
  }
  const photo = assets.find((asset) => asset.type === 'photo');
  if (photo) {
    return photo.url;
  }
  return defaultUrl;
};

export default getImgUrl;
