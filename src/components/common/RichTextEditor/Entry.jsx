import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '../ListItem';
import getFullName from '../../../utils/getFullName';

const Entry = ({
  mention,
  ...parentProps
}) => (
  <div
    {...parentProps}
  >
    <ListItem
      profile={mention}
      hideAction
      title={getFullName(mention)}
      subTitle={mention?.role?.name}
    />
  </div>
);

Entry.propTypes = {
  mention: PropTypes.objectOf(PropTypes.any)
};

Entry.defaultProps = {
  mention: {}
};

export default Entry;
