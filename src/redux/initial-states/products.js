const productInitialState = {
  availableProducts: {
    data: [],
    loading: false,
    hasMore: true,
  },
  soldProducts: {
    data: [],
    loading: false,
    hasMore: true
  },
  allProducts: {
    data: [],
    loading: false,
    hasMore: true
  },
  soldFilters: {
    data: {},
    loading: false
  },
  availableFilters: {
    data: {},
    loading: false
  },
  stats: {
    loading: false,
    data: {}
  },
  taggedCustomers: {
    loading: false,
    data: [],
    hasMore: true
  }
};

export default productInitialState;
