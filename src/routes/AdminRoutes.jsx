import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import AdminPrivateRoute from '../components/AdminPrivateRoute';
import Customers from '../containers/admin/Customers';
import ProductPage from '../containers/admin/ProductPage';
import Products from '../containers/admin/Products';
import CustomerDetail from '../containers/admin/CustomerDetail';
import Sales from '../containers/admin/Sales';
import SalesDetails from '../containers/admin/SalesDetails';
import Header from '../components/common/Header';
import RolesPermission from '../containers/RolesPermission';
import Locations from '../containers/Locations';
import NotFound from '../components/NotFound';
import Team from '../containers/admin/Team';
import TeamDetails from '../containers/admin/TeamDetails';
import Leads from '../containers/admin/Leads';
import AdminChat from '../containers/admin/Chat';
import CompanyProfile from '../containers/admin/CompanyProfile';
import TeamPermission from '../containers/admin/TeamPermission';
import Campaigns from '../containers/admin/Campaigns';
import CampaignCreate from '../containers/admin/Campaigns/Create';
import CampaignPreview from '../containers/admin/Campaigns/CampaignPreview';
import EmailSpecificCampaign from '../containers/admin/Campaigns/EmailSpecificCampaign';
import OrgChart from '../components/common/OrgChart';
import CampaignUpload from '../containers/admin/Campaigns/CampaignUpload';
import CampaignLists from '../containers/admin/Campaigns/CampaignLists';
import CampaignFileUpload from '../containers/admin/Campaigns/CampaignFileUpload';
import CampaignRecipients from '../containers/admin/Campaigns/CampaignRecipients';
import CampaignSchedule from '../containers/admin/Campaigns/CampaignSchedule';
import TextSpecificCampaign from '../containers/admin/Campaigns/TextSpecificCampaign';
import SocialPostCampaign from '../containers/admin/Campaigns/SocialPostCampaign';
import FacebookSpecificCampaign from '../containers/admin/Campaigns/FacebookSpecificCampaign';
import UndiffirentiatedCampaign from '../containers/admin/Campaigns/UndiffirentiatedCampaign';
import UploadProductCampaign from '../containers/admin/Campaigns/UploadProductCampaign';
import { LinkedInPopUp } from '../components/SocialLogin/LinkedIn';
import Preview from '../containers/admin/Campaigns/Preview';
import CampaignAnalytics from '../containers/admin/Campaigns/CampaignAnalytics';
import CampaignAnalyticsResponse from '../containers/admin/Campaigns/CampaignAnalyticsResponse';
import CampaignResponseDetails from '../containers/admin/Campaigns/CampaignResponseDetails';

const AdminRoutes = () => (
  <>
    <Header />
    <Switch>
      <PrivateRoute path="/admin/products" exact component={Products} />
      <AdminPrivateRoute path="/admin/products/updated" exact component={Products} />
      <AdminPrivateRoute path="/admin/products/:id" exact component={ProductPage} />
      <AdminPrivateRoute path="/admin/customers" exact component={Customers} />
      <AdminPrivateRoute path="/admin/customer-detail/:customerId" exact component={CustomerDetail} />
      <AdminPrivateRoute path="/admin/sales" exact component={Sales} />
      <AdminPrivateRoute path="/admin/sales-detail/:id" exact component={SalesDetails} />
      <AdminPrivateRoute exact path="/admin/rolepermission" component={RolesPermission} />
      <AdminPrivateRoute exact path="/admin/location" component={Locations} />
      <AdminPrivateRoute path="/admin/leads" exact component={Leads} />
      <AdminPrivateRoute exact path="/admin/team/:id?" component={Team} />
      <AdminPrivateRoute exact path="/admin/team-details/:id" component={TeamDetails} />
      <AdminPrivateRoute exact path="/admin/team-permission/:id" component={TeamPermission} />
      <AdminPrivateRoute exact path="/admin/orgchart" component={OrgChart} />
      <AdminPrivateRoute exact path="/admin/chats" component={AdminChat} />
      <AdminPrivateRoute exact path="/admin/chats/customers/:customerId" component={AdminChat} />
      <AdminPrivateRoute exact path="/admin/chats/users/:userId" component={AdminChat} />
      <AdminPrivateRoute exact path="/admin/chats/groups/:groupId" component={AdminChat} />
      <AdminPrivateRoute exact path="/admin/profile" component={CompanyProfile} />
      <AdminPrivateRoute path="/admin/campaigns" exact component={Campaigns} />
      <AdminPrivateRoute path="/admin/campaigns/new" exact component={CampaignCreate} />
      <AdminPrivateRoute path="/admin/campaign/preview" exact component={CampaignPreview} />
      <AdminPrivateRoute path="/admin/campaigns/campaignList" exact component={CampaignLists} />
      <AdminPrivateRoute path="/admin/campaigns/new/emailCampaign" exact component={EmailSpecificCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/campaignUpload" exact component={CampaignUpload} />
      <AdminPrivateRoute path="/admin/campaigns/new/CampaignFileUpload" exact component={CampaignFileUpload} />
      <AdminPrivateRoute path="/admin/campaigns/new/selectRecipients" exact component={CampaignRecipients} />
      <AdminPrivateRoute path="/admin/campaigns/new/scheduleCampaign" exact component={CampaignSchedule} />
      <AdminPrivateRoute path="/admin/campaigns/new/emailCampaign" exact component={EmailSpecificCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/textCampaign" exact component={TextSpecificCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/facebookCampaign" exact component={FacebookSpecificCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/UndiffirentiatedCampaign" exact component={UndiffirentiatedCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/uploadProductCampaign" exact component={UploadProductCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/socialPostCampaign" exact component={SocialPostCampaign} />
      <AdminPrivateRoute path="/admin/campaigns/new/Preview" exact component={Preview} />
      <AdminPrivateRoute path="/admin/campaigns/analytics/response" exact component={CampaignAnalyticsResponse} />
      <PrivateRoute path="/admin/campaign/analytics/response/details" exact component={CampaignResponseDetails} />
      <AdminPrivateRoute path="/admin/campaigns/analytics" exact component={CampaignAnalytics} />
      <Route exact path="/admin/linkedin" component={LinkedInPopUp} />
      <Route path="*" exact component={NotFound} />
    </Switch>
  </>
);

export default AdminRoutes;
