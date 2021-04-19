import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { NavLink, useHistory } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CustomIcon from '../CustomIcon';
import {
  getTotalUnreadCounts,
  getNotificationUnreadCounts,
  getAdminClientDetails,
  logoutUser
} from '../../../api';
import Notification from '../../notification/Notification';
import Popup from '../../notification/NotificationPop';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const toggleDrawer = (bool) => {
    setDrawerOpen(bool);
  };

  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const history = useHistory();
  const [showNotification, setShowNotification] = useState(false);
  const { totalUnreadCounts } = useSelector((state) => state.chat);
  const { unreadCounts } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getAdminClientDetails());
    dispatch(getTotalUnreadCounts());
    dispatch(getNotificationUnreadCounts());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated]);

  const logoutUserHandler = () => {
    dispatch(logoutUser());
  };

  const renderMenu = () => (
    <div className="centerSideheader">
      <ul>
        <li>
          <NavLink exact to="/admin/products" activeClassName="active">
            Products
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/customers" activeClassName="active">
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/sales" activeClassName="active">
            Sales
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/team" activeClassName="active">
            Team
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/rolepermission" activeClassName="active">
            Roles & Permissions
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/leads" activeClassName="active">
            Leads
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/admin/campaigns" activeClassName="active">
            Campaigns
          </NavLink>
        </li>
      </ul>
    </div>
  );
  return (
    <div style={{ borderTopColor: client?.color }} className="header">
      <div className="leftSide">
        <a href="/" className="logoLink flex align-center">
          {client.logo
            && <img src={client?.logo} alt="logo" />}
          <div className="brand-name">{client.name}</div>
        </a>
      </div>
      {renderMenu()}
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
            <NavLink to="/admin/chats" activeClassName="active">
              <CustomIcon icon="Navigation/Chat/Medium/Active" />
              <span className="badge">{totalUnreadCounts === 0 ? '' : totalUnreadCounts}</span>
            </NavLink>
          </li>
          <li>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle>
                <a className="defaultBG" onClick={() => toggle()}>
                  <CustomIcon icon="Placeholder/Person/Regular" />
                </a>
              </DropdownToggle>
              <DropdownMenu>
                <NavLink to="/admin/location" activeClassName="active">
                  <DropdownItem>Location</DropdownItem>
                </NavLink>
                <NavLink to="/admin/profile" activeClassName="active">
                  <DropdownItem>Profile</DropdownItem>
                </NavLink>
                <DropdownItem onClick={logoutUserHandler}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <li className="onMobile">
            <a onClick={() => toggleDrawer(true)}>
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {renderMenu()}
      </Drawer>
    </div>
  );
}

export default Header;
