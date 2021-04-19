/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { MentionsInput, Mention } from 'react-mentions';
// import { getUsers } from '../../api/users';
import CustomIcon from './CustomIcon';

const defaultStyle = {
  control: {
    width: '100%',
    height: '60px',
  },
  highlighter: {
    padding: '0.375rem 2.9rem 0.37rem 20px',
    fontSize: '14px',
    height: '100%',
  },
  suggestions: {
    marginTop: '30px',
    marginLeft: '10px',

    list: {
      backgroundColor: '#fff',
      border: '1px solid #d2d6de',
    },

    item: {
      padding: '5px 15px',
      borderBottom: '1px solid #d2d6de',

      '&focused': {
        backgroundColor: '#f7f7f7',
        color: '#2c89b7',
      },
    },
  },
};
const MentionInput = ({
  value,
  handleChange,
  idName = 'id',
  submit,
  aboveCursor = true,
  displayName = 'firstName',
  trigger = '@',
  placeholder,
}) => {
  const users = [];
  const [mentionTriggered, setMentionTriggered] = useState(false);
  const dispatch = useDispatch();

  const [data, setData] = useState([
    { id: '1', display: 'user 1' },
    { id: '2', display: 'user 2', roleId: '1' },
  ]);

  useEffect(() => {
    const newData = users.map((item) => ({
      id: item[idName],
      display: item[displayName],
      role: item?.role?.name,
    }));
    setData(newData);
  }, [displayName, idName, users]);

  // const debouncedSave = useCallback(
  //   debounce((value) => {
  //     dispatch(getUsers(1, `&limit=10&search=${value}`));
  //   }, 500),
  //   []
  // );

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const handleInputChange = (e, newValue, newPlainTextValue, mentions) => {
    const value = newValue;
    if (value.charAt(value.length - 1) === '@') {
      setMentionTriggered(true);
    } else if (value.indexOf(' ') === value.length - 1) {
      setMentionTriggered(false);
    }

    if (mentionTriggered === true) {
      const searchArray = value.split('@');
      const searchValue = searchArray[searchArray.length - 1];
      // debouncedSave(searchValue);
    }
    handleChange(e, value, newValue, newPlainTextValue, mentions);
  };

  return (
    <MentionsInput
      value={value}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      allowSuggestionsAboveCursor={aboveCursor}
      // allowSpaceInQuery={true}
      style={defaultStyle}
      placeholder={placeholder}
      className="mention"
    >
      <Mention
        trigger={trigger}
        appendSpaceOnAdd={true}
        data={data}
        type="@"
        displayTransform={(id, display) => `@${display}`}
        markup="@[__display__](__id__)"
        placeholder={placeholder}
        className="mentions__mention"
        style={defaultStyle}
        renderSuggestion={(
          suggestion,
          search,
          highlightedDisplay,
          index,
          focused
        ) => (
          <div className={`user ${focused ? 'focused' : ''}`}>
            <CustomIcon icon="Placeholder/Person/Small" />
            {/* <ProfileCon
                    names={suggestion.firstName + suggestion.lastName}
                    color={suggestion.color}/> */}
            {highlightedDisplay}
            {/* <br /> */}
            {/* <span>{suggestion.role}</span> */}
          </div>
        )}
      />
    </MentionsInput>
  );
}

export default MentionInput;
