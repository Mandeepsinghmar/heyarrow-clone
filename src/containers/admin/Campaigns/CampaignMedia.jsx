import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Grid,
  CardContent,
  CardMedia,
  IconButton,
  CardHeader,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DefualtPdf from '../../../assets/images/pdf-icon.png';
import DefualtPlay from '../../../assets/images/play.png';
import DefualtText from '../../../assets/images/text.png';

const styles = (theme) => ({
  card: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: '0px',
  },
  cover: {
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  videoId: {
    width: '275',
  }
});

function MusicCard(campaignProps) {
  const {
    isPin, propsId, compaignName, classes, data,
    propsType, propsSubject, propsStatus, scheduledAt
  } = campaignProps;
  const [anchorEl, setAnchorEl] = useState(null);
  const [campaignPin, setcampaignPin] = useState(
    campaignProps && isPin ? isPin : false
  );
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePin = () => {
    campaignProps.handleCampaignPin(propsId, !campaignPin);
    setcampaignPin(!campaignPin);
    handleClose();
  };
  const handleArchive = () => {
    campaignProps.handleCampaignArchived(propsId);
    handleClose();
  };
  const handleDuplicate = () => {
    campaignProps.handleCampaignDupliate(propsId);
    handleClose();
  };
  const getImagePreview = (
    event, img, title, imgdata, id, type, campaignCreatedAt, subject, status
  ) => {
    event.preventDefault();
    localStorage.setItem('previewTitle', title);
    localStorage.setItem('previewImage', img);
    localStorage.setItem('previewTextData', JSON.stringify(imgdata));
    localStorage.setItem('previewItemId', id);
    localStorage.setItem('previewItemType', type);
    localStorage.setItem('campaignCreatedAt', campaignCreatedAt);
    localStorage.setItem('subject', subject);
    localStorage.setItem('previewstatus', status);
    history.push('/admin/campaign/preview');
  };
  return (
    <Grid item md={4} key={compaignName} spacing={2}>
      <Card className={classes.card} style={{ width: '100%' }}>
        <div className={classes.details} style={{ width: '100%' }}>
          <CardHeader
            title={compaignName}
            action={(
              <IconButton aria-label="settings">
                <MoreVertIcon onClick={handleClick} />
              </IconButton>
            )}
            titleTypographyProps={{ align: 'left', variant: 'subtitle' }}
            subheaderTypographyProps={{ align: 'center' }}
            className={classes.cardHeader}
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handlePin}>{campaignPin ? 'Unpin' : 'Pin'}</MenuItem>
            <MenuItem>
              <a href="/campaign/preview" className="prev-anchor" onClick={(e) => { getImagePreview(e, data.fileUrl, compaignName, data, propsId, propsType, scheduledAt, propsSubject, propsStatus); return false; }}>Preview</a>
            </MenuItem>
            <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
            <MenuItem onClick={handleArchive}>Archived</MenuItem>
          </Menu>
          <CardContent className={classes.content}>
            <CardContent className={classes.content} style={{ paddingBottom: '0px' }}>
              {(campaignProps && data.fileType && (data.fileType.includes('pdf') || data.fileType.includes('video') || data.fileType.includes('audio')))
                ? (
                  <CardMedia
                    className="campaign__cardimage_default"
                    image={data.fileType.includes('pdf') ? DefualtPdf : DefualtPlay}
                    title={compaignName}
                  />
                )
                : (
                  <CardMedia
                    className={data.fileType === 'application/text' ? 'campaign__cardimage_default' : 'campaign__cardimage'}
                    image={data.fileType === 'application/text' ? DefualtText : data.fileUrl}
                    title={compaignName}
                  />
                )}
            </CardContent>
          </CardContent>
        </div>
        <CardMedia
          className={classes.cover}
          image="/static/images/cards/live-from-space.jpg"
          title="Live from space album cover"
        />
      </Card>
    </Grid>
  );
}
export default withStyles(styles, { withTheme: true })(MusicCard);
