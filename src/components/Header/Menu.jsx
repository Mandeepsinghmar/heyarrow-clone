import React from 'react';

import { NavLink } from 'react-router-dom';

const menuItems = [
  {
    label: 'Products',
    url: '/'
  },
  {
    label: 'Customers',
    url: '/customers'
  },
  {
    label: 'Team',
    url: '/teams'
  },
];

const Menu = () => (
  <div className="centerSide">
    <ul>
      {
        menuItems.map((item) => (
          <li key={item.url}>
            <NavLink exact to={item.url} activeClassName="active">
              {item.label}
            </NavLink>
          </li>
        ))
      }
    </ul>
  </div>
);

export default Menu;
