import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import { addProductComment } from '../../api';
import MentionInput from '../common/MentionTextBox';

const CommentInput = ({
  productId,
  sold
}) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const onSave = (e) => {
    const category = sold ? 'soldProducts' : 'availableProducts';
    e.preventDefault();
    const body = {
      productId,
      comment,
    };
    dispatch(addProductComment(body, category));
    setComment('');
  };

  return (
    <form className="comment-input-mention">
      <MentionInput
        value={comment}
        placeholder="Add a comment..."
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSave(e);
          }
        }}
        singleLine={false}
      />
      <div className="send-button">
        <IconButton
          size="small"
          disabled={!comment}
          onClick={onSave}
          type="submit"
        >
          <CustomIcon icon="Send-Enabled" />
        </IconButton>
      </div>
    </form>
  );
};

CommentInput.propTypes = {
  productId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  sold: PropTypes.bool
};

CommentInput.defaultProps = {
  sold: false,
};

export default CommentInput;
