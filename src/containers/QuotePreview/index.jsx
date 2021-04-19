import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import './index.scss';
import { getQuotePreview, markProductAsQuoted } from '../../api';
import CbopsTemplate from './Cbops';
import ATTemplate from './AT';
import { DOMAIN } from '../../constants';

const QuotePreview = ({
  location
}) => {
  const { client } = useSelector((state) => state);
  const { quotePreview } = useSelector((state) => state.customers);
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const history = useHistory();
  useEffect(() => {
    const { amount, shipping, productId } = queryString.parse(location.search);
    const body = {
      amount,
      shipping,
      productId,
      customerId
    };
    dispatch(getQuotePreview(body));
  }, []);

  const goBack = () => {
    history.push(`/customers/${customerId}?status=quoted`);
  };

  const onSend = () => {
    const { amount, shipping, productId } = queryString.parse(location.search);
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
      goBack();
      toast.success('Quote sent successfully');
    }).catch(() => {
      toast.error('Quote failed!');
      setSending(false);
    });
  };

  if (DOMAIN === 'cbops') {
    return (
      <CbopsTemplate
        quotePreview={quotePreview}
        goBack={goBack}
        client={client}
        onSend={onSend}
        sending={sending}
      />
    );
  }
  return (
    <ATTemplate
      quotePreview={quotePreview}
      goBack={goBack}
      client={client}
      onSend={onSend}
      sending={sending}
    />
  );
};

QuotePreview.propTypes = {
  location: PropTypes.objectOf(PropTypes.any)
};

QuotePreview.defaultProps = {
  location: {}
};

export default QuotePreview;
