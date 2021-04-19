import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import { useHistory } from 'react-router-dom';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import SearchInput from '../common/SearchInput';
import { getAllCustomers, getAllUsers } from '../../api';
import SearchItem from './SearchItem';
import Loader from '../common/Loader';
import {
  clearAllCustomers,
  clearAllUsers
} from '../../redux/actions';
import TabPanel from '../common/TabPanel';

const CreateChatModal = ({
  isOpen,
  toggle,
  activeTab,
  admin
}) => {
  const { allCustomers } = useSelector((state) => state.customers);
  const { users } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [customerFilters, setCustomerFilters] = useState({
    search: '',
    page: 1
  });
  const [userFilters, setUserFilters] = useState({
    search: '',
    page: 1,
    from: 'chat'
  });
  const history = useHistory();

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 0) {
        dispatch(getAllCustomers(customerFilters));
      } else {
        dispatch(getAllUsers(userFilters));
      }
    }
  }, [customerFilters, userFilters]);

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 0 && !allCustomers.data.length) {
        dispatch(getAllCustomers({ ...customerFilters, page: 1 }));
      } else if (!users.data.length) {
        dispatch(getAllUsers({ ...userFilters, page: 1 }));
      }
    }
  }, [isOpen]);

  const loadMoreCustomers = () => {
    setCustomerFilters({
      ...customerFilters,
      page: customerFilters.page + 1,
    });
  };

  const loadMoreUsers = () => {
    setUserFilters({
      ...userFilters,
      page: userFilters.page + 1
    });
  };

  const handleCustomerSearch = debounce((text) => {
    dispatch(clearAllCustomers());
    return setCustomerFilters({
      ...customerFilters,
      search: text,
      page: 1,
    });
  }, 500);

  const handleUserSearch = debounce((text) => {
    dispatch(clearAllUsers());
    return setUserFilters({
      ...userFilters,
      search: text,
      page: 1,
    });
  }, 500);

  const onCustomerClick = (customer) => {
    history.push(`${admin ? '/admin' : ''}/chats/customers/${customer.id}`);
    toggle();
  };

  const onUserClick = (user) => {
    history.push(`${admin ? '/admin' : ''}/chats/users/${user.id}`);
    toggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
    >
      <ModalBody>
        <div className="modalContent">
          <div className="custom-header modalHeader">
            <h3 className="heading">
              {activeTab === 0 ? 'Select customer' : 'Select Employee'}
            </h3>
            <IconButton
              className="cancel modal-close"
              onClick={toggle}
              size="small"
            >
              <CustomIcon icon="Close" />
            </IconButton>
          </div>
          <TabPanel
            value={activeTab}
            index={0}
          >
            <SearchInput
              onChange={(e) => handleCustomerSearch(e.target.value)}
              onClear={() => handleCustomerSearch('')}
            />
            <InfiniteScroll
              next={loadMoreCustomers}
              hasMore={allCustomers.hasMore || allCustomers.loading}
              loader={<Loader secondary />}
              dataLength={allCustomers.data.length}
              height="400px"
            >
              {allCustomers.data.map((customer) => (
                <SearchItem
                  item={customer}
                  onClick={() => onCustomerClick(customer)}
                />
              ))}
              { !allCustomers.data.length && !allCustomers.loading && (
                <center>
                  No customers found!
                </center>
              ) }
            </InfiniteScroll>
          </TabPanel>
          <TabPanel
            value={activeTab}
            index={1}
          >
            <SearchInput
              onChange={(e) => handleUserSearch(e.target.value)}
              onClear={() => handleUserSearch('')}
            />
            <InfiniteScroll
              next={loadMoreUsers}
              hasMore={users.hasMore || users.loading}
              loader={<Loader secondary />}
              dataLength={users.data.length}
              height="400px"
            >
              {users.data.map((user) => (
                <SearchItem
                  item={user}
                  onClick={() => onUserClick(user)}
                />
              ))}
              { !users.data.length && !users.loading && (
                <center>
                  No users found!
                </center>
              ) }
            </InfiniteScroll>
          </TabPanel>
        </div>
      </ModalBody>
    </Modal>
  );
};

CreateChatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  admin: PropTypes.bool
};

CreateChatModal.defaultProps = {
  activeTab: 0,
  admin: false
};

export default CreateChatModal;
