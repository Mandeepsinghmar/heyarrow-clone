const customerInitialState = {
  pinnedCustomers: {
    loading: false,
    data: [],
    pinning: false,
    unpinning: false,
  },
  myCustomers: {
    loading: false,
    hasMore: true,
    data: []
  },
  customerDetails: {
    loading: false,
    data: {}
  },
  purchaseHistory: {
    loading: false,
    data: []
  },
  allCustomers: {
    data: [],
    loading: false,
    hasMore: true
  },
  customerStats: {
    salesData: {
      units: '0',
      volume: 0,
      avgTurn: 0,
      estMargin: 0
    },
    products: {}
  },
  unassignedCustomers: {
    loading: false,
    data: []
  },
  quotePreview: {
    loading: false,
  },
  customerOverview: {
    loading: false,
    counts: {},
    customer: {}
  },
  notes: {
    loading: false,
    hasMore: true,
    data: []
  },
  taggedProducts: {
    loading: false,
    data: [],
    hasMore: true,
  },
  interests: {
    loading: false,
    data: [],
    hasMore: true
  }
};

export default customerInitialState;
