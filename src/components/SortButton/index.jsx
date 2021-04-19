import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../common/CustomIcon';

const SortButton = ({
  title,
  active,
  direction,
  onClick
}) => {
  const [currentDirection, setCurrentDirection] = useState(direction);

  const renderDirectionIcon = (_direction) => {
    switch (_direction.toUpperCase()) {
    case 'ASC':
      return <CustomIcon icon="sort/up" />;
    case 'DESC':
      return <CustomIcon icon="sort/down" />;
    default:
      return 'DESC';
    }
  };

  const toggleDirection = () => {
    if (!currentDirection) {
      return;
    }
    if (currentDirection === 'ASC') {
      setCurrentDirection('DESC');
    } else {
      setCurrentDirection('ASC');
    }
  };

  const onClickHandler = () => {
    if (!active) {
      onClick(currentDirection);
    } else {
      onClick(currentDirection === 'ASC' ? 'DESC' : 'ASC');
      toggleDirection();
    }
  };

  return (
    <li className={`${active ? 'active' : ''} sort-button`} onClick={onClickHandler}>
      <span>{title}</span>
      {currentDirection && renderDirectionIcon(currentDirection)}
    </li>
  );
};

SortButton.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  direction: PropTypes.string,
  onClick: PropTypes.func,
};

SortButton.defaultProps = {
  active: false,
  direction: '',
  onClick: () => {}
};

export default SortButton;
