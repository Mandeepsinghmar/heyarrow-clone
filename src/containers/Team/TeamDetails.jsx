import React, { useEffect, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import './index.scss';
import ProfileGroup from '../../components/common/ProfileGroup';
import getFullName from '../../utils/getFullName';
import LeftSideWrapper from '../../components/common/LeftSideWrapper';
import VerticalTabs from '../../components/common/VerticalTabs';
import CustomIcon from '../../components/common/CustomIcon';
import {
  getTeamOverview,
  getTeamDetail,
  getSalesData,
  getTeamCustomers,
} from '../../api';
import Loader from '../../components/common/Loader';
import CustomersTable from './CustomersTable';
import CustomDropdown from '../../components/common/CustomDropdown';
import { DURATION_TYPES, DURATION_OPTIONS } from '../../constants';
import StatsCard from '../../components/common/StatsCard';
import SaleDataTable from './SaleDataTable';
import AddTeamModal from '../../components/AddTeamModal';
import MemberTable from './MemberTable';
import RightSideWrapper from '../../components/common/RightSideWrapper';
import TeamChat from './TeamChat';

const defaultTabs = [
];

const TeamDetails = () => {
  const {
    overview,
    members,
    salesData,
    customers
  } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('team');
  const { userId } = useParams();
  const [filters, setFilters] = useState({
    durationType: 'yearly',
    duration: 'all',
    user: userId
  });
  useEffect(() => {
    dispatch(getTeamOverview({
      user: userId
    }));
    dispatch(getTeamDetail({
      user: userId
    }));
  }, [userId]);
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
  }, [filters, status, userId]);

  useEffect(() => {
    if (status === 'customers') {
      dispatch(getTeamCustomers({
        user: userId
      }));
    }
  }, [userId, status]);

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
        {overview.loading ? <Loader /> : (
          <>
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
            <div className="customers__header-icons">
              <IconButton
                size="small"
              >
                <a href={`mailto:${overview.user?.email}`}>
                  <CustomIcon icon="email" />
                </a>
              </IconButton>
              <IconButton
                size="small"
              >
                <Link to={`/chats/users/${overview.user?.id}`}>
                  <CustomIcon icon="chat" />
                </Link>
              </IconButton>
            </div>
            <VerticalTabs
              tabs={[...Object.keys(overview?.counts)?.map((key) => ({
                label: key,
                value: key,
                subtitle: overview?.counts[key]?.total
              })), ...defaultTabs]}
              value={status}
              onChange={onTabChange}
            />
          </>
        ) }
      </LeftSideWrapper>
      <div className="stats-container center-box">
        <div className="stats__filters">
          <div className="stats__filters__left">
            <h4 className="team-title">{status}</h4>
          </div>
          <div className="stats__filters__right">
            {(status === 'shared' || status === 'closed' || status === 'quoted' || status === 'sold') && (
              <>
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
          {status === 'customers' && <CustomersTable customers={customers} /> }
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

export default TeamDetails;
