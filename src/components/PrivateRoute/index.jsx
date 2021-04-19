import React, { useEffect } from 'react';
import {
  Redirect, Route, withRouter, useHistory
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function PrivateRoute(props) {
  const {
    isAuthenticated,
    component: Component,
    auth,
    ...rest
  } = props;
  const token = localStorage.getItem('token');
  const user = auth.currentUser || JSON.parse(localStorage.getItem('userData'));
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated && !token) {
      history.push('/login');
    } else if (user?.role?.name === 'Admin') {
      history.push('/admin/products');
    }
  }, [user]);

  return (
    <Route
      {...rest}
      render={(prop) => (
        isAuthenticated
          ? <Component {...rest} {...prop} />
          : <Redirect to="/login" />
      )}
    />
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth,
});

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  auth: PropTypes.objectOf(PropTypes.any).isRequired
};

export default connect(
  mapStateToProps,
  null
)(withRouter(PrivateRoute));
