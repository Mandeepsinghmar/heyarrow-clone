import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

import './index.scss';
import Loader from '../common/Loader';
import ChatMessageGroup from '../common/ChatMessageGroup';
import ChatMessageItem from '../common/ChatMessageItem';

const MessageList = ({
  id,
  loadMoreMessages,
}) => {
  const {
    loading,
    data,
    hasMore,
    dataLength
  } = useSelector((state) => state.chat.chatMessages);
  const chatMessageList = useRef();
  const { currentUser } = useSelector((state) => state.auth);
  const { groupId } = useParams();
  const [scrollChat, setScrollChat] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (chatMessageList.current && scrollChat) {
      chatMessageList.current.scrollTop = chatMessageList.current.scrollHeight;
    }
    if (!scrollChat) {
      setScrollChat(true);
      chatMessageList.current.scrollTop = chatMessageList.current.scrollHeight
      - scrollTop;
    }
  }, [data]);

  return (
    <>
      {loading
        ? (
          <div className="chat-message-list">
            <Loader secondary />
          </div>
        )
        : (
          <div
            className="chat-message-list"
            ref={chatMessageList}
            id={`chat-message-list-${id}`}
            onScroll={(e) => {
              if (e.target.scrollTop === 0) {
                setScrollTop(e.target.scrollHeight);
              }
            }}
          >
            <InfiniteScroll
              dataLength={dataLength}
              next={() => {
                loadMoreMessages();
                setScrollChat(false);
              }}
              hasMore={hasMore}
              inverse
              scrollableTarget={`chat-message-list-${id}`}
            >
              {Object.keys(data).reverse()
                .filter((key) => data[key].length).map((key) => (
                  <ChatMessageGroup date={key}>
                    {data[key].map((chat) => (
                      <ChatMessageItem
                        message={chat.message}
                        assets={chat.chatAssets}
                        type={Number(currentUser.id) === Number(chat.fromUserId) && 'sent'}
                        key={chat.chatId}
                        date={chat.created_at}
                        profile={chat.fromUser || chat.fromCustomer}
                        group={!!groupId}
                      />
                    ))}
                  </ChatMessageGroup>
                ))}
            </InfiniteScroll>
          </div>
        )}
    </>
  );
};

MessageList.propTypes = {
  id: PropTypes.string,
  loadMoreMessages: PropTypes.func,
};

MessageList.defaultProps = {
  id: '',
  loadMoreMessages: () => {},
};

export default MessageList;
