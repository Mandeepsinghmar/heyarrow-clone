/* eslint-disable */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MONTHS, YEARS, QUARTERS } from '../../constants';
import CustomIcon from './CustomIcon';

function SideTabsComponent(props) {
  let filter = useState(MONTHS);
  const { notes } = useSelector((state) => state.customers);

  const renderSearchBar = () => {
    if (props.renderSelect) {
      switch (props.activeTab) {
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

  const renderTotal = (index) => {
    if (props.showOtherOptions) {
      switch (index) {
        case 0:
          return props.totalCount.counts && props.totalCount.counts.team && props.totalCount.counts.team.total
        case 1:
          return props.totalCount.counts && props.totalCount.counts.customers && props.totalCount.counts.customers.total
        case 2:
          return props.totalCount.counts && props.totalCount.counts.shared && props.totalCount.counts.shared.total
        case 3:
          return props.totalCount.counts && props.totalCount.counts.quoted && props.totalCount.counts.quoted.total
        case 4:
          return props.totalCount.counts && props.totalCount.counts.sold && props.totalCount.counts.sold.total
        case 5:
          return props.totalCount.counts && props.totalCount.counts.closed && props.totalCount.counts.closed.total
        case 6:
          return props.totalCount.counts && props.totalCount.counts.tag_products && props.totalCount.counts.tag_products.total
      }
    }
    else {
      switch (index) {
        case 0:
          return props.totalCount.counts && props.totalCount.counts.shared && props.totalCount.counts.shared.total
        case 1:
          return props.totalCount.counts && props.totalCount.counts.quoted && props.totalCount.counts.quoted.total
        case 2:
          return props.totalCount.counts && props.totalCount.counts.sold && props.totalCount.counts.sold.total
        case 3:
          return props.totalCount.counts && props.totalCount.counts.closed && props.totalCount.counts.closed.total
        case 4:
          return props.totalCount.counts && props.totalCount.counts.deal_mode && props.totalCount.counts.deal_mode.total
        case 5:

          return notes.data && notes.data.length
          case 6:
            return props.totalCount.counts && props.totalCount.counts.tag_products && props.totalCount.counts.tag_products.total
      }
    }
  }

  return (
    <div className="headingBox" style={{ flexDirection: 'column' }}>
      {props.title ? (
        <div className="leftBar">
          <h5>{props.title}</h5>
        </div>
      ) : null}

      <div className="centerBar">
        {renderSearchBar()}
        <ul className="sideTabs">
          {props.tabs.map((item, index) => (
            <li
              className={(item.value === props.value && 'active') || ''}
              key={index}

              onClick={() => {
                props.onChangeTab(item.value)
                props.onChangeUrl(item.label);

                }
              }
            >
              <span className={(item.value === props.value && 'font-weight-bold') || ''}>{item.label}</span>
              <span style={{ position: 'absolute', right: 20 }}>{item.subtitle}</span>
            </li>
          ))}
        </ul>
      </div>
      {!props.noRightSection ? (
        <div className="rightBar">
          <CustomIcon icon="Search" />
        </div>
      ) : null}
    </div>
  );
}

export default SideTabsComponent;
