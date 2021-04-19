/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
import { createRegion, getRegions, deleteRegion } from '../../api/adminLocation';
import CustomIcon from '../../components/common/CustomIcon';
import './index.scss';
import TableContent from '../../components/common/ContentsTable';
import { onChangeLocation, updateExistLocation } from '../../redux/actions';

const columns = [
  { label: 'Group', key: 'name' },
  {
    label: 'State', key: 'stateId', type: 'state', options: 'stateCode'
  },
  {
    label: 'City', key: 'cityId', type: 'city', options: 'cityCode'
  }
];

const Locations = (props) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const fetchRegions = () => {
    setLoading(true);
    dispatch(getRegions())
      .then(() => {
        setLoading(false);
        setHasMore(false);
      });
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const { adminLocationRegion, states, cities } = props;

  const addLocationRegion = () => {
    const data = {
      name: 'Region 2',
      code: 're2'
    };
    dispatch(createRegion(data));
  };

  const loadFunc = () => {
    if (!loading) {
      fetchRegions();
    }
  };

  const onChange = (e, key, item, index) => {
    const { value } = e.target;
    dispatch(onChangeLocation(value, key, item, index));
  };

  const onSave = async (item, index) => {
    if (item.id) {
      dispatch(updateExistLocation(item, index));
    }
  };

  const onRemove = (e, item) => {
    e.stopPropagation();
    dispatch(deleteRegion(item.id));
  };

  const renderTableActions = (item) => (
    <div className="table-actions">
      <button className="sendBtn locationBtn">
        <UncontrolledDropdown className="moreOptionsConnew" direction="left">
          <DropdownToggle className="moreLeads" onClick={(e) => e.stopPropagation()}>
            <button className="sendBtn">
              <CustomIcon icon="Header/Icon/More" />
            </button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={(e) => onRemove(e, item)}>
              <CustomIcon icon="Icon/Archive" />
              Archive
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </button>
    </div>
  );

  return (
    <div className="contentContainerFull location-container">
      <div className="cardHeader">
        <h1 className="location-title">Locations</h1>
        <div className="topActionBar side-right">
          <button type="button" className="addNewItem noborder rolesAddIcon" onClick={() => addLocationRegion()}>
            <CustomIcon icon="Header/Icon/Add" />
          </button>
        </div>
      </div>
      <div className="stats_table tableContent location-content">
        <InfiniteScroll
          pageStart={1}
          loadMore={loadFunc}
          hasMore={hasMore}
          loader={(
            <div className="tableLoading ShowTableLoader" key={0}>
              <Loader
                type="Oval"
                color="#008080"
                height={30}
                width={30}
              />
            </div>
          )}
          threshold={150}
          useWindow={false}
          initialLoad={false}
        >
          <TableContent
            columns={columns}
            options={{
              stateCode: states,
              cityCode: cities
            }}
            data={(adminLocationRegion && adminLocationRegion.regions) || []}
            loading={loading}
            onChange={onChange}
            hasVerticalScroll
            onSave={onSave}
            tableActions={renderTableActions}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

Locations.propTypes = {
  adminLocationRegion: PropTypes.arrayOf(PropTypes.object).isRequired,
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  cities: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = (state) => ({
  adminLocationRegion: state.adminLocation.adminLocationRegion
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Locations);
