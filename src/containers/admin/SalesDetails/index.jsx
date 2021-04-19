import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import { debounce, isEmpty } from 'lodash';

import CustomIcon from '../../../components/common/CustomIcon';
import TableContent from '../../../components/common/ContentsTable';
import StatsCard from '../../../components/common/StatsCard';
import './index.scss';
import { getSalesReport } from '../../../api/adminSales';
import HeaderDropDown from '../../../components/common/HeaderDropDown';

const columns = [
  {
    label: 'Customer Name', key: 'customerNames', type: 'name', hasInitials: true
  },
  {
    label: 'State', key: 'stateId', type: 'state', options: 'stateCode'
  },
  {
    label: 'City', key: 'cityId', type: 'city', options: 'cityCode'
  },
  {
    label: 'Sold by', key: 'Sold_by', type: 'name', hasInitials: true
  },
  { label: 'Sold on', key: 'Sold_on', type: 'date' },
  { label: 'Sales Value', key: 'salesValue', type: 'currency' },
  { label: 'Margin', key: 'margin', type: 'currency' },
  { label: 'Shared', key: 'shared', minWidth: 100 },
  { label: 'Quoted', key: 'quoted', minWidth: 100 },
  { label: 'Sold', key: 'sold', minWidth: 100 },
  { label: 'Closed', key: 'closed', minWidth: 100 },
];

const bottomTabs = ['Month', 'Quarter', 'Year'];

function SalesDetail(props) {
  const {
    match: {
      params: { id },
    },
  } = props;
  const [activeTab, setActiveTab] = useState(2);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 30,
    duration: new Date().getFullYear(),
    durationType: 'yearly',
    search: ''
  });
  const { dispatch, singleSalesReport } = props;

  useEffect(() => {
    dispatch(getSalesReport(
      id, filters.durationType, filters.duration, filters.page, filters.search
    ))
      .then((resp) => {
        if (resp && resp.customers.length < filters.limit) {
          setHasMore(false);
        }
        setLoading(false);
        setPage(page + 1);
      });
  }, [filters]);

  const filterHandler = (items) => {
    const newFilter = { ...filters, page: 1, ...items };
    setFilters(newFilter);
  };

  const onChangeTab = (currentTab) => {
    setActiveTab(currentTab);
    const duration = 'yearly';
    const defaultDuration = new Date().getFullYear();
    const value = parseInt(currentTab.target.value, 10);
    switch (value) {
    case 0: return {
      duration: 'monthly',
      defaultDuration: '1'
    };
    case 1: return {
      duration: 'quarterly',
      defaultDuration: '1'
    };
    case 2: return {
      duration: 'yearly',
      defaultDuration: '2020'
    };
    default:
      break;
    }
    return filterHandler({ durationType: duration, duration: defaultDuration });
  };

  const onChangeDuration = (e) => {
    const { value } = e.target;
    filterHandler({ duration: value });
  };

  const renderTableActions = () => (
    <div className="table-actions" />
  );

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      filterHandler({ search: nextValue });
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setPage(1);
    debouncedSave(nextValue);
  };

  let newSalesReport = [];

  if (singleSalesReport) {
    if (singleSalesReport && singleSalesReport.customers
      && singleSalesReport.customers.length > 0) {
      newSalesReport = singleSalesReport.customers.map((customer) => ({
        ...customer,
        customerNames: `${customer.firstName} ${customer.lastName}`,
        Sold_by: !isEmpty(customer.products)
          ? `${customer.products[0].salesRep.firstName} ${customer.products[0].salesRep.lastName}`
          : null,
        Sold_on: !isEmpty(customer.products)
          ? customer.products[0].purchaseDate : null,
        salesValue: customer.salesValue || '0'
      }));
    }
  }

  return (
    <>
      <div className="contentContainerFull salesDetailList">
        <div className="innerFullCon">
          <div className="cardHeader noborder">
            <div className="product-head-title">
              <Link to="/admin/sales"><i className="fa fa-angle-left" aria-hidden="true" /></Link>
              <h4>
                Sales Report /
                {' '}
                {singleSalesReport && singleSalesReport.product
              && singleSalesReport.product.machine}
              </h4>
            </div>
            <div className="topActionBar">
              <div className="searchTabs searchContain">
                <CustomIcon icon="Search" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={handleChange}
                />
              </div>
              <div className="bottomTabs">
                <HeaderDropDown
                  activeTab={activeTab}
                  tabs={bottomTabs}
                  renderSelect
                  renderSelectOnRight
                  onChangeTab={onChangeTab}
                  onChangeDuration={onChangeDuration}
                />
              </div>
            </div>
          </div>
          <div
            className="detailCards overviewCards"
            style={{ paddingBottom: 20 }}
          >
            <div className="flex justify-between stats-group">
              <StatsCard
                label="REVENUE"
                value={singleSalesReport.salesData?.volume || 0}
                type="currency"
              />
              <StatsCard
                label="AVG. TURN"
                value={singleSalesReport.salesData?.avgTurn || 0}
                type="day"
              />
            </div>
            <div className="flex justify-between stats-group">
              <StatsCard
                label="UNITS"
                value={singleSalesReport.salesData?.units || 0}
              />
              <StatsCard
                label="EST. MARGIN"
                value={singleSalesReport.salesData?.estMargin || 0}
                type="currency"
              />
            </div>
          </div>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              hasMore={hasMore}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              <TableContent
                columns={columns}
                data={
                  newSalesReport || []
                }
                readOnly
                loading={loading}
                tableActions={renderTableActions}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  singleSalesReport: state.adminSales.singleSalesReport,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

SalesDetail.propTypes = {
  singleSalesReport: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesDetail);
