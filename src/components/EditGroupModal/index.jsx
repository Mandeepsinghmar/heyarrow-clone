import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Divider, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import { useHistory } from 'react-router-dom';
import './index.scss';
import SearchInput from '../common/SearchInput';
import ListItem from '../common/ListItem';
import CustomIcon from '../common/CustomIcon';
import Textarea from '../common/TextArea';
import GroupMemberItem from '../GroupMemberItem';
import Input from '../common/Input';
import Button from '../common/Button';
import {
  getAllUsers,
  removeMemberFromGroup,
  addMemberToGroup,
  updateGroupChat,
  deleteChatGroup
} from '../../api';
import getFullName from '../../utils/getFullName';
import Loader from '../common/Loader';
import { clearAllUsers, addMemberToGroupSuccess } from '../../redux/actions';
import ProfileInitials from '../common/ProfileInitials';

const EditGroupModal = ({
  isOpen,
  toggle,
  group
}) => {
  const history = useHistory();
  const { users } = useSelector((state) => state.team);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [groupName, setGroupName] = useState(group.group.groupName);
  const [description, setDescription] = useState(group.group.description || '');
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    search: ''
  });
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllUsers(filters));
    }
  }, [isOpen, filters]);

  const loadMoreUser = () => {
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };

  const handleSearch = debounce((text) => {
    dispatch(clearAllUsers());
    setFilters({
      ...filters,
      search: text,
      page: 1
    });
  }, 500);

  const updateChatGroupHandler = () => {
    setIsSaving(true);
    dispatch(updateGroupChat(group.group.groupId, {
      name: groupName,
      details: description
    })).then(() => {
      toggle();
      setIsSaving(false);
    });
  };

  const deleteChatGroupHandler = () => {
    setIsDeleting(true);
    dispatch(deleteChatGroup(group.group.groupId, {
      name: groupName,
      details: description
    })).then(() => {
      toggle();
    }).finally(() => {
      setIsDeleting(false);
      history.push('/chats');
    });
  };

  const onSubmit = () => {
    updateChatGroupHandler();
  };

  const onDelete = () => {
    deleteChatGroupHandler();
  };

  const addGroupMember = (member) => {
    dispatch(addMemberToGroup(
      {
        userId: member.id,
        groupId: group.group.groupId
      }
    ));
    dispatch(addMemberToGroupSuccess({
      member,
    }));
  };

  const isSelected = (user) => group.members
    .find(({ member }) => user.id === member.id);

  const removeGroupMember = (user) => {
    dispatch(removeMemberFromGroup({
      userId: user.id,
      groupId: group.group.groupId,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      className="create-group-chat-modal"
      centered
      toggle={toggle}
    >
      <ModalBody>
        <div className="modalContent">
          <div className="create-group-chat-modal__left">
            <h3>Add a member to a group</h3>
            <SearchInput
              onChange={(e) => handleSearch(e.target.value)}
              onClear={() => handleSearch('')}
            />
            <div>
              <InfiniteScroll
                dataLength={users.data.length}
                next={loadMoreUser}
                hasMore={users.hasMore}
                loader={<Loader secondary key={0} />}
                height="450px"
                endMessage={(
                  <p style={{ textAlign: 'center' }}>
                    <b>No more data</b>
                  </p>
                )}
              >
                {users.data.map((user) => (
                  <ListItem
                    title={getFullName(user)}
                    profile={user}
                    subTitle={user.email}
                    action={() => addGroupMember(user)}
                    hideAction={isSelected(user)}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="create-group-chat-modal__right">
            <div className="create-group-chat-modal__header">
              <h1>Group Details</h1>
              <IconButton
                size="small"
                onClick={toggle}
              >
                <CustomIcon icon="Close" />
              </IconButton>
            </div>
            <div>
              <ProfileInitials
                firstName={group?.group?.groupName?.split(' ')[0]}
                lastName={group?.group?.groupName?.split(' ')[1]}
                profileId={group?.group?.groupId}
                size="large"
              />
            </div>
            <form className="create-group-chat-modal__form">
              <Input
                placeholder="Name"
                label="Name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
              <Textarea
                rows={4}
                placeholder="Description"
                fullWidth
                inputProps={{
                  maxlength: 160
                }}
                className="description-text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="word-count self-end">
                {`${description.length}/160 characters`}
              </span>
            </form>
            <h3>Group members</h3>
            <Divider />
            <div className="create-group-chat-modal_member-list">
              {group.members.map(
                ({ member }) => (
                  <GroupMemberItem
                    member={member}
                    onRemove={() => removeGroupMember(member)}
                  />
                )
              )}
            </div>
            <div className="d-flex justify-content-between">
              <Button
                disabled={!groupName || isDeleting}
                onClick={onDelete}
                color="secondary"
              >
                {isDeleting ? 'Deleting...' : 'Delete' }
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!groupName || isSaving}
              >
                {isSaving ? 'Updating...' : 'Update' }
              </Button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

EditGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  group: PropTypes.objectOf(PropTypes.any).isRequired
};

export default EditGroupModal;
