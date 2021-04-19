/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import PropTypes from 'prop-types';
import { RenderHeader } from './tableHeader';
import { RenderRows } from './tableRows';
import { getStates, getUsers } from '../../../api/common';
import { Table } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

function TableContent(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getStates());
  }, []);


  return (
    <div className={`${props.hasVerticalScroll ? '' : ''}  ${props.tableName || ''}`}>
      <div className={`tableContent ${props.tableName || ''}`}>
        <Table cellPadding="0" cellSpacing="0">
          <RenderHeader
            columns={props.columns}
            tableName={props.tableName}
            tableHead={props.tableHead}
          />
          <RenderRows
            data={props.data}
            tableName={props.tableName}
            options={props.options}
            columns={props.columns}
            removeRow={props.removeRow}
            tableBody={props.tableBody}
            saveBtn={props.saveBtn}
            onChange={props.onChange}
            onSave={props.onSave}
            assignReportToHandler={props.assignReportToHandler}
            assignDepartmentHandler={props.assignDepartmentHandler}
            assignSalesRepHandler={props.assignSalesRepHandler}
            noActions={props.noActions}
            tableActions={props.tableActions}
            readOnly={props.readOnly || false}
            emptyMessage={props.emptyMessage || ''}
            onRowClick={props.onRowClick}
            loading={props.loading}
            tag_product={props.tag_product}
            quoted={props.quoted}
            openQuotedInfo={props.openQuotedInfo}
          />
        </Table>
      </div>
    </div>
  );
}

TableContent.propTypes = {
  hasVerticalScroll: PropTypes.bool,
  readOnly: PropTypes.bool,
  columns: PropTypes.array,
  data: PropTypes.array,
  options: PropTypes.object,

  tableName: PropTypes.string,
  tableHead: PropTypes.any,
  tableBody: PropTypes.any,
  tableActions: PropTypes.any,

  onChange: PropTypes.func,
  onSave: PropTypes.func,
  saveBtn: PropTypes.func,
  removeRow: PropTypes.func,
  assignSalesRepHandler: PropTypes.func,
  assignReportToHandler: PropTypes.func,
  assignDepartmentHandler: PropTypes.func,

  noActions: PropTypes.any,
  customers: PropTypes.any,
};

export default TableContent;