/* eslint-disable no-mixed-operators */
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
import TableContent from '../ContentsTable';
import { getProductSoldHistory } from '../../../api/adminProducts';

const columns = [
  { label: 'Customers', key: 'customerName' },
  { label: 'Region', key: 'region' },
  {
    label: 'State', key: 'stateId', type: 'state', options: 'stateCode'
  },
  {
    label: 'City', key: 'cityId', type: 'city', options: 'cityCode'
  },
  { label: 'Sold by', key: 'salesRepName' },
  { label: 'Sold on', key: 'soldOn', type: 'date' },
  { label: 'Closed on', key: 'closed', type: 'date' },
  { label: 'Sales Value', key: 'salesValue', type: 'price' },
  { label: 'Margin', key: 'margin', type: 'price' },
];

const ProductSoldHistory = (props) => {
  const { adminProductSold, match } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductSoldHistory(match));
  }, []);

  const onSave = () => {};
  const ProductHistoryList = adminProductSold && adminProductSold.map(
    (product) => ({
      customerName: `${product.customer.firstName} ${product.customer.lastName}`,
      region: 'region1',
      cityId: product.customer.city && product.customer.city.id,
      city: product.customer.city,
      salesRepName: `${product.salesRep.firstName} ${product.salesRep.lastName}`,
      soldOn: product.ProductClosed && product.ProductClosed.createdAt,
      closed: product.ProductClosed && product.ProductClosed.updatedAt,
      salesValue: product.product.price,
      margin: product.margin
    })
  );
  return (
    <div className="innerFullCon">
      <div className="tableBox">
        <InfiniteScroll
          pageStart={1}
          hasMore={!adminProductSold}
          loader={(
            <div className="tableLoading ShowTableLoader" key={0}>
              <Loader
                type="Oval"
                color="#008080"
                height={30}
                width={30}
              />
            </div>
          )}
          threshold={150}
          useWindow={false}
          initialLoad={false}
        >
          <TableContent
            columns={columns}
            data={ProductHistoryList || []}
            hasVerticalScroll
            ProductActivity
            noActions
            readOnly
            onSave={onSave}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

ProductSoldHistory.propTypes = {
  adminProductSold: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  adminProductSold: state.adminProduct.adminProductSold,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProductSoldHistory);
