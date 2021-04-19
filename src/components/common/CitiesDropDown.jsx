/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { connect } from 'react-redux';
import { debounce, get } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';

import { getCities } from '../../api/common';
import SearchInput from './SearchInput';

function CitiesDropDown(props) {
  const {
    isFilter = false,
    id = '',
    onSelect,
    cities,
    dispatch,
    stateId,
    item,
    readOnly,
    fetchInitialCites,
    placeholder = 'Select',
    selectedValue,
    customer
  } = props;

  const [selected, setSelected] = useState();
  const [loading, setloading] = useState(false);
  const [_stateId, setStateId] = useState(item.isNewItem
    ? stateId
    : item.stateId
      ? item.stateId
      : get(item, 'city.state.id', 0));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const itemId = item.isNewItem
      ? item.stateId || null
      : item.stateId
        ? item.stateId
        : get(item, 'city.state.id', 0);
    if (itemId) {
      setStateId(itemId);
      setSelected('');
      fetchInitialCites(itemId);
    }
  }, [item.stateId, stateId]);

  const fetchCities = (cityId) => {
    setloading(true);
    dispatch(getCities(cityId, page)).then((resp) => {
      if (resp.length < 30) {
        setHasMore(false);
      }
      setloading(false);
    });
  };

  const debouncedSave = useCallback(
    debounce((selectedStateId, nextValue) => {
      dispatch(getCities(selectedStateId, 1, nextValue));
    }, 500),
    [] // will be created only once initially
  );

  const handleSearch = (event) => {
    const { value: nextValue } = event.target;
    debouncedSave(_stateId, nextValue);
  };

  const renderLabel = () => {
    if (selected) {
      return selected;
    } if (props.selectedValue) {
      return props.selectedValue;
    }
    return <span style={{ color: 'rgb(112, 117, 128)' }}>{!readOnly ? placeholder : '-'}</span>;
  };

  const loadFunc = () => {
    const itemId = item.isNewItem
      ? stateId
      : item.stateId
        ? item.stateId
        : item.city.state.id;
    if (!loading) {
      setPage(page + 1);
      fetchCities(itemId);
    }
  };

  return (
    <div>
      {readOnly ? (
        renderLabel()
      ) : (
        <UncontrolledDropdown
          id={id}
          disabled={!!(item.isNewItem && !item.stateId)}
          className={
            !selected && !selectedValue
              ? 'tableOptions dropdown_wrapper selectbox'
              : 'tableOptions dropdown_wrapper'
          }
        >
          <DropdownToggle  style={{width: '100%', textAlign: 'left'}} >
            {renderLabel()}
          </DropdownToggle>
          <DropdownMenu className="searchInputBar">
            {isFilter && (
              <SearchInput
                style={customer ? { backgroundColor: '#E4E6EB', padding: '7px 10px' } : null}
                onChange={(event) => handleSearch(event)}
                onClear={() => handleSearch({
                  target: {
                    value: ''
                  }
                })}
              />
            )}
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              {!loading
                && cities[_stateId]
                && cities[_stateId].length > 0
                && cities[_stateId].map((data) => (
                  <DropdownItem
                    key={data.id}
                    onClick={() => {
                      setSelected(data.name);
                      onSelect({ target: { value: data.id } });
                    }}
                  >
                    {data.name}
                  </DropdownItem>
                ))}
            </InfiniteScroll>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  cities: state.common.cities,
  loader: state.common.loader,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

CitiesDropDown.propTypes = {
  isFilter: PropTypes.bool,
  id: PropTypes.string,
  onSelect: PropTypes.func,
  dispatch: PropTypes.func,
  readOnly: PropTypes.bool,
  selectedValue: PropTypes.string,
  placeholder: PropTypes.string,
  cities: PropTypes.arrayOf(PropTypes.any),
  fetchInitialCites: PropTypes.func,
  stateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  item: PropTypes.objectOf(PropTypes.any),
  customer: PropTypes.bool
};

CitiesDropDown.defaultProps = {
  isFilter: false,
  id: '',
  onSelect: () => {},
  dispatch: () => {},
  readOnly: false,
  selectedValue: '',
  placeholder: 'Select',
  cities: [],
  fetchInitialCites: () => {},
  stateId: 1,
  item: {},
  customer: false
};

export default connect(mapStateToProps, mapDispatchToProps)(CitiesDropDown);
