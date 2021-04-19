import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './index.scss';
import ProfileGroup from '../../components/common/ProfileGroup';
import getFullName from '../../utils/getFullName';
import LeftSideWrapper from '../../components/common/LeftSideWrapper';
import VerticalTabs from '../../components/common/VerticalTabs';
import {
  getTeamOverview,
  getTeamDetail,
  getMyCustomers,
  getSalesData
} from '../../api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import CustomersTable from './CustomersTable';
import CustomDropdown from '../../components/common/CustomDropdown';
import { DURATION_OPTIONS, DURATION_TYPES } from '../../constants';
import StatsCard from '../../components/common/StatsCard';
import SaleDataTable from './SaleDataTable';
import AddTeamModal from '../../components/AddTeamModal';
import MemberTable from './MemberTable';
import { canCreateTeams } from '../../utils/checkPermission';
import RightSideWrapper from '../../components/common/RightSideWrapper';
import TeamChat from './TeamChat';

const Team = () => {
  const { overview, members, salesData } = useSelector((state) => state.team);
  const { myCustomers } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('team');
  const [filters, setFilters] = useState({
    durationType: 'yearly',
    duration: 'all',
    user: ''
  });
  useEffect(() => {
    dispatch(getTeamOverview());
    if (!members.data.length) {
      dispatch(getTeamDetail());
    }
    if (!myCustomers.data.length) {
      dispatch(getMyCustomers());
    }
  }, []);
  const [isAddTeamModal, setIsAddTeamModal] = useState(false);
  const toggleAddTeamModal = () => setIsAddTeamModal(!isAddTeamModal);
  const [duration, setDuration] = useState(DURATION_OPTIONS[DURATION_TYPES
    .findIndex((dr) => dr.value === filters.durationType)]);

  useEffect(() => {
    const newDuration = DURATION_OPTIONS[DURATION_TYPES
      .findIndex((dr) => dr.value === filters.durationType)];
    setDuration(newDuration);
  }, [filters.durationType]);

  useEffect(() => {
    if (status !== 'team' && status !== 'customers') {
      dispatch(getSalesData(status, filters));
    }
  }, [filters, status]);

  const onTabChange = (value) => {
    setStatus(value);
  };

  const onFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="team-container">
      <LeftSideWrapper>
        <div className="stats__header">
          <ProfileGroup
            profiles={[
              overview.user,
              overview.user?.reportingTo
            ]}
          />
          <div className="stats__header-title">
            <span>{getFullName(overview.user)}</span>
            <span>{overview?.user?.role?.name}</span>
          </div>
        </div>
        {overview.loading ? <Loader />
          : (
            <VerticalTabs
              tabs={[...Object.keys(overview?.counts)?.filter((key) => (key !== 'deal_mode' && key !== 'tag_products'))?.map((key) => ({
                label: key,
                value: key,
                subtitle: overview?.counts[key]?.total
              }))]}
              value={status}
              onChange={onTabChange}
            />
          ) }
      </LeftSideWrapper>
      <div className="stats-container center-box">
        <div className="stats__filters">
          <div className="stats__filters__left">
            <h4 className="team-title">{status}</h4>
          </div>
          <div className="stats__filters__right">
            {status === 'team' && canCreateTeams()
            && <Button onClick={toggleAddTeamModal}>Add</Button> }
            {(status === 'shared' || status === 'closed' || status === 'quoted' || status === 'sold') && (
              <>
                <CustomDropdown
                  data={[{
                    label: 'All Members',
                    value: ''
                  }, ...members?.data.map((user) => ({
                    label: getFullName(user),
                    value: user.id
                  }))]}
                  value={filters.user}
                  placeholder="-Member-"
                  onChange={(value) => onFilterChange('user', value)}
                />
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
                  onChange={(value) => setFilters({
                    ...filters,
                    durationType: value
                  })}
                />
              </>
            )}
          </div>
        </div>
        {(status === 'shared' || status === 'closed' || status === 'quoted' || status === 'sold') && (
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
        )}
        <div className="stats_table tableContent">
          {(status === 'shared'
        || status === 'closed'
        || status === 'quoted'
        || status === 'sold')
        && (
          <SaleDataTable
            salesData={salesData}
            status={status}
          />
        )}
          {status === 'team' && (
            <MemberTable users={members} />
          ) }
          {status === 'customers' && <CustomersTable customers={myCustomers} /> }
        </div>
      </div>
      <RightSideWrapper>
        <TeamChat />
      </RightSideWrapper>
      <AddTeamModal
        isOpen={isAddTeamModal}
        toggle={toggleAddTeamModal}
      />
    </div>
  );
};

export default Team;
