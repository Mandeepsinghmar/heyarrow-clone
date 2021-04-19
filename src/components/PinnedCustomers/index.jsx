import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PinnedCustomerItem from './PinnedCustomerItem';
import { getPinnedCustomers } from '../../api';
import Loader from '../common/Loader';

const PinnedCustomers = () => {
  const {
    data,
    loading
  } = useSelector((state) => state.customers.pinnedCustomers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data.length) {
      dispatch(getPinnedCustomers());
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="gridBox">
        <ul>
          {data.map((customer) => (
            <PinnedCustomerItem key={customer.id} customer={customer} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default PinnedCustomers;
