import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import CampaignsAll from './CampaignsAll';
import CampaignType from './CampaignType';
import { API_MARKETING } from '../../../constants';

export const DataContext = React.createContext({});

const Campaigns = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const history = useHistory();
  const CallListApi = () => {
    setApiResponse([]);
    axios
      .get(`${API_MARKETING}/list?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.campaignList.length > 0) {
            setApiResponse(response.data.campaignList);
          } else {
            history.push('/admin/campaigns/new');
          }
        } else if (response.status === 202) {
          toast.error(response.data.message);
        }
      });
  };
  const CallAuthApi = () => {
    const UserData = JSON.parse(localStorage.getItem('userData'));
    axios
      .get(`${API_MARKETING}/token?user_id=${UserData.id}`).then((response) => {
        localStorage.setItem('bearToken', response.data.accessToken);
        CallListApi();
      });
  };
  useEffect(() => {
    if (localStorage.getItem('bearToken') !== null) {
      CallListApi();
    } else {
      CallAuthApi();
    }
  }, []);
  const responseCampain = (campaign) => (
    campaign.length > 0
      ? <CampaignsAll Apicall={CallListApi} CampaignData={campaign} />
      : <CampaignType />
  );
  return (
    <DataContext.Provider value={apiResponse}>
      <div className="campaign-container center-box">
        {apiResponse.length === 0 ? (
          <Loader
            type="Oval"
            color="#008080"
            height={30}
            width={30}
            className="LoaderSpinner"
          />
        ) : responseCampain(apiResponse)}
      </div>
      <div style={{ borderBottom: '20px solid #f2f3f5', position: 'sticky', bottom: 0 }} />
    </DataContext.Provider>
  );
};
export default Campaigns;
