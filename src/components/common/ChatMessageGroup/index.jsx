import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { formatDate } from '../../../utils/messageDateFormatter';

const ChatMessageGroup = ({
  children,
  date
}) => {
  const dateFormatHandler = () => {
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) {
      return formatDate(date);
    }
    return date;
  };

  return (
    <>
      <div className="flex justify-center">
        <span className="chat-group-time">
          {dateFormatHandler()}
        </span>
      </div>
      {children}
    </>
  );
};

ChatMessageGroup.propTypes = {
  children: PropTypes.node.isRequired,
  date: PropTypes.string.isRequired
};

export default ChatMessageGroup;
