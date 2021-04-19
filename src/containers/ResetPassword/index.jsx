import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button } from 'reactstrap';
import { Link, useHistory, useParams } from 'react-router-dom';

import { DOMAIN } from '../../constants';
import { resetPassword, getClientDetails } from '../../api';

const initialForm = { password: '', domain: DOMAIN };

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);
  const formRef = useRef(null);
  const [createPasswordForm, setCreatePasswordForm] = useState(initialForm);
  const history = useHistory();
  const { hash } = useParams();

  useEffect(() => {
    dispatch(getClientDetails());
  }, []);

  const onChange = (key, value) => {
    const form = { ...createPasswordForm };
    form[key] = value;
    setCreatePasswordForm(form);
  };

  const save = (e) => {
    e.preventDefault();
    dispatch(resetPassword({
      ...createPasswordForm,
      hash
    })).then(() => {
      history.push('/login');
    });
  };

  const isDisable = () => !createPasswordForm.password;

  return (
    <>
      <div className="loginCon">
        <div className="innerContainer">
          <div className="loginContainer">
            <div
              className="loginLogoBox"
              style={{ backgroundColor: client.color }}
            >
              <div className="logoBox">
                <img
                  src={client.logo ? client.logo : '/Icons/LogoPlaceholder.svg'}
                  alt="logo"
                />
              </div>
            </div>
            <div className="loginBox">
              <h3 style={{ marginBottom: '5px' }}>New Password</h3>
              <p
                style={{
                  color: '#707580',
                  fontSize: '13px',
                  textAlign: 'center',
                  marginBottom: '37px'
                }}
              >
                Enter a new password
              </p>
              <ValidatorForm
                ref={formRef}
                style={{ width: '100%' }}
                onSubmit={save}
              >
                <TextValidator
                  label="Enter a new password"
                  name="password"
                  type="password"
                  validators={['required']}
                  errorMessages={['This field is required']}
                  fullWidth
                  variant="outlined"
                  className="formElement"
                  onChange={(e) => onChange('password', e.target.value)}
                  value={createPasswordForm.password}
                />
                <div
                  className="btnCon text-center"
                  style={{ marginTop: '0px' }}
                >
                  <Button
                    color="primary"
                    className="mainBtn"
                    style={{ marginBottom: '34px' }}
                    disabled={isDisable()}
                  >
                    Save
                  </Button>
                  <Link to="/login" style={{ fontSize: '13px' }}>
                    Back to Sign In
                  </Link>
                </div>
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
