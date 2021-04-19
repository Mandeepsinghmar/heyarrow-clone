import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';

import './index.scss';
import fullName from '../../../utils/getFullName';
import CustomIcon from '../CustomIcon';
import ProfileInitial from '../ProfileInitials';

const CustomerListItem = ({
  item,
  onClick,
  actionButtonIcon,
  action,
  hideAction,
  tooltip = '',
  redirect = true
}) => (
  <li onClick={() => onClick && onClick()}>
    <a className="flex justify-between">
      <Link to={redirect ? `/customers/${item.id}` : '#'} className="list-item flex-1">
        <ProfileInitial
          firstName={item.firstName}
          lastName={item.lastName}
          size="small"
          profileId={item.id}
        />
        <span className="list-item-title flex-1">
          {fullName(item)}
        </span>
      </Link>
      {item.newLead
      && <span className="new-lead">New lead</span> }
      {!hideAction && (
        <Tooltip placement="right" title={tooltip}>
          <i onClick={action}>
            <CustomIcon icon={actionButtonIcon} />
          </i>
        </Tooltip>
      )}
    </a>
  </li>
);

CustomerListItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ])).isRequired,
  actionButtonIcon: PropTypes.string,
  action: PropTypes.func,
  hideAction: PropTypes.bool,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  redirect: PropTypes.bool
};

CustomerListItem.defaultProps = {
  actionButtonIcon: '',
  action: () => {},
  hideAction: true,
  tooltip: '',
  onClick: () => {},
  redirect: true,
};

export default CustomerListItem;
