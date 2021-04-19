import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
import TableContent from '../../../components/common/ContentsTable';
import StatsCard from '../../../components/common/StatsCard';
import './index.scss';
import HeaderDropDown from '../../../components/common/HeaderDropDown';
import { getSalesReportWithSearch } from '../../../api/adminSales';
import { clearSales } from '../../../redux/actions';
import SearchInput from '../../../components/common/SearchInput';

const columns = [
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category' },
  { label: 'Product Name', key: 'modelName' },
  { label: 'Year', key: 'modelYear' },
  { label: 'Type', key: 'type' },
  { label: 'Make', key: 'manufacturer' },
  { label: 'Model', key: 'model' },
  { label: 'Customers', key: 'customersCount' },
  { label: 'Sales Value', key: 'salesValue', type: 'currency' },
  { label: 'Margin', key: 'margin', type: 'currency' },
  { label: 'Shared', key: 'shared' },
  { label: 'Quoted', key: 'quoted' },
  { label: 'Sold', key: 'sold' },
  { label: 'Closed', key: 'closed' },
];

const bottomTabs = ['Month', 'Quarter', 'Year'];

function Sales(props) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(2);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [height, setHeight] = useState(window.innerHeight);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 30,
    duration: new Date().getFullYear(),
    durationType: 'yearly',
    search: '',
  });

  const { adminSalesList } = props;

  const fetchSalesReport = (_filters) => {
    setLoading(true);
    dispatch(getSalesReportWithSearch(
      _filters.durationType, _filters.duration,
      height >= 900 ? (_filters.limit * 3) : _filters.limit,
      page, _filters.search
    )).then((resp) => {
      if (resp && resp.salesReport.length < filters.limit) {
        setHasMore(false);
      }
      setLoading(false);
      setPage(page + 1);
    });
  };

  useEffect(() => {
    fetchSalesReport(filters);
    setHeight(window.innerHeight);
  }, [filters]);

  const filterHandler = (items) => {
    const newFilter = { ...filters, page: 1, ...items };
    setFilters(newFilter);
  };

  const onChangeTab = (currentTab) => {
    setActiveTab(currentTab);
    const durationType = 'yearly';
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
    setPage(1);
    return filterHandler({ durationType, duration: defaultDuration });
  };

  const onChangeDuration = (e) => {
    const { value } = e.target;
    setPage(1);
    filterHandler({ duration: value });
  };

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      dispatch(clearSales());
      filterHandler({ search: nextValue });
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    setPage(1);
    debouncedSave(event);
  };

  const loadFunc = () => {
    if (!loading) {
      fetchSalesReport(filters);
    }
  };

  const onSave = () => {

  };

  const onChange = () => {

  };

  const renderTableActions = (item) => (
    <div className="table-actions">
      <button
        type="button"
        className="sendBtn"
        onClick={() => {
          props.history.push(`sales-detail/${item.id}`);
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );

  return (
    <>
      <div className="contentContainerFull salesList">
        <div className="innerFullCon">
          <div className="cardHeader noborder">
            <h4>Sales Report</h4>
            <div className="topActionBar">
              <SearchInput
                onChange={(e) => handleChange(e.target.value)}
                onClear={() => handleChange('')}
              />
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
          <div className="detailCards overviewCards" style={{ paddingBottom: 10 }}>
            <div className="flex justify-between stats-group">
              <StatsCard
                label="REVENUE"
                value={(adminSalesList.salesData?.volume) || 0}
                type="currency"
              />
              <StatsCard
                label="AVG. TURN"
                value={(adminSalesList.salesData?.avgTurn) || 0}
                type="day"
              />
            </div>
            <div className="flex justify-between stats-group">
              <StatsCard
                label="UNITS"
                value={(adminSalesList.salesData?.units) || 0}
              />
              <StatsCard
                label="EST. MARGIN"
                value={(adminSalesList.salesData?.estMargin) || 0}
                type="currency"
              />
            </div>
          </div>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
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
                loading={loading}
                columns={columns}
                data={(adminSalesList && adminSalesList.salesReport) || []}
                tableActions={renderTableActions}
                onSave={onSave}
                readOnly
                hasVerticalScroll
                onChange={onChange}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

Sales.propTypes = {
  history: PropTypes.func.isRequired,
  adminSalesList: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  salesReport: state.salesReport,
  adminSalesList: state.adminSales.adminSalesList,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Sales);
