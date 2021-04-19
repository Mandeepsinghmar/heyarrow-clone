import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FilterOptions from '../../components/FilterOptions';
import StatsCard from '../../components/common/StatsCard';
import { getProductStats } from '../../api';
import Loader from '../../components/common/Loader';

const ProductStats = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.products.stats);
  const [filters, setFilters] = useState({
    status: 'shared',
    type: 'all',
    durationType: 'yearly',
    duration: 'all',
  });

  useEffect(() => {
    dispatch(getProductStats(filters));
  }, [filters]);

  const filterHandler = (label, value) => {
    setFilters({
      ...filters,
      [label]: value,
    });
  };

  return (
    <>
      <FilterOptions filters={filters} filterHandler={filterHandler} />
      {loading ? <Loader /> : (
        <div>
          <div className="flex justify-between stats-group">
            <StatsCard label="REVENUE" value={data.volume} type="currency" />
            <StatsCard label="AVG. TURN" value={data.avgTurn} type="day" />
          </div>
          <div className="flex justify-between stats-group">
            <StatsCard label="UNITS" value={data.units} />
            <StatsCard label="EST. MARGIN" value={data.estMargin} type="currency" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductStats;
