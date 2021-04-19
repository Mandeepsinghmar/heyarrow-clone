const userData = localStorage.getItem('userData');
const client = userData ? userData.client : {};

const clientDetailInitialState = {
  loading: false,
  ...client
};

export default clientDetailInitialState;
