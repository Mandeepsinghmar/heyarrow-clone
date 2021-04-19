import React, { useState } from 'react';
import './index.scss';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { campaignMediaType } from '../../../../redux/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    zIndex: 0,
    minWidth: 722,
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
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
      width: '50ch',
    },
  },
}));

const CampaignUploadContent = (props) => {
  const { getData, isSaveDraft, campaignFormData } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [meadiaType, setMeadiaType] = useState(campaignFormData && campaignFormData.meadiaType ? campaignFormData.meadiaType : '');

  const selectMediaType = (selectType) => {
    if (campaignFormData && campaignFormData.type === 'voiceMail') {
      if (selectType !== 'uploadfile') {
        toast.success('Please select upload a file');
      } else {
        setMeadiaType(selectType);
      }
    } else {
      setMeadiaType(selectType);
    }
  };

  if (isSaveDraft) {
    getData();
  }

  const onClickNext = () => {
    if (!meadiaType) {
      toast.error('please choose the media');
    } else if (meadiaType === 'uploadfile') {
      const data = {
        meadiaType
      };
      dispatch(campaignMediaType(data));
      history.push('/admin/campaigns/new/CampaignFileUpload');
    } else {
      const data = {
        meadiaType
      };
      dispatch(campaignMediaType(data));
      history.push('/admin/campaigns/new/uploadProductCampaign');
    }
  };

  return (
    <div>
      <div className="choosemedia-text">Choose the media</div>
      <hr className="division-line" />
      <Grid container className={classes.gridcontainer} spacing={2}>
        <Card className="gridcontainer-uploadfile" elevation={meadiaType === 'uploadfile' ? 6 : 1} onClick={() => { selectMediaType('uploadfile'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/uploadfile.svg"
            title="uploadfile"
          />
          <CardContent>
            <Typography className="upload-file" component="p">
              Upload a file
            </Typography>
          </CardContent>
        </Card>

        <Card className="gridcontainer-findproducts" direction="row" elevation={meadiaType === 'findproducts' ? 6 : 1} onClick={() => { selectMediaType('findproducts'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/findproducts.svg"
            title="Find Products"
          />
          <CardContent>
            <Typography className="findproductstext" component="p">
              Find Products
            </Typography>
          </CardContent>
        </Card>
        {/* <Card className="gridcontainer-linkedlibraries" elevation={meadiaType === 'linkedlibraries' ? 6 : 1} onClick={() => { selectMediaType('linkedlibraries'); }}>
          <CardMedia
            className="dispcontent-image"
            image="/images/linkedlibraries.svg"
            title="Linked Libraries"
          />
          <CardContent>
            <Typography className="uploadsocialpost" component="p">
              Linked libraries
            </Typography>
          </CardContent>
        </Card> */}
      </Grid>
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>
    </div>
  );
};
CampaignUploadContent.propTypes = {
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool,
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

CampaignUploadContent.defaultProps = {
  getData: () => { },
  isSaveDraft: false,
  campaignFormData: {},
};

export default CampaignUploadContent;
