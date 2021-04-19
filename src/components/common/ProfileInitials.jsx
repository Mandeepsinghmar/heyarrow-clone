/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';

import { COLORS } from '../../constants';

const ProfileInitial = ({
  firstName,
  lastName,
  size = '',
  className = '',
  profileId = Math.floor(Math.random() * COLORS.length) + 0,
  profileUrl
}) => {
  const colorIndex = profileId % 7;
  return (
    <div
      style={{ backgroundColor: COLORS[colorIndex] }}
      className={`profile-initial ${size} ${className}`}
    >
      {profileUrl
        ? <img style={{ width: '100%' }} src={profileUrl} alt="" /> : `${firstName?.charAt(0)}${lastName?.charAt(0)}` }
    </div>
  );
};

ProfileInitial.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  profileId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  profileUrl: PropTypes.string,
};

ProfileInitial.defaultProps = {
  firstName: '',
  lastName: '',
  size: '',
  className: '',
  profileId: Math.floor(Math.random() * COLORS.length) + 0,
  profileUrl: ''
};

export default ProfileInitial;
