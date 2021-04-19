import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import Drawer from '@material-ui/core/Drawer';

const CampaignsHeader = (headerProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (bool) => {
    setDrawerOpen(bool);
  };
  const renderMenu = () => {
    <div className="centerSideheader" />;
  };

  const headerSaveDraft = () => {
    headerProps.saveDraft();
  };

  return (
    <div className="campaignheader">
      <div className="leftSide">
        <div className="brand-name"> New Campaign</div>
      </div>
      {renderMenu()}
      <div className="rightSide">
        <ul className="iconList">
          <div className="savedraftbutton">
            <Button onClick={() => headerSaveDraft()}>
              <span className="savedrafttext">Save Draft</span>
            </Button>
          </div>
          <div className="cancelbutton">
            <Button onClick={() => { headerProps.cancelCampaign(); }}>
              <span className="canceltext">Cancel</span>
            </Button>
          </div>
        </ul>
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {renderMenu()}
      </Drawer>
    </div>
  );
};

export default CampaignsHeader;
