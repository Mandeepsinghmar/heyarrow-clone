import React, { useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { debounce, orderBy } from 'lodash';

import './index.scss';
import LeftSideWrapper from '../../components/common/LeftSideWrapper';
import RightSideWrapper from '../../components/common/RightSideWrapper';
import Tabs from '../../components/common/Tab';
import CustomIcon from '../../components/common/CustomIcon';
import SearchInput from '../../components/common/SearchInput';
import ContactListItem from '../../components/common/ContactListItem';
import ChatBody from '../../components/ChatBody';
import Collapsable from '../../components/common/Collapsable';
import CustomerDetails from '../../components/CustomerDetails';
import UserDetails from '../../components/UserDetails';
import TabPanel from '../../components/common/TabPanel';
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
} from '../../api';
import Loader from '../../components/common/Loader';
import getFullName from '../../utils/getFullName';
import GroupDetails from '../../components/GroupDetails';
import CreateChatModal from '../../components/CreateChatModal';
import CreateGroupModal from '../../components/CreateGroupModal';
import {
  markAsReadTeamSuccess,
  markAsReadCustomerAssignedSuccess,
  markAsReadCustomerUnassignedSuccess
} from '../../redux/actions';
import { canCreateChatGroups, canChatUnassignedCustomers } from '../../utils/checkPermission';

