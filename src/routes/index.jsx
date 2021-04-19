import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../components/NotFound';
import Login from '../containers/Login';
import ForgotPassword from '../containers/ForgotPassword';
import ResetPassword from '../containers/ResetPassword';
import AdminRoutes from './AdminRoutes';
import SalesRoutes from './SalesRoutes';
import QuotePreview from '../containers/QuotePreview';

const Routes = () => (
  <Switch>
    <Route path="/login" exact component={Login} />
    <Route path="/admin" component={AdminRoutes} />
    <Route path="/customers/:customerId/quote/preview" component={QuotePreview} />
    <Route path="/auth/password/forgot" exact component={ForgotPassword} />
    <Route path="/auth/password/Reset/:hash" exact component={ResetPassword} />
    <Route path="/auth/password/create/:hash" exact component={ResetPassword} />
    <Route exact component={SalesRoutes} />
    <Route path="*" exact component={NotFound} />
  </Switch>
);

export default Routes;
