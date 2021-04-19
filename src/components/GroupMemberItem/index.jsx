import React from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { IconButton } from '@material-ui/core';

import './index.scss';
import ProfileInitials from '../common/ProfileInitials';
import CustomIcon from '../common/CustomIcon';
import getFullName from '../../utils/getFullName';

const GroupMemberItem = ({
  member = {},
  onRemove
}) => (
  <div className="flex group-member-list-item justify-between">
    <div className="flex w-100">
      <ProfileInitials
        firstName={member.firstName}
        lastName={member.lastName}
        profileId={member.id}
      />
      <div className="group-member-list-item__text flex-1">
        <span className="group-member-list-item__title">
          <span>{getFullName(member)}</span>
        </span>
        <span className="group-member-list-item__subtitle">{member?.role?.name}</span>
      </div>
    </div>
    <div className="group-member-list-item__action">
      <UncontrolledDropdown className="moreOptionsCon">
        <DropdownToggle>
          <IconButton
            size="small"
          >
            <CustomIcon icon="more-vertical" />
          </IconButton>
        </DropdownToggle>
        <DropdownMenu>
          <div>
            <DropdownItem onClick={onRemove}>
              Remove
            </DropdownItem>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  </div>
);

GroupMemberItem.propTypes = {
  member: PropTypes.objectOf(PropTypes.any).isRequired,
  onRemove: PropTypes.func,
};

GroupMemberItem.defaultProps = {
  onRemove: () => {}
};

export default GroupMemberItem;
