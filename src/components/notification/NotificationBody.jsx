import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import CustomIcon from '../common/CustomIcon';
import NotificationListItem from './NotificationListItem';

const NotificationBody = () => {
  const { data } = useSelector((state) => state.notification);
  return (
    <div>
      {!data.length ? (
        <div>
          <div className="empty">
            <center>
              <CustomIcon icon="Navigation/Notifications/no-notification" />
              <span>There are no notifications</span>
            </center>
          </div>
        </div>
      ) : (
        <Modal.Body>
          {data.map((notification) => (
            <NotificationListItem
              read
              notification={notification}
            />
          ))}
        </Modal.Body>
      )}
    </div>
  );
};

export default NotificationBody;
