/* eslint-disable */
import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomIcon from '../CustomIcon';

export const RenderActions = ({ item, index, saveBtn, removeRow, tableActions, openQuotedInfo }) => {
  return (
    <>
      {item.isNewItem ? (
        <div className="table-actions alwaysShow">
          {saveBtn && saveBtn(item, index)}
          <button className="sendBtn" onClick={() => removeRow(index)}>
            <i className="fa fa-times" />
          </button>
        </div>
      ) : typeof tableActions === 'function' ? (
        tableActions(item, index)
      ) : (
        <UncontrolledDropdown className="moreOptionsCon">
          <DropdownToggle style={{ border: 'unset' }}>
            <button type="button" className="sendBtn">
              <CustomIcon icon="Header/Icon/More" />
            </button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                removeRow({
                  id: item.id,
                  customerId: item.customerId,
                  productId: item.productId,
                });
              }}
            >
              Remove Tag
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </>
  );
};

RenderActions.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  saveBtn: PropTypes.func,
  removeRow: PropTypes.func,
  onSave: PropTypes.func,
  tableActions: PropTypes.any,
};
