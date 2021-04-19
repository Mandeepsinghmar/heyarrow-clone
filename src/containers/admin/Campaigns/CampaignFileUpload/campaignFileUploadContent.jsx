import React, { useState } from 'react';
import './index.scss';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { campaignFileUpload } from '../../../../redux/actions';
import { API_MARKETING } from '../../../../constants';

const CampaignFileUploadContent = (props) => {
  const { getData, isSaveDraft, campaignFormData } = props;
  const [uploadFile, setUploadFile] = useState(campaignFormData && campaignFormData.fileUpload ? campaignFormData.fileUpload : '');
  const [fileType, setFileType] = useState('');
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const uploadFilePublicUrl = (uploadResponse) => {
    const data = JSON.stringify({ fileName: uploadResponse.fileName });
    const config = {
      method: 'post',
      url: `${API_MARKETING}/file-public`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        'Content-Type': 'application/json'
      },
      data
    };

    axios(config)
      .then((response) => {
        setUploadFile(response.data.url);
        setFileType(uploadResponse.fileType);
        setLoader(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const uploadFileToUrl = (uploadResponse, file) => {
    const config = {
      method: 'put',
      url: uploadResponse.uploadUrl[0],
      headers: {
        'Content-Type': uploadResponse.fileType
      },
      data: file
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          uploadFilePublicUrl(uploadResponse);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const uploadService = (file) => {
    const data = JSON.stringify({ fileName: file.name, mimeType: file.type });
    const config = {
      method: 'post',
      url: `${API_MARKETING}/uploadV2`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        'Content-Type': 'application/json'
      },
      data
    };

    axios(config)
      .then((response) => {
        if (response.data.uploadUrl) {
          uploadFileToUrl(response.data, file);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const onDrop = (acceptedFiles) => {
    setLoader(true);
    acceptedFiles.forEach((file) => {
      if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'video/quicktime' || file.type === 'video/x-ms-wmv' || file.type === 'video/mp4' || file.type === 'audio/mpeg') {
        if (campaignFormData && campaignFormData.type === 'voiceMail') {
          if (file.type !== 'audio/mpeg') {
            setLoader(false);
            toast.error('Please upload the audio file');
          } else {
            uploadService(file);
          }
        } else if (campaignFormData && (campaignFormData.type === 'social_post' || campaignFormData.type === 'social_ad')) {
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'video/quicktime' || file.type === 'video/x-ms-wmv' || file.type === 'video/mp4') {
            uploadService(file);
          } else {
            setLoader(false);
            toast.error('Please upload only jpeg, png, svg, mov, wmv, mp4');
          }
        } else if (campaignFormData && campaignFormData.type === 'email') {
          if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'video/quicktime' || file.type === 'video/x-ms-wmv' || file.type === 'video/mp4') {
            uploadService(file);
          } else {
            setLoader(false);
            toast.error('Please upload only pdf, jpeg, png, svg, mov, wmv, mp4');
          }
        } else {
          uploadService(file);
        }
      } else {
        setLoader(false);
        toast.error('Please upload only pdf, jpeg, png, svg, mov, wmv, mp4');
      }
    });
  };
  if (isSaveDraft) {
    getData(uploadFile);
  }
  const onClickNext = () => {
    if (!uploadFile) {
      toast.error('please select the file to upload');
    } else {
      const data = {
        fileUpload: uploadFile,
        fileType
      };
      dispatch(campaignFileUpload(data));
      if (campaignFormData.type !== 'social_post' && campaignFormData.type !== 'social_ad') {
        history.push('/admin/campaigns/new/selectRecipients');
      } else if (campaignFormData.selectedSocialMediaType === 'facebook' || campaignFormData.selectedSocialMediaType === 'instagram') {
        // history.push('/admin/campaigns/new/Preview');
        history.push('/admin/campaigns/new/scheduleCampaign');
      } else {
        history.push('/admin/campaigns/new/scheduleCampaign');
      }
    }
  };

  const renderFileUpload = () => (
    <>
      {
        uploadFile
          ? (
            <div className="files-upload-success">
              <div className="selected-files-text">
                Selected file is uploaded
              </div>
            </div>
          )
          : (
            <Dropzone
              multiple={false}
              onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="files-upload" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="vector" />
                  <div className="rectangle">
                    <div className="plus" />
                  </div>
                  <div className="select-files-text">Select Files to Upload</div>
                  <div className="drag-drop-text">drag and drop, or copy and paste files</div>
                </div>
              )}
            </Dropzone>
          )
      }
    </>
  );

  return (
    <div className="campignfile-upload">
      {
        loader
          ? (
            <Loader
              type="Oval"
              color="#008080"
              height={40}
              width={40}
              className="LoaderSpinner"
            />
          )
          : renderFileUpload()
      }
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Upload</span>
        </Button>
      </div>
    </div>
  );
};
CampaignFileUploadContent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool
};

CampaignFileUploadContent.defaultProps = {
  campaignFormData: {},
  getData: () => { },
  isSaveDraft: false
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});
export default connect(mapStateToProps, null)(CampaignFileUploadContent);
