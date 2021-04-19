import React, { useState, useEffect } from 'react';
import { Divider, IconButton } from '@material-ui/core';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { debounce } from 'lodash';

import './index.scss';
import Tabs from '../../../components/common/Tab';
import CustomIcon from '../../../components/common/CustomIcon';
import SearchInput from '../../../components/common/SearchInput';
import ContactListItem from '../../../components/common/ContactListItem';
import Loader from '../../../components/common/Loader';
import Collapsable from '../../../components/common/Collapsable';
import getFullName from '../../../utils/getFullName';
import {
  getCustomerChatContacts,
  getCustomerChatMessages,
  getCustomerDetails,
  getCustomerPurchaseHistory,
  getTeamChatContacts,
  getUserChatMessages,
  getTeamMemberDetails,
  getGroupChatMessages,
  getGroupChatDetails,
  getTotalUnreadCounts,
  reloadCustomerChatContacts,
  reloadTeamChatContacts
} from '../../../api';
import TabPanel from '../../../components/common/TabPanel';
import ChatBody from '../../../components/ChatBody';
import CreateChatModal from '../../../components/CreateChatModal';
import CustomerDetails from '../../../components/CustomerDetails';
import GroupDetails from '../../../components/GroupDetails';
import UserDetails from '../../../components/UserDetails';
import CreateGroupModal from '../../../components/CreateGroupModal';
import {
  markAsReadTeamSuccess,
  markAsReadCustomerAssignedSuccess,
  markAsReadCustomerUnassignedSuccess
} from '../../../redux/actions';

