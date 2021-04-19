import React, { useState, useEffect } from 'react';
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
  updateCustomer
} from '../../api';

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: '33.3%',
  }
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is Required').email('Invalid Email'),
  phone: Yup.string().required('Phone Number is Required')
});

const EditCustomerModal = ({
  isOpen,
  toggle,
  customer
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    accountName: customer.accountName,
    email: customer.email,
    phone: customer.phone,
    zipcode: customer.zipcode,
    cityId: customer.city?.id,
    assignedTo: currentUser.id,
    notes: ''
  });
  const { states, cities } = useSelector((state) => state.common);
  const [innerStates, setStates] = useState([{
    name: customer?.city?.state?.name,
    id: customer?.city?.state?.id,
    code: customer?.city?.state?.code
  }]);
  const classes = useStyles();
  const [innerCities, setCities] = useState([{
    name: customer?.city?.name,
    id: customer?.city?.id,
    code: customer?.city?.code
  }]);
  const [stateId, setStateId] = useState(customer?.city?.state?.id);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      accountName: customer.accountName,
      email: customer.email,
      phone: customer.phone,
      zipcode: customer.zipcode,
      cityId: customer.city?.id,
      assignedTo: currentUser.id,
      notes: ''
    });
  }, [customer]);

  useEffect(() => {
    if (cities[stateId]?.length) {
      setCities(cities[stateId]);
    }
  }, [cities]);

  useEffect(() => {
    if (states.length) {
      setStates(states);
    }
  }, [states]);

  const updateCustomerHandler = (actions) => {
    actions.setSubmitting(false);
    setIsUpdating(true);
    dispatch(updateCustomer(customer.id, form)).finally(() => {
      setIsUpdating(false);
      toggle();
    });
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

  const getCitiesHandler = () => {
    if (!cities[stateId]?.length && stateId) {
      dispatch(getCities(stateId)).then((data) => {
        setCities(data);
      });
    } else {
      setCities(cities[stateId]);
    }
  };

  const onStateChange = (id) => {
    setStateId(id);
    if (cities[id]) {
      setCities(cities[id]);
    } else {
      setCities([]);
    }
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
          Customer details
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
          initialValues={form}
          onSubmit={(values, action) => updateCustomerHandler(action)}
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
                  value={form.firstName || ''}
                />
                <Input
                  label="Last name"
                  className="half-size"
                  name="lastName"
                  onChange={(e) => inputHandler('lastName', e.target.value)}
                  value={form.lastName || ''}
                />
              </div>
              <div className="form-input-group">
                <Input
                  fullWidth
                  label="Account name"
                  name="accountName"
                  onChange={(e) => inputHandler('accountName', e.target.value)}
                  value={form.accountName || ''}
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
                  value={form.email || ''}
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
                  name="phone"
                  onChange={(e) => {
                    inputHandler('phone', e.target.value);
                    handleChange(e);
                  }}
                  helperText={errors.phone && touched.phone && errors.phone}
                  error={errors.phone && touched.phone}
                  onBlur={handleBlur}
                  value={form.phone || ''}
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
                    value={stateId}
                  >
                    {!states.length
              && <MenuItem>Loading...</MenuItem> }
                    {innerStates.map(
                      (state) => (
                        <MenuItem
                          key={state.id}
                          value={state.id}
                        >
                          {state.name}
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
                    value={form.cityId}
                    onOpen={() => getCitiesHandler()}
                    disabled={!stateId}
                  >
                    {innerCities.map(
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
                  name="zipcode"
                  onChange={(e) => inputHandler('zipcode', e.target.value)}
                  value={form.zipcode || ''}
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
                  disabled={isUpdating}
                >
                  { isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

EditCustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  customer: PropTypes.objectOf(PropTypes.any)
};

EditCustomerModal.defaultProps = {
  customer: {}
};

export default EditCustomerModal;
