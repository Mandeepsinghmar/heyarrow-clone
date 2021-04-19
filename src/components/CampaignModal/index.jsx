import React from 'react';
import './index.scss';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import CampaignsHeader from '../../containers/admin/Campaigns/CampaignHeader';
import CampaignUploadContent from '../../containers/admin/Campaigns/CampaignUpload/campaignUploadContent';
import CampaignFileUploadContent from '../../containers/admin/Campaigns/CampaignFileUpload/campaignFileUploadContent';
import SelectRecipients from '../../containers/admin/Campaigns/CampaignRecipients/selectRecipients';
import CampaignCards from '../../containers/admin/Campaigns/CampaignType/campaignCards';
import ScheduleCampaign from '../../containers/admin/Campaigns/CampaignSchedule/scheduleCampaign';
import EmailSpecificContent from '../../containers/admin/Campaigns/EmailSpecificCampaign/emailSpecificContent';
import TextSpecificContent from '../../containers/admin/Campaigns/TextSpecificCampaign/textSpecificContent';
import SocialPostCampaignContent from '../../containers/admin/Campaigns/SocialPostCampaign/socialPostCampaignContent';
import FacebookSpecificContent from '../../containers/admin/Campaigns/FacebookSpecificCampaign/facebookSpecificContent';
import UndiffirentiatedCampaignContent from '../../containers/admin/Campaigns/UndiffirentiatedCampaign/undiffirentiatedCampaignContent';
import UploadProductCampaignContent from '../../containers/admin/Campaigns/UploadProductCampaign/uploadProductCampaignContent';
import PreviewComponent from '../../containers/admin/Campaigns/Preview/previewComponent';
import { clearAllCampaignData } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    minWidth: 722,
    zIndex: 0,
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll',
    backgroundColor: '#fff'
  },
  control: {
    padding: theme.spacing(2),
  },
  papercontainer: {
    height: 155,
    width: 189,
    marginTop: 51,
  },
  subject: {
    marginLeft: 17,
    height: 10,
    '& > *': {
      margin: theme.spacing(1),
      width: '57ch',
      textAlign: 'center'
    },
  },
}));

const CampaignModal = (props) => {
  const {
    title, isBackBtnVisible, apiResponse, type,
    apiCustomerResponse, saveDraft, isSaveDraft, getData, campaignFormData
  } = props;

  const classes = useStyles();
  const rootRef = React.useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const cancelCampaign = () => {
    const data = null;
    dispatch(clearAllCampaignData(data));
    history.push('/admin/campaigns');
  };

  const renderComponent = () => {
    if (title === 'Campaign Type') return (<CampaignCards getData={getData} isSaveDraft={isSaveDraft} campaignFormData={campaignFormData} />);
    if (title === 'Add copy or description:' && type === 'emailSpecific') return (<EmailSpecificContent apiResponse={apiResponse} isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Add copy or description:' && type === 'textSpecific') return (<TextSpecificContent apiResponse={apiResponse} isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Social Profiles or Pages' && type === 'allLists') return (<SocialPostCampaignContent campaignFormData={campaignFormData} />);
    if (title === 'Add copy or description:' && type === 'facebookSpecific') return (<FacebookSpecificContent apiResponse={apiResponse} isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Add copy or description:' && type === 'Undiffirentiated') return (<UndiffirentiatedCampaignContent apiResponse={apiResponse} isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Upload Content') return (<CampaignUploadContent isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Search Product Inventory') return (<UploadProductCampaignContent />);
    if (title === 'Select files from your computer') return (<CampaignFileUploadContent isSaveDraft={isSaveDraft} getData={getData} campaignFormData={campaignFormData} />);
    if (title === 'Select Recipients') return (<SelectRecipients isSaveDraft={isSaveDraft} getData={getData} apiResponse={apiResponse} apiCustomerResponse={apiCustomerResponse} campaignFormData={campaignFormData} />);
    if (title === 'Almost there!') return (<ScheduleCampaign isSaveDraft={isSaveDraft} getData={getData} />);
    if (title === 'Preview') return (<PreviewComponent campaignFormData={campaignFormData} />);
    return null;
  };

  return (
    <>
      <CampaignsHeader saveDraft={saveDraft} cancelCampaign={cancelCampaign} />
      <div className={classes.root} ref={rootRef}>
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          className={classes.modal}
          container={() => rootRef.current}
          style={{ zIndex: 1, overflow: 'scroll' }}
        >
          <div className="uploadcard">
            <div className="MuiCardHeader-title">{title}</div>
            {renderComponent()}
            {
              isBackBtnVisible
                ? (
                  <div className="socialpostbackbutton">
                    <Button
                      onClick={() => { history.goBack(); }}
                    >
                      <span className="socialpostbacktext">Back</span>
                    </Button>
                  </div>
                )
                : null
            }
          </div>
        </Modal>
      </div>
    </>
  );
};

CampaignModal.propTypes = {
  apiResponse: PropTypes.arrayOf(PropTypes.object),
  apiCustomerResponse: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  isBackBtnVisible: PropTypes.bool,
  isSaveDraft: PropTypes.bool,
  type: PropTypes.string,
  saveDraft: PropTypes.func,
  getData: PropTypes.func,
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignModal.defaultProps = {
  apiResponse: [],
  apiCustomerResponse: [],
  title: '',
  isBackBtnVisible: false,
  isSaveDraft: false,
  type: '',
  saveDraft: () => { },
  getData: () => { },
  campaignFormData: {},
};
export default CampaignModal;
