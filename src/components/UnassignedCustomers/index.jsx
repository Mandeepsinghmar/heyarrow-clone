import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import CustomerListItem from '../common/CustomerListItem';
import './index.scss';
import SearchInput from '../common/SearchInput';
import { getUnassignedCustomers } from '../../api';
import Loader from '../common/Loader';

const UnassignedCustomers = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state) => state.customers.unassignedCustomers
  );
  const [filters, setFilters] = useState({
    page: 1
  });

  useEffect(() => {
    dispatch(getUnassignedCustomers(filters));
  }, [filters]);

  const searchHandler = debounce((text) => {
    setFilters({
      ...filters,
      search: text
    });
  }, 500);

  return (
    <div>
      <SearchInput
        onChange={(e) => searchHandler(e.target.value)}
        onClear={() => searchHandler('')}
      />
      <div className="listBox">
        {loading ? <Loader />
          : (
            <ul>
              {data.map((customer) => (
                <CustomerListItem
                  item={customer}
                  actionButtonIcon="unpin"
                  hideAction
                  key={customer.id}
                />
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default UnassignedCustomers;
