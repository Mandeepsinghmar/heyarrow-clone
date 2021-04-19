/* eslint-disable */
import React from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import CustomIcon from '../CustomIcon';
import ProfileInitial from '../ProfileInitials';
import { useDispatch } from 'react-redux';
import { deleteProductComment } from '../../../api/adminProducts';
import TextWithMention from '../TextWithMention';

const ProductComment = (props) => {
  const dispatch = useDispatch();
  const { comment } = props;

  const deleteComment = (comment) => {
      dispatch(deleteProductComment(comment, comment.id));
  }
  const userData = JSON.parse(localStorage.getItem('userData'));
  return (
    <>
      <li>
        <div className={userData.id === comment.user.id ? "userCard flex justify-end" : "userCard flex justify-start"}>
          <div className={userData.id !== comment.user.id ? "commentTabListOuter" : "commentTabListOuter commentTabListOuterAlternative"}>
            {userData.id !== comment.user.id ?
            <div className="userCon">
              <ProfileInitial
                firstName={comment.user.firstName}
                lastName={comment.user.lastName}
                profileId={comment.id}
                size="small"
              />
            </div> : null}
            {userData.id === comment.user.id ?
              <div className="rightIcon">
                <UncontrolledDropdown>
                  <DropdownToggle>
                    <button type="button" className="sendBtn">
                      <CustomIcon icon="Header/Icon/More" />
                    </button>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => deleteComment(comment)}>
                      <CustomIcon icon="Delete" />
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            : null}
            {userData.id === comment.user.id ? <div className="chat-message-list-item sent" style={{float:'right'}}> 
              <div className="mainOuterChat">
                <span>{moment(comment.createdAt).format('MM/DD/YYYY')}</span>
              </div>
              <p><TextWithMention text={comment.comment} /></p>
            </div>
            : <div className="commentTabList"> 
              <div className="mainOuterChat" >
                <p>{`${comment.user.firstName } ${ comment.user.lastName}`}</p>
                <span>{moment(comment.createdAt).format('MM/DD/YYYY')}</span>
              </div>
              <p><TextWithMention text={comment.comment} /></p>
            </div>}
          </div>
          {userData.id !== comment.user.id ?
            <div className="rightIcon">
              <UncontrolledDropdown>
                <DropdownToggle>
                  <button type="button" className="sendBtn">
                    <CustomIcon icon="Header/Icon/More" />
                  </button>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => deleteComment(comment)}>
                    <CustomIcon icon="Delete" />
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          : null}
        </div>
      </li>
    </>
  );
}

ProductComment.propTypes = {
  comment: PropTypes.object
};

export default ProductComment;
