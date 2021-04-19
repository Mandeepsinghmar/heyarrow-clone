/* eslint-disable */
import { debounce, get } from 'lodash';
import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import CustomIcon from '../CustomIcon';
import ProfileInitals from '../ProfileInitials';
import { getUsers } from '../../../api/common';

function AssignToDropDown(props) {
  const {
    isFilter = false,
    id = '',
    onSelect,
    readOnly,
    selectedSalesRep,
    placeholder = 'Select',
  } = props;
  const [selected, setSelected] = useState();
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      fetchUsers(nextValue);
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setPage(1);
    // highlight-starts
    debouncedSave(nextValue);
    // highlight-ends
  };

  /*
   * Getting Users list
   */
  const fetchUsers = () => {
    setloading(true);
    dispatch(getUsers(page)).then((resp) => {
      if (resp.length < 9) {
        setHasMore(false);
      }
      setloading(false);
    });
  };

  const renderLabel = () => {
    if (selected) {
      return selected;
    }
    if (props.selectedSalesRep) {
      return `${props.selectedSalesRep.firstName} ${props.selectedSalesRep.lastName}`;
    }
    return <span style={{ color: '#707580' }}>{placeholder}</span>;
  };

  const loadFunc = () => {
    if (!loading) {
      setPage(page + 1);
      fetchUsers();
    }
  };

  return (
    <div>
      {readOnly ? (
        <UncontrolledDropdown
          id={id}
          className="tableOptions dropdown_wrapper dropdown_wrapper_assign"
        >
          <DropdownToggle>
            <div className="userCard d-flex">
              <div className="userCon" style={{ border: 'none' }}>
                {!props.selectedSalesRep ? (
                  <CustomIcon icon="Placeholder/Person/Small" />
                ) : (
                  <ProfileInitals
                    firstName={props.selectedSalesRep.firstName}
                    lastName={props.selectedSalesRep.lastName}
                    size="small"
                    profileId={props.selectedSalesRep.id}
                  />
                )}
              </div>
              <div>{renderLabel()}</div>
            </div>
          </DropdownToggle>
        </UncontrolledDropdown>
      ) : (
        <UncontrolledDropdown
          id={id}
          className="tableOptions dropdown_wrapper dropdown_wrapper_assign"
        >
          <DropdownToggle>
            <div className="userCard d-flex">
              <div className="userCon" style={{ border: 'none' }}>
                {!props.selectedSalesRep ? (
                  <CustomIcon icon="Placeholder/Person/Small" />
                ) : (
                  <ProfileInitals
                    firstName={props.selectedSalesRep.firstName}
                    lastName={props.selectedSalesRep.lastName}
                    size="small"
                    profileId={props.selectedSalesRep.id}
                  />
                )}
              </div>
              <div>{renderLabel()}</div>
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={
                <div className="tableLoading ShowTableLoader" key={0}>
                  <Loader type="Oval" color="#008080" height={30} width={30} />
                </div>
              }
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              {props.users.length > 0 ? (
                props.users.map((data, i) => (
                  <DropdownItem
                    key={i}
                    onClick={() => {
                      onSelect({ target: { value: data.id } });
                      setSelected(`${data.firstName} ${data.lastName}`);
                    }}
                    style={{ padding: 0 }}
                  >
                    <div className="assignWrapper" style={{display:'flex'}}>
                        <div className="userCard" style={{width:'30px'}} >
                          <ProfileInitals
                            firstName={data.firstName}
                            lastName={data.lastName}
                            profileId={data.id}
                          />
                        </div>
                      <div style={{ width: '100%', marginLeft: '5px' }}>
                        <div style={{ textAlign: 'justify' }}>
                          <h6 className="name">{`${data.firstName} ${data.lastName}`}</h6>
                          {/* {selectedSalesRep && (
                            <Checkbox
                              checked={selectedSalesRep.id == data.id}
                              color="primary"
                            />
                          )} */}
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                          <span className="position">
                            {get(data, 'role.name')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem style={{ textAlign: 'center' }}>
                  No record
                </DropdownItem>
              )}
            </InfiniteScroll>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </div>
  );
}

AssignToDropDown.propTypes = {
  selectedSalesRep: PropTypes.object,
  users: PropTypes.object,
  isFilter: PropTypes.bool,
  onSelect: PropTypes.func,
  readOnly: PropTypes.bool,
  id: PropTypes.string,
};

const mapStateToProps = (state) => ({
  users: state.common.users,
});

export default connect(mapStateToProps)(AssignToDropDown);
