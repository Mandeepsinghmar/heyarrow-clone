import React from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  IconButton
} from '@material-ui/core';

import CustomIcon from '../CustomIcon';

const Attachment = ({ asset }) => {
  if (asset.fileType.split('/')[0] === 'image') {
    return (
      <img
        src={asset.url}
        alt="img-attachment"
      />
    );
  }
  return (
    <div className="attachment">
      <CustomIcon icon="File" />
      <span className="attachment-name">{asset.fileName}</span>
      <UncontrolledDropdown className="moreOptionsCon">
        <DropdownToggle>
          <IconButton
            size="small"
          >
            <CustomIcon icon="More" />
          </IconButton>
        </DropdownToggle>
        <DropdownMenu>
          <a href={asset.url} download>
            <DropdownItem>
              Download
            </DropdownItem>
          </a>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

Attachment.propTypes = {
  asset: PropTypes.objectOf(PropTypes.any)
};

Attachment.defaultProps = {
  asset: {}
};

export default Attachment;
