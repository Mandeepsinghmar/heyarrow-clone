import { clone } from 'lodash';

const removeEmptyProps = (filters) => {
  const newFilters = clone(filters);
  Object.keys(newFilters).forEach((key) => {
    const value = newFilters[key];
    if ((typeof value === 'string'
    || Array.isArray(value)) && !value.length) {
      delete newFilters[key];
    }
    if (typeof value === 'object') {
      if (Object.keys(value).length) {
        const newValue = removeEmptyProps(value);
        if (!Object.keys(newValue).length) {
          delete newFilters[key];
        } else {
          newFilters[key] = newValue;
        }
      } else {
        delete newFilters[key];
      }
    }
  });
  return newFilters;
};

export default removeEmptyProps;
