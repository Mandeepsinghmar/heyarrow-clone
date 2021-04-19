import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import CustomIcon from '../common/CustomIcon';
import Input from '../common/Input';
import Button from '../common/Button';
import { updateCustomerNote } from '../../api';

const EditNoteModal = ({ toggle, isOpen, noteObject }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState(noteObject?.note);
  const [isSaving, setIsSaving] = useState(false);

  const editNote = () => {
    setIsSaving(true);
    dispatch(
      updateCustomerNote(noteObject.id, {
        note,
      })
    ).finally(() => {
      setIsSaving(false);
      toggle();
      setNote('');
    });
  };

  useEffect(() => {
    setNote(noteObject?.note);
  }, [noteObject]);

  return (
    <Modal
      toggle={toggle}
      isOpen={isOpen}
      centered
      className="add-customer-modal"
    >
      <ModalHeader>
        <span className="heading">Edit Note</span>
        <IconButton size="small">
          <CustomIcon icon="Close" onClick={toggle} />
        </IconButton>
      </ModalHeader>
      <ModalBody>
        <form className="add-note-form">
          <Input
            multiline
            fullWidth
            label="Edit a note"
            rows="15"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
          <div className="button-group">
            <Button color="secondary" type="button" onClick={toggle}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!note || isSaving}
              onClick={editNote}
            >
              Update
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

EditNoteModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  noteObject: PropTypes.objectOf(PropTypes.any).isRequired
};

export default EditNoteModal;
