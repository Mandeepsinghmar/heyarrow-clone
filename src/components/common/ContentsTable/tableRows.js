/* eslint-disable */
import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { RenderActions } from './tableActions';
import { RenderTableCell } from './tableCell';
import CustomIcon from '../CustomIcon';
import ProfileInitals from '../ProfileInitials';
import getProductImgUrl from '../../../utils/getProductImageUrl';
import { Tbody, Tr, Td } from 'react-super-responsive-table';

export const RenderRows = (props) => {
  const { readOnly = false } = props;

  const [currentIndex, setCurrentIndex] = useState(null);
  const onFocus = (index) => {
    setCurrentIndex(index);
  };

  const onBlur = (index) => {
    setCurrentIndex(null);
  };

  const noHistoryIcon = () => {
    return(
      <img
        src={getProductImgUrl('history', `/images/${props.emptyMessage}.svg`)}
        style={{width: 60, margin: 'auto', marginBottom: 20}}
      />
    );
  }

  return (
    <>
      {props.tableBody ? props.tableBody
        : (!props.loading && !props.data.length)
          ? (
            <Tbody>
              <Tr className="show-no-history" style={props.emptyMessage ? {} : { width: '98%' }}>
                <div style={{textAlign: 'center'}}>
                  {props.emptyMessage ? noHistoryIcon() : null}
                  <Td colSpan={props.columns.length + 2}>{props.emptyMessage ? `There is no ${props.emptyMessage} history available` : 'No Data Found'}</Td>
                </div>
              </Tr>
            </Tbody>
          )
          : (
            <Tbody>
              {props.data.filter(data => data !== undefined).map((item, index) => (
                <Tr
                  key={`${item.id}${index}`}
                  //className={(currentIndex === index && 'currentIndex') || ''}

                    onMouseEnter={()=>onFocus(index)}
                >
                  {props.columns.map((col, i) => {
                    const keys = col.key.split('.');

                    let value = item[keys[0]];

                    if (value && col.multipleKey && keys.length > 1) {
                      for (let i = 1; i < keys.length; i++) {
                        value = value[keys[i]];
                      }
                    }

                    return (
                      <Td
                        key={i}
                        onClick={() => readOnly &&
                          typeof props.onRowClick === 'function' &&
                          !item.isNewItem &&
                          props.onRowClick(item) }
                          //onMouseEnter={()=>onFocus(index)}
                        className={col.key}
                        style={
                          col.type === 'name'
                            ? { minWidth: 60 }
                            : { minWidth: 60 }
                        }
                      >
                      {/* TO BE REMOVED LATER */}
                        {col.hasCheckbox && !item.isNewItem ? (
                        <>
                          {!col.hideCheckbox && (
                          <div
                            className="checkBoxCon"
                            style={{
                              width:
                                props.selectedRows
                                && props.selectedRows.length > 0
                                && '27px',
                            }}
                          >
                            <Checkbox
                              onChange={() => (props.selectMultipleRowHandler
                                ? props.selectMultipleRowHandler(item.id)
                                : alert('selectMultipleRowHandler method defined!'))}
                              checked={
                                !!(props.selectedRows
                                && props.selectedRows.length > 0
                                && props.selectedRows.indexOf(item.id) >= 0)
                              }
                              value={item.id}
                              color="primary"
                              inputProps={{
                                'aria-label': 'secondary checkbox',
                              }}
                            />
                          </div>
                          )}
                        </> ) : null}
                        {col.hasInitials && (
                          <div className="profileIcon">
                            {!value
                              ? <CustomIcon icon="Placeholder/Person/Small" />
                              : (
                                <ProfileInitals
                                  firstName={item[col.key] && item[col.key]}
                                  lastName={col.key !== 'assign_to' && item?.last_name || item?.lastName || ''}
                                  size="small"
                                  profileId={item.id || index}
                                />
                              )}
                          </div>
                        )}
                        <RenderTableCell
                          value={value}
                          columnKey={col.key}
                          type={col.type}
                          options={col.options}
                          innerKey={col.innerKey}
                          item={item}
                          index={index}
                          label={col.label}
                          readOnly={col.readOnly
                                || !item.isNewItem ? readOnly : false}
                          isEmail={col.isEmail}
                          hasInitials={col.hasInitials}
                          optionsToChooseFrom={props.options}

                          onChange={props.onChange}
                          onSave={props.onSave}
                          assignSalesRepHandler={props.assignSalesRepHandler}
                          assignReportToHandler={props.assignReportToHandler}
                          assignDepartmentHandler={props.assignDepartmentHandler}
                        />
                      </Td>
                    );
                  })}

                  {!props.noActions && (
                  <Td>
                    <RenderActions
                      item={item}
                      index={index}
                      saveBtn={props.saveBtn}
                      onSave={props.onSave}
                      removeRow={props.removeRow}
                      tableActions={props.tableActions}
                      tag_product={props.tag_product}
                      quoted={props.quoted}
                      openQuotedInfo={props.openQuotedInfo}
                    />
                  </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          )
      }
    </>
  );
};

RenderRows.propTypes = {
  tableBody: PropTypes.any,
  loading: PropTypes.bool,
  data: PropTypes.array,
  columns: PropTypes.array,
  noActions: PropTypes.any,
  readOnly: PropTypes.bool,
  options: PropTypes.object,

  removeRow: PropTypes.func,
  tableActions: PropTypes.any,
  saveBtn: PropTypes.any,
  tableName: PropTypes.string,

  customers: PropTypes.object,
  archiveCustomers: PropTypes.object,
  ProductActivity: PropTypes.object,

  selectedRows: PropTypes.any,
  selectMultipleRowHandler: PropTypes.any,

  assignDepartmentHandler: PropTypes.func,
  assignReportToHandler: PropTypes.func,
  assignSalesRepHandler: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};