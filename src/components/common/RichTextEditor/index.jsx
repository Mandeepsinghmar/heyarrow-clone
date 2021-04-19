import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import { useSelector, useDispatch } from 'react-redux';

import 'draft-js-mention-plugin/lib/plugin.css';
import './index.scss';
import Entry from './Entry';
import { getAllUsers } from '../../../api';
import getFullName from '../../../utils/getFullName';

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mentionPlugin] = useState(createMentionPlugin());
  const { MentionSuggestions } = mentionPlugin;
  const plugins = [mentionPlugin];
  const { users } = useSelector((state) => state.team);
  const dispatch = useDispatch();

  const onChange = (editor) => {
    setEditorState(editor);
  };

  const onSearch = ({
    value
  }) => {
    dispatch(getAllUsers({
      search: value
    }));
  };

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
      />
      <MentionSuggestions
        onSearchChange={onSearch}
        suggestions={users.data.map((user) => ({
          ...user,
          name: getFullName(user),
        }))}
        entryComponent={Entry}
        onAddMention={() => {
        }}
      />
    </div>
  );
};

export default RichTextEditor;
