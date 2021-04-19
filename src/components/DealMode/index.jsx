import React from 'react';
import { useSelector } from 'react-redux';

import './index.scss';
import Deal from './Deal';
import Loader from '../common/Loader';

const DealMode = () => {
  const { deals } = useSelector((state) => state.dealMode);
  const emptyState = () => (
    <div className="deal-mode__empty-state">
      <h2>Deal Mode</h2>
      <span>
        There is not any deal available.
        Create your first deal mode from the shared history.
      </span>
    </div>
  );

  return (
    <>
      <div className="deal-mode-container">
        {deals.loading && <Loader secondary />}
        {!deals.loading && (
          <>
            {!deals.deals.length ? emptyState()
              : (
                <div className="deal-list">
                  {deals.deals.map((deal) => (
                    <Deal
                      deal={deal}
                    />
                  ))}
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
};

DealMode.propTypes = {
};

DealMode.defaultProps = {
};

export default DealMode;
