import React, { useState, useRef } from 'react';
import { Divider, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import './index.scss';
import CustomIcon from '../common/CustomIcon';
import Shape from '../../assets/Icons/Header/Icon/Shape.svg';
import Assignto from '../../assets/Icons/Header/Icon/Assignto.svg';
import { postMessage } from '../../api';
import MessageList from '../MessageList';
import {
  initialChatWithCustomerAssigned,
  initialChatWithCustomerUnassigned,
  initialChatWithUser,
  initialChatWithGroup
} from '../../redux/actions';
import ShareProductChatModal from '../ShareProductChatModal';
import { canShareProducts } from '../../utils/checkPermission';

const AnalyticsChatBody = ({
  toggleChat,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { customerId, userId, groupId } = useParams();
  const [message, setMessage] = useState('');
  const { customerDetails } = useSelector((state) => state.customers);
  const { memberDetails } = useSelector((state) => state.team);
  const { groupDetails } = useSelector((state) => state.chat);
  const [isShareModal, setIsShareModal] = useState(false);
  const setImage = useState('');
  let fileType = useState();
  const inputFile = useRef(null);

  const updateChatList = (msg) => {
    if (customerId) {
      if (customerDetails.data.salesRepId) {
        dispatch(initialChatWithCustomerAssigned({
          id: customerId,
          firstName: customerDetails.data.firstName,
          lastName: customerDetails.data.lastName,
          email: customerDetails.data.email,
          message: msg,
          isRead: false,
          updatedAt: new Date(),
        }));
      } else {
        dispatch(initialChatWithCustomerUnassigned({
          id: customerId,
          firstName: customerDetails.data.firstName,
          lastName: customerDetails.data.lastName,
          email: customerDetails.data.email,
          message: msg,
          isRead: false,
          updatedAt: new Date(),
        }));
      }
    }
    if (userId) {
      dispatch(initialChatWithUser({
        id: userId,
        message: msg,
        firstName: memberDetails.data.firstName,
        lastName: memberDetails.data.lastName,
        updatedAt: new Date(),
      }));
    }
    if (groupId) {
      dispatch(initialChatWithGroup({
        groupId,
        message: msg,
        groupName: groupDetails.group.groupName,
        updatedAt: new Date()
      }));
    }
  };

  const postMessageHandler = (e) => {
    e.preventDefault();
    const preMessage = {
      fromUserId: currentUser.id,
      fromUser: currentUser,
      message,
      toCustomerId: customerId,
      toUserId: userId,
      toGroupId: groupId,
      created_at: new Date()
    };
    updateChatList(message);
    dispatch(postMessage({
      toCustomer: customerId,
      toUser: userId,
      toGroup: groupId,
      message,
    }, preMessage));
    setMessage('');
  };

  const toggleIsShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      const parts = filename.split('.');
      fileType = parts[parts.length - 1];

      setImage(files[0]);
    }
    return fileType;
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div className="chat-body-analytics">
      <div className="chat-body__header-analytics">
        <div className="chat-body__header-title-analytics">
          <span className="title_text">Chat</span>
        </div>
        <img src={Assignto} alt="" style={{ marginRight: '-79%' }} />
        <div className="flex">
          <IconButton
            size="medium"
            onClick={() => toggleChat(false)}
          >
            <CustomIcon icon="Close" />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div style={{ height: '660px' }}>
        <MessageList />
      </div>
      <form className="chat-message__footer-analytics">
        <input
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton
          type="submit"
          size="medium"
          onClick={postMessageHandler}
          disabled={!message}
        >
          <CustomIcon icon="Send-Enabled" />
        </IconButton>
        <IconButton
          type="button"
          size="medium"
        >
          <input
            style={{ display: 'none' }}
            ref={inputFile}
            onChange={handleFileUpload}
            type="file"
          />
          <img src={Shape} alt="" onClick={() => { onButtonClick(); }} />
        </IconButton>

      </form>
      {canShareProducts()
        && (
          <ShareProductChatModal
            isOpen={isShareModal}
            toggle={toggleIsShareModal}
            chat
            updateChatList={updateChatList}
          />
        )}
    </div>
  );
};

AnalyticsChatBody.propTypes = {
  toggleChat: PropTypes.func
};

AnalyticsChatBody.defaultProps = {
  toggleChat: () => { }
};

export default AnalyticsChatBody;
