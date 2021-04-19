import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import ProfileInitials from '../../components/common/ProfileInitials';
import getFullName from '../../utils/getFullName';
import nFormatter from '../../utils/nFormatter';
import Loader from '../../components/common/Loader';

const SaleDataTable = ({
  salesData,
  status
}) => {
  const history = useHistory();
  const onRowClick = (id) => {
    history.push({
      pathname: `/customers/${id}`,
      search: `?status=${status}`
    });
  };

  const emptyState = () => {
    switch (status) {
    case 'shared': {
      return (
        <div className="empty-state">
          <img src="/images/Shared.svg" alt="sold" />
          <span>No Shared history</span>
        </div>
      );
    }
    case 'quoted': {
      return (
        <div className="empty-state">
          <img src="/images/Quoted.svg" alt="sold" />
          <span>No Quoted history</span>
        </div>
      );
    }
    case 'sold': {
      return (
        <div className="empty-state">
          <img src="/images/Sold.svg" alt="sold" />
          <span>No Sold history</span>
        </div>
      );
    }
    case 'closed': {
      return (
        <div className="empty-state">
          <img src="/images/Closed.svg" alt="sold" />
          <span>No Closed history</span>
        </div>
      );
    }
    default:
      return '';
    }
  };

  if (salesData.loading) {
    return <Loader secondary />;
  }

  if (!salesData.data.length) {
    return emptyState();
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Customer name</th>
          <th>Assigned to</th>
          <th>Revenue</th>
          <th>Avg. turn</th>
          <th>Units</th>
          <th>Est. margin</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {!salesData.loading && salesData.data.map((sale) => (
          <tr>
            <td>
              <div className="flex table-customer__item">
                <ProfileInitials
                  firstName={sale.customer.firstName}
                  lastName={sale.customer.lastName}
                  profileId={sale.customer.id}
                  size="small"
                />
                <span>
                  {getFullName(sale.customer)}
                </span>
              </div>
            </td>
            <td>
              <div className="flex table-customer__item">
                <ProfileInitials
                  firstName={sale?.customer?.salesRep?.firstName}
                  lastName={sale?.customer?.salesRep?.lastName}
                  profileId={(sale.customer?.salesRep?.id) ? (sale.customer?.salesRep?.id) : 'N/A'}
                  size="small"
                />
                <span>
                  {(sale.customer?.salesRep) ? getFullName(sale.customer?.salesRep) : '-'}
                </span>
              </div>
            </td>
            <td>{`$${nFormatter(sale.salesData.volume)}`}</td>
            <td>{`${sale.salesData.avgTurn} Days`}</td>
            <td>{sale.salesData.units}</td>
            <td>{`$${nFormatter(sale.salesData.estMargin)}`}</td>
            <td className="stats-table__actions">
              <div className="table-actions">
                <button type="button" className="sendBtn" onClick={() => onRowClick(sale.customer.id)}>
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SaleDataTable.propTypes = {
  salesData: PropTypes.objectOf(PropTypes.any),
  status: PropTypes.string
};

SaleDataTable.defaultProps = {
  salesData: {},
  status: 'shared'
};

export default SaleDataTable;
