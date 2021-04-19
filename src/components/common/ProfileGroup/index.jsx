import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import ProfileInitials from '../ProfileInitials';

const ProfileGroup = ({
  profiles
}) => (
  <div className="profile-group">
    <div className="profile-group__item">
      <ProfileInitials
        firstName={profiles[0]?.firstName}
        lastName={profiles[0]?.lastName}
        profileId={profiles[0]?.id}
        profileUrl={profiles[0]?.profileUrl}
      />
    </div>
    <div className="profile-group__item">
      <ProfileInitials
        firstName={profiles[1]?.firstName}
        lastName={profiles[1]?.lastName}
        profileId={profiles[1]?.id}
      />
    </div>
  </div>
);

ProfileGroup.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.any)
};

ProfileGroup.defaultProps = {
  profiles: [
    {
      firstName: 'T',
      lastName: 'D',
      id: 1,
    },
    {
      firstName: 'M',
      lastName: 'Q',
      id: 3
    }
  ]
};

export default ProfileGroup;
