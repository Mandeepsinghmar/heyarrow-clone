import React, { useState } from 'react';
import { Divider, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './index.scss';
import ProfileGroup from '../common/ProfileGroup';
import Loader from '../common/Loader';
import CustomIcon from '../common/CustomIcon';
import GroupMemberItem from '../GroupMemberItem';
import { formatDate } from '../../utils/messageDateFormatter';
import { removeMemberFromGroup } from '../../api';
import EditGroupModal from '../EditGroupModal';
import { canEditChatGroups } from '../../utils/checkPermission';

const GroupDetails = ({
  admin
}) => {
  const { groupDetails } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [isEditGroupModal, setIsEditGroupModal] = useState(false);

  const onRemoveMember = (member) => {
    dispatch(removeMemberFromGroup({
      userId: member.id,
      groupId: groupDetails.group.groupId
    }));
  };

  const toggleIsEditGroupModal = () => {
    setIsEditGroupModal(!isEditGroupModal);
  };

  return (
    <div className="group-details">
      <div className="flex items-center justify-between">
        <h3>
          Details
        </h3>
        {canEditChatGroups()
        && (
          <IconButton size="small" onClick={toggleIsEditGroupModal}>
            <CustomIcon icon="Pen" className="pen-icon" />
          </IconButton>
        )}
      </div>
      <Divider />
      {groupDetails.loading ? <Loader secondary={admin} /> : (
        <>
          {groupDetails.group.groupId
            ? (
              <>
                <ProfileGroup
                  profiles={[
                    {
                      firstName: groupDetails?.group?.groupName?.split(' ')[0],
                      lastName: groupDetails?.group?.groupName?.split(' ')[1],
                      id: groupDetails?.group?.groupId,
                      profileUrl: '/Icons/Placeholder/Group/Small.svg'
                    },
                    {
                      firstName: groupDetails?.group?.groupName?.split(' ')[0],
                      lastName: groupDetails?.group?.groupName?.split(' ')[1],
                      id: groupDetails?.group?.groupId,
                    },
                  ]}
                />
                <div className="group-details__profile">
                  <h4>{groupDetails.group.groupName}</h4>
                  <span>
                    {groupDetails.group.description}
                  </span>
                  <span className="group-details-create-date">
                    {`Created on ${formatDate(groupDetails.group.createdAt)}`}
                  </span>
                </div>
                <div className="group-details__members">
                  <div className="flex items-center justify-between">
                    <h3>Group members</h3>
                    <IconButton size="small" onClick={toggleIsEditGroupModal}>
                      <CustomIcon icon="Add" />
                    </IconButton>
                  </div>
                  <Divider />
                  {groupDetails.members.map(({ member }) => (
                    <GroupMemberItem
                      member={member}
                      onRemove={() => onRemoveMember(member)}
                    />
                  ))}
                </div>
                <EditGroupModal
                  isOpen={isEditGroupModal}
                  toggle={toggleIsEditGroupModal}
                  group={groupDetails}
                />
              </>
            ) : (
              <center>
                Group not found!
              </center>
            )}
        </>
      )}
    </div>
  );
};

GroupDetails.propTypes = {
  admin: PropTypes.bool
};

GroupDetails.defaultProps = {
  admin: false,
};

export default GroupDetails;
