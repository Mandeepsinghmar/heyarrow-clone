import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import CustomIcon from '../common/CustomIcon';
import {
  getSignedDocumentUrl
} from '../../api';

const DealDoc = ({
  doc
}) => {
  const dispatch = useDispatch();
  const [previewing, setPreviewing] = useState(false);
  const [signedUrl, setSignedUrl] = useState(doc.signedUrl);

  const openPreview = (url) => {
    window.open(`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`, '_blank');
  };
  const getSignedUrl = () => {
    setPreviewing(true);
    dispatch(getSignedDocumentUrl(doc.id)).then((data) => {
      openPreview(data.signedUrl);
      setSignedUrl(data.signedUrl);
    }).finally(() => {
      setPreviewing(false);
    });
  };

  const onPreview = () => {
    if (!signedUrl) {
      getSignedUrl();
    } else {
      openPreview(signedUrl);
    }
  };

  return (
    <div className="flex justify-between mb-2">
      <div className="flex">
        <div
          className="flex document-file-icon"
        >
          <CustomIcon icon="pdf" />
        </div>
        <div className="flex column document-preview-details">
          <span>{doc.filename || doc.gcsFilename}</span>
          <span className="time">{`Sent on ${moment(doc.createdAt).format('MM/DD/YYYY')}`}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onPreview}
      >
        {previewing ? 'Previewing...' : 'Preview'}
      </button>
    </div>
  );
};

DealDoc.propTypes = {
  doc: PropTypes.objectOf(PropTypes.any)
};

DealDoc.defaultProps = {
  doc: {}
};

export default DealDoc;
