import React, { useState } from 'react';
import { Divider, IconButton } from '@material-ui/core';

import './index.scss';
import CustomIcon from '../../../components/common/CustomIcon';
import MentionInput from '../../../components/common/MentionTextBox';
import InputAttachment from '../../../components/common/InputAttachment';
import MessageList from '../../../components/MessageList';

const TeamChat = () => {
  const [files, setFiles] = useState([]);
  const [fileValue, setFileValue] = useState('');
  const [message, setMessage] = useState('');

  const removeFiles = (index) => {
    setFiles(files.filter((file, i) => index !== i));
    setFileValue('');
  };

  const onUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      setFiles([{ file: e.target.files[0], url: result }]);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFileValue(e.target.value);
  };

  return (
    <div className="team-chat-container w-100">
      <div className="flex items-center team-chat__header">
        <CustomIcon icon="Placeholder/Group/Small" />
        <h3 className="">Ryan King Team</h3>
      </div>
      <Divider />
      <div className="team-message-list">
        <MessageList />
      </div>
      <form>
        <input
          accept="image/svg+xml,image/x-png,image/jpeg,application/pdf,.csv"
          id="attach-"
          type="file"
          hidden
          value={fileValue}
          onChange={onUpload}
        />
        <div className="flex-1">
          <MentionInput
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            singleLine={false}
          />
          {files.map(({ file, url }, index) => (
            <InputAttachment
              key={url}
              file={file}
              url={url}
              onClose={() => removeFiles(index)}
            />
          ))}
        </div>
        <label className="customer-attach-btn cursor-pointer" htmlFor="attach-">
          <CustomIcon icon="Icon/Attach" />
        </label>
        <IconButton
          type="submit"
          size="small"
          disabled={!message.length && !files.length}
        >
          <CustomIcon icon="Send-Enabled" />
        </IconButton>
      </form>
    </div>
  );
};

export default TeamChat;
