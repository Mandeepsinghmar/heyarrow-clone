import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../CustomIcon';
import urlify from '../../../utils/urlify';
import TextWithMention from '../TextWithMention';
import messageDateFormatter from '../../../utils/messageDateFormatter';
import ProfileInitials from '../ProfileInitials';
import getFullName from '../../../utils/getFullName';
import Attachment from './Attachment';

const ChatMessageItem = ({
  type,
  message,
  date,
  profile,
  group,
  assets
}) => (
  <div className={`flex chat-meesage-list-item-container ${type}`}>
    {type !== 'sent' && group
    && <ProfileInitials size="small" {...profile} profileId={profile.id} /> }
    <div className={`chat-message-list-item ${type}`}>
      <div className="chat-message-list-item__top flex">
        <span className="chat-message-list-item__time">
          {group && type !== 'sent' && getFullName(profile)}
          {' '}
          {messageDateFormatter(date)}
        </span>
        {type === 'sent'
      && <CustomIcon icon="small-chat" /> }
      </div>
      <p>
        <TextWithMention text={urlify(message)} />
      </p>
      <div>
        {assets.map((asset) => (
          <Attachment asset={asset} />
        ))}
      </div>
    </div>
  </div>
);

ChatMessageItem.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  date: PropTypes.string,
  profile: PropTypes.objectOf(PropTypes.any),
  group: PropTypes.bool,
  assets: PropTypes.arrayOf(PropTypes.any)
};

ChatMessageItem.defaultProps = {
  type: 'received',
  message: '',
  date: new Date().toDateString(),
  profile: {},
  group: false,
  assets: [],
};

export default ChatMessageItem;
