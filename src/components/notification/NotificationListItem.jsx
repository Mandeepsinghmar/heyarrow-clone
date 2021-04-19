import React from 'react';
import PropTypes from 'prop-types';

import ProfileInitial from '../common/ProfileInitials';
import getFullName from '../../utils/getFullName';
import formatMessageDateForNotification from '../../utils/messageDataFormatterForNotification';
import './index.scss';

const NotificationListItem = ({
  read = false,
  notification
}) => (
  <div
    id="show"
    className={`notification-item ${read ? '' : 'unread' }`}
  >
    <ProfileInitial
      firstName={notification.fromUser.firstName}
      lastName={notification.fromUser.lastName}
      profileId={notification.fromUser.id}
      profileUrl={notification.fromUser.profileUrl}
    />
    <div className="flex column notification-item-text content">
      <span>
        <span className="notifier">
          {getFullName(notification.fromUser)}
        </span>
        <span>
          {notification.body}
        </span>
      </span>
    </div>
    <span className="time">{formatMessageDateForNotification(notification.createdAt)}</span>
  </div>
);

NotificationListItem.defaultProps = {
  read: '',
  notification: PropTypes.objectOf(PropTypes.any)
};

NotificationListItem.propTypes = {
  read: PropTypes.bool,
  notification: {}
};

export default NotificationListItem;
