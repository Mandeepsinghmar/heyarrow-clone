import React, { useCallback, useState,useEffect } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';
import SearchInput from './SearchInput';
import { getStates } from '../../api/common';

function StateDropDown(props) {
  const {
    isFilter = false,
    id = '',
    onSelect,
    onClick,
    states,
    dispatch,
    countryId = 1,
    loader,
    readOnly,
    selectedValue,
    placeholder = 'Select',
    customer
  } = props;
  const [selected, setSelected] = useState(selectedValue);
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('');
  const debouncedSave = useCallback(
    debounce((nextValue) => {
      dispatch(getStates(countryId, 1, nextValue));
    }, 100),
    [], // will be created only once initially
  );

  const handleSearch = (event) => {
    setSearch(event);
    debouncedSave(event);
  };
  useEffect(() => {
    setSelected(props.selectedValue)
  },[props.selectedValue])
  const renderLabel = () => {
    if (selected) {
      return selected;
    }
    if (props.selectedValue) {
      return props.selectedValue;
    }
    return (
      <span style={{ color: 'rgb(112, 117, 128)' }}>
        {!readOnly ? placeholder : '-'}
      </span>
    );
  };

  return (
    <div>
      {readOnly ? (
        renderLabel()
      ) : (
        <UncontrolledDropdown
          id={id}
          className={
            !selected && !selectedValue
              ? 'tableOptions dropdown_wrapper selectbox'
              : 'tableOptions dropdown_wrapper'
          }
        >
          <DropdownToggle style={{width: '100%', textAlign: 'left'}} onClick={onClick}>{renderLabel()}</DropdownToggle>
          <DropdownMenu>
            {isFilter && (
              <div className="searchInputBar">
                <SearchInput
                  style={customer ? { backgroundColor: '#E4E6EB', padding: '7px 10px' } : null}
                  onChange={(event) => handleSearch(event.target.value)}
                  onClear={() => handleSearch('')}
                />
              </div>
            )}
            {!loader
              && !!states.length
              && states.map((data) => (
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
            {loader && 'Fetching...'}
            {!states.length && !loader && <center>No states found!</center>}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  states: state.common.states,
  loader: state.common.loader,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

StateDropDown.propTypes = {
  isFilter: PropTypes.bool,
  id: PropTypes.string,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  states: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.func,
  countryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loader: PropTypes.bool,
  readOnly: PropTypes.bool,
  selectedValue: PropTypes.string,
  placeholder: PropTypes.string,
  customer: PropTypes.bool
};

StateDropDown.defaultProps = {
  isFilter: false,
  id: '',
  onSelect: () => {},
  onClick: () => {},
  states: [],
  dispatch: () => {},
  countryId: 1,
  loader: false,
  readOnly: false,
  selectedValue: '',
  placeholder: 'Select',
  customer: false
};

export default connect(mapStateToProps, mapDispatchToProps)(StateDropDown);
