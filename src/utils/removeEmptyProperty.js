import { clone } from 'lodash';

const removeEmptyObject = (filters) => {
  // eslint-disable-next-line no-underscore-dangle
  const _filters = clone(filters);
  Object.keys(_filters).forEach((key) => {
    if (!_filters[key]?.length) {
      delete _filters[key];
    }
  });
  return _filters;
};

export default removeEmptyObject;
