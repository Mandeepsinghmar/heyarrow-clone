const teamInitialState = {
  memberDetails: {
    loading: false,
    data: {},
  },
  users: {
    loading: false,
    hasMore: true,
    data: []
  },
  members: {
    loading: false,
    hasMore: true,
    data: []
  },
  overview: {
    loading: false,
    counts: {},
    user: JSON.parse(localStorage.getItem('userData')) || {}
  },
  salesData: {
    loading: false,
    data: [],
    salesData: {
      units: '0',
      volume: 0,
      avgTurn: 0,
      estMargin: 0
    }
  },
  customers: {
    loading: false,
    data: [],
    hasMore: true
  }
};

export default teamInitialState;
