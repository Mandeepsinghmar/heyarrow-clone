import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { NavLink, useHistory } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch, useSelector } from 'react-redux';

import './index.scss';
import Menu from './Menu';
import CustomIcon from '../common/CustomIcon';
import {
  getClientDetails,
  getTotalUnreadCounts,
  logoutUser,
  getNotificationUnreadCounts,
} from '../../api';
import Notification from '../notification/Notification';
import Popup from '../notification/NotificationPop';
import ProfileInitials from '../common/ProfileInitials';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleDrawer = (bool) => {
    setDrawerOpen(bool);
  };
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const history = useHistory();
  const [showNotification, setShowNotification] = useState(false);
  const { totalUnreadCounts } = useSelector((state) => state.chat);
  const { unreadCounts } = useSelector((state) => state.notification);
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(getClientDetails());
    dispatch(getTotalUnreadCounts());
    dispatch(getNotificationUnreadCounts());
  }, []);

  const logoutUserHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="header" style={{ borderTopColor: client?.color }}>
      <div className="leftSide">
        <a href="/" className="logoLink flex align-center">
          {client.logo
            && <img src={client?.logo} alt="logo" />}
          <div className="brand-name">{client.name}</div>
        </a>
      </div>
      <Menu />

      <div className="notification-division">
        <Popup showMe={showNotification}>
          <Notification close={() => setShowNotification(false)} />
        </Popup>
      </div>
      <div className="rightSide">
        <ul className="iconList">
          <li>
            <a href="#" onClick={() => setShowNotification(!showNotification)}>
              <CustomIcon icon="Navigation/Notifications/Regular" />
              {!!unreadCounts && <span className="badge">{unreadCounts}</span>}
            </a>
          </li>
          <li>
            <NavLink to="/chats" activeClassName="active">
              <CustomIcon icon="Navigation/Chat/Regular" />
              {!!totalUnreadCounts
                && <span className="badge">{totalUnreadCounts}</span>}
            </NavLink>
          </li>
          <li>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle>
                <ProfileInitials
                  {...currentUser}
                  profileId={currentUser?.id}
                  onClick={() => toggle()}
                />
              </DropdownToggle>
              <DropdownMenu>
                <NavLink to="/profile" activeClassName="active">
                  <DropdownItem>Profile</DropdownItem>
                </NavLink>
                <DropdownItem
                  onClick={logoutUserHandler}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <li className="onMobile">
            <a role="button" onClick={() => toggleDrawer(true)}>
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Menu />
      </Drawer>
    </div>
  );
};

export default Header;
