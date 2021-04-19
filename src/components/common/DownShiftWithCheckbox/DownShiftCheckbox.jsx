import React, { Component } from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';

const checkedSelectedItem = [];
const uncheckedSeletedItem = [];

class DownShiftCheckbox extends Component {
  static stateReducer(changes) {
    switch (changes.type) {
    case Downshift.stateChangeTypes.clickItem:
      return {
        ...changes,
        isOpen: true
      };
    default:
      return changes;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      onSelect: props.onSelect,
      onChange: props.onChange,
    };
    // this.stateReducer = this.stateReducer.bind(this);
  }
  // static displayName = 'DownShiftCheckbox';

  handleSelection(selectedItem, downshift) {
    const { onChange, onSelect, selectedItems } = this.state;
    const callOnChange = () => {
      if (onSelect) {
        onSelect(
          selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
      if (onChange) {
        onChange(
          selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
    };
    // remove if already in the state; add otherwise
    if (selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, callOnChange);
    } else {
      this.addSelectedItem(selectedItem, callOnChange);
    }
  }

  getStateAndHelpers(downshift) {
    const { selectedItems } = this.state;

    return {
      selectedItems,
      ...downshift
    };
  }

  addSelectedItem(item, callbackFunction) {
    uncheckedSeletedItem.push(item.label);
    checkedSelectedItem.push(item.label);
    // uncheckedSeletedItem.push(item.label);
    // localStorage.removeItem("unchecked",uncheckedSeletedItem);
    localStorage.setItem('checked', checkedSelectedItem);

    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item]
      }),
      callbackFunction
    );
  }

  removeItem(item, callbackFunction) {
    uncheckedSeletedItem.push(item.label);
    checkedSelectedItem.push(item.label);

    // uncheckedSeletedItem = localStorage.getItem("unchecked");
    // console.log(uncheckedSeletedItem)

    // console.log(item.label);
    // removegetItem.splice(item.type,1);
    localStorage.removeItem('unchecked', uncheckedSeletedItem);
    localStorage.setItem('unchecked', checkedSelectedItem);

    this.setState(({ selectedItems }) => ({
      selectedItems: selectedItems.filter((i) => i !== item)

    }), callbackFunction);
    //  console.log(this.state.selectedItems);
  }

  render() {
    const { render, children = render, ...props } = this.props;

    return (
      <Downshift
        {...props}
        stateReducer={DownShiftCheckbox.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {(downshift) => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}
DownShiftCheckbox.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  render: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired
};
export default DownShiftCheckbox;
