import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { IconButton } from '@material-ui/core';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProfileInitials from '../common/ProfileInitials';
import Loader from '../common/Loader';
import AddNoteModal from './AddNoteModal';
import EditNoteModal from './EditNoteModal';
import { deleteCustomerNote } from '../../api';

const Notes = ({
  fromCustomersDetails
}) => {
  const { notes } = useSelector((state) => state.customers);
  const [isAddNoteModal, setAddNoteModal] = useState(false);
  const [isEditNoteModal, setIsEditNoteModal] = useState(false);
  const dispatch = useDispatch();
  const [editableNote, setEditableNote] = useState({});

  const toggleIsAddNoteModal = () => {
    setAddNoteModal(!isAddNoteModal);
  };

  const toggleIsEditNoteModal = () => {
    setIsEditNoteModal(!isEditNoteModal);
  };

  const deleteNote = (noteId) => {
    dispatch(deleteCustomerNote(noteId));
  };

  return (
    <div className="customer-notes-container">
      <div className="flex justify-between customer-notes__header">
        <h3>Notes</h3>
        <CustomIcon
          className="cursor-pointer"
          icon="Add"
          onClick={toggleIsAddNoteModal}
        />
      </div>
      {notes.loading && <Loader secondary />}
      {!notes.loading && notes.data.map((note) => (
        <div className="customer-notes__list">
          <div className={`customer-notes__list-item ${fromCustomersDetails ? 'custNotes-list' : ''}`}>
            <p>{note.note}</p>
            <div className="flex justify-between items-center">
              <span className="customer-notes__time">{moment(note.createdAt).format('ll')}</span>
              <div className="flex">
                <UncontrolledDropdown className="moreOptionsCon">
                  <DropdownToggle>
                    <IconButton
                      size="small"
                    >
                      <CustomIcon icon="More" />
                    </IconButton>
                  </DropdownToggle>
                  <DropdownMenu>
                    <div>
                      <DropdownItem
                        onClick={() => {
                          setEditableNote(note);
                          toggleIsEditNoteModal();
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem onClick={() => deleteNote(note.id)}>
                        Delete
                      </DropdownItem>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <ProfileInitials
                  firstName={note.createdBy.firstName}
                  lastName={note.createdBy.lastName}
                  size="small"
                  profileUrl={note.createdBy.profileUrl}
                  profileId={note.createdBy.id}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      {!notes.loading && !notes.data.length && <center>No notes found!</center>}
      <AddNoteModal
        isOpen={isAddNoteModal}
        toggle={toggleIsAddNoteModal}
      />
      <EditNoteModal
        isOpen={isEditNoteModal}
        toggle={toggleIsEditNoteModal}
        noteObject={editableNote}
      />
    </div>
  );
};

Notes.propTypes = {
  fromCustomersDetails: PropTypes.bool.isRequired
};

export default Notes;
