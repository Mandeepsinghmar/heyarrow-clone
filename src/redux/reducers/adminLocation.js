import {
  SET_ADMIN_LOCATION_REGION, CREATE_ADMIN_LOCATION_REGION,
  ONCHANGE_LOCATION, UPDATE_ADMIN_LOCATION
} from '../types/adminLocation';

const initialState = {
  adminLocationRegion: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_LOCATION_REGION: {
    return {
      ...state,
      adminLocationRegion: action.payload
    };
  }
  case CREATE_ADMIN_LOCATION_REGION: {
    let items = { ...state.adminLocationRegion };
    const newItems = [...items.regions, action.payload.region];
    items = { ...items, regions: newItems };
    return {
      ...state,
      adminLocationRegion: items,
    };
  }
  case ONCHANGE_LOCATION: {
    let formRows = { ...state.adminLocationRegion };
    const newItems = [...formRows.regions];
    newItems[action.index] = {
      ...newItems[action.index],
      [action.key]: action.value,
    };
    formRows = { ...formRows, regions: newItems };
    return {
      ...state,
      adminLocationRegion: formRows,
    };
  }
  case UPDATE_ADMIN_LOCATION: {
    let formRows = { ...state.adminLocationRegion };
    const newItems = [...formRows.regions];
    newItems[action.index] = {
      ...newItems[action.index],
      [action.key]: action.value,
    };
    formRows = { ...formRows, regions: newItems };
    return {
      ...state,
      adminLocationRegion: formRows,
    };
  }
  default:
    return state;
  }
};
