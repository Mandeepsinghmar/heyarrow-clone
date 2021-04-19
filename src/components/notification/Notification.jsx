import React, {
  useEffect,
  useCallback
} from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import PropTypes from 'prop-types';
import {
  fetchAllNotifications,
  markAllNotificationAsRead
} from '../../api';
import NotificationBody from './NotificationBody';
import Loader from '../common/Loader';
import CustomIcon from '../common/CustomIcon';

const Notification = ({
  close,
}) => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.notification);

  const loadNotifications = useCallback(async () => {
    dispatch(fetchAllNotifications()).then(() => {
      dispatch(markAllNotificationAsRead());
    });
  }, [dispatch]);

  useEffect(() => {
    if (!data.length) {
      loadNotifications();
    }
  }, [loadNotifications]);

  return (
    <div>
      <Modal.Dialog
        animation={false}
        style={{ bordeRadius: 5, maxWidth: 340, maxHeight: 435 }}
        className="notification-models"
      >
        <Modal.Header>
          <div className="modal-title">Notifications</div>
          <CustomIcon icon="Close" className="close" onClick={close} />
        </Modal.Header>
        <Scrollbar
          style={{ width: 340, height: 435 }}
          className="empty-container"
        >
          {loading ? (
            <Loader secondary />
          ) : (
            <NotificationBody />
          )}
        </Scrollbar>
      </Modal.Dialog>
    </div>
  );
};

Notification.defaultProps = {
  close: '',

};
Notification.propTypes = {
  close: PropTypes.func,
};

export default Notification;
