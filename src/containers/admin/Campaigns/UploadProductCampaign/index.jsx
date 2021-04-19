import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { API_MARKETING } from '../../../../constants';
import UploadProductCampaignContent from './uploadProductCampaignContent';
import CampaignsHeader from '../CampaignHeader';

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

const UploadProductCampaign = (props) => {
  const { campaignFormData } = props;
  const classes = useStyles();
  const rootRef = React.useRef(null);
  const history = useHistory();
  const [apiResponse, setApiResponse] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const productListApi = () => {
    setTimeout(() => {
      axios
        .get(`${API_MARKETING}/products?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('bearToken')}`
          }
        })
        .then((res) => {
          if (res.data.productList.length > 0) {
            if (apiResponse.length > 0) {
              const data = apiResponse.concat(res.data.productList);
              setApiResponse(data);
            } else {
              setApiResponse(res.data.productList);
            }
          } else {
            setHasMore(false);
          }
        });
    }, 1500);
  };

  useEffect(() => {
    productListApi();
  }, []);

  const productListsPagination = () => {
    setPage(page + 1);
    productListApi();
  };

  return (
    <>
      <CampaignsHeader />
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
          <div className="uploadcard-product">
            <div className="MuiCardHeader-titleProduct">Search Product Inventory</div>
            <UploadProductCampaignContent
              apiResponse={apiResponse}
              campaignFormData={campaignFormData}
              productListsPagination={productListsPagination}
              page={page}
              hasMore={hasMore}
            />

            <div className="socialpostbackbutton">
              <Button onClick={() => { history.goBack(); }}>
                <span className="socialpostbacktext">Back</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

UploadProductCampaign.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

UploadProductCampaign.defaultProps = {
  campaignFormData: {},
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(UploadProductCampaign);
