import { logout } from '../redux/actions';

export default () => (dispatch) => {
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  localStorage.removeItem('bearToken');
  dispatch(logout());
};
