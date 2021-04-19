/* eslint-disable */
import React, {
  useEffect,
  useState
} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

import CustomIcon from './CustomIcon';
import formatPhoneNumber from '../../utils/phoneNumberFormatter';

export default function CountryCodeDropDown(props) {
  const {
    options = [],
    isFilter = false,
    id = '',
    name,
    onChange,
    change,
    onKeyDown,
    onBlur,
    value = null,
    isEdit = false,
    item,
    index,
    readOnly,
  } = props;
  const [filtered, setFiltered] = useState(options);
  const [countryCode, setCountryCode] = useState('1');

  useEffect(() => {
    change({ target: { value: countryCode } }, 'countryCode', item, index);
    setFiltered(options);
  }, []);

  const filterData = (search) => {
    if (search !== '') {
      const temp = [];
      options
        && options.map((o) => {
          if (
            o[name].toLowerCase().includes(search.toLowerCase())
            || o.code.toLowerCase().includes(search.toLowerCase())
          ) {
            temp.push(o);
          }
        });
      setFiltered(temp);
    } else {
      setFiltered(options);
    }
  };
  function numberOnly(e,id) {
    var e = document.getElementById(id);
    e.value = e.value.replace(/[^0-9]/gi);
}
  return (
    <div>
      {/* eslint-disable-next-line no-constant-condition */}
      {true ? (
        <div style={{ display: 'inline', justifyContent: 'space-between'}}>
          +
          {countryCode}
        </div>
      ) : (
        <UncontrolledDropdown id={id} className="tableOptions dropdown_wrapper">
          <DropdownToggle>
            <div>
              +
              {countryCode}
            </div>
          </DropdownToggle>
          <DropdownMenu>
            {isFilter && (
              <div className="searchTabs">
                <CustomIcon icon="Search" />
                <input
                  className="form-control"
                  autoComplete="false"
                  autoCapitalize="off"
                  type="text"
                  onChange={(e) => {
                    filterData(e.target.value, name);
                  }}
                />
              </div>
            )}
            {options.length > 0 && filtered.length > 0 ? (
              filtered.map((data, i) => (
                <DropdownItem
                  key={i}
                  onClick={() => {
                    change(
                      { target: { value: data.code } },
                      'countryCode',
                      item,
                      index
                    );
                    setCountryCode(data.code);
                  }}
                >
                  <img
                    src={`https://www.countryflags.io/${data.country_code}/flat/24.png`}
                    style={{ height: 25, marginRight: 10 }}
                    alt={data.label}
                  />
                  {data.label}
                  {' '}
                  +
                  {data.code}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem>No record</DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
      &nbsp;&nbsp;&nbsp;
      {readOnly ? (
        value
          .substr(value.length - 10)
          .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      ) : (
        <input
          style={{display: 'inline-block'}}
          readOnly={readOnly}
          type="number"
          className={isEdit ? 'editingInput phone-number' : 'form-control phone-number'}
          name="phone"
          max="10"
          min="10"
          value={value ? (value) : ''}
          autoComplete="off"
          onBlur={(e) => {
            change(
              { target: { value: countryCode } },
              'countryCode',
              item,
              index
            );
            onBlur(e, countryCode);
          }}
          onKeyDown={(e) => {
            change(
              { target: { value: countryCode } },
              'countryCode',
              item,
              index
            );
            onKeyDown(e, countryCode);
          }}
          onChange={(e) => {
            change(
              { target: { value: countryCode } },
              'countryCode',
              item,
              index
            );
            onChange(e, countryCode);
          }}
          placeholder="Phone number"
        />
      )}
    </div>
  );
}
