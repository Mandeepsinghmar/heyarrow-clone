import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

import CustomerListItem from '../common/CustomerListItem';
import './index.scss';
import SearchInput from '../common/SearchInput';
import {
  getMyCustomers,
  pinCustomer,
  unpinCustomer,
} from '../../api';
import Loader from '../common/Loader';
import CustomIcon from '../common/CustomIcon';
import { clearMyCustomers } from '../../redux/actions';

const MyCustomers = () => {
  const {
    data,
    loading,
    hasMore
  } = useSelector((state) => state.customers.myCustomers);
  const { pinnedCustomers } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    page: 1
  });

  useEffect(() => {
    if ((filters.page === 1 && !data.length) || filters.page !== 1) {
      dispatch(getMyCustomers(filters));
    }
  }, [filters]);

  const pinCustomerHandler = (id) => {
    dispatch(pinCustomer(id));
  };

  const unpinCustomerHandler = (id) => {
    dispatch(unpinCustomer(id));
  };

  const isCustomerPinned = (customerId) => pinnedCustomers.data
    .find((customer) => customer.id === customerId);
  const togglePinCustomer = (customer) => {
    if (!isCustomerPinned(customer.id)) {
      pinCustomerHandler(customer);
    } else {
      unpinCustomerHandler(customer);
    }
  };

  const searchHandler = debounce((text) => {
    dispatch(clearMyCustomers());
    setFilters({
      ...filters,
      search: text
    });
  }, 500);

  const loadMoreCustomers = () => {
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };

  return (
    <div>
      <SearchInput
        onChange={(e) => searchHandler(e.target.value)}
        onClear={() => searchHandler('')}
      />
      {!data.length && !loading
      && (
        <div className="no-customers">
          <CustomIcon icon="empty-state/customers" />
          <span>No customers!</span>
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        loader={<Loader key={0} />}
        height="100vh"
        hasMore={hasMore}
        next={loadMoreCustomers}
      >
        <div className="listBox">
          <ul>
            {data.map((customer) => (
              <CustomerListItem
                item={customer}
                actionButtonIcon={isCustomerPinned(customer.id) ? 'unpin' : 'pin'}
                hideAction={false}
                key={customer.id}
                action={() => togglePinCustomer(customer)}
              />
            ))}
          </ul>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MyCustomers;
