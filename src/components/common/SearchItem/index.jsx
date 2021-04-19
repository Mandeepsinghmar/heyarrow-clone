import React from 'react';
import PropTypes from 'prop-types';

import getFullName from '../../../utils/getFullName';
import ProfileInitials from '../ProfileInitials';
import CustomIcon from '../CustomIcon';

const SearchItem = ({
  item = {},
  onClick,
  icon
}) => (
  <div
    className="flex search-list-item justify-between"
    onClick={onClick}
  >
    <div className="flex">
      <ProfileInitials
        firstName={item.firstName}
        lastName={item.lastName}
        profileId={item.id}
        size="small"
      />
      <div className="search-list-item-text">
        {getFullName(item)}
      </div>
    </div>
    <div className="search-list-item-action">
      <CustomIcon icon={icon} />
    </div>
  </div>
);

SearchItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.string
};

SearchItem.defaultProps = {
  onClick: () => {},
  icon: ''
};

export default SearchItem;
