import React, { useState } from 'react';
import { ModalBody, Modal, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import Input from '../common/Input';
import Button from '../common/Button';
import { changePassword } from '../../api';

const ChangePasswordModal = ({
  isOpen,
  toggle
}) => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    dispatch(changePassword({
      oldPassword,
      newPassword,
    })).finally(() => {
      setIsSaving(false);
      toggle();
    });
  };

  const isValid = () => oldPassword.length
  && newPassword.length
  && (newPassword === confirmPassword);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="add-customer-modal"
    >
      <ModalHeader>
        <span className="heading">
          Change password
        </span>
        <CustomIcon icon="Close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="change-password-form">
          <Input
            label="Enter current password"
            fullWidth
            type="password"
            className="change-password__input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            label="Enter new password"
            fullWidth
            type="password"
            className="change-password__input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            fullWidth
            type="password"
            className="change-password__input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <Button
            type="submit"
            className="btn-block change-password__button"
            onClick={onSubmit}
            disabled={!isValid() || isSaving}
          >
            Change password
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default ChangePasswordModal;
