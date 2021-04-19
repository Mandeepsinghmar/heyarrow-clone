import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DOMAIN } from '../../constants';
import CbopsTemplate from './Cbops';
import ATTemplate from './AT';
import { getQuotePreview, markProductAsQuoted } from '../../api';

const TemplateModal = ({
  isOpen,
  toggle,
  location,
  quotedPrice,
  shippingPrice,
  product,
  toggleCreateModal
}) => {
  const { client } = useSelector((state) => state);
  const { quotePreview } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const { customerId } = useParams();
  const search = queryString.parse(location.search);
  const [amount, setAmount] = useState(quotedPrice || search.amount);
  const [shipping, setShipping] = useState(shippingPrice || search.shipping);
  const [productId, setProductId] = useState(product || search.productId);
  const history = useHistory();

  useEffect(() => {
    const body = {
      amount,
      shipping,
      productId,
      customerId
    };
    if (isOpen) {
      dispatch(getQuotePreview(body));
    }
  }, [amount, shipping, productId, isOpen]);

  useEffect(() => {
    setAmount(quotedPrice);
    setShipping(shippingPrice);
    setProductId(product);
  }, [quotedPrice, shippingPrice, productId]);

  const onSend = () => {
    const body = {
      amount,
      shipping,
      productId,
      customerId,
      via: 1
    };
    setSending(true);
    dispatch(markProductAsQuoted(body)).then(() => {
      setSending(false);
      toast.success('Quote sent successfully');
      history.push({
        pathname: `/customers/${customerId}`,
        search: '?status=quoted'
      });
    }).catch(() => {
      toast.error('Quote failed!');
      setSending(false);
    }).finally(() => {
      toggle();
      toggleCreateModal();
    });
  };

  return (
    <Modal
      className="postDetailModal"
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalBody>
        {DOMAIN === 'cbops' ? (
          <CbopsTemplate
            quotePreview={quotePreview}
            goBack={toggle}
            client={client}
            onSend={onSend}
            sending={sending}
          />
        ) : (
          <ATTemplate
            quotePreview={quotePreview}
            goBack={toggle}
            client={client}
            onSend={onSend}
            sending={sending}
          />
        ) }
      </ModalBody>
    </Modal>
  );
};

TemplateModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any),
  quotedPrice: PropTypes.number,
  shippingPrice: PropTypes.number,
  product: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  toggleCreateModal: PropTypes.func
};

TemplateModal.defaultProps = {
  isOpen: false,
  location: {},
  quotedPrice: null,
  shippingPrice: null,
  product: null,
  toggleCreateModal: () => {}
};

export default TemplateModal;
