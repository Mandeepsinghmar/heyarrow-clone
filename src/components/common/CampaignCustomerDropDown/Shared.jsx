import React from 'react';
import { css as emoCSS } from '@emotion/css';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const css = (...args) => ({ className: emoCSS(...args) });

const Item = styled('div')(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
    const styles = [];
    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      });
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      });
    }
    return styles;
  },
);
const onAttention = '&:hover, &:focus';
const Input = styled('input')(
  {
    width: '100%', // full width - icon width/2 - border
    fontSize: 14,
    wordWrap: 'break-word',
    lineHeight: '1em',
    outline: 0,
    whiteSpace: 'normal',
    minHeight: '2em',
    background: '#fff',
    display: 'inline-block',
    padding: '1em 2em 1em 1em',
    color: 'rgba(0,0,0,.87)',
    boxShadow: 'none',
    border: '1px solid rgba(34,36,38,.15)',
    borderRadius: '.30rem',
    transition: 'box-shadow .1s ease,width .1s ease',
    [onAttention]: {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  },
  ({ isOpen }) => (isOpen
    ? {
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
      [onAttention]: {
        boxShadow: 'none',
      },
    }
    : null),
);

const Label = styled('label')({
  fontWeight: 'bold',
  display: 'block',
  marginBottom: 10,
});

const Menu = styled('div')({
  position: 'absolute',
  backgroundColor: 'white',
  width: '100%',
  maxHeight: '20rem',
  overflowY: 'auto',
  overflowX: 'hidden',
  borderTopWidth: '0',
  outline: '0',
  borderRadius: '0 0 .28571429rem .28571429rem',
  transition: 'opacity .1s ease',
  boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
  borderColor: '#96c8da',
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderStyle: 'solid',
});

const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  cursor: 'pointer',
  width: 47,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

function ArrowIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  );
}
ArrowIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired
};
export {
  Menu, ControllerButton, Input, Item, ArrowIcon, XIcon, Label, css
};
