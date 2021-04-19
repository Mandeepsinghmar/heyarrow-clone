/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import './index.scss';
import Card from '@material-ui/core/Card';
import AnalyticsChatBody from '../../../../components/AnalyticsChatBody';
import TabPanel from '../../../../components/common/TabPanel';
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
} from '../../../../api';
import getFullName from '../../../../utils/getFullName';

const AnalyticsChatCampaign = ({ isOpen, toggleChat }) => {
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

  useEffect(() => {
    if (activeTab === 1 && !team.data.length) {
      dispatch(getTeamChatContacts());
    } else if (activeTab === 0 && !assigned.length && !unassigned.length) {
      dispatch(getCustomerChatContacts());
    }
  }, [activeTab]);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerChatMessages(customerId));
      dispatch(getCustomerDetails(customerId));
      dispatch(getCustomerPurchaseHistory(customerId));
    }
    if (userId) {
      dispatch(getUserChatMessages(userId));
      dispatch(getTeamMemberDetails(userId));
    }
    if (groupId) {
      dispatch(getGroupChatMessages(groupId));
      dispatch(getGroupChatDetails(groupId));
    }
  }, [customerId, userId, groupId]);

  const toggleIsCreateChatModal = () => {
    setIsCreateChatModal(!isCreateChatModal);
  };

  const toggleIsCreateGroupModal = () => {
    setIsCreateGroupModal(!isCreateGroupModal);
  };

  return (
    isOpen ?
      <Card>
        <AnalyticsChatBody
          profile={{
            firstName: customerDetails.data.firstName,
            lastName: customerDetails.data.lastName,
            id: customerDetails.data.id
          }}
          chatTitle={getFullName(customerDetails.data)}
          isLoading={customerDetails.loading}
          toggleChat={toggleChat}
        />
      </Card>
      : null
  );
};

export default AnalyticsChatCampaign;