const Chats = () => {
  const { customerId, userId, groupId } = useParams();
  const setDefaultActiveTab = () => {
    if (userId || groupId) {
      return 1;
    }
    return 0;
  };
  const [activeTab, setActiveTab] = useState(setDefaultActiveTab());
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    assigned,
    loading,
    unassigned
  } = useSelector((state) => state.chat.customers);
  const {
    team
  } = useSelector((state) => state.chat);
  const { customerDetails } = useSelector((state) => state.customers);
  const { memberDetails } = useSelector((state) => state.team);
  const { groupDetails } = useSelector((state) => state.chat);
  const [isCreateChatModal, setIsCreateChatModal] = useState(false);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isChatBodySubmitted, setIsChatBodySubmitted] = useState(false);

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
  }, [page, customerId, userId,isChatBodySubmitted, groupId]);

  useEffect(() => {
    if (!userId && !groupId) {
      if (!Object.keys(memberDetails.data).length
    && !Object.keys(groupDetails.group).length) {
        if (team.data.length) {
          if (team.data[0].id) {
            history.push(`/chats/users/${team.data[0].id}`);
          } else {
            history.push(`/chats/groups/${team.data[0].groupId}`);
          }
        }
      }
    }
  }, [team]);

  useEffect(() => {
    if (activeTab === 0) {
      if (assigned.length && !customerId && activeTab === 0) {
        history.push(`/chats/customers/${assigned[0].id}`);
      } else if (unassigned.length && !customerId && activeTab === 0) {
        history.push(`/chats/customers/${unassigned[0].id}`);
      }
    }
  }, [loading]);

  const onCustomerClick = (customer, isAssigned) => {
    history.push(`/chats/customers/${customer.id}`);
    if (Number(customer.unreadCount) > 0) {
      if (isAssigned) {
        dispatch(markAsReadCustomerAssignedSuccess(customer.chatId));
      } else {
        dispatch(markAsReadCustomerUnassignedSuccess(customer.chatId));
      }
    }
  };

  const onUserClick = (user) => {
    history.push(`/chats/users/${user.id}`);
  };

  const onGroupClick = (group) => {
    history.push(`/chats/groups/${group.groupId}`);
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
      history.push(`/chats/users/${memberDetails.data.id}`);
    } else if (tab === 1 && groupDetails.group.groupId) {
      history.push(`/chats/groups/${groupDetails.group.groupId}`);
    } else if (tab === 1 && !groupDetails.group) {
      history.push(`/chats/groups/${team.data[0].groupId}`);
    } else if (tab === 0 && customerDetails.data.id) {
      history.push(`/chats/customers/${customerDetails.data.id}`);
    }
  };

  const toggleIsCreateChatModal = () => {
    setIsCreateChatModal(!isCreateChatModal);
  };

  const toggleIsCreateGroupModal = () => {
    setIsCreateGroupModal(!isCreateGroupModal);
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

  const handleReorderArray = () => {
    setIsChatBodySubmitted(!isChatBodySubmitted);
  };

  const loadMoreMessages = () => {
    setPage(page + 1);
  };

  return (
    <div className="chat-container">
      <LeftSideWrapper>
        <div className="w-100 sticky-top">
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
                <CustomIcon icon="Pen" className="pen-icon" />
              </IconButton>
              {canCreateChatGroups()
              && (
                <UncontrolledDropdown className="moreOptionsCon">
                  <DropdownToggle>
                    <IconButton
                      size="small"
                    >
                      <CustomIcon icon="more-vertical" className="vertical-icon" />
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
              ) }
            </div>
          </div>
          <SearchInput
            onChange={(e) => searchHandler(e.target.value)}
            onClear={() => searchHandler('')}
          />
        </div>
        <div className="w-100">
          <TabPanel
            index={0}
            value={activeTab}
            className="w-100"
          >
            <div className="contact-list">
              <Collapsable
                title="Assigned"
              >
                {loading ? <Loader />
                /* eslint-disable indent */
                  : orderBy(assigned,
                  ['updatedAt'], 'desc').map((chat) => (
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
                      onClick={() => onCustomerClick(chat, true)}
                      key={chat.chatId}
                      active={Number(customerId) === Number(chat.id)}
                    />
                  ))}
              </Collapsable>
              {canChatUnassignedCustomers()
              && (
                <Collapsable
                  title="Unassigned"
                >
                  {loading ? <Loader />
                  /* eslint-disable indent */
                   : orderBy(unassigned,
                    ['updatedAt'], 'desc').map((chat) => (
                      <ContactListItem
                        unreadCount={chat.unreadCount}
                        profile={chat}
                        userName={getFullName(chat)}
                        time={chat.updatedAt}
                        message={chat.message}
                        onClick={() => onCustomerClick(chat)}
                        key={chat.chatId}
                        active={Number(customerId) === Number(chat.id)}
                      />
                    ))}
                </Collapsable>
              )}
            </div>
          </TabPanel>
          <TabPanel
            index={1}
            value={activeTab}
            className="w-100"
          >
            <div className="contact-list">
              {team.loading ? <Loader />
                : (
                  <>
                    { orderBy(team.data,
                      ['updatedAt'], 'desc').map((chat) => (
                        <ContactListItem
                          unreadCount={chat.unreadCount}
                          profile={chat}
                          userName={chat.groupName || getFullName(chat)}
                          time={chat.updatedAt}
                          message={chat.message}
                          key={chat.chatId}
                          onClick={() => onTeamClick(chat)}
                          group={chat.groupId}
                          active={Number(userId) === Number(chat.id)
                          || Number(groupId) === Number(chat.groupId)}
                        />
                    ))}
                  </>
                ) }
              {!team.data.length
              && !team.loading && <center>No contacts!</center>}
            </div>
          </TabPanel>
        </div>
      </LeftSideWrapper>
      <div className="centerContent scroll-vertical">
        <div className="center-box chat-body-container">
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
              handleSubmit={() => {
                handleReorderArray();
              }}

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
              handleSubmit={() => {
                handleReorderArray();
              }}
            />
          </TabPanel>
        </div>
      </div>
      <RightSideWrapper>
        <TabPanel
          value={activeTab}
          index={0}
          className="w-100"
        >
          <CustomerDetails />
        </TabPanel>
        <TabPanel
          value={activeTab}
          index={1}
          className="w-100 overflow-auto details-section"
        >
          {groupId && <GroupDetails />}
          {userId && <UserDetails />}
        </TabPanel>
      </RightSideWrapper>
      <CreateChatModal
        toggle={toggleIsCreateChatModal}
        isOpen={isCreateChatModal}
        activeTab={activeTab}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModal}
        toggle={toggleIsCreateGroupModal}
      />
    </div>
  );
};

export default Chats;
