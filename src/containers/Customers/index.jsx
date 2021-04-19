import React, { useEffect, useState } from 'react';
import { Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './index.scss';
import CustomAccordion from '../../components/common/Collapsable';
import PinnedCustomers from '../../components/PinnedCustomers';
import { customers } from '../../_mocks_';
import MyCustomers from '../../components/MyCustomers';
import TabWithContent from '../../components/common/TabWithContent';
import CustomIcon from '../../components/common/CustomIcon';
import TabPanel from '../../components/common/TabPanel';
import UnassignedCustomers from '../../components/UnassignedCustomers';
import ProfileGroup from '../../components/common/ProfileGroup';
import StatsCard from '../../components/common/StatsCard';
import CustomDropdown from '../../components/common/CustomDropdown';
import {
  DURATION_TYPES,
  DURATION_OPTIONS
} from '../../constants';
import ProfileInitials from '../../components/common/ProfileInitials';
import AddCustomerModal from '../../components/AddCustomerModal';
import VerticalTabs from '../../components/common/VerticalTabs';
import getFullName from '../../utils/getFullName';
import { getTeamOverview, getSalesData } from '../../api';
import Loader from '../../components/common/Loader';
import nFormatter from '../../utils/nFormatter';
import { canCreateCustomers, canViewUnassignedCustomers } from '../../utils/checkPermission';
import DealMode from '../../components/DealMode';
import Button from '../../components/common/Button';
import DealModal from '../../components/DealMode/Modal';

const defaultTabs = [
];

const Customers = () => {
  const [barType, setBarType] = useState(null);
  const [currentTab, setcurrentTab] = useState(0);
  const [status, setStatus] = useState('shared');
  const [isAddCustomerModal, setIsAddCustomerModal] = useState(false);
  const [isDealModal, setDealModal] = useState(false);
  const dispatch = useDispatch();
  const { overview, salesData } = useSelector((state) => state.team);
  const [filters, setFilters] = useState({
    durationType: 'yearly',
    duration: 'all'
  });
  const [duration, setDuration] = useState(DURATION_OPTIONS[DURATION_TYPES
    .findIndex((dr) => dr.value === filters.durationType)]);
  const history = useHistory();
  const openBar = (type) => {
    setBarType(type);
    if (type) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleAddCustomerModal = () => {
    setIsAddCustomerModal(!isAddCustomerModal);
  };

  const toggleDealModal = () => {
    setDealModal(!isDealModal);
  };

  useEffect(() => {
    dispatch(getTeamOverview());
  }, []);

  useEffect(() => {
    if (status !== 'deal-mode') {
      dispatch(getSalesData(status, filters));
    }
  }, [filters, status]);

  useEffect(() => {
    const newDuration = DURATION_OPTIONS[DURATION_TYPES
      .findIndex((dr) => dr.value === filters.durationType)];
    setDuration(newDuration);
  }, [filters.durationType]);

  const onFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const onRowClick = (id) => {
    history.push(`/customers/${id}`);
  };

  return (
    <div className="flex justify-between w-100">
      <div
        onClick={openBar}
        className={barType === 'leftBar' ? 'leftSidebar open' : 'leftSidebar'}
      >
        <div className="leftSidebarContent scroll-vertical">
          <CustomAccordion
            title="Pinned Customers"
            accordionId="pinned-customers"
          >
            <PinnedCustomers customers={customers} />
          </CustomAccordion>
          {canCreateCustomers()
          && (
            <div className="customers-add-btn">
              <CustomIcon icon="Add" onClick={toggleAddCustomerModal} />
            </div>
          )}
          <TabWithContent
            titles={['Assigned', 'Unassigned']}
            onChangeTab={(tab) => setcurrentTab(tab)}
          >
            <TabPanel index={0} value={currentTab}>
              <MyCustomers />
            </TabPanel>
            <TabPanel index={1} value={currentTab}>
              {canViewUnassignedCustomers()
                ? <UnassignedCustomers /> : <center className="text-sm">Not authorized</center>}
            </TabPanel>
          </TabWithContent>
        </div>
      </div>
      <div className="center-box customers-container">
        <div className="customers__left-sider">
          <div className="customers__left-sider__header">
            <div>
              <ProfileGroup
                profiles={
                  [
                    overview.user,
                    overview.user.reportingTo
                  ]
                }
              />
              <div className="customers__header-title">
                <span>{getFullName(overview.user)}</span>
                <span>{overview.user?.role?.name}</span>
              </div>
            </div>
          </div>
          <div className="customers__left-sider__body">
            {overview.loading ? <Loader secondary />
              : (
                <VerticalTabs
                  tabs={[...Object.keys(overview?.counts)?.filter((key) => key !== 'customers'
                  && key !== 'team'
                  && key !== 'deal_mode'
                  && key !== 'tag_products')
                    .map((key) => ({
                      label: key,
                      value: key,
                      subtitle: overview?.counts[key]?.total
                    })), ...defaultTabs]}
                  value={status}
                  onChange={(value) => setStatus(value)}
                />
              ) }
          </div>
        </div>
        <Divider orientation="vertical" />
        <div className="customers__right-sider">
          <div className="sticky-top bg-white">
            <div className="stats_card_list">
              <StatsCard
                label="Revenue"
                value={salesData.salesData.volume}
                type="currency"
              />
              <StatsCard
                label="AVG.TUrn"
                value={salesData.salesData.avgTurn}
                type="day"
              />
              <StatsCard
                label="Units"
                value={salesData.salesData.units}
              />
              <StatsCard
                label="EST.MARGIN"
                value={salesData.salesData.estMargin}
                type="currency"
              />
            </div>
            <div className="customers__filters">
              <div className="customers__filters__left" />
              <div className="customers__filters__right">
                <CustomDropdown
                  data={duration?.data}
                  value={filters.duration}
                  placeholder={duration.placeholder}
                  onChange={(value) => onFilterChange('duration', value)}
                />
                <CustomDropdown
                  data={DURATION_TYPES}
                  value={filters.durationType}
                  placeholder="Duration type"
                  onChange={(value) => onFilterChange('durationType', value)}
                />
                {status === 'deal-mode'
                && (
                  <Button
                    className="action-btn"
                    onClick={toggleDealModal}
                  >
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
          {status === 'deal-mode' && <DealMode />}
          {status !== 'deal-mode'
          && (
            <div className="stats_table tableContent">
              <table>
                <thead>
                  <tr>
                    <th>Customers</th>
                    <th>Revenue</th>
                    <th>Avg. turn</th>
                    <th>Units</th>
                    <th>Est. margin</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {!salesData.loading && salesData.data.map((sale) => (
                    <tr onClick={() => onRowClick(sale.customer.id)}>
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
                      <td>{`$${nFormatter(sale.salesData.volume)}`}</td>
                      <td>{`${sale.salesData.avgTurn} Days`}</td>
                      <td>{sale.salesData.units}</td>
                      <td>{`$${nFormatter(sale.salesData.estMargin)}`}</td>
                      <td className="stats-table__actions">
                        <div className="table-actions">
                          <button type="button" className="sendBtn">
                            <i className="fas fa-chevron-right" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {salesData.loading && <Loader secondary />}
            </div>
          )}
        </div>
      </div>
      <div style={{ width: '210px' }}>
          &nbsp;
      </div>
      <AddCustomerModal
        isOpen={isAddCustomerModal}
        toggle={toggleAddCustomerModal}
      />
      <DealModal
        isOpen={isDealModal}
        toggle={toggleDealModal}
      />
    </div>
  );
};

export default Customers;
