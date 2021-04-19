import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CustomIcon from '../../../../components/common/CustomIcon';
import UploadCategoryCampaign from '../../../../components/common/UploadCategoryCampaign';
import { CATEGORY } from '../../../../constants';
import { selectedProducts } from '../../../../redux/actions';

const UploadProductCampaignContent = (props) => {
  const {
    apiResponse, campaignFormData, productListsPagination, page, hasMore
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [productLists, setProductLists] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [multipleFilter, setMultipleFilter] = useState(false);
  const [filterProductLists, setFilterProductLists] = useState([]);
  const [change, setChange] = useState(false);
  const [checkList, setCheckList] = React.useState({
    productList: [
      {
        name: 'Get Display Photos',
        selected: false
      },
      {
        name: 'Get Price',
        selected: false
      },
      {
        name: 'Get Make,Model,and Year',
        selected: false
      },
      {
        name: 'Get Machine Specifications',
        selected: false
      },
      {
        name: 'Use Arrow URL',
        selected: false
      }
    ]
  });

  const getSelectedProductIds = () => {
    if (
      campaignFormData && campaignFormData.productIds && apiResponse
    ) {
      const getSelectedProducts = apiResponse.filter(
        (item) => campaignFormData.productIds.map(
          (element) => {
            if (item.id === element) {
              const selectedItem = item;
              selectedItem.selected = true;
              return selectedItem;
            }
            return item;
          }
        )
      );
      setProductLists(getSelectedProducts);
    }
  };

  const selectedRow = (rowData) => {
    const singleRowData = rowData;
    if (singleRowData && singleRowData.selected) {
      singleRowData.selected = false;
    } else {
      singleRowData.selected = true;
    }
    setChange(!change);
  };

  useEffect(() => {
    setProductLists(apiResponse);
    setFilterProductLists(apiResponse);
    getSelectedProductIds();
  }, [apiResponse]);

  const onClickNext = () => {
    const productListData = [];
    productLists.map((item) => {
      if (item.selected) {
        productListData.push(item);
      }
      return item;
    });

    let selectedProductListIds = [];
    selectedProductListIds = productListData.map((item) => item.id);

    const data = {
      productIds: selectedProductListIds
    };
    dispatch(selectedProducts(data));
    history.push('/admin/campaigns/new/campaignUpload');
  };

  const renderTableBody = () => (
    <tbody>
      {productLists.map((row) => (
        <tr key={row.name} className={row.selected ? 'selected_row_item' : null} onClick={() => { selectedRow(row); }}>
          <td>
            {row.machine}
          </td>
          <td>{row.category}</td>
          <td>{row.price}</td>
          <td>{row.year}</td>
          <td>{row.make}</td>
          <td>{row.model}</td>
          <td>{row.type.toString()}</td>
          <td>{row.status}</td>
        </tr>
      ))}
    </tbody>
  );

  const renderTableHeader = () => (
    <thead className="table_header">
      <tr>
        <th style={{ width: 200 }}>Machine</th>
        <th style={{ width: 200 }}> Category</th>
        <th style={{ width: 200 }}>Price</th>
        <th style={{ width: 200 }}>Year</th>
        <th style={{ width: 200 }}>Make</th>
        <th style={{ width: 200 }}>Model</th>
        <th style={{ width: 200 }}>Type</th>
        <th style={{ width: 200 }}>Status</th>
      </tr>
    </thead>
  );

  const handleOnChange = (item) => {
    const selectedItem = item;
    if (selectedItem.selected) {
      selectedItem.selected = false;
    } else {
      selectedItem.selected = true;
    }
    setCheckList(checkList);
    setChange(!change);
  };

  const renderCheckboxList = (options) => (
    <div className="checkbox_list">
      {
        options.map((item) => (
          <div className="checkbox_item" onClick={() => { handleOnChange(item); }}>
            <label htmlFor="conatinerLabel" className="container">
              <input
                type="checkbox"
                name={item.name}
                checked={item.selected}
              />
              <span className="checkmark" />
              {item.name}
            </label>
          </div>
        ))
      }
    </div>
  );

  const onChangeText = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      setMultipleFilter(true);
      const newData = filterProductLists.filter(
        (item) => item.machine.toLowerCase().indexOf(text.toLowerCase()) >= 0
              || item.category.toLowerCase().indexOf(text.toLowerCase()) >= 0
              || item.model.toLowerCase().indexOf(text.toLowerCase()) >= 0
              || item.make.toLowerCase().indexOf(text.toLowerCase()) >= 0
              || item.price.toString().indexOf(text.toString()) >= 0
              || item.year.toString().indexOf(text.toString()) >= 0
      );
      setChange(!change);
      setProductLists(newData);
    } else {
      setMultipleFilter(false);
      setProductLists(filterProductLists);
    }
  };

  const filterItem = (item) => {
    if (multipleFilter) {
      let myData = [];
      if (item === 'machine') {
        myData = productLists
          .sort((a, b) => a.machine.localeCompare(b.machine));
      } else if (item === 'category') {
        myData = productLists
          .sort((a, b) => a.category.localeCompare(b.category));
      } else if (item === 'model') {
        myData = productLists
          .sort((a, b) => a.model.localeCompare(b.model));
      } else if (item === 'make') {
        myData = productLists
          .sort((a, b) => a.make.localeCompare(b.make));
      } else if (item === 'price') {
        myData = productLists.sort((a, b) => a.price - b.price);
      } else if (item === 'year') {
        myData = productLists.sort((a, b) => a.year - b.year);
      } else if (item === 'type') {
        myData = productLists
          .sort((a, b) => a.type?.localeCompare(b.type));
      }
      setChange(!change);
      setProductLists(myData);
    } else {
      let myData = [];
      if (item === 'machine') {
        myData = filterProductLists
          .sort((a, b) => a.machine.localeCompare(b.machine));
      } else if (item === 'category') {
        myData = filterProductLists
          .sort((a, b) => a.category.localeCompare(b.category));
      } else if (item === 'model') {
        myData = filterProductLists
          .sort((a, b) => a.model.localeCompare(b.model));
      } else if (item === 'make') {
        myData = filterProductLists
          .sort((a, b) => a.make.localeCompare(b.make));
      } else if (item === 'price') {
        myData = filterProductLists.sort((a, b) => a.price - b.price);
      } else if (item === 'year') {
        myData = filterProductLists.sort((a, b) => a.year - b.year);
      } else if (item === 'type') {
        myData = filterProductLists
          .sort((a, b) => a.typedata?.localeCompare(b.typedata));
      }
      setChange(!change);
      setProductLists(myData);
    }
  };

  const loadFunc = () => {
    productListsPagination();
  };

  return (
    <>
      <div className="grid_product_Select_checklist">
        <div className="product_checkList_filters">
          <div className="product_select_list">
            <div className="product_item">
              {renderCheckboxList(checkList.productList)}
            </div>
          </div>
          <div className="Filter_items">
            <div className="upload-searchTabs">
              <div className="product-search-tabs">
                <input
                  vlaue={searchText}
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => onChangeText(e.target.value)}
                />
                <CustomIcon className="searchIcon" icon="Search" />
              </div>
            </div>
            <div className="filter_by_div">
              <span className="filter_by_text">Filter By</span>
            </div>
            <div className="upload_category">
              <UploadCategoryCampaign
                data={CATEGORY}
                // value="Category"
                placeholder="Select Type"
                className="category-filter-item"
                onChange={(e) => { filterItem(e); }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table_group">
        <div style={{ height: '500px', overflow: 'auto' }}>
          <InfiniteScroll
            pageStart={page}
            loadMore={loadFunc}
            hasMore={hasMore}
            loader={(
              <div className="productsTableLoading" key={0}>
                Loading ...
              </div>
            )}
            threshold={150}
            useWindow={false}
            initialLoad={false}
          >
            <table className="select_products_table" cellPadding="0" cellSpacing="0">
              {renderTableHeader()}
              {renderTableBody()}
            </table>
          </InfiniteScroll>
        </div>
      </div>
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Use Product Info</span>
        </Button>
      </div>
    </>

  );
};

UploadProductCampaignContent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  apiResponse: PropTypes.arrayOf(PropTypes.object),
  productListsPagination: PropTypes.func,
  page: PropTypes.string,
  hasMore: PropTypes.bool
};

UploadProductCampaignContent.defaultProps = {
  campaignFormData: {},
  apiResponse: [],
  productListsPagination: () => { },
  page: '',
  hasMore: false
};

export default UploadProductCampaignContent;
