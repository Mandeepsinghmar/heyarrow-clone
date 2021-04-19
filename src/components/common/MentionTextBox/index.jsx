/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import './index.scss';
import { getMentions } from '../../../api';
import { clearAllUsers } from '../../../redux/actions';
import ListItem from '../ListItem';

const defaultStyle = {
  highlighter: {
    padding: '0.375rem 2.9rem 0.37rem 20px',
    fontSize: '14px',
    height: '100%',
  },
  suggestions: {
    marginTop: '30px',
    zIndex: 200,
    list: {
      backgroundColor: '#fff',
    },
    item: {
      padding: '5px 15px',
      borderRadius: '4px',
      '&focused': {
        backgroundColor: '#f7f7f7',
        color: '#196EE5',
      },
    },
  },
};

const MentionInput = ({
  onChange,
  value,
  placeholder,
  singleLine = 'true',
  onKeyPress
}) => {
  const [innerValue, setValue] = useState(value);
  const dispatch = useDispatch();
  const { mentions } = useSelector((state) => state.common);
  const [mentionTriggered, setMentionTriggered] = useState(false);

  const searchUsers = useCallback(debounce((text) => {
    dispatch(getMentions({
      search: text
    }));
  }, 500));

  const onChangeHandler = (e, newValue) => {
    setValue(e.target.value);
    if (typeof onChange === 'function') {
      onChange(e);
    }
    const val = newValue;
    if (val.charAt(val.length - 1) === '@') {
      setMentionTriggered(true);
    } else if (val.indexOf(' ') === val.length - 1) {
      setMentionTriggered(false);
    }

    if (mentionTriggered === true) {
      const searchArray = val.split('@');
      const searchValue = searchArray[searchArray.length - 1];
      dispatch(clearAllUsers());
      searchUsers(searchValue);
    }
  };

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <MentionsInput
      value={value || innerValue}
      onChange={onChangeHandler}
      singleLine={singleLine}
      allowSuggestionsAboveCursor
      className="mention"
      placeholder={placeholder}
      style={{ ...defaultStyle }}
      onKeyPress={onKeyPress}
    >
      <Mention
        trigger="@"
        type="@"
        data={mentions.data.map((
          mention
        ) => ({
          ...mention,
          display: mention.name,
          id: mention.userId || mention.roleId || mention.departmentId,
          firstName: mention.name.split(' ')[0],
          lastName: mention.name.split(' ')[1] || '',
          subtitle: mention.userId ? 'User' : (mention.roleId ? 'Role' : 'Department')
        }))}
        displayTransform={(id, display) => `@${display}`}
        markup="@[__display__](__id__)"
        renderSuggestion={(suggestion) => (
          <ListItem
            profile={{
              id: suggestion.id,
              firstName: suggestion.firstName,
              lastName: suggestion.lastName,
            }}
            title={suggestion.name}
            subTitle={suggestion.subtitle}
            hideAction
          />
        )}
        className="mentions__mention"
        style={defaultStyle}
        appendSpaceOnAdd
      />
    </MentionsInput>
  );
};

MentionInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  singleLine: PropTypes.bool,
  onKeyPress: PropTypes.func
};

MentionInput.defaultProps = {
  onChange: () => {},
  value: '',
  placeholder: '',
  singleLine: true,
  onKeyPress: () => {}
};

export default MentionInput;
