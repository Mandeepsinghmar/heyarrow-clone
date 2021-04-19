import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomIcon from '../common/CustomIcon';
import Input from '../common/Input';
import Button from '../common/Button';
import { addCustomerNote } from '../../api';

const AddNoteModal = ({
  toggle,
  isOpen
}) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const customerId = useParams()?.customerId;
  const [isSaving, setIsSaving] = useState(false);

  const addNote = () => {
    setIsSaving(true);
    dispatch(addCustomerNote({
      note,
      customerId,
    })).finally(() => {
      setIsSaving(false);
      toggle();
      setNote('');
    });
  };

  useEffect(() => {
    setNote('');
  }, [isOpen]);

  return (
    <Modal
      toggle={toggle}
      isOpen={isOpen}
      centered
      className="add-customer-modal"
    >
      <ModalHeader>
        <span className="heading">
          Add Note
        </span>
        <IconButton size="small">
          <CustomIcon icon="Close" onClick={toggle} />
        </IconButton>
      </ModalHeader>
      <ModalBody>
        <form className="add-note-form">
          <Input
            multiline
            fullWidth
            label="Write a note"
            rows="15"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
          <div className="button-group">
            <Button
              color="secondary"
              type="button"
              onClick={toggle}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!note || isSaving}
              onClick={addNote}
            >
              Save
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

AddNoteModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default AddNoteModal;
