/* eslint-disable */
import { get } from 'lodash';

export default (item, type, key) => {
  let selectedValue = '';
  let isFilter = true;
  let feildName = 'label';
  let valueFeild = 'value';
  if(type === 'status' && (item.status || item.isNewItem)) {
    selectedValue = get(item, 'status.status', 'Select');
  } else if (type === 'city' && (item.city || item.isNewItem)) {
    selectedValue = get(item, 'city.name', 'Select');
  } else if (type === 'state' && (item.city || item.isNewItem)) {
    selectedValue = get(item, 'city.state.name', 'Select');
  } else if (type === 'year' && (item.modelYear || item.isNewItem)) {
    selectedValue = item.modelYear;
  } else if (type === 'role' && (item.role || item.isNewItem)) {
    selectedValue = item.role.name;
    feildName = 'name';
    valueFeild = 'id';
    isFilter = false;
  } else if (type === 'department') {
    selectedValue = item.departments
        && item.departments.length
        && item.departments[0]
        && item.departments[0].name;
    feildName = 'name';
    valueFeild = 'id';
  } else if (type === 'customDropdown' && key === 'productStatusId') {
    selectedValue = item.productStatus && item.productStatus.status;
    isFilter = false;
  }
  return {
    selectedValue,
    isFilter,
    feildName,
    valueFeild
  };
};
