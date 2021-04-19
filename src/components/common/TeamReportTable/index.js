/* eslint-disable */
import React from 'react';
import { get } from 'lodash';
import moment from 'moment';
import nFormatter from '../../../utils/nFormatter';
import ProfileInitial from '../../../components/common/ProfileInitials';
import getFullName from '../../../utils/getFullName';

function TeamReportTable(props) {
  const { data, filters, loading } = props;

  const teamTable = () => {
    return (
      <>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Email address</th>
            <th>Phone number</th>
            <th>State</th>
            <th>City</th>
            <th>Customers</th>
          </tr>
        </thead>
        <tbody>
          {data.data && data.data.length > 0 ?
            data.data.map(item => {
              return <>
                <tr>
                  <td>
                  <div style={{display: 'inline-block', display: 'inline-flex', position: 'relative', alignItems:'center', justifyContent: 'center'}}>
                  <ProfileInitial
                  firstName={get(item, 'firstName', 'N/A')}
                  lastName={get(item, 'lastName', 'N/A')}
                  size="small"
                  profileId={get(item, 'id', 'N/A')}
                  profileUrl={item?.profileUrl}
                  />
                  <span style={{marginLeft: '5px'}}>{get(item, 'firstName', 'N/A')} {get(item, 'lastName', 'N/A')}</span>
                  </div>
                  </td>
                  <td>{`${get(item, 'departments[0].name', '-')}`}</td>
                  <td>{`${get(item, 'role.name', '-')}`}</td>
                  <td>{`${get(item, 'email', '-')}`}</td>
                  <td>{`${get(item, 'phoneNumber', '-')}`}</td>
                  <td>{`${get(item, 'city.state.name', '-')}`}</td>
                  <td>{`${get(item, 'city.name', '-')}`}</td>
                  <td>{`${get(item, 'totalCustomers', '-')}`}</td>
                </tr>
              </>
            })
          : null}
        </tbody>
      </>
    );
  };

  const customersTable = () => {
    return (
      <>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>City</th>
            <th>Assigned to</th>
            <th>Assigned on</th>
          </tr>
        </thead>
        <tbody>
          {data.customers && data.customers.length > 0 ? (
            data.customers.map((item) => {
              return<>
                <tr>
                  <td>
                    <div style={{display: 'inline-block', display: 'inline-flex', position: 'relative', alignItems:'center', justifyContent: 'center'}}>
                    <ProfileInitial
                    firstName={get(item, 'firstName', 'N/A')}
                    lastName={get(item,'lastName','N/A')}
                    size="small"
                    profileId={get(item, 'id', 'N/A')}
                    profileUrl={item.profileUrl}
                    />
                    <span style={{marginLeft: '5px', marginRight: '-60px'}}>
                    {get(item, 'firstName', 'N/A')} {get(item,'lastName','N/A')}
                    </span>
                    </div>
                  </td>
                  <td>{`${get(item, 'city.state.name', '-')}`}</td>
                  <td>{`${get(item, 'city.name', '-')}`}</td>
                  <td>
                  <div style={{display: 'inline-block', display: 'inline-flex', position: 'relative', alignItems:'center', justifyContent: 'center'}}>
                  <ProfileInitial
                    firstName={get(item, 'salesRep.firstName', 'N/A')}
                    lastName={get(
                      item,
                      'salesRep.lastName',
                      'N/A'
                    )}
                    size="small"
                    profileId={get(item, 'salesRep.id', 'N/A')}
                    profileUrl={item?.salesRep?.profileUrl}
                    />
                    <span style={{marginLeft: '5px', marginRight: '-60px'}}>
                    {get(item, 'salesRep.firstName', 'N/A')} {get(item, 'salesRep.lastName', 'N/A')}
                    </span>
                  </div>
                  </td>
                  <td>
                    {moment(item.updatedAt).format('DD/MM/YYYY')}
                  </td>
                </tr>
              </>
            })
          ) : (
            <div style={{ padding: '10px 0px' }}>{ !loading && 'No data found' } </div>
          )}
        </tbody>
      </>
    );
  };

  const customersSharedTable = () => {
    return (
      <>
        <thead>
          <tr>
            <th>Customer name</th>
            <th>Revenue</th>
            <th>Avg. turn</th>
            <th>Units</th>
            <th>Est. margin</th>
          </tr>
        </thead>
        <tbody>
          {data.data && data.data.length > 0 ? (
            data.data.map((item) => {
            return  <>
                <tr>
                  <td>
                  <div style={{display: 'inline-block', display: 'inline-flex', position: 'relative', alignItems:'center', justifyContent: 'center'}}>
                  <ProfileInitial
                    firstName={get(item.customer, 'firstName', 'N/A')}
                    lastName={get(item.customer,'lastName','N/A')}
                    size="small"
                    profileId={get(item.customer, 'id', 'N/A')}
                    profileUrl={item?.customer?.profileUrl}
                    />
                    <span style={{marginLeft: '5px', marginRight: '-60px'}}>
                    {`${get(item.customer, 'firstName', 'N/A')} ${get(
                      item.customer,
                      'lastName',
                      'N/A'
                    )}`}
                    </span>
                    </div>
                  </td>
                  <td>
                  <div style={{display: 'inline-block', display: 'inline-flex', position: 'relative', alignItems:'center', justifyContent: 'center'}}>
                  <ProfileInitial
                    firstName={get(item.customer, 'salesRep.firstName', 'N/A')}
                    lastName={get(
                      item.customer,
                      'salesRep.lastName',
                      'N/A'
                    )}
                    size="small"
                    profileId={item?.customer?.salesRep?.id}
                    profileUrl={item?.salesRep?.profileUrl}
                    />
                    <span style={{marginLeft: '5px', marginRight: '-60px'}}>
                    {get(item.customer, 'salesRep.firstName', 'N/A')} {get(item.customer, 'salesRep.lastName', 'N/A')}
                    </span>
                    </div>
                  </td>
                  <td>{(item.salesData && `$${nFormatter(item.salesData.volume)}`) || '$0'}</td>
                  <td>{(item.salesData && `${nFormatter(item.salesData.avgTurn == '-' ? 0 : item.salesData.avgTurn)}D`) || '0D'}</td>
                  <td>{(item.salesData && `${nFormatter(item.salesData.units)}`) || '0'}</td>
                  <td>{(item.salesData && `$${nFormatter(item.salesData.estMargin == '-' ? 0 : item.salesData.estMargin)}`) || '$0'}</td>
                </tr>
              </>
            })
            ) : (
              <div style={{ padding: '10px 0px' }}>{ !loading && 'No data found' } </div>
            )}
        </tbody>
      </>
    );
  };

  const renderTableBody = (status) => {
    switch (status) {
      case 'team':
        return teamTable();
      case 'customers':
        return customersTable();
      case 'shared':
        return customersSharedTable();
      case 'quoted':
        return customersSharedTable();
      case 'sold':
        return customersSharedTable();
      case 'closed':
        return customersSharedTable();
      default:
        break;
    }
  };

  return (
    <div className={''}>
      <div className="tableContent">
        <table cellPadding="0" cellSpacing="0">
          {data && renderTableBody(filters.status)}
        </table>
      </div>
    </div>
  );
}

export default TeamReportTable;
