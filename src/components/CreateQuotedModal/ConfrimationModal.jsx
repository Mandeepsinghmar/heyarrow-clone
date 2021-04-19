import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Button from '../common/Button';

const ConfirmationModal = ({
  isOpen,
  toggle,
  onConfirm
}) => (
  <Modal
    isOpen={isOpen}
    toggle={toggle}
    centered
    style={{ width: '400px' }}
  >
    <ModalHeader style={{ maxHeight: 'unset' }}>
      Confirmation
    </ModalHeader>
    <ModalBody>
      <h3 style={{ marginTop: '20px', fontWeight: 500, fontSize: '13px' }}>Are you sure you want cancel the Quote?</h3>
      <div style={{ marginTop: '36px' }} className="flex justify-end">
        <Button onClick={toggle} color="secondary">
          Continue
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          color="danger"
          onClick={onConfirm}
        >
          Cancel Quote
        </Button>
      </div>
    </ModalBody>
  </Modal>
);

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default ConfirmationModal;
