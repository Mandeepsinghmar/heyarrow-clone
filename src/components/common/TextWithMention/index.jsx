/* eslint-disable react/no-danger */
import React from 'react';
import _clone from 'lodash/clone';
import _escapeRegExp from 'lodash/escapeRegExp';
import PropTypes from 'prop-types';

export default function RenderTextWithMentions({ text }) {
  if (!text) {
    return '';
  }
  let displayText = _clone(text);
  const tags = text.match(/@\[[^)]+\]+\([^)]+\)/gi) || [];
  tags.forEach((myTag) => {
    const tagDisplayValue = myTag.split(']')[0].substr(2);
    displayText = displayText.replace(new RegExp(_escapeRegExp(myTag), 'gi'), `<span class="mentioned">${tagDisplayValue}</span>`);
  });
  return <span dangerouslySetInnerHTML={{ __html: displayText }} />;
}

RenderTextWithMentions.propTypes = {
  text: PropTypes.string
};

RenderTextWithMentions.defaultProps = {
  text: ''
};
