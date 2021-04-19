import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  InputAdornment
} from '@material-ui/core';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import ProductSearchItem from '../common/ProductSearchItem';
import Input from '../common/Input';
import Button from '../common/Button';
import {
  markProductAsSold,
  markProductAsClosed,
} from '../../api';

const MarkProductModal = ({
  isOpen,
  toggle,
  sales = {},
  status,
}) => {
  const dispatch = useDispatch();
  const [soldDate, setSoldDate] = useState(new Date());
  const [closedDate, setClosedDate] = useState(new Date());
  const [
    serviceDue,
    setServiceDue] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [soldPrice, setSoldPrice] = useState(sales?.amount
     + (sales?.shipping ? sales.shipping : 0));
  const [marking, setMarking] = useState(false);
  const history = useHistory();

  const onSend = () => {
    setMarking(true);
    if (status === 'Sold') {
      dispatch(markProductAsSold({
        productQuotedId: sales?.id,
        amount: soldPrice,
        purchaseDate: moment(soldDate).format('YYYY-MM-DD')
      })).then(() => {
        setMarking(false);
        toggle();
        toast.success('Product marked as sold');
        history.push({
          pathname: '',
          search: '?status=sold'
        });
      });
    } else {
      dispatch(markProductAsClosed({
        productSoldId: sales?.id,
        closeDate: moment(closedDate).format('YYYY-MM-DD'),
        serviceDue: moment(serviceDue).format('YYYY-MM-DD')
      })).then(() => {
        setMarking(false);
        toggle();
        toast.success('Product marked as closed');
        history.push({
          pathname: '',
          search: '?status=closed'
        });
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="action-product-modal"
    >
      <ModalBody>
        <div className="action-product-modal__header flex justify-between">
          <h3>{`Mark as ${status}`}</h3>
          <CustomIcon className="cursor-pointer" icon="Close" onClick={toggle} />
        </div>
        <ProductSearchItem
          amount={sales.amount + (sales.shipping ? sales.shipping : 0)}
          product={sales?.product}
        />
        {status === 'Sold'
          ? (
            <div className="input-group mark-product__inputs">
              <Input
                className="half-size"
                type="text"
                label="Sold Price"
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <Input
                className="half-size"
                type="date"
                label="Sold Date"
                onChange={(e) => setSoldDate(new Date(e.target.value))}
                value={moment(soldDate).format('YYYY-MM-DD')}
              />
            </div>
          ) : (
            <div className="input-group mark-product__inputs">
              <Input
                className="half-size"
                type="date"
                label="Close Date"
                onChange={(e) => setClosedDate(new Date(e.target.value))}
                value={moment(closedDate).format('YYYY-MM-DD')}
              />
              <Input
                className="half-size"
                type="date"
                label="Service Due"
                onChange={(e) => setServiceDue(new Date(e.target.value))}
                value={moment(serviceDue).format('YYYY-MM-DD')}
              />
            </div>
          )}
        <div className="flex justify-end">
          <Button
            onClick={onSend}
            disabled={marking}
          >
            {`Mark as ${status}`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

MarkProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  sales: PropTypes.objectOf(PropTypes.any).isRequired,
  status: PropTypes.string.isRequired
};

export default MarkProductModal;
