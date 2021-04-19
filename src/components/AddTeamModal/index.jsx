import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProfileInitals from '../common/ProfileInitials';
import Input from '../common/Input';
import CustomSelect from '../common/CustomSelect';
import Button from '../common/Button';
import {
  getStates,
  getCities,
  getRolesList,
  createTeamUser
} from '../../api';

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: '33.3%',
  }
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is Required').email('Invalid Email'),
});

const AddCustomerModal = ({
  isOpen,
  toggle
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    zipcode: '',
    cityId: '',
    reportingToId: currentUser.id,
    roleId: ''
  });
  const { states } = useSelector((state) => state.common);
  const classes = useStyles();
  const [cities, setCities] = useState([]);
  const history = useHistory();
  const { roleList } = useSelector((state) => state.permission);
  const [stateId, setStateId] = useState('');

  const addCustomerHandler = (actions) => {
    actions.setSubmitting(false);
    dispatch(createTeamUser(form, 0)).then((data) => {
      history.push(`/teams/${data.id}`);
    });
    toggle();
  };

  const inputHandler = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };

  const onStateOpen = () => {
    dispatch(getStates());
  };

  const onStateChange = (id) => {
    setStateId(id);
    dispatch(getCities(id)).then((data) => {
      setCities(data);
    });
  };

  const getRoleHandler = () => {
    dispatch(getRolesList());
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="add-customer-modal"
    >
      <ModalHeader>
        <span className="heading">
          Add Team member
        </span>
        <IconButton size="small">
          <CustomIcon icon="Close" onClick={toggle} />
        </IconButton>
      </ModalHeader>
      <ModalBody>
        <div className="add-customer-modal__avatar">
          <ProfileInitals
            size="extra-large"
            firstName={form.firstName}
            lastName={form.lastName}
          />
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            email: '',
          }}
          onSubmit={(values, action) => addCustomerHandler(action)}
          validationSchema={validationSchema}
        >
          {({
            errors,
            touched,
            handleSubmit,
            handleBlur,
            handleChange
          }) => (
            <form className="add-customer-modal__form" onSubmit={handleSubmit}>
              <div className="flex justify-between form-input-group">
                <Input
                  label="First name"
                  className="half-size"
                  name="firstName"
                  onChange={(e) => inputHandler('firstName', e.target.value)}
                />
                <Input
                  label="Last name"
                  className="half-size"
                  name="lastName"
                  onChange={(e) => inputHandler('lastName', e.target.value)}
                />
              </div>
              <div className="form-input-group">
                <FormControl variant="outlined" className="select-label w-100">
                  <InputLabel id="role">- Select role* -</InputLabel>
                  <CustomSelect
                    labelId="role"
                    onOpen={getRoleHandler}
                    onChange={(e) => inputHandler('roleId', e.target.value)}
                    label="- Select role* -"
                  >
                    {!roleList.length
              && <MenuItem>Loading...</MenuItem> }
                    {roleList.map(
                      (role) => (
                        <MenuItem
                          key={role.id}
                          value={role.id}
                        >
                          {role.name}
                        </MenuItem>
                      )
                    )}
                  </CustomSelect>
                </FormControl>
              </div>
              <div className="form-input-group">
                <Input
                  fullWidth
                  type="email"
                  label="Email address"
                  name="email"
                  onChange={(e) => {
                    inputHandler('email', e.target.value);
                    handleChange(e);
                  }}
                  helperText={errors.email && touched.email && errors.email}
                  error={errors.email && touched.email}
                  onBlur={handleBlur}
                />
              </div>
              <div className="flex form-input-group form-input-group__phone">
                <CustomSelect
                  label="Country code"
                  value="+1"
                  className="country-code"
                  disabled
                >
                  <MenuItem value="+1">+1</MenuItem>
                </CustomSelect>
                <Input
                  label="Phone number"
                  className="phone-number"
                  name="phoneNumber"
                  maxLength="15"
                  pattern="^[0-9]*$"
                  onChange={(e) => {
                    inputHandler('phoneNumber', e.target.value);
                    handleChange(e);
                  }}
                  helperText={errors.phone && touched.phone}
                  error={errors.phone && touched.phone}
                  onBlur={handleBlur}
                  type="number"
                />
              </div>
              <div className="flex form-input-group justify-between">
                <FormControl variant="outlined" className={`${classes.formControl} select-label`}>
                  <InputLabel id="state">State</InputLabel>
                  <CustomSelect
                    labelId="state"
                    onOpen={onStateOpen}
                    onChange={(e) => onStateChange(e.target.value)}
                    label="State"
                  >
                    {!states.length
              && <MenuItem>Loading...</MenuItem> }
                    {states.map(
                      (state) => (
                        <MenuItem
                          key={state.id}
                          value={state.id}
                        >
                          {state.code}
                        </MenuItem>
                      )
                    )}
                  </CustomSelect>
                </FormControl>
                <FormControl variant="outlined" className={`${classes.formControl} select-label`}>
                  <InputLabel id="city">City</InputLabel>
                  <CustomSelect
                    label="City"
                    labelId="city"
                    onChange={(e) => inputHandler('cityId', e.target.value)}
                    disabled={!stateId}
                  >
                    {cities.map(
                      (city) => (
                        <MenuItem
                          key={city.id}
                          value={city.id}
                        >
                          {city.name}
                        </MenuItem>
                      )
                    )}
                  </CustomSelect>
                </FormControl>
                <Input
                  label="Zip code"
                  className="third-size"
                  type="number"
                  name="zipcode"
                  onChange={(e) => inputHandler('zipcode', e.target.value)}
                />
              </div>
              <div className="flex justify-between form-input-group">
                <Button
                  className="half-size"
                  color="secondary"
                  onClick={toggle}
                >
                  Cancel
                </Button>
                <Button
                  className="half-size"
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

AddCustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default AddCustomerModal;
