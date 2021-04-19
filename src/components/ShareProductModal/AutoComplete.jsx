/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import NoSsr from '@material-ui/core/NoSsr';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import ListItem from '../common/ListItem';
import getFullName from '../../utils/getFullName';
import Chip from '../common/Chip';

const Listbox = styled('ul')`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

export default function AutoComplete({
  selected,
  onChange,
  onSearch,
  shareType
}) {
  const { allCustomers } = useSelector((state) => state.customers);
  const [options, setOptions] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    setOptions(allCustomers.data);
  }, [allCustomers]);
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    value,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options,
    getOptionLabel: (option) => getFullName(option),
    value: selected,
    onChange: (e, valu) => onChange(valu)
  });

  const searchHandler = async (e) => {
    if (!e.target.value) {
      setOptions([]);
      setFlag(false);
    } else {
      setFlag(true);
      await onSearch(e);
    }
  };

  return (
    <NoSsr>
      <div>
        <div {...getRootProps()}>
          <div ref={setAnchorEl} className="flex flex-wrap">
            {value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                profile={option}
                title={getFullName(option)}
                label={option.firstName}
              />
            ))}
            <input
              {...getInputProps()}
              onChange={(e) => {
                getInputProps().onChange(e);
                searchHandler(e);
              }}
              placeholder="Name or email"
            />
          </div>
        </div>
        {flag ? (
          <Listbox {...getListboxProps()}>
            {options.map((option, index) => (
              <ListItem
                profile={option}
                title={getFullName(option)}
                {...getOptionProps({ option, index })}
                subTitle={shareType === 'email' ? option.email : option.phone}
              />
            ))}
          </Listbox>
        ) : null}
      </div>
    </NoSsr>
  );
}

AutoComplete.propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.objectOf),
  onSearch: PropTypes.func,
  shareType: PropTypes.string
};

AutoComplete.defaultProps = {
  onChange: () => {},
  selected: [],
  onSearch: () => {},
  shareType: 'email'
};
