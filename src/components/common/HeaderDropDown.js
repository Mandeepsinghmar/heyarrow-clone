/* eslint-disable */
import React, { useState } from 'react';
import { MONTHS, YEARS, QUARTERS } from '../../constants';

function HeaderDropDown(props) {
  let filter = useState(YEARS);

  const renderSearchBar = () => {
    if (props.renderSelect) {
       
      let value = props.activeTab && props.activeTab.target && props.activeTab.target.value ? 
      props.activeTab && props.activeTab.target && parseInt(props.activeTab.target.value) :
      props.activeTab;

      switch (value) {
      case 0: {
        filter = MONTHS;
        break;
      }
      case 1: {
        filter = QUARTERS;
        break;
      }
      case 2: {
        filter = YEARS;
        break;
      }
      default:
        break;
      }
      
      return (
        <div
          className="selecBox"
          style={
            props.renderSelectOnRight && {
              order: 1,
              marginRight: 0,
              marginLeft: 10,
            }
          }
        >
          <select className="form-control" onChange={props.onChangeDuration}>
            {filter.map((item) => (
              <option
                key={item.value}
                value={item.value}
                style={{ fontSize: '15px', fontFamily: 'inherit' }}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
  };

  return (
    <div className="headingBox" style={{ marginTop: 0, width: 'auto' }}>
      <div className="centerBar">
        <div
          className="selecBox"
          style={
            props.renderSelectOnRight && {
              order: 1,
              marginRight: 0,
              marginLeft: 10,
            }
          }
        >
          <select className="form-control" onChange={(e) => props.onChangeTab(e)}>
            {props.tabs.map((item, index) => (
              <option
                key={index}
                value={index}
                selected={"Year"}
                style={{ fontSize: '15px', fontFamily: 'inherit' }}
              >
                {item}
              </option>
            ))}
          </select>
        </div>
        {renderSearchBar()}
      </div>
    </div>
  );
}

export default HeaderDropDown;