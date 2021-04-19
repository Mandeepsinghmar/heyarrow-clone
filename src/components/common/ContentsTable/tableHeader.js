/* eslint-disable */
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { Thead, Tr, Th } from 'react-super-responsive-table';


export const RenderHeader = (props) => {
  if (props.tableHead) {
    return props.tableHead;
  }
  return (
    <Thead>
      <Tr>
        {props.columns.map((item, i) => (
          <Th
            key={`${props.tableName}-${item.label}-col-${i}`}
            className={item.hasCheckbox ? 'hasCheckbox' : ''}
          >
            {item.hasCheckbox && !item.hideCheckbox ? (
              <div className="checkBoxCon">
                <Checkbox
                    // checked={false}
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
            ) : null}
            <div className={item.label} style={{ display: 'inline-block', minWidth: 60 }}>{item.label}</div>
            {item.require && <sup>*</sup>}
            {item.arrowDown && <i className="fas fa-sort-down" />}
          </Th>
        ))}
        {!props.noActions && <Th />}
      </Tr>
    </Thead>
  );
};

RenderHeader.propTypes = {
  tableHead: PropTypes.any,
  columns: PropTypes.array,
  tableName: PropTypes.string,
  noActions: PropTypes.any
};
