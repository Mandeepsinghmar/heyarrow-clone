/* eslint-disable */
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { debounce, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, connect, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { Popover, PopoverBody } from 'reactstrap';
import { MenuItem } from '@material-ui/core';
import TableContent from '../../../components/common/ContentsTable';

import CustomIcon from '../../../components/common/CustomIcon';
import CustomSelect from '../../../components/common/CustomSelect';
import './index.scss';
import { createAdminProduct, getAdminProductsList, getProductStatus, updateAdminProduct } from '../../../api/adminProducts';
import {
  clearAdminProducts,
  removeNewAdminProducts,
  setAdminProductDetail,
  setAdminProductList,
  onChangeAdminProduct,
  addNewAdminProducts,
} from '../../../redux/actions';
import TableSendButton from '../../../components/common/TableSendButton';
import SearchInput from '../../../components/common/SearchInput';
import removeEmptyProps from '../../../utils/removeEmptyProps';

const columns = [
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category', type: 'category' },
  { label: 'Cost', key: 'cost' },
  { label: 'Price', key: 'price', type: 'price' },
  {
    label: 'Year',
    key: 'modelYear',
    type: 'year',
    options: 'year',
  },
  { label: 'Make', key: 'manufacturer', minWidth: 150 },
  { label: 'Model', key: 'model' },
  { label: 'Type', key: 'type', type: 'type' },
  {
    label: 'Status',
    key: 'productStatusId',
    type: 'customDropdown',
    options: 'status',
  },
];

const cbopsColumn = [
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category', type: 'category' },
  { label: 'Make (Manufcaturer)', key: 'manufacturer' },
  { label: 'Model', key: 'model' },
  {
    label: 'Year',
    key: 'modelYear',
    type: 'year',
    options: 'year',
  },
  { label: 'Type', key: 'type', type: 'type' },
  { label: 'Cost (Wholesale)', key: 'cost' },
  { label: 'Price (Advt.)', key: 'advertisedPrice', type: 'price' },
  { label: 'SN#', key: 'serialNumber' },

  { label: 'Horse Power', key: 'horsePower' },
  { label: 'OP HRS', key: 'operationHours' },
  { label: 'Stock#', key: 'stockNumber' },
  {
    label: 'City',
    key: 'cityId',
    type: 'city',
    options: 'cityCode',
  },
  {
    label: 'State',
    key: 'stateId',
    type: 'state',
    options: 'stateCode',
  },
  {
    label: 'Status',
    key: 'productStatusId',
    type: 'customDropdown',
    options: 'status',
  },
];

const curtisLaneAndATColumn = [
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category', type: 'category' },
  { label: 'Make', key: 'manufacturer', minWidth: 150 },
  { label: 'Model', key: 'model' },
  {
    label: 'Year',
    key: 'modelYear',
    type: 'year',
    options: 'year',
  },
  { label: 'Type', key: 'type', type: 'type' },
  { label: 'Cost', key: 'cost' },
  { label: 'Price', key: 'price', type: 'price' },
  { label: 'Serial Number', key: 'serialNumber' },
  { label: 'Operation Hours', key: 'operationHours' },
  { label: 'Stock Number', key: 'stockNumber' },
  { label: 'City Name', key: 'city.name', multipleKey: true },
  { label: 'State Name', key: 'city.state.name', multipleKey: true },
  {
    label: 'Status',
    key: 'productStatusId',
    type: 'customDropdown',
    options: 'status',
  },
];

const formObject = {
  model: '',
  modelName: '',
  modelYear: '',
  category: '',
  machine: '',
  manufacturer: '',
  hours: '',
  countryId: '',
  stateId: '',
  cityId: '',
  stockNumber: '',
  vinNo: '',
  price: '',
  tag: '',
  description: '',
  productStatusId: '',
  isNewItem: true,
  type: '',
  cost: '',
};

const countries = [
  { label: 'India', value: 1 },
  { label: 'UK', value: 2 },
  { label: 'USA', value: 3 },
  { label: 'Australia', value: 4 },
];

const types = [
  { label: 'U', value: 1 },
  { label: 'N', value: 2 },
];

const states = [
  { label: 'UP', value: 1 },
  { label: 'Delhi', value: 2 },
  { label: 'Gujarat', value: 3 },
  { label: 'MP', value: 4 },
];
const cities = [
  { label: 'Surat', value: 1 },
  { label: 'Banaras', value: 2 },
  { label: 'Ahemdabad', value: 3 },
  { label: 'Vapi', value: 4 },
  { label: 'Mumbai', value: 5 },
];

const years = [{ label: 'none', value: '' }];
const currentYear = new Date();
for (let i = currentYear.getFullYear(); i > 1900; i--) {
  years.push({
    label: `${i}`,
    value: `${i}`,
  });
}
function Products(props) {
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRows, setSelectedRow] = useState([]);
  const [search, setSearch] = useState('');
  const [countriesOptions, setCountriesOptions] = useState(countries);
  const [statesOptions, setStatesOptions] = useState(states);
  const [citiesOptions, setCitiesOptions] = useState(cities);
  const [yearOptions, setYearOptions] = useState(years);
  const [typeOptions, settypeOptions] = useState(types);
  const [isLocked, setIsLocked] = useState(true);
  const [height, setHeight] = useState(window.innerHeight);
  const [limit] = useState(30);
  const { client } = useSelector((state) => state);
  const [isUpdatedCbops] = useState(props.history.location.pathname.split('/')[3] === 'updated' && client.domain == 'cbops');
  const [selectStatus, setSelectStatus] = useState('all');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const dispatch = useDispatch();

  const { adminProductList, productStatuses } = props;
  useEffect(() => {
    fetchProducts();
    setHeight(window.innerHeight);
    dispatch(getProductStatus());
  }, []);

  useEffect(() => {
    if (handleFilterTableByStatus(adminProductList).length < 30) {
      setHasMore(false);
    }
  }, [selectStatus]);

  const selectMultipleRowHandler = (id) => {
    const _selectedRows = Object.assign([], selectedRows);
    const index = _selectedRows.findIndex((o) => o === id);
    if (index >= 0) {
      _selectedRows.splice(index, 1);
    } else {
      _selectedRows.push(id);
    }
    setSelectedRow(_selectedRows);
  };

  const fetchProducts = (nextValue) => {
    setloading(true);
    dispatch(getAdminProductsList(height >= 900 ? limit * 3 : limit, page, nextValue && `&search=${nextValue}`)).then((res) => {
      setloading(false);
      setPage(page + 1);
      if (res && res.length < 30) {
        setHasMore(false);
      }
    });
  };

  const addNew = () => {
    dispatch(addNewAdminProducts(JSON.parse(JSON.stringify(formObject))));
  };

  const onChange = (e, key, item, index) => {
    let { value } = e.target;
    if (key === 'price') {
      if (value.length > 0) {
        value = value.replace('$', '').replace(/,/g, '');
      }
      if (isNaN(value) && value !== '') {
        return;
      }
    }

    dispatch(onChangeAdminProduct(value, key, item, index));
  };

  const loadFunc = () => {
    if (!loading) {
      fetchProducts();
    }
  };

  const onSave = async (item, index, payload) => {
    if (item.id) {
      setSaving(true);
      // item.price = (item.price.length > 0
      //     && parseInt(item.price.toString().replace(',', '')))
      //   || item.price;
      dispatch(updateAdminProduct(item.id, item));
      setSaving(false);
    } else {
      setSaving(true);
      dispatch(createAdminProduct(removeEmptyProps(item))).then(() => {
        toast.success('Product added successfully.');
        setSaving(false);
      });
      removeRow(index);
    }
  };

  const removeRow = (index) => {
    dispatch(removeNewAdminProducts(index));
  };

  const renderTableActions = (item) => (
    <div className="table-actions">
      <button
        className="sendBtn"
        onClick={() => {
          props.history.push(`/admin/products/${item.id}`);
          dispatch(setAdminProductDetail(item));
          dispatch(clearAdminProducts());
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      dispatch(clearAdminProducts());
      fetchProducts(nextValue);
    }, 1000),
    []
  );

  const handleChange = (event) => {
    setPage(1);
    setSearch(event);
    debouncedSave(event);
  };

  const handleChangeSelect = (event) => {
    setSelectStatus(event.target.value);
  };

  const handleFilterTableByStatus = (adminProductList) => {
    let adminProductListState = adminProductList;
    if (selectStatus !== 'all') {
      adminProductListState = adminProductList.filter((adminProduct) => {
        return adminProduct?.productStatus?.id === selectStatus;
      });
    }

    return adminProductListState;
  };

  const saveBtn = (item, index) => {
    const isDisabled = () => {
      return (!item.model && !item.machine) || !item.price || !item.category || !item.modelYear || !item.manufacturer;
    };
    return (
      <TableSendButton
        className="sendBtn"
        onClick={() => onSave(item, index, null, true)}
        title="Add a product"
        placement="left"
        icon="Save"
      >
        <CustomIcon icon="Send" />
      </TableSendButton>
    );
  };

  const onRowClick = (item) => {
    props.history.push(`/admin/products/${item.id}`);
  };

  const onHoverPopOver = () => {
    setPopoverOpen(true);
  };

  const onHoverLeavePopOver = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <div className="contentContainerFull productList">
        <div className="innerFullCon">
          <div className="cardHeader noborder">
            {!isUpdatedCbops ? (
              <Fragment>
                <div className="d-flex align-items-center">
                  <h4>Products</h4>
                  {client.domain == 'cbops' && (
                    <button
                      onClick={() => {
                        props.history.push('/admin/products/updated');
                      }}
                      className="btn updatesBtn"
                    >
                      Updates Available
                      <i className="fa fa-caret-right updatesBtnIcon"></i>
                    </button>
                  )}
                </div>
                <div className="topActionBar">
                  {saving ? <button className="btn">Saving...</button> : ''}
                  <SearchInput onChange={(e) => handleChange(e.target.value)} onClear={() => handleChange('')} />
                  <>
                    <button className="sendBtn sendHeadBtn " onClick={() => setIsLocked(!isLocked)}>
                      {isLocked ? <CustomIcon icon="Edit/Stroke" /> : <CustomIcon icon="Icon/Lock" />}
                    </button>
                    <button className="sendBtn sendHeadBtn" onClick={() => addNew()}>
                      <CustomIcon icon="Header/Icon/Add" />
                    </button>
                  </>
                </div>
              </Fragment>
            ) : (
              <div>
                <h4 className="productsHeader">
                  <span>Products</span>
                  <span> /</span>
                  <span> Updated Products</span>
                </h4>
                <div className="topActionBar">
                  <CustomIcon
                    id="PopOver"
                    onMouseEnter={onHoverPopOver}
                    onMouseLeave={onHoverLeavePopOver}
                    className="productsIcon_alert-gray"
                    icon="alert/gray"
                  />
                  <Popover placement="bottom" isOpen={popoverOpen} target="PopOver">
                    <PopoverBody className="topActionBarUpdated__popOver">
                      Update your product status to have your list upto date.
                    </PopoverBody>
                  </Popover>
                  <CustomSelect
                    className="productsSelectStatus"
                    value={selectStatus}
                    onChange={(e) => {
                      handleChangeSelect(e);
                    }}
                  >
                    <MenuItem key="all" value="all">
                      Select Status
                    </MenuItem>
                    {!isEmpty(productStatuses) &&
                      productStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                  </CustomSelect>
                </div>
              </div>
            )}
          </div>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={
                <div className="tableLoading ShowTableLoader" key={0}>
                  <Loader type="Oval" color="#008080" height={30} width={30} />
                </div>
              }
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              <TableContent
                columns={
                  client.domain == 'cbops'
                    ? cbopsColumn
                    : client.domain == 'curtis-lane' || client.domain == 'aerialtitans'
                    ? curtisLaneAndATColumn
                    : columns
                }
                options={{
                  year: yearOptions,
                  type: typeOptions,
                  status: productStatuses,
                  stateCode: statesOptions,
                  cityCode: citiesOptions,
                  countryCode: countriesOptions,
                }}
                data={client.domain == 'cbops' ? handleFilterTableByStatus(adminProductList) : adminProductList}
                loading={loading}
                tableActions={renderTableActions}
                hasVerticalScroll
                onChange={onChange}
                onSave={onSave}
                removeRow={removeRow}
                selectMultipleRowHandler={selectMultipleRowHandler}
                selectedRows={selectedRows}
                readOnly={isLocked}
                saveBtn={saveBtn}
                onRowClick={onRowClick}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

Products.propTypes = {
  dispatch: PropTypes.func,
  product: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state) => ({
  adminProductList: state.adminProduct.adminProductList,
  productStatuses: state.adminProduct.productStatuses,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Products);
