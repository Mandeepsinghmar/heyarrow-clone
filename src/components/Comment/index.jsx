import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import './index.scss';
import CustomMenu from '../common/CustomMenu';
import CustomIcon from '../common/CustomIcon';
import getFullName from '../../utils/getFullName';
import TextWithMention from '../common/TextWithMention';
import { deleteProductComment } from '../../api';
import { canDeleteComment } from '../../utils/checkPermission';

const Comment = ({
  comment,
  sold,
  productId
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const deleteCommentHandler = () => {
    const category = sold ? 'soldProducts' : 'availableProducts';
    dispatch(deleteProductComment(comment.id, category, productId));
    toggleIsOpen();
  };

  return (
    <>
      <div className="product-comment-list items-start">
        <div className="flex flex-1">
          <span className="product-comment-user">{`${getFullName(comment.user)}:`}</span>
          <span className="flex-1"><TextWithMention text={comment.comment} /></span>
        </div>
        <span className="flex align-center">
          <span className="product-comment-time">
            {moment(comment.createdAt).fromNow()}
          </span>
          <span>
            {canDeleteComment()
              && (
                <CustomMenu
                  titleComponent={<CustomIcon icon="More" />}
                  isOpen={isOpen}
                  toggleIsOpen={toggleIsOpen}
                >
                  <div>
                    <MenuItem onClick={deleteCommentHandler}>
                      <CustomIcon icon="Delete" />
                      <span className="menu-caption">Delete</span>
                    </MenuItem>
                  </div>
                </CustomMenu>
              ) }
          </span>
        </span>
      </div>
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  sold: PropTypes.bool,
  productId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

Comment.defaultProps = {
  sold: false
};

export default Comment;
