/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Divider, IconButton, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import './index.scss';
import ProfileInitials from '../common/ProfileInitials';
import CustomIcon from '../common/CustomIcon';
import {
  postMessage,
  deleteChatGroup,
  sendAttachment
} from '../../api';
import MessageList from '../MessageList';
import {
  initialChatWithCustomerAssigned,
  initialChatWithCustomerUnassigned,
  initialChatWithUser,
  initialChatWithGroup,
  postMessageSuccess
} from '../../redux/actions';
import ShareProductChatModal from '../ShareProductChatModal';
import { canShareProducts } from '../../utils/checkPermission';
import MentionTextBox from '../common/MentionTextBox';
import InputAttachment from '../common/InputAttachment';

const ChatBody = ({
  group,
  profile,
  chatTitle,
  isLoading,
  tab,
  loadMoreMessages,
  handleSubmit
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { customerId, userId, groupId } = useParams();
  const [message, setMessage] = useState('');
  const { customerDetails } = useSelector((state) => state.customers);
  const { memberDetails } = useSelector((state) => state.team);
  const { groupDetails, team } = useSelector((state) => state.chat);
  const [isShareModal, setIsShareModal] = useState(false);
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const [fileValue, setFileValue] = useState('');

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

  const postMessageWithAttachment = () => {
    const body = new FormData();
    dispatch(postMessageSuccess({
      fromUserId: currentUser.id,
      fromUser: currentUser,
      toCustomer: customerId,
      toUser: userId,
      toGroupId: groupId,
      message,
      chatAssets: files.map(({ file, url }) => ({
        fileType: file.type,
        url,
        name: file.name,
        size: file.size,
      })),
      created_at: new Date()
    }));
    body.append('attach', files[0].file);
    if (customerId) {
      body.append('toCustomer', customerId);
    }
    if (groupId) {
      body.append('toGroup', groupId);
    }
    if (userId) {
      body.append('toUser', userId);
    }
    if (message) {
      body.append('message', message);
    }
    dispatch(sendAttachment(body));
    setFiles([]);
  };

  const postMessageHandler = () => {
    if (files.length) {
      postMessageWithAttachment();
    } else {
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
    }
    setMessage('');
  };

  const toggleIsShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  const redirect = () => {
    if (team.data.length) {
      if (team.data[0].groupId) {
        history.push(`/admin/chats/groups/${team.data[0].groupId}`);
      } else {
        history.push(`/admin/chats/groups/${team.data[0].id}`);
      }
    }
  };

  const deleteGroupHandler = () => {
    dispatch(deleteChatGroup(groupId)).then(() => {
      redirect();
    });
  };

  const onUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      setFiles([{ file: e.target.files[0], url: result }]);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFileValue(e.target.value);
  };

  const removeFiles = (index) => {
    setFiles(files.filter((file, i) => index !== i));
    setFileValue('');
  };

  const setMessageHandler = (e) => {
    setMessage(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postMessageHandler(e);
    }
  };

  return (
    <div className="chat-body">
      <div className="chat-body__header">
        <div className="chat-body__header-title">
          {group ? (
            <div className="chat-body__header-profile-img">
              <CustomIcon icon="Placeholder/Group/Small" />
            </div>
          ) : (
            <ProfileInitials
              firstName={profile?.firstName}
              lastName={profile?.lastName}
              size="small"
              profileId={profile?.id}
            />
          )}
          <h4>{isLoading ? 'Loading...' : chatTitle}</h4>
        </div>
        {currentUser.role.name === 'Admin' && groupId
        && (
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
                <DropdownItem onClick={deleteGroupHandler}>
                  Archive group
                </DropdownItem>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>
      <Divider />
      <MessageList
        id={tab === 'team' && (groupId || userId)}
        loadMoreMessages={loadMoreMessages}
      />
      <form
        className="chat-message__footer"
      >
        {canShareProducts()
        && (
          <Tooltip title="Share product">
            <IconButton
              type="button"
              size="small"
              onClick={toggleIsShareModal}
            >
              <CustomIcon icon="Share" />
            </IconButton>
          </Tooltip>
        )}
        <div className="chat-input-container">
          <MentionTextBox
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessageHandler(e)}
            singleLine={false}
            appendSpaceOnAdd
            onKeyPress={onKeyPress}
          />
          {!!files.length
          && (
            <div className="chat-input-attachment-list">
              {files.map(({ file, url }, index) => (
                <InputAttachment
                  key={url}
                  file={file}
                  url={url}
                  onClose={() => removeFiles(index)}
                />
              ))}
            </div>
          )}
        </div>
        <input
          onChange={onUpload}
          accept="image/svg+xml,image/x-png,image/jpeg,application/pdf,.csv"
          id={`attach-${tab}`}
          type="file"
          hidden
          value={fileValue}
        />
        <label className="chat-attach-btn" htmlFor={`attach-${tab}`}>
          <CustomIcon icon="Icon/Attach" />
        </label>
        <IconButton
          size="small"
          disabled={!message && !files.length}
          onClick={() => {
            postMessageHandler();
            handleSubmit();
          }}
        >
          <CustomIcon icon="Send-Enabled" />
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

ChatBody.propTypes = {
  group: PropTypes.bool,
  profile: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])),
  chatTitle: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  tab: PropTypes.string,
  loadMoreMessages: PropTypes.func,
  handleSubmit: PropTypes.func
};

ChatBody.defaultProps = {
  group: false,
  profile: null,
  isLoading: false,
  tab: '',
  loadMoreMessages: () => {},
  handleSubmit: () => {}
};

export default ChatBody;
