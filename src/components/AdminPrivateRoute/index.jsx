import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const isAuthRoute = (props) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (token) {
      if (userData.role.name !== 'Admin') {
        return <Redirect to="/" />;
      }
      return <Component {...props} />;
    }
    return <Redirect to={`/?redirect=${props.location.pathname}`} />;
  };

  return <Route {...rest} render={(props) => isAuthRoute(props)} />;
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.node.isRequired,
  location: PropTypes.objectOf(PropTypes.object).isRequired
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  null
)(AuthenticatedRoute);
