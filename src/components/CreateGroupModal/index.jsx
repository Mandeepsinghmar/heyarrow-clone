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
import { getAllUsers, createChatGroup } from '../../api';
import getFullName from '../../utils/getFullName';
import Loader from '../common/Loader';
import { clearAllUsers, initialChatWithGroup } from '../../redux/actions';

const CreateGroupModal = ({
  isOpen,
  toggle,
  admin
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.team);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [groupMembers, setGroupMembers] = useState([{
    ...currentUser,
  }]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    search: ''
  });
  const history = useHistory();
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

  const onSubmit = () => {
    setIsSaving(true);
    dispatch(createChatGroup({
      name: groupName,
      details: description,
      members: groupMembers.map((member) => member.id)
    })).then((data) => {
      dispatch(initialChatWithGroup({
        groupName,
        message: '',
        updatedAt: new Date(),
        groupId: data?.cg?.id
      }));
      toggle();
      setIsSaving(false);
      setGroupName('');
      setDescription('');
      history.push(`${admin ? '/admin' : '' }/chats/groups/${data?.cg?.id}`);
    });
  };

  const addGroupMember = (member) => {
    setGroupMembers([...groupMembers, member]);
  };

  const isSelected = (user) => groupMembers
    .find((member) => user.id === member.id);

  const removeGroupMember = (user) => {
    setGroupMembers((members) => members
      .filter((member) => member.id !== user.id));
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
              <h1>Create group</h1>
              <IconButton
                size="small"
                onClick={toggle}
              >
                <CustomIcon icon="Close" />
              </IconButton>
            </div>
            <div>
              <CustomIcon icon="Placeholder/Group/Medium" />
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
              {groupMembers.map(
                (member) => (
                  <GroupMemberItem
                    member={member}
                    onRemove={() => removeGroupMember(member)}
                  />
                )
              )}
            </div>
            <Button
              className="self-end"
              onClick={onSubmit}
              disabled={!groupName || isSaving}
            >
              {isSaving ? 'Creating' : 'Create' }
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

CreateGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  admin: PropTypes.bool
};

CreateGroupModal.defaultProps = {
  admin: false
};

export default CreateGroupModal;
