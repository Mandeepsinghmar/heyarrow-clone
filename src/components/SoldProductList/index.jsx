import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

import ProductGridItem from '../ProductGridItem';
import ProductListItem from '../ProductListItem';
import Loader from '../common/Loader';
import ProductDetailModal from '../ProductDetailModal';
import { getProductDetail } from '../../api/adminProducts';
import { canShareProducts } from '../../utils/checkPermission';
import ShareProductModal from '../ShareProductModal';
import ProductTagModal from '../ProductTagModal';

const SoldProductList = ({
  view,
  loadMoreProducts,
  location
}) => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isProductTagModal, setIsProductTagModal] = useState(false);
  const [modalProduct, setModalProduct] = useState({});
  const history = useHistory();
  const { productId, sold } = queryString.parse(location.search);
  const dispatch = useDispatch();
  const { data, hasMore } = useSelector((state) => state.products
    .soldProducts);
  const [isShareModal, setIsShareModal] = useState(false);

  const toggleDetailModal = () => {
    setIsDetailModal(!isDetailModal);
    if (isDetailModal) {
      history.push('/');
    }
  };

  const toggleProductTagModal = () => {
    setIsProductTagModal(!isProductTagModal);
  };

  useEffect(() => {
    if (productId && sold) {
      toggleDetailModal();
    }
  }, [productId]);

  useEffect(() => {
    if (!modalProduct.id && productId) {
      dispatch(getProductDetail(productId)).then((pr) => {
        setModalProduct(pr);
      });
    }
  }, []);

  const openDetailModal = (product) => {
    setModalProduct(product);
    history.push({
      pathname: '',
      search: `?productId=${product.id}&sold=true`
    });
  };

  const toggleShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  const openTagModal = (product) => {
    setModalProduct(product);
    toggleProductTagModal();
  };

  if (!data?.length && !hasMore) {
    return <center>No Sold products available</center>;
  }
  if (view === 'list') {
    return (
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<Loader key={0} />}
        height="100vh"
        endMessage={(
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        )}
      >
        {data.map((product) => (
          <ProductListItem
            sold
            key={product.id}
            product={product}
            toggleProductTagModal={() => openTagModal(product)}
          />
        ))}
      </InfiniteScroll>
    );
  }
  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<Loader key={0} />}
        height="100vh"
        endMessage={(
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        )}
      >
        {data.map((product) => (
          <ProductGridItem
            sold
            key={product.id}
            product={product}
            openDetailModal={() => openDetailModal(product)}
            toggleProductTagModal={() => openTagModal(product)}
          />
        ))}
      </InfiniteScroll>
      <ProductDetailModal
        isOpen={isDetailModal}
        toggle={toggleDetailModal}
        product={modalProduct}
        productId={productId}
        toggleShareModal={toggleShareModal}
        sold={sold}
      />
      {canShareProducts()
      && (
        <ShareProductModal
          isOpen={isShareModal}
          toggle={toggleShareModal}
          product={modalProduct}
        />
      )}
      <ProductTagModal
        isOpen={isProductTagModal}
        toggle={toggleProductTagModal}
        product={modalProduct}
      />
    </>
  );
};

SoldProductList.propTypes = {
  view: PropTypes.string,
  loadMoreProducts: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any)
};

SoldProductList.defaultProps = {
  view: 'grid',
  loadMoreProducts: () => {},
  location: {}
};

export default SoldProductList;
