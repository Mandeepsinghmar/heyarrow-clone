/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import queryString from 'query-string';
import { toast } from 'react-toastify';
// import { getSingleSalesReport } from '../../api/sales';
import ProductDetail from '../ProductDetail';
import Header from '../../../components/common/Header';
import './index.scss';
import CustomIcon from '../../../components/common/CustomIcon';
import ProductSoldHistory from '../../../components/common/ProductSoldHistory';
import ProductTags from '../../../components/common/ProductTags';
import HeadingBox from '../../../components/common/HeadingBox';
import { getProductDetail, getProductStatus } from '../../../api/adminProducts';
import { Link } from 'react-router-dom';
import { clearAdminProducts } from '../../../redux/actions';

const tabs = ['Sold History', 'Details', 'Tagged'];

const handleCurrentTab = (queryString) => {
  switch (Object.keys(queryString)[0]) {
    case 'activity':
      return 0;
    case 'tags':
      return 2;
    default:
      return 1;
  }
}

const ProductPage = (props) => {
  const [currentTab, setCurrentTab] = useState(handleCurrentTab(queryString.parse(props.location.search)));
  const [activity, setActivity] = useState(false);
  const {
    match: {
      params: { id },
    },
  } = props;
  const dispatch = useDispatch();

  const { adminProductDetail, history, location } = props;

  useEffect(() => {
    const { activity } = queryString.parse(props.location.search);
    if (activity) {
      setActivity(true);
      setCurrentTab(0);
    }
    dispatch(getProductStatus());
    dispatch(getProductDetail(id));
    // dispatch(getSingleSalesReport(id, { durationType: 'yearly', duration: 2020, page: 1, limit: 30 }));
  }, []);

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
    if (tab === 0) {
      history.push(`/admin/products/${adminProductDetail.id}?activity=true`);
    } else {
      history.push(`/admin/products/${adminProductDetail.id}`);
      if (tab === 2) {
        history.push(`/admin/products/${adminProductDetail.id}?tags=true`);
      }
    }
    dispatch(clearAdminProducts());
  };

  const goBack = () => {
    history.push('/admin/products');
  };

  return (
    <>
      <div className="contentContainerFull AdminproductDetail productPageContainer">
        <div className="cardHeader product-title activity">
          <div style={{ display: 'inline-flex' }}>
            {adminProductDetail && adminProductDetail.id && (
              <>
                <Link to="/admin/products">
                  <i class="fa fa-angle-left" aria-hidden="true"></i>
                </Link>
                <h4 style={{ margin: 'auto' }}>
                  {adminProductDetail.modelName ||
                    `${'' + ' '}${adminProductDetail.model}` ||
                    ''}
                </h4>
              </>
            )}
          </div>
          <div className="flex justify-content-center align-items-center">
            <div className="bottomTabs">
              <HeadingBox
                activeTab={currentTab}
                tabs={tabs}
                noRightSection
                onChangeTab={onChangeTab}
              />
            </div>
            {/* This is Future feature **
            <button type="button" className="sendBtn">
              <CustomIcon icon="Header/Icon/More" />
            </button> */}
            <button type="button" className="sendBtn" onClick={() => goBack()}>
              <CustomIcon icon="Icon/Close" />
            </button>
          </div>
        </div>
        {currentTab === 0 ? (
          <ProductSoldHistory match={id} />
        ) : currentTab === 2 ? (
          <ProductTags match={id} />
        ) : (
          <ProductDetail history={history} match={id} location={location} />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  adminProductDetail: state.adminProduct.adminProductDetail,
  adminProductTags: state.adminProduct.adminProductTags,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
