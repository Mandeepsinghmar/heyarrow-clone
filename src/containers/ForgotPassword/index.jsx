import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import './index.scss';
import { forgotPassword, getClientDetails } from '../../api';
import { DOMAIN } from '../../constants';

const initialForm = { email: '', domain: DOMAIN };

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);
  const formRef = useRef(null);
  const [forgotPasswordForm, setForgotPasswordForm] = useState(initialForm);
  const [step, setStep] = useState(1);

  useEffect(() => {
    dispatch(getClientDetails());
  }, []);

  const onForgot = () => {
    dispatch(forgotPassword(forgotPasswordForm)).then(() => {
      setStep(2);
    });
  };

  const onChange = (key, value) => {
    const form = { ...forgotPasswordForm };
    form[key] = value;
    setForgotPasswordForm(form);
  };

  const isDisable = () => {
    if (!forgotPasswordForm.email) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="loginCon">
        <div className="innerContainer">
          <div className="loginContainer">
            <div className="loginLogoBox" style={{ backgroundColor: client.color }}>
              <div className="logoBox">
                <img src={client.logo ? client.logo : '/Icons/LogoPlaceholder.svg'} alt="logo" />
              </div>
            </div>
            <div className="loginBox">
              <h3 className="loginBox__title">Forgot Password?</h3>
              <p className="loginBox__description">
                {step === 1 ? 'Enter your email address and we’ll send you a link to reset your password.' : 'Password reset link has been sent to your email address'}
              </p>
              {step === 1
              && (
                <ValidatorForm
                  ref={formRef}
                  onSubmit={onForgot}
                  style={{ width: '100%' }}
                >
                  <TextValidator
                    label="Email Address"
                    name="email"
                    validators={['required', 'isEmail']}
                    errorMessages={['This field is required', 'Email is not valid']}
                    fullWidth
                    variant="outlined"
                    className="formElement"
                    onChange={(e) => onChange('email', e.target.value.toLowerCase())}
                    value={forgotPasswordForm.email || ''}
                    type="email"
                  />
                  <div className="btnCon text-center" style={{ marginTop: '0px' }}>
                    <Button
                      color="primary"
                      className="mainBtn"
                      style={{ marginBottom: '34px' }}
                      disabled={isDisable()}
                    >
                      Send password reset link
                    </Button>
                    <Link to="/login" style={{ fontSize: '13px' }}>Back to Sign In</Link>
                  </div>
                </ValidatorForm>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
