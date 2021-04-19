import React, { useState, useEffect, useCallback } from 'react';
import {
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import './index.scss';
import ProfileInitials from '../../components/common/ProfileInitials';
import Input from '../../components/common/Input';
import CustomSelect from '../../components/common/CustomSelect';
import CustomIcon from '../../components/common/CustomIcon';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import {
  getProfile,
  updateProfile,
  getStates,
  getCities,
} from '../../api';
import getFullName from '../../utils/getFullName';
import getLocation from '../../utils/getLocation';

const Profile = () => {
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    zipcode: user.zipcode,
    cityId: user?.city?.id
  });
  const { states, cities } = useSelector((state) => state.common);
  const [innerCities, setCities] = useState([{
    name: user.city?.name,
    id: user.city?.id,
    code: user.city?.code
  }]);
  const [innerStates, setStates] = useState([{
    name: user?.city?.state?.name,
    id: user?.city?.state?.id,
    code: user?.city?.state?.code
  }]);
  const [stateId, setStateId] = useState(user?.city?.state?.id);
  const onDrop = useCallback((files) => {
    const data = new FormData();
    data.append('profileUrl', files[0]);
    dispatch(updateProfile(data));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5242880
  });

  const toggleIsChangePasswordModal = () => {
    setIsChangePasswordModal(!isChangePasswordModal);
  };

  useEffect(() => {
    dispatch(getProfile());
  }, []);

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

  useEffect(() => {
    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      zipcode: user.zipcode,
      cityId: user?.city?.id
    });
  }, [user]);

  const onSave = () => {
    const data = new FormData();
    Object.keys(profileForm).forEach((key) => {
      data.append(key, profileForm[key]);
    });
    dispatch(updateProfile(data));
  };

  const handleInputChange = (key, value) => {
    setProfileForm({
      ...profileForm,
      [key]: value
    });
  };

  const getStatesHandler = () => {
    if (!states.length) {
      dispatch(getStates());
    }
  };

  const getCitiesHandler = () => {
    if (stateId && !cities[stateId]?.length) {
      dispatch(getCities(stateId)).then((data) => {
        setCities(data);
      });
    } else if (stateId) {
      setCities(cities[stateId]);
    }
  };

  return (
    <div className="profile-container">
      <div
        className="center-box"
      >
        <div className="flex justify-center items-center">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <ProfileInitials
              size="extra-large"
              firstName={profileForm.firstName}
              lastName={profileForm.lastName}
              profileId={user.id}
              profileUrl={user.profileUrl}
            />
          </div>
        </div>
        <form className="profile-form">
          <div className="form-input-group justify-between flex">
            <Input
              label="First Name"
              className="half-size"
              value={profileForm.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={onSave}
            />
            <Input
              label="Last Name"
              className="half-size"
              value={profileForm.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={onSave}
            />
          </div>
          <div className="form-input-group">
            <Input
              placeholder="Email address"
              label="Email address"
              value={user.email || ''}
              disabled
              fullWidth
            />
          </div>
          <div className="flex form-input-group form-input-group__phone">
            <CustomSelect
              placeholder="Country code"
              value="+1"
              className="country-code"
              disabled
            >
              <MenuItem value="+1">
                +1
              </MenuItem>
            </CustomSelect>
            <Input
              label="Phone number"
              className="phone-number"
              value={profileForm.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div className="flex form-input-group justify-between">
            <FormControl variant="outlined" className="third-size select-label">
              <InputLabel id="state">State</InputLabel>
              <CustomSelect
                label="State"
                onOpen={getStatesHandler}
                labelId="state"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
              >
                {innerStates.map((state) => (
                  <MenuItem value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </FormControl>
            <FormControl variant="outlined" className="third-size select-label">
              <InputLabel id="city">City</InputLabel>
              <CustomSelect
                label="City"
                value={profileForm.cityId}
                labelId="city"
                onOpen={() => getCitiesHandler()}
                onBlur={onSave}
                disabled={!stateId}
                onChange={(e) => handleInputChange('cityId', e.target.value)}
              >
                {innerCities.map((city) => (
                  <MenuItem value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </FormControl>
            <Input
              label="Zip Code"
              className="third-size"
              value={profileForm.zipcode || ''}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              onBlur={onSave}
            />
          </div>
        </form>
        {user.reportingTo
        && (
          <div className="profile-reporting-to">
            <h3 className="profile-reporting-to__title">Reporting to</h3>
            <Divider />
            <div className="profile-reporting-to__profile">
              <ProfileInitials
                firstName={user.reportingTo.firstName}
                lastName={user.reportingTo.lastName}
                profileUrl={user.reportingTo.profileUrl}
                profileId={user.reportingTo.id}
              />
            </div>
            <div className="profile-reporting-to__text">
              <h2>{getFullName(user.reportingTo)}</h2>
              <span>{getLocation(user.reportingTo?.city)}</span>
            </div>
            <div className="profile-reporting-to__buttons">
              <Tooltip title={user?.reportingTo?.email}>
                <IconButton size="small">
                  <a href={`mailto:${user?.reportingTo?.email}`}>
                    <CustomIcon icon="Icon/Email" />
                  </a>
                </IconButton>
              </Tooltip>
              <Tooltip title={user.reportingTo.phone || ''}>
                <IconButton size="small">
                  <CustomIcon icon="Phone" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      <a
        className="text-right change-password"
        onClick={toggleIsChangePasswordModal}
      >
        Change password
      </a>
      <ChangePasswordModal
        isOpen={isChangePasswordModal}
        toggle={toggleIsChangePasswordModal}
      />
    </div>
  );
};

export default Profile;
