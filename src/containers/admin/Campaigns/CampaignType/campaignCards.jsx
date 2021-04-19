import React, { useState } from 'react';
import './index.scss';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { campaignTypeData } from '../../../../redux/actions';

const useStyles = makeStyles((theme) => ({

  root: {
    height: '100%',
    flexGrow: 1,
    minWidth: 722,
    zIndex: 0,
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
    '& .MuiOutlinedInput-input': {
      padding: 0,
      height: 10,
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center'
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
      // margin: theme.spacing(1),
      width: '65ch',
      textAlign: 'center',
      margin: 0,
      padding: 0,
      height: 10,
    },
  },
}));

const CampaignCards = (props) => {
  const { campaignFormData, isSaveDraft, getData } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [campaignType, setCampaignType] = useState(campaignFormData && campaignFormData.type ? campaignFormData.type : '');
  const [checked, setChecked] = useState(
    campaignFormData && campaignFormData.smartCampaign
      ? campaignFormData.smartCampaign : false
  );
  const prevName = history.location.state !== undefined ? history.location.state.previewTitle : '';
  const [campaignName, setCampaignName] = useState(
    (campaignFormData && campaignFormData.campaignName)
      ? campaignFormData.campaignName : prevName
  );

  if (isSaveDraft) {
    getData(campaignType, checked, campaignName);
  }
  const onClickNext = () => {
    if (!campaignName) {
      toast.error('please enter the campaign name');
    } else if (!campaignType) {
      toast.error('please select the campaign type');
    } else {
      const data = {
        campaignName,
        type: campaignType,
        smartCampaign: checked
      };
      dispatch(campaignTypeData(data));

      if (campaignType === 'email') {
        history.push('/admin/campaigns/new/emailCampaign', { campaignType });
      } else if (campaignType === 'text') {
        history.push('/admin/campaigns/new/textCampaign');
      } else if (campaignType === 'social_post' || campaignType === 'social_ad') {
        history.push('/admin/campaigns/new/socialPostCampaign');
      } else {
        history.push('/admin/campaigns/new/campaignUpload');
      }
    }
  };

  const renderSelectCampaignType = (selectType) => {
    setCampaignType(selectType);
  };

  const onChangeText = (text) => {
    setCampaignName(text);
  };

  const toggleChecked = () => {
    setChecked(!checked);
  };

  return (
    <div>
      <form className={`${classes.subject} textfield`} noValidate autoComplete="off">
        <TextField
          value={campaignName}
          id="outlined-basic"
          label="Name Your Campaign"
          variant="outlined"
          onChange={(e) => { onChangeText(e.target.value); }}
          size="small"
        />
      </form>
      <div className="smartCampign">
        <div className="smartCampign-text">Smart Campaign</div>
        <i className="fa fa-exclamation-circle exclamationCircle">
          <span className="hoverBox">Your campaign will run automatically as dynamics lists change</span>
        </i>
        <div className="toggleSwitch">
          <FormGroup>
            <FormControlLabel
              control={<Switch size="small" checked={checked} onChange={toggleChecked} />}
            />
          </FormGroup>
        </div>
      </div>

      <Grid container className={classes.gridcontainer} spacing={2}>
        <Card className="gridcontainer-email" elevation={campaignType === 'email' ? 6 : 1} onClick={() => { renderSelectCampaignType('email'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/email.svg"
            title="Email"
          />
          <CardContent>
            <Typography className="emailtext" component="p">
              Email
            </Typography>
          </CardContent>
        </Card>
        <Card className="gridcontainer-text" direction="row" elevation={campaignType === 'text' ? 5 : 1} onClick={() => { renderSelectCampaignType('text'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/text.svg"
            title="Text"
          />
          <CardContent>
            <Typography className="socilposttext" component="p">
              Text
            </Typography>
          </CardContent>
        </Card>
        <Card className="gridcontainer-socialpost" elevation={campaignType === 'social_post' ? 5 : 1} onClick={() => { renderSelectCampaignType('social_post'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/socialPost.svg"
            title="Social Post"
          />
          <CardContent>
            <Typography className="socialpost" component="p">
              Social Post
            </Typography>
          </CardContent>
        </Card>
        <Card className="gridcontainer-social-ad" elevation={campaignType === 'social_ad' ? 5 : 1} onClick={() => { renderSelectCampaignType('social_ad'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/SocialAd.svg"
            title="Social ad"
          />
          <CardContent>
            <Typography className="socialad" component="p">
              Social Ad
            </Typography>
          </CardContent>
        </Card>
        <Card className="gridcontainer-search" elevation={campaignType === 'searchAd' ? 5 : 1} onClick={() => { renderSelectCampaignType('searchAd'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/SearchAd.svg"
            title="Search"
          />
          <CardContent>
            <Typography className="searchad" component="p">
              Search Ad
            </Typography>
          </CardContent>
        </Card>
        <Card className="gridcontainer-Voicemail__Drop" elevation={campaignType === 'voiceMail' ? 5 : 1} onClick={() => { renderSelectCampaignType('voiceMail'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/voiceMail.svg"
            title="Voicemail Drop"
          />
          <CardContent>
            <Typography className="voiceMail-text" component="p">
              Voicemail Drop
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>
    </div>
  );
};

CampaignCards.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool,
};

CampaignCards.defaultProps = {
  campaignFormData: {},
  getData: () => { },
  isSaveDraft: false,
};

export default CampaignCards;
