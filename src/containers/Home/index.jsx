import React, {
  useState,
  useEffect,
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { debounce } from 'lodash';

import './index.scss';
import PinnedCustomers from '../../components/PinnedCustomers';
import { customers } from '../../_mocks_';
import CustomAccordion from '../../components/common/Collapsable';
import CustomIcon from '../../components/common/CustomIcon';
import Tabs from '../../components/common/Tab';
import FilterIcon from '../../components/common/FilterIcon';
import Filters from '../../components/Filters';
import AvailableProductsList from '../../components/AvailableProductList';
import SoldProductList from '../../components/SoldProductList';
import SortButton from '../../components/SortButton';
import TabPanel from '../../components/common/TabPanel';
import LeftSideWrapper from '../../components/common/LeftSideWrapper';
import RightSideWrapper from '../../components/common/RightSideWrapper';
import { getAvailableProducts, getSoldProducts } from '../../api';
import { clearSoldProducts, clearAvailableProducts } from '../../redux/actions';
import removeEmptyProps from '../../utils/removeEmptyProps';
import FilterChipList from './FilterChipList';
import ProductStats from './ProductStats';

const tabs = [
  'Available',
  'Sold'
];

const Home = (props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState('grid');
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    sortBy: 'updatedAt',
    order: 'DESC',
    filters: {
      manufacturer: [],
      modelYear: [],
      price: [],
      category: [],
      is_new: [],
      model: []
    }
  });
  const {
    availableProducts,
    soldProducts
  } = useSelector((state) => state.products);

  const getAvailableProductHandler = debounce((fil) => {
    dispatch(getAvailableProducts(fil));
  }, 0);

  const getSoldProductHandler = debounce((fil) => {
    dispatch(getSoldProducts(fil));
  }, 0);

  useEffect(() => {
    if (activeTab === 0) {
      getAvailableProductHandler(filters);
    } else {
      getSoldProductHandler(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (!availableProducts.data.length && activeTab === 0) {
      getAvailableProductHandler({
        ...filters,
        page: 1
      });
    }
    if (!soldProducts.data.length && activeTab === 1) {
      getSoldProductHandler({
        ...filters,
        page: 1
      });
    }
  }, [activeTab]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const switchTab = (index) => {
    setActiveTab(index);
  };

  const loadMoreProducts = () => {
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };

  const clearProductsHandler = () => {
    if (activeTab === 1) {
      dispatch(clearSoldProducts());
    } else {
      dispatch(clearAvailableProducts());
    }
  };

  const onSearch = debounce((text) => {
    clearProductsHandler();
    setFilters({
      ...filters,
      search: text,
      page: 1,
    });
  }, 500);

  const searchHandler = (searchText) => {
    onSearch(searchText);
    setSearch(searchText);
  };

  const isFiltersApplied = () => !!Object.keys(
    removeEmptyProps(filters.filters)
  ).length;

  const onApplyFilters = (selectedFilters) => {
    clearProductsHandler();
    setFilters({
      ...filters,
      page: 1,
      filters: selectedFilters
    });
    toggleFilter();
  };

  const onFilterCancel = () => {
    toggleFilter();
  };

  const removeFilter = (value, key) => {
    if (key === 'price') {
      setFilters({
        ...filters,
        filters: {
          ...filters.filters,
          price: []
        }
      });
    } else {
      setFilters({
        ...filters,
        filters: {
          ...filters.filters,
          [key]: filters.filters[key].filter((fil) => fil !== value)
        }
      });
    }
    clearProductsHandler();
  };

  const sortByHandler = (sortBy, order) => {
    clearProductsHandler();
    setFilters({
      ...filters,
      sortBy,
      order,
      page: 1
    });
  };

  return (
    <div className="home-container">
      <LeftSideWrapper>
        <div className="leftSidebarContent scroll-vertical">
          <CustomAccordion
            title="Pinned Customers"
            accordionId="pinned-customers"
          >
            <PinnedCustomers customers={customers} />
          </CustomAccordion>
        </div>
      </LeftSideWrapper>
      <div className="centerContent scroll-vertical">
        <div className="centerBoxContainer homebar">
          <div className="headingBox align-center">
            <Tabs
              tabs={tabs}
              className="headingBox__tabs"
              onChange={switchTab}
            />
            <div className="searchBar flex-1">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={search}
                onChange={(e) => searchHandler(e.target.value)}
              />
              {search ? (
                <CustomIcon
                  icon="clear"
                  onClick={() => {
                    onSearch('');
                    setSearch('');
                  }}
                />
              )
                : <CustomIcon icon="Search" /> }
            </div>
            <div>
              <i onClick={toggleFilter}>
                <FilterIcon enabled={isFiltersApplied()} />
              </i>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex listing-type">
              <CustomIcon icon={viewType === 'list' ? 'view/list-enabled' : 'view/list-disabled'} onClick={() => setViewType('list')} />
              <CustomIcon icon={viewType === 'grid' ? 'view/grid-enabled' : 'view/grid-disabled'} onClick={() => setViewType('grid')} />
            </div>
            <div className="sortByList">
              <ul>
                <SortButton
                  active={filters.sortBy === 'updatedAt'}
                  title="Most Recent"
                  onClick={(value) => sortByHandler('updatedAt', value)}
                />
                <SortButton
                  active={filters.sortBy === 'modelYear'}
                  title="Model Year"
                  direction="ASC"
                  onClick={(value) => sortByHandler('modelYear', value)}
                />
                <SortButton
                  active={filters.sortBy === 'price'}
                  title="Price"
                  direction="DESC"
                  onClick={(value) => sortByHandler('price', value)}
                />
                {/* <SortButton ***** This is a future feature ******
                  active={filters.sortBy === 'operationHours'}
                  title="Hours"
                  direction="DESC"
                  onClick={(value) => sortByHandler('operationHours', value)}
                /> */}
              </ul>
            </div>
          </div>
          <FilterChipList
            filters={filters.filters}
            removeFilter={removeFilter}
          />
          {isFilterOpen && (
            <Filters
              setFilters={setFilters}
              onApplyFilters={onApplyFilters}
              defaultFilters={filters.filters}
              onFilterCancel={onFilterCancel}
              applied={isFiltersApplied()}
              activeTab={activeTab}
            />
          )}
          <TabPanel index={0} value={activeTab}>
            <AvailableProductsList
              view={viewType}
              loadMoreProducts={loadMoreProducts}
              {...props}
            />
          </TabPanel>
          <TabPanel index={1} value={activeTab}>
            <SoldProductList
              view={viewType}
              loadMoreProducts={loadMoreProducts}
              {...props}
            />
          </TabPanel>
        </div>
      </div>
      <RightSideWrapper>
        <div className="leftSidebarContent scroll-vertical">
          <ProductStats />
        </div>
      </RightSideWrapper>
    </div>
  );
};

export default Home;
