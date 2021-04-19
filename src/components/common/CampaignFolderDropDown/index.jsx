import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import './index.scss';
import Archive from '../../../assets/Icons/Header/Icon/Archive.svg';
// import ArchiveIcon from '../../../assets/Icons/Header/Icon/ArchiveIcon.svg';

const CampaignFolderDropDown = ({
  data,
  onChange,
  disabled = false,
  value,
  placeholder,
  className,
  SearchFilterData,
  CheckFolderOpen,
}) => {
  const [_value, setvalue] = useState(value);
  const [_isOpen, setOpen] = useState(true);
  const getDisplayLabel = () => placeholder;

  const onChangeHandler = (newValue) => {
    SearchFilterData('', '', '', newValue);
    setvalue(newValue);
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  const toggle = (e) => {
    setOpen(!e);
    CheckFolderOpen(!e);
  };
  return (
    <UncontrolledDropdown isOpen={_isOpen} className={`custom-dropdown-pinned ${className}`}>
      <DropdownToggle disabled={disabled} onClick={() => toggle(_isOpen)}>
        {getDisplayLabel()}
      </DropdownToggle>
      <DropdownMenu>
        {data.length > 0
          ? data.map((dataItem) => (
            <DropdownItem
              disabled={_value === dataItem.id}
              onClick={() => onChangeHandler(dataItem.id)}
              key={dataItem.id}
            >
              <div className="successful-folder">
                <span className={_value === dataItem.id ? 'successful-folder_button successful-folder_button-active' : 'successful-folder_button'}>
                  <img className="successful-folder_img" src={Archive} alt="archive" />
                  {dataItem.name}
                </span>
              </div>
            </DropdownItem>
          ))
          : (
            <>
            </>
          )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

CampaignFolderDropDown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  SearchFilterData: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  CheckFolderOpen: PropTypes.func,
};

CampaignFolderDropDown.defaultProps = {
  onChange: () => { },
  SearchFilterData: () => { },
  disabled: false,
  value: '',
  placeholder: '',
  className: '',
  CheckFolderOpen: () => { }
};

export default CampaignFolderDropDown;
