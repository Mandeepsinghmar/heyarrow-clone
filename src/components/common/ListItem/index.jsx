import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import './index.scss';
import ProfileInitials from '../ProfileInitials';
import CustomIcon from '../CustomIcon';

const ListItem = ({
  profile,
  title,
  subTitle,
  action,
  hideAction,
  ...props
}) => (
  <div className="item-list justify-between" {...props}>
    <div className="flex items-center">
      {profile && (
        <ProfileInitials
          firstName={profile.firstName}
          lastName={profile.lastName}
          profileId={profile.id}
        />
      )}
      <div className="item-list__text">
        <span className="item-list__title">{title}</span>
        <span className="item-list__subtitle">{subTitle}</span>
      </div>
    </div>
    {!hideAction && (
      <div className="item-list__action">
        <IconButton
          size="small"
          onClick={action}
        >
          <CustomIcon icon="Add" />
        </IconButton>
      </div>
    )}
  </div>
);

ListItem.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  action: PropTypes.func,
  hideAction: PropTypes.bool
};

ListItem.defaultProps = {
  profile: null,
  title: '',
  subTitle: '',
  action: () => {},
  hideAction: false,
};

export default ListItem;
