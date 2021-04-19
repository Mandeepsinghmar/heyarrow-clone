import React, { useState } from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import './index.scss';

const UploadCategoryCampaign = ({
  data,
  onChange,
  disabled = false,
  value,
  placeholder,
  className,

}) => {
  const [_value, setvalue] = useState(value);
  // const [apiResponse, setApiResponse] = useState({});

  // useEffect(() => {
  //   axios.get('https://us-central1-arrow-bravo-team-dev-env.cloudfunctions.net/campaigns/list')
  //     .then((response) => setApiResponse(response.data.campaignList));
  // }, []);

  const getDisplayLabel = () => {
    const label = data?.find((dataItem) => dataItem.value === _value)?.label;
    return label || placeholder;
  };

  const onChangeHandler = (newValue) => {
    setvalue(newValue);
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };

  return (
    <>
      <UncontrolledDropdown className={`category-dropdown-campaign ${className}`}>
        <DropdownToggle disabled={disabled}>
          {getDisplayLabel()}
        </DropdownToggle>
        <DropdownMenu>

          {data?.map((dataItem) => (
            <DropdownItem
              disabled={_value === dataItem.value}
              onClick={() => onChangeHandler(dataItem.value)}
              key={dataItem.value}
            >
              {dataItem.label}
            </DropdownItem>
          ))}

        </DropdownMenu>

      </UncontrolledDropdown>
    </>

  );
};

UploadCategoryCampaign.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

UploadCategoryCampaign.defaultProps = {
  onChange: () => {},
  disabled: false,
  value: '',
  placeholder: '',
  className: ''
};

export default UploadCategoryCampaign;
