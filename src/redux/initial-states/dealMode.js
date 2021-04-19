const dealMode = {
  dealElements: {
    loading: false,
    data: []
  },
  paymentMethods: {
    loading: false,
    data: []
  },
  deals: {
    loading: false,
    deals: [],
    salesData: {
      units: '0',
      volume: 0,
      avgTurn: 0,
      estMargin: 0
    }
  }
};

export default dealMode;
