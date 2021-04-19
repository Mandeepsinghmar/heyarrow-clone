import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getDepartmentList, getOrgChart } from '../../../api';
import './index.scss';
import Departments from '../Departments';
import OrgChartHandler from '../OrgChartHandler';
import { COLORS } from '../../../constants';

function OrgChart(props) {
  const [filter] = useState('all');
  const [loadingSidebar, setloadingSidebar] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  // eslint-disable-next-line react/prop-types
  const { adminOrgChartList } = props;

  const fetchDepartments = () => {
    setloadingSidebar(true);
    dispatch(getDepartmentList()).then(() => {
      setloadingSidebar(false);
    });
  };

  useEffect(() => {
    fetchDepartments();
    dispatch(getOrgChart());
  }, []);

  const filterTeam = async (currentFilter) => {
    history.push(`/admin/team/${currentFilter}`);
  };

  const orgChartList = [adminOrgChartList] && [adminOrgChartList].map(
    (data) => (
      {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        sales: 'Sales',
        post: (data.role && data.role.name) || '',
        img: `${data.firstName && data.firstName.charAt(0)}${data.lastName && data.lastName.charAt(0)}`
      }
    )
  );

  const populateIdentifiers = (list, PID) => list.reduce((globalList, item) => {
    const { id } = item;

    if (PID) {
      // eslint-disable-next-line no-param-reassign
      item.pid = PID;
    }

    // eslint-disable-next-line no-param-reassign
    globalList = globalList.concat(item);
    let newArr = [];

    if (item.reporters) {
      // eslint-disable-next-line no-param-reassign
      globalList = globalList.concat(populateIdentifiers(item.reporters, id));
      newArr = globalList.filter((v, i, a) => a.findIndex(
        (t) => (t.id === v.id)
      ) === i);
      newArr = newArr.map((data) => {
        const colorIndex = Math.floor(Math.random() * COLORS.length) + 0;

        return {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
          sales: data.role.name,
          post: (data.role && data.role.name) || '',
          img: `${data.firstName && data.firstName.charAt(0)}${data.lastName && data.lastName.charAt(0)}`,
          color: COLORS[colorIndex]
        };
      });
    }

    return newArr;
  }, []);

  return (
    <>
      <div className="contentContainerFull teamDescription teamOrgChart">
        <div className="innerFullCon leftSideBar">
          <Departments
            {...props}
            loading={loadingSidebar}
            filterTeam={filterTeam}
            filter={filter}
            OrgChart
          />
        </div>
        <div className="innerFullCon rightSection">
          {/* Future Use */}
          {/* <div className="exportBtn">
            <button type="button" className="btn">Export PDF</button>
          </div> */}
          <div className="orgChartCon">
            <OrgChartHandler
              nodes={populateIdentifiers(orgChartList) || []}
            />
          </div>
        </div>
      </div>
    </>
  );
}

OrgChartHandler.propTypes = {
  adminOrgChartList: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = (state) => ({
  adminTeamDepartmentList: state.adminTeam.adminTeamDepartmentList,
  users: state.common.users,
  countries: state.common.countries,
  cities: state.common.cities,
  states: state.common.states,
  adminOrgChartList: state.adminTeam.adminOrgChartList
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrgChart);
