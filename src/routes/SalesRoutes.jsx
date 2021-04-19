import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Home from '../containers/Home';
import Team from '../containers/Team';
import Customers from '../containers/Customers';
import Profile from '../containers/Profile';
import Chats from '../containers/Chats';
import Header from '../components/Header';
import NotFound from '../components/NotFound';
import CustomerDetails from '../containers/Customers/CustomerDetails';
import TeamDetails from '../containers/Team/TeamDetails';

const SalesRoutes = () => (
  <>
    <Header />
    <div className="contentContainer">
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/feed" exact component={Home} />
        <PrivateRoute path="/teams" exact component={Team} />
        <PrivateRoute path="/customers" exact component={Customers} />
        <PrivateRoute path="/teams/:userId" exact component={TeamDetails} />
        <PrivateRoute path="/customers/:customerId" exact component={CustomerDetails} />
        <PrivateRoute path="/profile" exact component={Profile} />
        <PrivateRoute path="/chats" exact component={Chats} />
        <PrivateRoute path="/chats/customers/:customerId" exact component={Chats} />
        <PrivateRoute path="/chats/users/:userId" exact component={Chats} />
        <PrivateRoute path="/chats/groups/:groupId" exact component={Chats} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </div>
  </>
);

export default SalesRoutes;
