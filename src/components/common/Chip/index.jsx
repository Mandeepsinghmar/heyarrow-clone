import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../CustomIcon';
import ProfileInitials from '../ProfileInitials';

const Chip = ({
  profile,
  title,
  onDelete,
  ...props
}) => (
  <div className="chip" {...props}>
    {profile && (
      <ProfileInitials
        firstName={profile.firstName}
        lastName={profile.lastName}
        size="small"
        profileId={profile.id}
      />
    )}
    {title}
    <CustomIcon onClick={onDelete} className="cursor-pointer" icon="Close" />
  </div>
);

Chip.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func
};

Chip.defaultProps = {
  profile: null,
  onDelete: () => {}
};

export default Chip;
