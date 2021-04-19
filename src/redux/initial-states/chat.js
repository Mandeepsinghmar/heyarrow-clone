const chatInitialState = {
  customers: {
    assigned: [],
    unassigned: [],
    loading: false
  },
  chatMessages: {
    loading: false,
    data: [],
    posting: false,
    hasMore: true,
    dataLength: 0
  },
  team: {
    data: [],
    loading: false,
  },
  groupDetails: {
    loading: false,
    members: [],
    group: {}
  },
  totalUnreadCounts: 0
};

export default chatInitialState;
