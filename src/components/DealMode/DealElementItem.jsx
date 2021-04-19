import React, { useState } from 'react';
import { Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import CustomIcon from '../common/CustomIcon';
import DealDoc from './DealDoc';
import {
  uploadDocForDealElement,
} from '../../api';

const DealElementItem = ({
  dealElement,
  dealElementsDocs,
  id,
  togglePreviewModal,
  disabled
}) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const documentUploadHandler = (elementId, body) => {
    setUploading(true);
    dispatch(uploadDocForDealElement(elementId, body)).finally(() => {
      setUploading(false);
    });
  };

  const onUpload = (e, elementId) => {
    const body = new FormData();
    body.append('document', e.target.files[0]);
    documentUploadHandler(elementId, body);
  };

  const togglePreviewHandler = () => {
    if (dealElement.name === 'Purchase Order') {
      togglePreviewModal('purchase_order', id);
    } else {
      togglePreviewModal('quote', id);
    }
  };

  return (
    <div className="deal-element-item">
      {!dealElementsDocs.length
        ? <div className="radio" />
        : (
          <div>
            <CustomIcon icon="check" className="mr-1" />
          </div>
        )}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="h3-heading">{dealElement?.name}</h3>
          {dealElement?.name === 'Purchase Order' || dealElement?.name === 'Quote'
            ? (
              <button
                type="button"
                onClick={togglePreviewHandler}
                disabled={disabled}
              >
                Create
              </button>
            )
            : (
              <>
                <input
                  type="file"
                  id={`deal-element-${id}`}
                  hidden
                  onChange={(e) => onUpload(e, id)}
                  accept="application/pdf"
                  disabled={uploading || disabled}
                />
                <label
                  htmlFor={`deal-element-${id}`}
                  type="submit"
                  className={disabled && 'disabled'}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </label>
              </>
            )}
        </div>
        <Divider />
        <div className="deal-element-doc-list">
          {dealElementsDocs.map((doc) => (
            <DealDoc doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

DealElementItem.propTypes = {
  dealElement: PropTypes.objectOf(PropTypes.any),
  dealElementsDocs: PropTypes.arrayOf(PropTypes.any),
  id: PropTypes.string,
  togglePreviewModal: PropTypes.func,
  disabled: PropTypes.bool,
};

DealElementItem.defaultProps = {
  dealElement: {},
  dealElementsDocs: [],
  id: '',
  togglePreviewModal: () => {},
  disabled: false
};

export default DealElementItem;
