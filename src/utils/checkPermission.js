import store from '../redux';

export const CREATE_CUSTOMERS = 'create_customers';
export const UPDATE_CUSTOMERS = 'update_customers';
export const SHARE_PRODUCTS = 'share_products';
export const CREATE_TEAMS = 'create_teams';
export const DELETE_COMMENT = 'delete_comment';
export const viewUnassignedCustomers = 'view_unassigned_customers';
export const createChatGroups = 'create_chat_groups';
export const editChatGroups = 'edit_chat_groups';
export const chatUnassignedCustomers = 'chat_unassigned_customers';

const checkPermission = (name) => {
  const { currentUser } = store.getState()?.auth;
  if (!currentUser || !currentUser.userPermission) {
    return false;
  }
  return currentUser.userPermission.find(
    (permission) => (permission.name === name) && permission.state
  );
};

export const canCreateCustomers = () => !!checkPermission(CREATE_CUSTOMERS);
export const canUpdateCustomers = () => !!checkPermission(UPDATE_CUSTOMERS);
export const canShareProducts = () => !!checkPermission(SHARE_PRODUCTS);
export const canCreateTeams = () => !!checkPermission(CREATE_TEAMS);
export const canDeleteComment = () => !!checkPermission(DELETE_COMMENT);
export const canViewUnassignedCustomers = () => !!checkPermission(
  viewUnassignedCustomers
);
export const canCreateChatGroups = () => !!checkPermission(createChatGroups);
export const canEditChatGroups = () => !!checkPermission(editChatGroups);
export const canChatUnassignedCustomers = () => !!checkPermission(
  chatUnassignedCustomers
);

export default checkPermission;
