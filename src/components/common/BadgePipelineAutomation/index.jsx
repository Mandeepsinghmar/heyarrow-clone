import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const BadgePipelineAutomation = ({ text, type }) => {
  switch (type) {
  case 'yellow':
    return <span className="badge__pipeline-automation badge_yellow ">{text}</span>;
  case 'black':
    return <span className="badge__pipeline-automation badge_black">{text}</span>;
  case 'purple':
    return <span className="badge__pipeline-automation badge_purple">{text}</span>;
  case 'blue':
    return <span className="badge__pipeline-automation badge_blue">{text}</span>;
  case 'red':
    return <span className="badge__pipeline-automation badge_red">{text}</span>;
  default:
    return <span />;
  }
};

BadgePipelineAutomation.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default BadgePipelineAutomation;
