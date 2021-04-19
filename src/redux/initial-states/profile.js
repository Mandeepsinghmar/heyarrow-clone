const userData = localStorage.getItem('userData');

const profileInitialState = {
  loading: false,
  updating: false,
  user: userData ? JSON.parse(userData) : {},
};

export default profileInitialState;