const AdminChat = () => {
  const { customerId, userId, groupId } = useParams();
  const setDefaultActiveTab = () => {
    if (userId || groupId) {
      return 1;
    }
    return 0;
  };
  const [activeTab, setActiveTab] = useState(setDefaultActiveTab());
  const {
    assigned,
    loading,
    unassigned
  } = useSelector((state) => state.chat.customers);
  const dispatch = useDispatch();
  const {
    team
  } = useSelector((state) => state.chat);
  const { customerDetails } = useSelector((state) => state.customers);
  const [isCreateChatModal, setIsCreateChatModal] = useState(false);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const history = useHistory();
  const { memberDetails } = useSelector((state) => state.team);
  const { groupDetails } = useSelector((state) => state.chat);
  const [page, setPage] = useState(1);

  const toggleIsCreateChatModal = () => {
    setIsCreateChatModal(!isCreateChatModal);
  };

  const toggleIsCreateGroupModal = () => {
    setIsCreateGroupModal(!isCreateGroupModal);
  };

  useEffect(() => {
    if (activeTab === 1 && !team.data.length) {
      dispatch(getTeamChatContacts());
    } else if (activeTab === 0 && !assigned.length && !unassigned.length) {
      dispatch(getCustomerChatContacts());
    }
  }, [activeTab]);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerDetails(customerId));
      dispatch(getCustomerPurchaseHistory(customerId));
    }
    if (userId) {
      dispatch(getTeamMemberDetails(userId));
    }
    if (groupId) {
      dispatch(getGroupChatDetails(groupId));
    }
    setPage(1);
  }, [customerId, userId, groupId]);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerChatMessages(customerId, {
        page
      })).then(() => {
        dispatch(getTotalUnreadCounts());
        dispatch(reloadCustomerChatContacts());
      });
    }
    if (userId) {
      dispatch(getUserChatMessages(userId, {
        page
      })).then(() => {
        dispatch(getTotalUnreadCounts());
        dispatch(reloadTeamChatContacts());
      });
    }
    if (groupId) {
      dispatch(getGroupChatMessages(groupId, {
        page
      })).then(() => {
        dispatch(getTotalUnreadCounts());
        dispatch(reloadTeamChatContacts());
      });
    }
  }, [page, customerId, userId, groupId]);

  useEffect(() => {
    if (!userId && !groupId) {
      if (!Object.keys(memberDetails.data).length
    && !Object.keys(groupDetails.group).length) {
        if (team.data.length) {
          if (team.data[0].id) {
            history.push(`/admin/chats/users/${team.data[0].id}`);
          } else {
            history.push(`/admin/chats/groups/${team.data[0].groupId}`);
          }
        }
      }
    }
  }, [team]);

  useEffect(() => {
    if (activeTab === 0) {
      if (assigned.length && !customerId && activeTab === 0) {
        history.push(`/admin/chats/customers/${assigned[0].id}`);
      } else if (unassigned.length && !customerId && activeTab === 0) {
        history.push(`/admin/chats/customers/${unassigned[0].id}`);
      }
    }
  }, [loading]);

  const onCustomerClick = (customer, isAssigned) => {
    history.push(`/admin/chats/customers/${customer.id}`);
    if (Number(customer.unreadCount) > 0) {
      if (isAssigned) {
        dispatch(markAsReadCustomerAssignedSuccess(customer.chatId));
      } else {
        dispatch(markAsReadCustomerUnassignedSuccess(customer.chatId));
      }
    }
  };

  const onUserClick = (user) => {
    history.push(`/admin/chats/users/${user.id}`);
  };

  const onGroupClick = (group) => {
    history.push(`/admin/chats/groups/${group.groupId}`);
  };

  const onTeamClick = (chat) => {
    if (chat.groupId) {
      onGroupClick(chat);
    } else {
      onUserClick(chat);
    }
    if (Number(chat.unreadCount) > 0) {
      dispatch(markAsReadTeamSuccess(chat.chatId));
    }
  };

  const onChangeTab = (tab) => {
    setActiveTab(tab);
    if (tab === 1 && memberDetails?.data?.id) {
      history.push(`/admin/chats/users/${memberDetails.data.id}`);
    } else if (tab === 1 && groupDetails.group.groupId) {
      history.push(`/admin/chats/groups/${groupDetails.group.groupId}`);
    } else if (tab === 0 && customerDetails.data.id) {
      history.push(`/admin/chats/customers/${customerDetails.data.id}`);
    }
  };

  const searchHandler = debounce((text) => {
    if (activeTab === 1) {
      dispatch(getTeamChatContacts({
        search: text
      }));
    } else {
      dispatch(getCustomerChatContacts({
        search: text
      }));
    }
  }, 500);

  const loadMoreMessages = () => {
    setPage(page + 1);
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat__contact-list">
        <div className="sticky-top">
          <div className="chat-list__header">
            <Tabs
              tabs={['Customer', 'Team']}
              className="chat-list__tabs"
              activeTab={activeTab}
              onChange={onChangeTab}
            />
            <div className="chat-list_actions">
              <IconButton
                size="small"
                onClick={toggleIsCreateChatModal}
              >
                <CustomIcon icon="Pen" />
              </IconButton>
              <UncontrolledDropdown className="moreOptionsCon">
                <DropdownToggle>
                  <IconButton
                    size="small"
                  >
                    <CustomIcon icon="more-vertical" />
                  </IconButton>
                </DropdownToggle>
                <DropdownMenu>
                  <div>
                    <DropdownItem onClick={toggleIsCreateGroupModal}>
                      Create Group
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
          <div className="chat-contact-search">
            <SearchInput
              onChange={(e) => searchHandler(e.target.value)}
              onClear={() => searchHandler('')}
            />
          </div>
        </div>
        <div className="contact-list">
          <TabPanel
            index={0}
            value={activeTab}
          >
            <Collapsable
              title="Assigned"
            >
              {loading ? <Loader secondary />
                : assigned.map((chat) => (
                  <ContactListItem
                    unreadCount={chat.unreadCount}
                    profile={{
                      firstName: chat.firstName,
                      lastName: chat.lastName,
                      id: chat.id
                    }}
                    userName={getFullName(chat)}
                    time={chat.updatedAt}
                    message={chat.message}
                    key={chat.chatId}
                    onClick={() => onCustomerClick(chat, 'customer-assigned')}
                    active={Number(customerId) === Number(chat.id)}
                  />
                ))}
            </Collapsable>
            <Collapsable
              title="Unassigned"
            >
              {loading ? <Loader secondary />
                : unassigned.map((chat) => (
                  <ContactListItem
                    unreadCount={chat.unreadCount}
                    profile={chat}
                    userName={getFullName(chat)}
                    time={chat.updatedAt}
                    message={chat.message}
                    key={chat.chatId}
                    onClick={() => onCustomerClick(chat, 'customer-unassigned')}
                    active={Number(customerId) === Number(chat.id)}
                  />
                ))}
            </Collapsable>
          </TabPanel>
          <TabPanel
            index={1}
            value={activeTab}
          >
            {team.loading ? <Loader secondary />
              : (
                <>
                  { team.data.map((chat) => (
                    <ContactListItem
                      unreadCount={chat.unreadCount}
                      profile={chat}
                      userName={chat.groupName || getFullName(chat)}
                      time={chat.updatedAt}
                      message={chat.message}
                      key={chat.chatId}
                      group={chat.groupId}
                      onClick={() => onTeamClick(chat)}
                      active={Number(userId) === Number(chat.id)
                        || Number(groupId) === Number(chat.groupId)}
                    />
                  ))}
                </>
              ) }
            {!team.data.length
              && !team.loading && <center>No contacts!</center>}
          </TabPanel>
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className="admin-chat__body">
        <TabPanel
          index={0}
          value={activeTab}
          className="h-full"
        >
          <ChatBody
            profile={{
              firstName: customerDetails.data.firstName,
              lastName: customerDetails.data.lastName,
              id: customerDetails.data.id
            }}
            chatTitle={getFullName(customerDetails.data)}
            isLoading={customerDetails.loading}
            tab="customer"
            loadMoreMessages={loadMoreMessages}
          />
        </TabPanel>
        <TabPanel
          index={1}
          value={activeTab}
          className="h-full"
        >
          <ChatBody
            profile={{
              firstName: memberDetails.data.firstName,
              lastName: memberDetails.data.lastName,
              id: memberDetails.data.id
            }}
            chatTitle={groupId
              ? groupDetails.group?.groupName
              : getFullName(memberDetails.data)}
            group={groupId}
            isLoading={memberDetails.loading || groupDetails.loading}
            tab="team"
            loadMoreMessages={loadMoreMessages}
          />
        </TabPanel>
      </div>
      <Divider orientation="vertical" />
      <div className="admin-chat_details">
        <TabPanel
          value={activeTab}
          index={0}
          className="w-100"
        >
          <CustomerDetails admin />
        </TabPanel>
        <TabPanel
          value={activeTab}
          index={1}
          className="w-100"
        >
          {groupId && <GroupDetails admin />}
          {userId && <UserDetails admin />}
        </TabPanel>
      </div>
      <CreateChatModal
        toggle={toggleIsCreateChatModal}
        isOpen={isCreateChatModal}
        activeTab={activeTab}
        admin
      />
      <CreateGroupModal
        isOpen={isCreateGroupModal}
        toggle={toggleIsCreateGroupModal}
        admin
      />
    </div>
  );
};

export default AdminChat;
