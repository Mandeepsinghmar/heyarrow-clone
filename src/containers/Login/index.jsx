import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button } from 'reactstrap';

import './index.scss';
import { loginUser, getClientDetails } from '../../api';

const intialForm = { email: '', password: '' };

const Login = () => {
  const [loginForm, setLoginForm] = useState(intialForm);
  const { client } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const history = useHistory();

  useEffect(() => {
    dispatch(getClientDetails());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated]);

  const formRef = useRef(null);

  /*
   * onchange event for form handle
   */
  const onChange = (key, value) => {
    const form = { ...loginForm };
    form[key] = value;
    setLoginForm(form);
  };

  const onSubmit = () => {
    dispatch(loginUser(loginForm));
  };

  const isDisable = () => {
    if (!loginForm.email || !loginForm.password) {
      return true;
    }
    return false;
  };

  return (
    <div className="loginCon w-100">
      <div className="innerContainer">
        <div className="loginContainer">
          <div className="loginLogoBox" style={{ backgroundColor: client?.color || 'white', transition: '1s ease-in' }}>
            <div className="logoBox">
              {client?.logo && <img src={client?.logo} alt="logo" style={{ transition: 'opacity 1s ease-in' }} />}
            </div>
          </div>
          <div className="loginBox">
            <ValidatorForm
              ref={formRef}
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit(event);
              }}
              style={{ width: '100%' }}
            >
              <h3>
                Welcome to
                {' '}
                {client?.name}
                {' '}
                Workspace!
              </h3>
              <TextValidator
                label="Email Address"
                onChange={(e) => onChange('email', e.target.value.toLocaleLowerCase())}
                name="email"
                value={loginForm.email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
                fullWidth
                variant="outlined"
                className="formElement"
                type="email"
              />
              <TextValidator
                label="Password"
                onChange={(e) => onChange('password', e.target.value)}
                name="password"
                type="password"
                validators={['required']}
                errorMessages={['This field is required']}
                value={loginForm.password}
                fullWidth
                variant="outlined"
                className="formElement"
              />
              <div className="text-right forgotLink">
                <Link to="/auth/password/forgot">Forgot Password?</Link>
              </div>
              <div className="btnCon text-center">
                <Button color="primary" className="mainBtn" disabled={(!!(loading || isDisable()))}>
                  {loading ? 'Loading...' : 'Sign In'}
                </Button>
              </div>
              <p className="loginText">
                By clicking Sign In,
                you acknowledge that
                {' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                you have read and understood, and agree to Arrow's
                {' '}
                <a href="https://privacy.heyarrow.com" target="blank">Terms of Service</a>
                {' '}
                and
                {' '}
                <a href="https://privacy.heyarrow.com" target="blank">Privacy Policy</a>
                .
              </p>
            </ValidatorForm>
          </div>
        </div>
      </div>
      <div className="bottomContainer">
        <div className="text-center flex justify-center">
          <img alt="" src="/images/arrowLogo.png" />
        </div>
        <p>{`Powered by Arrow © ${new Date().getFullYear()}. All rights reserved.`}</p>
      </div>
    </div>
  );
};

export default Login;
