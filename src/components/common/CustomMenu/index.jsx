import React, { useEffect, useRef, useState } from 'react';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  menuTitle: {
    cursor: 'pointer'
  }
}));

const CustomMenu = ({
  children,
  titleComponent,
  isOpen,
  toggleIsOpen
}) => {
  const anchorRef = useRef(null);
  const classes = useStyles();
  // eslint-disable-next-line camelcase
  const [_isOpen, set_isOpen] = useState(isOpen);

  const handleToggle = () => {
    toggleIsOpen();
    set_isOpen(!_isOpen);
  };

  useEffect(() => {
    set_isOpen(isOpen);
  }, [isOpen]);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    handleToggle();
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      handleToggle();
    }
  }

  const prevOpen = useRef(isOpen);
  useEffect(() => {
    if (prevOpen.current === true && isOpen === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div>
      <span
        ref={anchorRef}
        aria-controls={isOpen ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={classes.menuTitle}
      >
        {titleComponent}
      </span>
      <Popper
        open={_isOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 400, minWidth: '150px', marginTop: '-15px' }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {children}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

CustomMenu.propTypes = {
  children: PropTypes.node.isRequired,
  titleComponent: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  toggleIsOpen: PropTypes.func,
};

CustomMenu.defaultProps = {
  isOpen: false,
  toggleIsOpen: () => {}
};

export default CustomMenu;
