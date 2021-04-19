/* eslint-disable */
import React from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const dropDown = ({
  options,
  optionsToChooseFrom,
  key,
  index,
  isNewItem = false,
  value
}) => (
  <UncontrolledDropdown
    id={`id-${key}-${index}`}
    className="tableOptions"
  >
    <DropdownToggle>{isNewItem ? 'Select' : value && value.status}</DropdownToggle>
    <DropdownMenu>
      {optionsToChooseFrom[options]
            && optionsToChooseFrom[options].map((item, i) => (
              <DropdownItem
                key={`${item.label}-${i}`}
                value={item.value}
              >
                {item.label}
              </DropdownItem>
            ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default dropDown;
