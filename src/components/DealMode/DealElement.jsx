import React, { useState, useEffect } from 'react';
import {
  Divider,
  Checkbox,
  IconButton
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import CustomIcon from '../common/CustomIcon';

const DealElement = ({
  checked,
  onChange,
  element,
  isDefault,
  onDelete,
  onEdit
}) => {
  const [value, setValue] = useState(element.name);
  const editHandler = () => {
    onEdit({
      ...element,
      name: value
    });
  };

  useEffect(() => {
    editHandler();
  }, [value]);

  return (
    <>
      <div className="deal-element">
        <Checkbox
          size="small"
          checked={checked}
          onChange={onChange}
        />
        { isDefault ? (
          <span>
            {element.name}
          </span>
        ) : (
          <>
            <input
              className="input-element"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <UncontrolledDropdown className="moreOptionsCon">
              <DropdownToggle>
                <IconButton
                  size="small"
                >
                  <CustomIcon icon="more-vertical" />
                </IconButton>
              </DropdownToggle>
              <DropdownMenu>
                <div>
                  <DropdownItem onClick={onDelete}>
                    Delete
                  </DropdownItem>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        ) }
      </div>
      <Divider />
    </>
  );
};

DealElement.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  element: PropTypes.objectOf(PropTypes.any).isRequired,
  isDefault: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

DealElement.defaultProps = {
  isDefault: true,
  onDelete: () => {},
  onEdit: () => {}
};

export default DealElement;
