const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');

const authInitialState = {
  isAuthenticated: !!token,
  currentUser: userData ? JSON.parse(userData) : null,
  token,
  loading: false
};

export default authInitialState;
