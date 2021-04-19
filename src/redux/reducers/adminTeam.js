import { isEmpty } from 'lodash';
import {
  SET_ADMIN_TEAM_DEPARTMENT_LIST, SET_ADMIN_ALL_TEAM_DEPARTMENT,
  ENABLE_EDIT_DEPARTMENT, DISABLE_EDIT_DEPARTMENT,
  CANCEL_DEPARTMENT, ADD_NEW_DEPARTMENT,
  SET_NEW_DEPARTMENT, PUSH_NEW_DEPARTMENT,
  ONCHANGE_TEAM, SET_ADMIN_TEAM_DETAILS,
  SET_ADMIN_TEAM_MEMBER_DATA, ADD_NEW_TEAM_MEMBER,
  SET_NEW_TEAM_ITEM, REMOVE_NEW_TEAM_ITEM,
  UPDATE_TEAM_ITEM, SET_DEACTIVATED_USERS,
  SET_ORG_CHART, SET_MEMBERS_FILTER
} from '../types/adminTeam';

const initialState = {
  adminTeamDepartmentList: [],
  adminAllTeamDepartment: [],
  adminTeamSideDetails: {},
  adminTeamMemberData: {},
  adminOrgChartList: [],
  adminDeactivatedUsers: [],
  membersFilter: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_TEAM_DEPARTMENT_LIST: {
    return {
      ...state,
      adminTeamDepartmentList: action.payload
    };
  }
  case SET_ADMIN_ALL_TEAM_DEPARTMENT: {
    let allItems = [...state.adminAllTeamDepartment];
    if (action.page === 1) {
      allItems = action.data;
    } else {
      allItems = allItems.concat(action.data);
    }
    return {
      ...state,
      adminAllTeamDepartment: allItems
    };
  }
  case ENABLE_EDIT_DEPARTMENT: {
    const allDepartment = [...state.adminTeamDepartmentList];
    allDepartment[action.index] = {
      ...allDepartment[action.index],
      isEditing: true
    };
    return {
      ...state,
      adminTeamDepartmentList: allDepartment
    };
  }
  case DISABLE_EDIT_DEPARTMENT: {
    const allDepartment = [...state.adminTeamDepartmentList];
    allDepartment[action.index] = {
      ...allDepartment[action.index],
      ...action.data,
      isEditing: false
    };
    return {
      ...state,
      adminTeamDepartmentList: allDepartment
    };
  }
  case CANCEL_DEPARTMENT: {
    const temp = [...state.adminTeamDepartmentList];
    temp.splice(action.index, 1);
    return {
      ...state,
      adminTeamDepartmentList: temp
    };
  }
  case ADD_NEW_DEPARTMENT: {
    let allDepartments = [...state.adminTeamDepartmentList];
    allDepartments = [...allDepartments, action.form];
    return {
      ...state,
      adminTeamDepartmentList: allDepartments
    };
  }
  case SET_NEW_DEPARTMENT: {
    const departments = [...state.adminTeamDepartmentList];
    departments[action.index] = action.item;
    return {
      ...state,
      adminTeamDepartmentList: departments
    };
  }
  case PUSH_NEW_DEPARTMENT:
    return {
      ...state,
      adminTeamDepartmentList: [...state.adminTeamDepartmentList, action.item]
    };
  case ONCHANGE_TEAM: {
    const formRows = [...state.adminAllTeamDepartment];
    formRows[action.index] = {
      ...formRows[action.index],
      [action.key]: action.value
    };
    return {
      ...state,
      adminAllTeamDepartment: formRows
    };
  }
  case SET_ADMIN_TEAM_DETAILS: {
    return {
      ...state,
      adminTeamSideDetails: action.payload
    };
  }
  case SET_ADMIN_TEAM_MEMBER_DATA: {
    if (!isEmpty(action.payload)) {
      let allItems = { ...state.adminTeamMemberData };
      if (action.page === 1) {
        allItems = action.payload;
      } else if (!isEmpty(action.payload[action.key])) {
        const newItem = allItems[action.key].concat(action.payload[action.key]);
        allItems = {
          ...allItems,
          [action.key]: newItem
        };
      }
      return {
        ...state,
        adminTeamMemberData: allItems
      };
    }
    return {
      ...state,
      adminTeamMemberData: {}
    };
  }
  case ADD_NEW_TEAM_MEMBER: {
    let items = [...state.adminAllTeamDepartment];
    items = [action.form, ...items];
    return {
      ...state,
      adminAllTeamDepartment: items
    };
  }
  case SET_NEW_TEAM_ITEM: {
    const item = [...state.adminAllTeamDepartment];
    item[action.index] = action.item;
    return {
      ...state,
      adminAllTeamDepartment: item
    };
  }
  case REMOVE_NEW_TEAM_ITEM: {
    return {
      ...state,
      adminAllTeamDepartment: [...state.adminAllTeamDepartment.filter(
        (_, index) => index !== action.index
      )]
    };
  }
  case UPDATE_TEAM_ITEM: {
    const allTeamsUpdate = [...state.adminAllTeamDepartment];
    allTeamsUpdate[action.index] = action.item;
    return {
      ...state,
      adminAllTeamDepartment: allTeamsUpdate
    };
  }
  case SET_ORG_CHART: {
    return {
      ...state,
      adminOrgChartList: action.item
    };
  }
  case SET_DEACTIVATED_USERS: {
    return {
      ...state,
      adminDeactivatedUsers: action.item
    };
  }
  case SET_MEMBERS_FILTER: {
    return {
      ...state,
      membersFilter: action.item.data.map(({ customer }) => {
        const { id } = customer.salesRep;

        const fullName = customer.salesRep.firstName
        + customer.salesRep.lastName;

        return {
          id,
          fullName
        };
      })
    };
  }
  default:
    return state;
  }
};
