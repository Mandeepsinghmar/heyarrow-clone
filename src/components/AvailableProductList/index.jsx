import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

import ProductGridItem from '../ProductGridItem';
import ProductListItem from '../ProductListItem';
import Loader from '../common/Loader';
import ProductDetailModal from '../ProductDetailModal';
import ShareProductModal from '../ShareProductModal';
import { getProductDetail } from '../../api/adminProducts';
import { canShareProducts } from '../../utils/checkPermission';
import ProductTagModal from '../ProductTagModal';

const AvailableProductList = ({
  view,
  loadMoreProducts,
  location
}) => {
  const { data, hasMore } = useSelector(
    (state) => state.products.availableProducts
  );
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isProductTagModal, setIsProductTagModal] = useState(false);
  const [modalProduct, setModalProduct] = useState({});
  const history = useHistory();
  const { productId, sold } = queryString.parse(location.search);
  const dispatch = useDispatch();
  const [isShareModal, setIsShareModal] = useState(false);

  const toggleDetailModal = () => {
    setIsDetailModal(!isDetailModal);
    if (isDetailModal) {
      history.push('/');
    }
  };

  const toggleShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  const toggleProductTagModal = () => {
    setIsProductTagModal(!isProductTagModal);
  };

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetail(productId)).then((pr) => {
        setModalProduct(pr);
      });
    }
  }, [productId]);

  useEffect(() => {
    if (productId && !sold) {
      toggleDetailModal();
    }
  }, [productId]);

  const openDetailModal = (product) => {
    setModalProduct(product);
    history.push({
      pathname: '',
      search: `?productId=${product.id}`
    });
  };

  const openTagModal = (product) => {
    setModalProduct(product);
    toggleProductTagModal();
  };

  if (!data?.length && !hasMore) {
    return <center>No products available</center>;
  }

  if (view === 'list') {
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
            <ProductListItem
              key={product.id}
              product={product}
              toggleProductTagModal={() => openTagModal(product)}
            />
          ))}
        </InfiniteScroll>
        <ProductTagModal
          isOpen={isProductTagModal}
          toggle={toggleProductTagModal}
          product={modalProduct}
        />
      </>
    );
  }
  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<Loader />}
        height="100vh"
        endMessage={(
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        )}
      >
        {data.map((product) => (
          <ProductGridItem
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

AvailableProductList.propTypes = {
  view: PropTypes.string,
  loadMoreProducts: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any)
};

AvailableProductList.defaultProps = {
  view: 'grid',
  loadMoreProducts: () => {},
  location: {}
};

export default AvailableProductList;
