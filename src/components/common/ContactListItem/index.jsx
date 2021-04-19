import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import ProfileInitials from '../ProfileInitials';
import CustomIcon from '../CustomIcon';
import messageDateFormatter from '../../../utils/messageDateFormatter';
import TextWithMention from '../TextWithMention';

const ContactListItem = ({
  group,
  unreadCount,
  profile,
  userName,
  time,
  message,
  onClick,
  active
}) => (
  <div className={`contact-list-item ${active ? 'active' : ''}`} onClick={onClick}>
    {group
      ? (
        <div className="contact-list-item__profile-img">
          <CustomIcon icon="Placeholder/Group/Small" />
        </div>
      )
      : (
        <ProfileInitials
          firstName={profile.firstName}
          lastName={profile.lastName}
          profileId={profile.id}
        />
      ) }
    <div className="contact-list-item__text">
      <div className="contact-list-item__top">
        <span className="contact-list-item__name">{userName}</span>
        <span className="contact-list-item__time">{messageDateFormatter(time)}</span>
      </div>
      <div className="contact-list-item__down">
        <p className="contact-list-item__message">
          <TextWithMention text={message} />
        </p>
        {unreadCount > 0 && (
          <span className="contact-list-item__unread">
            {unreadCount}
          </span>
        ) }
      </div>
    </div>
  </div>
);

ContactListItem.propTypes = {
  group: PropTypes.bool,
  unreadCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  profile: PropTypes.objectOf(PropTypes.any),
  userName: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  message: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

ContactListItem.defaultProps = {
  group: false,
  profile: {
    firstName: 'C',
    lastName: 'L'
  },
  message: 'Write your new message...',
  onClick: () => {},
  active: false
};

export default ContactListItem;
