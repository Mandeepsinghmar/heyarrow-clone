import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { get } from 'lodash';
import * as Yup from 'yup';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProfileInitals from '../common/ProfileInitials';
import Input from '../common/Input';
import CustomSelect from '../common/CustomSelect';
import Button from '../common/Button';
import StatesDropDown from '../common/StatesDropDown';
import CitiesDropDown from '../common/CitiesDropDown';
import { addCustomer, getCities, getStates } from '../../api';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is Required').email('Invalid Email'),
});

const AddCustomerModal = ({
  isOpen,
  toggle
}) => {
  const [cities, setCities] = useState([]);
  const [stateId, setStateId] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    accountName: '',
    email: '',
    phone: '',
    zipcode: '',
    cityId: '',
    assignedTo: currentUser.id,
    notes: ''
  });
  const { states } = useSelector((state) => state.common);
  const history = useHistory();

  const addCustomerHandler = (actions) => {
    actions.setSubmitting(false);
    dispatch(addCustomer(form)).then((data) => {
      history.push(`/customers/${data.id}`);
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

  const onStateChange = (e) => {
    const id = e.target.value;

    setStateId(id);

    dispatch(getCities(id)).then((data) => {
      setCities(data);
    });
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
          Add Customer
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
                <Input
                  fullWidth
                  label="Account name"
                  name="accountName"
                  onChange={(e) => inputHandler('accountName', e.target.value)}
                />
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
                  pattern="^[0-9]*$"
                  maxLength="15"
                  name="phone"
                  onChange={(e) => {
                    inputHandler('phone', e.target.value);
                    handleChange(e);
                  }}
                  helperText={errors.phone && touched.phone}
                  error={errors.phone && touched.phone}
                  onBlur={handleBlur}
                  type="number"
                />
              </div>
              <div className="flex form-input-group justify-between">
                <div className="third-size">
                  <div className="addCustomerModalDropDown">
                    <StatesDropDown
                      isFilter
                      item={states}
                      onClick={onStateOpen}
                      selectedValue={get(states, 'city.state.name')}
                      onSelect={onStateChange}
                      placeholder="State"
                      customer
                    />
                    <span className="dropIcons"><i className="fas fa-caret-down" /></span>
                  </div>
                </div>
                <div className="third-size">
                  <div className="addCustomerModalDropDown">
                    <CitiesDropDown
                      isFilter
                      selectedValue={get(cities, 'city.name')}
                      onSelect={(e) => {
                        inputHandler('cityId', e.target.value);
                      }}
                      placeholder="City"
                      item={{
                        cities,
                        isNewItem: true,
                        stateId
                      }}
                      customer
                    />
                    <span className="dropIcons"><i className="fas fa-caret-down" /></span>
                  </div>
                </div>
                <div className="third-size">
                  <Input
                    label="Zip Code"
                    name="zipcode"
                    onChange={(e) => inputHandler('zipcode', e.target.value)}
                  />
                </div>
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
