import React from 'react';
import PropTypes from 'prop-types';

import CustomIcon from '../CustomIcon';
import './index.scss';

const InputAttachment = ({
  file,
  url,
  onClose
}) => (
  <div className="chat-input-attachment">
    <div className="chat-input-attachment__img">
      {file?.type?.split('/')[0] === 'image' ? <img src={url} alt="" />
        : <CustomIcon icon="file" />}
    </div>
    <span className="chat-input-attachment__name">{file?.name}</span>
    <CustomIcon
      icon="Close"
      className="cursor-pointer"
      onClick={() => onClose()}
    />
  </div>
);

InputAttachment.propTypes = {
  file: PropTypes.objectOf(PropTypes.any),
  url: PropTypes.string,
  onClose: PropTypes.func
};

InputAttachment.defaultProps = {
  file: {},
  url: '',
  onClose: () => {}
};

export default InputAttachment;
