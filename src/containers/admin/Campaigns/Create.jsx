import React, { useEffect } from 'react';
import './index.scss';
import CampaignType from './CampaignType';

export const DataContext = React.createContext({});

const CreateCampaigns = () => {
  useEffect(() => {
  }, []);
  return (
    <CampaignType />
  );
};
export default CreateCampaigns;
