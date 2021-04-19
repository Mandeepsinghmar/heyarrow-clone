import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import Button from '../common/Button';
import ProductSearchItem from '../common/ProductSearchItem';
import { sendReminder } from '../../api';

const SendReminderModal = ({
  isOpen,
  toggle,
  soldProduct,
  product
}) => {
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    viaText: false,
    viaEmail: false,
  });
  const sendReminderHandler = () => {
    setIsSending(true);
    dispatch(sendReminder({
      ...form,
      productSoldId: Number(soldProduct?.productService?.productSoldId)
    })).finally(
      () => {
        setIsSending(false);
        toggle();
      }
    );
  };

  return (
    <Modal
      centered
      isOpen={isOpen}
      toggle={toggle}
      className="action-product-modal send-reminder-modal"
    >
      <ModalBody>
        <div className="action-product-modal__header flex justify-between">
          <h3>Send Reminder</h3>
          <CustomIcon className="cursor-pointer" icon="Close" onClick={toggle} />
        </div>
        <ProductSearchItem
          product={product}
        />
        <span className="due-date">
          Service due on
          {' '}
          {soldProduct?.productService?.dueDate ? moment(soldProduct?.productService?.dueDate).format('LL') : '-'}
        </span>
        <div className="flex justify-between items-center modal-end">
          <div>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="top">
                <FormControlLabel
                  value="end"
                  control={(
                    <Checkbox
                      color="primary"
                      onChange={() => setForm({
                        ...form,
                        viaEmail: !form.viaEmail
                      })}
                      checked={form.viaEmail}
                    />
                  )}
                  label="Via Email"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="end"
                  control={(
                    <Checkbox
                      color="primary"
                      onChange={() => setForm({
                        ...form,
                        viaText: !form.viaText
                      })}
                      checked={form.viaText}
                    />
                  )}
                  label="Via Message"
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            onClick={sendReminderHandler}
            disabled={isSending || (!form.viaText && !form.viaEmail)}
          >
            Send
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

SendReminderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  soldProduct: PropTypes.objectOf(PropTypes.any),
  product: PropTypes.objectOf(PropTypes.any)
};

SendReminderModal.defaultProps = {
  soldProduct: {},
  product: {}
};

export default SendReminderModal;
